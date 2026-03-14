import io

import pandas as pd

REQUIRED_COLUMNS = {"date", "vendor", "amount"}
OPTIONAL_ACTIVITY_COLUMNS = ["distance_km", "passenger_count", "freight_ton_km"]


def read_statement(file_bytes: bytes) -> pd.DataFrame:
    # Read uploaded CSV bytes into DataFrame.
    df = pd.read_csv(io.BytesIO(file_bytes))

    # Normalize incoming column names.
    df.columns = [col.strip().lower() for col in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    # Keep required fields and optional activity fields (if provided).
    selected_columns = ["date", "vendor", "amount"] + [col for col in OPTIONAL_ACTIVITY_COLUMNS if col in df.columns]
    df = df[selected_columns].copy()

    # Normalize text and parse values.
    df["vendor"] = df["vendor"].astype(str).str.strip()
    # Accept common currency formats from bank exports (e.g. $, Rs, INR, and ₹).
    df["amount"] = (
        df["amount"]
        .astype(str)
        .str.replace(r"[$,₹]", "", regex=True)
        .str.replace(r"(?i)\b(?:rs|inr)\b", "", regex=True)
        .str.replace(r"[^0-9.\-]", "", regex=True)
        .str.strip()
    )
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    for col in OPTIONAL_ACTIVITY_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop invalid or unusable rows.
    df = df.dropna(subset=["date", "vendor", "amount"])
    df = df[df["vendor"] != ""]
    df = df[df["amount"] > 0]

    return df.reset_index(drop=True)