import pandas as pd

# Factors are modeled directly as kg CO2 per INR spent.
DEFAULT_EMISSION_FACTORS_KG_PER_INR: dict[str, float] = {
    "Cloud Services": 0.0032,
    "Transportation": 0.0095,
    "Logistics": 0.0068,
    "Hardware": 0.0044,
    "Office Supplies": 0.0017,
    "Other": 0.0050,
}


def apply_emission_factors(df: pd.DataFrame, factors_by_category: dict[str, float] | None = None) -> pd.DataFrame:
    out = df.copy()
    factors = factors_by_category or DEFAULT_EMISSION_FACTORS_KG_PER_INR

    # NOTE: We keep the legacy column name for DB compatibility.
    out["factor_kg_per_usd"] = out["category"].map(factors).fillna(
        factors.get("Other", DEFAULT_EMISSION_FACTORS_KG_PER_INR["Other"])
    )
    out["emissions_kg"] = (out["amount"] * out["factor_kg_per_usd"]).round(3)
    return out


def apply_hybrid_emission_factors(
    df: pd.DataFrame,
    factors_by_category: dict[str, float] | None = None,
    activity_factors: dict[str, dict[str, float | str]] | None = None,
) -> pd.DataFrame:
    out = apply_emission_factors(df, factors_by_category=factors_by_category)
    activity_map = activity_factors or {}

    # Transportation override: when distance is available, use passenger-km factor.
    transport_meta = activity_map.get("Transportation", {})
    transport_key = str(transport_meta.get("activity_key", "distance_km"))
    transport_factor = float(transport_meta.get("factor_kg_per_unit", 0.115))

    if transport_key in out.columns:
        transport_mask = (out["category"] == "Transportation") & out[transport_key].notna() & (out[transport_key] > 0)
        if transport_mask.any():
            passengers = out["passenger_count"] if "passenger_count" in out.columns else 1.0
            passengers = passengers.fillna(1.0) if hasattr(passengers, "fillna") else passengers
            out.loc[transport_mask, "emissions_kg"] = (
                out.loc[transport_mask, transport_key].astype(float)
                * passengers.loc[transport_mask].astype(float)
                * transport_factor
            ).round(3)

    # Logistics override: when freight ton-km is available, use freight activity factor.
    logistics_meta = activity_map.get("Logistics", {})
    logistics_key = str(logistics_meta.get("activity_key", "freight_ton_km"))
    logistics_factor = float(logistics_meta.get("factor_kg_per_unit", 0.08))

    if logistics_key in out.columns:
        logistics_mask = (out["category"] == "Logistics") & out[logistics_key].notna() & (out[logistics_key] > 0)
        if logistics_mask.any():
            out.loc[logistics_mask, "emissions_kg"] = (
                out.loc[logistics_mask, logistics_key].astype(float) * logistics_factor
            ).round(3)

    return out