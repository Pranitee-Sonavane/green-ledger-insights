import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.dashboard import router as dashboard_router
from app.api.upload import router as upload_router
from app.db.crud import clear_upload_data
from app.db import models  # noqa: F401 - ensure models are imported before create_all
from app.db.session import Base, engine
from app.db.session import SessionLocal
from app.services.factor_loader import seed_carbon_factors

load_dotenv()

app = FastAPI(title="Green Ledger API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    seed_carbon_factors()

    # Prototype default: start with empty uploaded analytics data (all 0 values)
    reset_uploads_on_startup = os.getenv("RESET_UPLOADS_ON_STARTUP", "true").lower() in {"1", "true", "yes"}
    if reset_uploads_on_startup:
        db: Session = SessionLocal()
        try:
            clear_upload_data(db)
        finally:
            db.close()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(upload_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")