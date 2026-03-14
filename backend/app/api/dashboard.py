from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.crud import (
    get_ai_insights,
    get_emissions_by_category,
    get_monthly_emissions_trend,
    get_overview_stats,
    get_recommendations,
    get_top_vendors_by_emissions,
    get_vendors_summary,
)
from app.db.session import get_db

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/overview")
def dashboard_overview(db: Session = Depends(get_db)) -> dict:
    return get_overview_stats(db)


@router.get("/dashboard/emissions-by-category")
def dashboard_emissions_by_category(db: Session = Depends(get_db)) -> list[dict]:
    return list(get_emissions_by_category(db))


@router.get("/dashboard/top-vendors")
def dashboard_top_vendors(limit: int = 10, db: Session = Depends(get_db)) -> list[dict]:
    return list(get_top_vendors_by_emissions(db, limit=limit))


@router.get("/dashboard/monthly-trend")
def dashboard_monthly_trend(db: Session = Depends(get_db)) -> list[dict]:
    return list(get_monthly_emissions_trend(db))


@router.get("/vendors")
def vendors_summary(db: Session = Depends(get_db)) -> list[dict]:
    return list(get_vendors_summary(db))


@router.get("/recommendations")
def recommendations(limit: int = 4, db: Session = Depends(get_db)) -> list[dict]:
    return list(get_recommendations(db, limit=limit))


@router.get("/ai-insights")
def ai_insights(limit: int = 5, db: Session = Depends(get_db)) -> list[dict]:
    return list(get_ai_insights(db, limit=limit))