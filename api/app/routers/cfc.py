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
from app.services.cfc_calculator import CFCCalculator

router = APIRouter()


class CFCReportCreate(BaseModel):
    device: str
    issue_type: str
    notes: str | None = None


class CFCCalculationRequest(BaseModel):
    device: str
    issue_type: str
    refrigerant_type: str = "Unknown"
    refrigerant_amount_kg: float | None = None
    device_age_years: int | None = None

# Valid CFC-containing devices
VALID_DEVICES = [
    "AC",                    # Air Conditioner
    "Refrigerator",          # Refrigerator
    "Freezer",               # Standalone Freezer
    "Dehumidifier",          # Dehumidifier
    "Car AC",                # Automotive Air Conditioning
    "Water Cooler",          # Water Cooler/Dispenser
    "Ice Maker",             # Ice Maker Machine
    "Heat Pump",             # Heat Pump System
    "Chiller",               # Commercial Chiller
    "Walk-in Cooler",        # Walk-in Refrigeration Unit
    "Commercial Refrigeration",  # Commercial Refrigeration System
    "Window AC",             # Window Air Conditioner
    "Split AC",              # Split Air Conditioner
    "Central AC",            # Central Air Conditioning
    "Car Refrigerator",      # Portable Car Refrigerator
]

# Valid issue types
VALID_ISSUE_TYPES = [
    "Gas leak",              # Refrigerant leak detected
    "Disposal",              # Device disposal/replacement
    "Servicing",             # Maintenance/service required
    "Replacement",           # Replacing old CFC-containing device
    "Improper disposal",     # Improper disposal concern
    "Recycling",            # Recycling old device
    "Maintenance check",    # Routine maintenance check
    "Refrigerant recharge",  # Refrigerant recharge needed
    "System upgrade",       # Upgrading to CFC-free system
]


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
    
    Supported devices:
    - AC, Refrigerator, Freezer, Dehumidifier, Car AC, Water Cooler, Ice Maker,
      Heat Pump, Chiller, Walk-in Cooler, Commercial Refrigeration, Window AC,
      Split AC, Central AC, Car Refrigerator
    
    Supported issue types:
    - Gas leak, Disposal, Servicing, Replacement, Improper disposal, Recycling,
      Maintenance check, Refrigerant recharge, System upgrade
    """
    # Validate device
    if report_data.device not in VALID_DEVICES:
        raise HTTPException(
            status_code=400,
            detail=f"Device must be one of: {', '.join(VALID_DEVICES)}"
        )
    
    # Validate issue_type
    if report_data.issue_type not in VALID_ISSUE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Issue type must be one of: {', '.join(VALID_ISSUE_TYPES)}"
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


@router.get("/devices")
async def get_valid_devices():
    """
    Get list of valid CFC-containing devices
    """
    return {
        "success": True,
        "data": VALID_DEVICES,
    }


@router.get("/issue-types")
async def get_valid_issue_types():
    """
    Get list of valid issue types
    """
    return {
        "success": True,
        "data": VALID_ISSUE_TYPES,
    }


@router.get("/refrigerant-types")
async def get_refrigerant_types():
    """
    Get list of available refrigerant types
    """
    return {
        "success": True,
        "data": CFCCalculator.get_refrigerant_types(),
    }


@router.post("/calculate")
async def calculate_cfc_impact(
    calculation_data: CFCCalculationRequest,
    current_user: User = Depends(get_current_active_user),
):
    """
    Calculate CFC impact for a device and issue type
    
    Returns CO2 equivalent, ozone depletion, and impact equivalents
    """
    # Validate device
    if calculation_data.device not in VALID_DEVICES:
        raise HTTPException(
            status_code=400,
            detail=f"Device must be one of: {', '.join(VALID_DEVICES)}"
        )
    
    # Validate issue type
    if calculation_data.issue_type not in VALID_ISSUE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Issue type must be one of: {', '.join(VALID_ISSUE_TYPES)}"
        )
    
    # Calculate impact
    result = CFCCalculator.calculate_cfc_impact(
        device=calculation_data.device,
        issue_type=calculation_data.issue_type,
        refrigerant_type=calculation_data.refrigerant_type,
        refrigerant_amount_kg=calculation_data.refrigerant_amount_kg,
        device_age_years=calculation_data.device_age_years,
    )
    
    return {
        "success": True,
        "data": result,
    }


@router.get("/device-defaults/{device}")
async def get_device_defaults(device: str):
    """
    Get default values for a specific device
    """
    if device not in VALID_DEVICES:
        raise HTTPException(
            status_code=400,
            detail=f"Device must be one of: {', '.join(VALID_DEVICES)}"
        )
    
    return {
        "success": True,
        "data": CFCCalculator.get_device_defaults(device),
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

