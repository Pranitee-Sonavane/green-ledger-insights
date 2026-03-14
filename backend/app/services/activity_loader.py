from pathlib import Path

import pandas as pd


def get_activity_factor_map() -> dict[str, dict[str, float | str]]:
    csv_path = Path(__file__).resolve().parents[2] / "data" / "activity_factors.csv"
    if not csv_path.exists():
        return {}

    df = pd.read_csv(csv_path)
    if df.empty:
        return {}

    required_cols = {"category", "activity_key", "factor_kg_per_unit", "is_active"}
    if not required_cols.issubset(df.columns):
        return {}

    result: dict[str, dict[str, float | str]] = {}
    for _, row in df.iterrows():
        is_active = str(row["is_active"]).strip().lower() in {"1", "true", "yes"}
        if not is_active:
            continue

        category = str(row["category"]).strip()
        result[category] = {
            "activity_key": str(row["activity_key"]).strip(),
            "factor_kg_per_unit": float(row["factor_kg_per_unit"]),
            "unit": str(row.get("unit", "")).strip(),
        }

    return result
