import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.upload import router as upload_router
from app.db import models  # noqa: F401 - ensure models are imported before create_all
from app.db.session import Base, engine
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


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(upload_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")