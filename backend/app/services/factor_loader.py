from pathlib import Path

import pandas as pd

from app.db.crud import upsert_carbon_factors
from app.db.session import SessionLocal


def seed_carbon_factors() -> int:
    csv_path = Path(__file__).resolve().parents[2] / "data" / "carbon_factors.csv"
    if not csv_path.exists():
        return 0

    df = pd.read_csv(csv_path)
    if df.empty:
        return 0

    required_cols = {
        "category",
        "region",
        "year",
        "unit",
        "factor_kg_per_inr",
        "source",
        "is_active",
    }
    if not required_cols.issubset(df.columns):
        return 0

    records = []
    for _, row in df.iterrows():
        records.append(
            {
                "category": str(row["category"]).strip(),
                "region": str(row["region"]).strip(),
                "year": int(row["year"]),
                "unit": str(row["unit"]).strip(),
                "factor_kg_per_inr": float(row["factor_kg_per_inr"]),
                "source": str(row["source"]).strip(),
                "is_active": str(row["is_active"]).strip().lower() in {"1", "true", "yes"},
            }
        )

    with SessionLocal() as db:
        return upsert_carbon_factors(db, records)
