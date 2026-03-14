import io
import re

import pandas as pd

REQUIRED_COLUMNS = {"date", "vendor", "amount"}
OPTIONAL_ACTIVITY_COLUMNS = ["distance_km", "passenger_count", "freight_ton_km"]

# Flexible aliases for each canonical column name (all lowercase, stripped).
_DATE_ALIASES = {
    "date", "transaction date", "trans date", "tran date", "txn date",
    "value date", "posting date", "booking date", "trans. date",
}
_VENDOR_ALIASES = {
    "vendor", "description", "narration", "particulars", "payee",
    "merchant", "beneficiary", "remarks", "details", "name",
    "transaction details", "transaction description",
}
_AMOUNT_ALIASES = {
    "amount", "debit", "debit amount", "withdrawal", "withdrawal amt.",
    "withdrawal amt", "withdrawals", "dr", "dr amount", "debit (inr)",
    "transaction amount", "txn amount",
}


def _map_columns(cols: list[str]) -> dict[str, str]:
    """Return a rename mapping from raw col → canonical name for matching aliases.

    Only the first matching column wins for each canonical name so that CSVs
    with multiple date-like columns (e.g. 'Transaction Date' AND 'Value Date')
    don't produce duplicate column names.
    """
    rename: dict[str, str] = {}
    claimed: set[str] = set()  # canonical names already spoken for
    for raw in cols:
        key = raw.strip().lower()
        if "date" not in claimed and key in _DATE_ALIASES:
            rename[raw] = "date"
            claimed.add("date")
        elif "vendor" not in claimed and key in _VENDOR_ALIASES:
            rename[raw] = "vendor"
            claimed.add("vendor")
        elif "amount" not in claimed and key in _AMOUNT_ALIASES:
            rename[raw] = "amount"
            claimed.add("amount")
    return rename


def _clean_amount(series: pd.Series) -> pd.Series:
    """Strip currency symbols, thousand separators, Dr/Cr suffixes, then coerce to float."""
    return (
        series.astype(str)
        # Strip currency symbols and thousand-separator commas
        .str.replace(r"[$,₹]", "", regex=True)
        # Strip Rs / INR word prefix/suffix
        .str.replace(r"(?i)\b(?:rs|inr)\b\.?", "", regex=True)
        # Strip trailing Dr/Cr indicator (e.g. "5000.00 Dr")
        .str.replace(r"(?i)\s*[dc]r\.?$", "", regex=True)
        # Strip anything that isn't a digit, dot, or minus sign
        .str.replace(r"[^0-9.\-]", "", regex=True)
        .str.strip()
    )


def read_statement(file_bytes: bytes) -> pd.DataFrame:
    # Read uploaded CSV bytes into DataFrame.
    df = pd.read_csv(io.BytesIO(file_bytes))

    # Normalize incoming column names via alias mapping.
    rename = _map_columns(list(df.columns))
    df = df.rename(columns=rename)

    # Also lowercase any remaining columns for consistency.
    df.columns = [col.strip().lower() for col in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(
            f"Missing required columns: {sorted(missing)}. "
            f"Your CSV has: {sorted(df.columns.tolist())}. "
            "Expected columns named: date, vendor/description/narration, amount/debit/withdrawal."
        )

    # Keep required fields and optional activity fields (if provided).
    selected_columns = ["date", "vendor", "amount"] + [col for col in OPTIONAL_ACTIVITY_COLUMNS if col in df.columns]
    df = df[selected_columns].copy()

    # Normalize text and parse values.
    df["vendor"] = df["vendor"].astype(str).str.strip()
    # Accept common currency formats from bank exports (e.g. $, Rs, INR, ₹, Dr/Cr suffix).
    df["amount"] = _clean_amount(df["amount"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce")

    for col in OPTIONAL_ACTIVITY_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop invalid or unusable rows.
    df = df.dropna(subset=["date", "vendor", "amount"])
    df = df[df["vendor"].str.strip() != ""]
    # Take absolute value so debits stored as negatives still count.
    df["amount"] = df["amount"].abs()
    df = df[df["amount"] > 0]

    return df.reset_index(drop=True)