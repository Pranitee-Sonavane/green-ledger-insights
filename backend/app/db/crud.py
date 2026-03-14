from collections.abc import Sequence

import pandas as pd
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models import CarbonFactor, Transaction, UploadBatch


def _latest_batch_id(db: Session) -> int | None:
    return db.query(func.max(UploadBatch.id)).scalar()


def clear_upload_data(db: Session) -> None:
    """Remove all uploaded transaction batches so analytics reset to empty state."""
    db.query(Transaction).delete(synchronize_session=False)
    db.query(UploadBatch).delete(synchronize_session=False)
    db.commit()


def upsert_carbon_factors(db: Session, factors: list[dict]) -> int:
    upserted = 0
    for row in factors:
        existing = (
            db.query(CarbonFactor)
            .filter(
                CarbonFactor.category == str(row["category"]),
                CarbonFactor.region == str(row["region"]),
                CarbonFactor.year == int(row["year"]),
            )
            .first()
        )

        if existing is None:
            db.add(
                CarbonFactor(
                    category=str(row["category"]),
                    region=str(row["region"]),
                    year=int(row["year"]),
                    unit=str(row["unit"]),
                    factor_kg_per_inr=float(row["factor_kg_per_inr"]),
                    source=str(row["source"]),
                    is_active=bool(row.get("is_active", True)),
                )
            )
        else:
            existing.unit = str(row["unit"])
            existing.factor_kg_per_inr = float(row["factor_kg_per_inr"])
            existing.source = str(row["source"])
            existing.is_active = bool(row.get("is_active", True))

        upserted += 1

    db.commit()
    return upserted


def get_active_carbon_factor_map(db: Session, region: str = "IN", year: int | None = None) -> dict[str, float]:
    target_year = year
    if target_year is None:
        target_year = (
            db.query(func.max(CarbonFactor.year))
            .filter(CarbonFactor.region == region, CarbonFactor.is_active.is_(True))
            .scalar()
        )

    if target_year is None:
        return {}

    rows = (
        db.query(CarbonFactor.category, CarbonFactor.factor_kg_per_inr)
        .filter(
            CarbonFactor.region == region,
            CarbonFactor.year == target_year,
            CarbonFactor.is_active.is_(True),
        )
        .all()
    )

    return {str(category): float(factor) for category, factor in rows}


def create_upload_batch(db: Session, filename: str, status: str = "processed") -> UploadBatch:
    batch = UploadBatch(filename=filename, status=status)
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


def insert_transactions_from_df(db: Session, batch_id: int, df: pd.DataFrame) -> int:
    records: list[Transaction] = []
    for _, row in df.iterrows():
        records.append(
            Transaction(
                batch_id=batch_id,
                date=row["date"].to_pydatetime() if hasattr(row["date"], "to_pydatetime") else row["date"],
                vendor_raw=str(row["vendor"]),
                vendor_normalized=str(row["vendor_normalized"]),
                category=str(row["category"]),
                amount=float(row["amount"]),
                factor_kg_per_usd=float(row["factor_kg_per_usd"]),
                emissions_kg=float(row["emissions_kg"]),
            )
        )

    db.add_all(records)
    db.commit()
    return len(records)


def get_overview_stats(db: Session) -> dict:
    batch_id = _latest_batch_id(db)
    if batch_id is None:
        return {
            "total_emissions_kg": 0.0,
            "total_vendors": 0,
            "total_transactions": 0,
            "top_category": None,
            "top_category_emissions_kg": 0.0,
        }

    total_emissions = (
        db.query(func.coalesce(func.sum(Transaction.emissions_kg), 0.0))
        .filter(Transaction.batch_id == batch_id)
        .scalar()
        or 0.0
    )
    total_vendors = (
        db.query(func.count(func.distinct(Transaction.vendor_normalized)))
        .filter(Transaction.batch_id == batch_id)
        .scalar()
        or 0
    )
    total_transactions = (
        db.query(func.count(Transaction.id))
        .filter(Transaction.batch_id == batch_id)
        .scalar()
        or 0
    )

    top_category_row = (
        db.query(
            Transaction.category,
            func.sum(Transaction.emissions_kg).label("emissions"),
        )
        .filter(Transaction.batch_id == batch_id)
        .group_by(Transaction.category)
        .order_by(func.sum(Transaction.emissions_kg).desc())
        .first()
    )

    return {
        "total_emissions_kg": round(float(total_emissions), 3),
        "total_vendors": int(total_vendors),
        "total_transactions": int(total_transactions),
        "top_category": top_category_row[0] if top_category_row else None,
        "top_category_emissions_kg": round(float(top_category_row[1]), 3) if top_category_row else 0.0,
    }


def get_emissions_by_category(db: Session) -> Sequence[dict]:
    batch_id = _latest_batch_id(db)
    if batch_id is None:
        return []

    rows = (
        db.query(
            Transaction.category,
            func.sum(Transaction.emissions_kg).label("value"),
        )
        .filter(Transaction.batch_id == batch_id)
        .group_by(Transaction.category)
        .order_by(func.sum(Transaction.emissions_kg).desc())
        .all()
    )
    return [{"name": category, "value": round(float(value), 3)} for category, value in rows]


def get_top_vendors_by_emissions(db: Session, limit: int = 10) -> Sequence[dict]:
    batch_id = _latest_batch_id(db)
    if batch_id is None:
        return []

    rows = (
        db.query(
            Transaction.vendor_raw,
            func.sum(Transaction.emissions_kg).label("emissions"),
        )
        .filter(Transaction.batch_id == batch_id)
        .group_by(Transaction.vendor_raw)
        .order_by(func.sum(Transaction.emissions_kg).desc())
        .limit(limit)
        .all()
    )
    return [{"name": vendor, "emissions": round(float(emissions), 3)} for vendor, emissions in rows]


def get_monthly_emissions_trend(db: Session) -> Sequence[dict]:
    batch_id = _latest_batch_id(db)
    if batch_id is None:
        return []

    rows = (
        db.query(
            func.strftime("%Y-%m", Transaction.date).label("month_key"),
            func.sum(Transaction.emissions_kg).label("emissions"),
        )
        .filter(Transaction.batch_id == batch_id)
        .group_by("month_key")
        .order_by("month_key")
        .all()
    )

    return [
        {
            "month": month_key,
            "emissions": round(float(emissions), 3),
        }
        for month_key, emissions in rows
        if month_key
    ]


def get_vendors_summary(db: Session) -> Sequence[dict]:
    batch_id = _latest_batch_id(db)
    if batch_id is None:
        return []

    rows = (
        db.query(
            Transaction.vendor_raw.label("name"),
            Transaction.category.label("category"),
            func.sum(Transaction.amount).label("spend"),
            func.sum(Transaction.emissions_kg).label("emissions"),
        )
        .filter(Transaction.batch_id == batch_id)
        .group_by(Transaction.vendor_raw, Transaction.category)
        .order_by(func.sum(Transaction.emissions_kg).desc())
        .all()
    )

    result = []
    for name, category, spend, emissions in rows:
        spend_value = float(spend or 0.0)
        emissions_value = float(emissions or 0.0)
        intensity = (emissions_value / spend_value * 1000.0) if spend_value > 0 else 0.0
        result.append(
            {
                "name": name,
                "category": category,
                "spend": round(spend_value, 2),
                "emissions": round(emissions_value, 3),
                "intensityScore": round(intensity, 3),
            }
        )

    return result


def get_recommendations(db: Session, limit: int = 4) -> Sequence[dict]:
    vendors = list(get_vendors_summary(db))
    recommendations: list[dict] = []

    _category_config: dict[str, tuple[int, str]] = {
        "Cloud Services":  (35, "Green Cloud Provider (renewable-powered)"),
        "Transportation":  (28, "Sustainable Aviation / Rail Alternative"),
        "Logistics":       (40, "Optimised Green Freight Partner"),
        "Hardware":        (18, "Refurbished / Circular Hardware Supplier"),
        "Office Supplies": (22, "Recycled & Sustainable Supplies Vendor"),
        "Other":           (15, "Lower-Impact Alternative Vendor"),
    }

    for index, vendor in enumerate(vendors[:limit], start=1):
        category = vendor["category"]
        reduction_percent, recommended_label = _category_config.get(
            category, (15, "Lower-Impact Alternative Vendor")
        )
        estimated_emissions = vendor["emissions"] * (1 - reduction_percent / 100.0)
        recommendations.append(
            {
                "id": index,
                "currentVendor": vendor["name"],
                "currentEmissions": round(float(vendor["emissions"]), 3),
                "recommendedVendor": recommended_label,
                "estimatedEmissions": round(float(estimated_emissions), 3),
                "reductionPercent": reduction_percent,
                "category": category,
            }
        )

    return recommendations


def get_ai_insights(db: Session, limit: int = 5) -> Sequence[dict]:
    overview = get_overview_stats(db)
    categories = list(get_emissions_by_category(db))
    top_vendors = list(get_top_vendors_by_emissions(db, limit=3))

    insights: list[dict] = []

    if categories and overview["total_emissions_kg"] > 0:
        top_category = categories[0]
        share = (top_category["value"] / overview["total_emissions_kg"]) * 100
        insights.append(
            {
                "id": len(insights) + 1,
                "title": "Largest Emissions Category",
                "description": f"{top_category['name']} currently contributes the largest share of your emissions.",
                "impact": "high",
                "metric": f"{share:.1f}%",
                "metricLabel": "of total emissions",
            }
        )

    for vendor in top_vendors:
        insights.append(
            {
                "id": len(insights) + 1,
                "title": f"High-Impact Vendor: {vendor['name']}",
                "description": "This vendor is among your top contributors to carbon emissions based on uploaded transactions.",
                "impact": "medium",
                "metric": f"{vendor['emissions']:.3f} kg",
                "metricLabel": "CO2 emissions",
            }
        )

    if not insights:
        insights.append(
            {
                "id": 1,
                "title": "Upload Data to Generate Insights",
                "description": "No processed transactions found yet. Upload a CSV statement to generate AI insights.",
                "impact": "low",
                "metric": "0",
                "metricLabel": "records analyzed",
            }
        )

    return insights[:limit]