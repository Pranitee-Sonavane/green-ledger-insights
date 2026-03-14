from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.crud import create_upload_batch, get_active_carbon_factor_map, insert_transactions_from_df
from app.db.session import get_db
from app.services.activity_loader import get_activity_factor_map
from app.services.classifier import classify_vendors
from app.services.emissions import apply_hybrid_emission_factors
from app.services.pandas_ingest import read_statement

router = APIRouter(tags=["uploads"])


@router.post("/uploads/statements")
async def upload_statement(file: UploadFile = File(...), db: Session = Depends(get_db)) -> dict:
    filename = file.filename or "uploaded.csv"
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        df = read_statement(content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {exc}") from exc

    if df.empty:
        raise HTTPException(status_code=400, detail="No valid rows found in CSV")

    df = classify_vendors(df)
    factor_map = get_active_carbon_factor_map(db, region="IN")
    activity_factor_map = get_activity_factor_map()
    df = apply_hybrid_emission_factors(
        df,
        factors_by_category=factor_map,
        activity_factors=activity_factor_map,
    )

    batch = create_upload_batch(db, filename=filename, status="processed")
    rows_inserted = insert_transactions_from_df(db, batch_id=batch.id, df=df)

    preview = (
        df[["date", "vendor", "category", "amount", "emissions_kg"]]
        .head(20)
        .copy()
    )
    preview["date"] = preview["date"].dt.strftime("%Y-%m-%d")

    return {
        "batch_id": batch.id,
        "filename": batch.filename,
        "rows_processed": rows_inserted,
        "total_emissions_kg": round(float(df["emissions_kg"].sum()), 3),
        "preview": preview.to_dict(orient="records"),
    }