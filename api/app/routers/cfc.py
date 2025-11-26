"""
CFC Emission Awareness & Reporting endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import CFCReport, User
from app.auth import get_current_active_user

router = APIRouter()


class CFCReportCreate(BaseModel):
    device: str  # AC / Refrigerator
    issue_type: str  # Gas leak / Disposal / Servicing
    notes: str | None = None


class CFCReportResponse(BaseModel):
    id: str
    user_id: str
    device: str
    issue_type: str
    notes: str | None
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/report")
async def create_cfc_report(
    report_data: CFCReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new CFC report
    """
    # Validate device
    if report_data.device not in ["AC", "Refrigerator"]:
        raise HTTPException(
            status_code=400,
            detail="Device must be either 'AC' or 'Refrigerator'"
        )
    
    # Validate issue_type
    if report_data.issue_type not in ["Gas leak", "Disposal", "Servicing"]:
        raise HTTPException(
            status_code=400,
            detail="Issue type must be 'Gas leak', 'Disposal', or 'Servicing'"
        )
    
    report = CFCReport(
        user_id=current_user.id,
        device=report_data.device,
        issue_type=report_data.issue_type,
        notes=report_data.notes,
        date=datetime.utcnow(),
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Serialize the report object to dict for proper JSON response
    report_dict = {
        "id": str(report.id),
        "user_id": str(report.user_id),
        "device": report.device,
        "issue_type": report.issue_type,
        "notes": report.notes,
        "date": report.date.isoformat() if report.date else None,
        "created_at": report.created_at.isoformat() if report.created_at else None,
    }
    
    return {
        "success": True,
        "data": report_dict,
    }


@router.get("/my-reports")
async def get_my_cfc_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get all CFC reports for the authenticated user
    """
    reports = db.query(CFCReport).filter(
        CFCReport.user_id == current_user.id
    ).order_by(
        CFCReport.date.desc()
    ).all()
    
    # Serialize reports
    reports_list = []
    for report in reports:
        reports_list.append({
            "id": str(report.id),
            "user_id": str(report.user_id),
            "device": report.device,
            "issue_type": report.issue_type,
            "notes": report.notes,
            "date": report.date.isoformat() if report.date else None,
            "created_at": report.created_at.isoformat() if report.created_at else None,
        })
    
    return {
        "success": True,
        "data": reports_list,
    }

