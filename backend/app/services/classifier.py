import re

import pandas as pd

CATEGORY_RULES: dict[str, tuple[str, ...]] = {
    "Cloud Services": ("aws", "amazon web services", "google cloud", "gcp", "azure"),
    "Transportation": ("delta", "united", "airlines", "uber", "lyft"),
    "Logistics": ("fedex", "ups", "dhl"),
    "Hardware": ("dell", "hp", "lenovo", "apple"),
    "Office Supplies": ("staples", "office depot"),
}


def normalize_vendor_name(vendor: str) -> str:
    text = vendor.strip().lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def classify_vendor(normalized_vendor: str) -> str:
    for category, keywords in CATEGORY_RULES.items():
        if any(keyword in normalized_vendor for keyword in keywords):
            return category
    return "Other"


def classify_vendors(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["vendor_normalized"] = out["vendor"].astype(str).map(normalize_vendor_name)
    out["category"] = out["vendor_normalized"].map(classify_vendor)
    return out