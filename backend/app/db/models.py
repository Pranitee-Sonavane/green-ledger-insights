from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UploadBatch(Base):
    __tablename__ = "upload_batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="processed")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="batch", cascade="all, delete-orphan"
    )


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(ForeignKey("upload_batches.id"), index=True, nullable=False)

    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    vendor_raw: Mapped[str] = mapped_column(String(255), nullable=False)
    vendor_normalized: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)

    amount: Mapped[float] = mapped_column(Float, nullable=False)
    factor_kg_per_usd: Mapped[float] = mapped_column(Float, nullable=False)
    emissions_kg: Mapped[float] = mapped_column(Float, nullable=False)

    batch: Mapped["UploadBatch"] = relationship("UploadBatch", back_populates="transactions")


class CarbonFactor(Base):
    __tablename__ = "carbon_factors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    region: Mapped[str] = mapped_column(String(10), nullable=False, default="IN", index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    unit: Mapped[str] = mapped_column(String(30), nullable=False, default="kgCO2e/INR")
    factor_kg_per_inr: Mapped[float] = mapped_column(Float, nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)