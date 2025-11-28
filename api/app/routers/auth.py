"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets

from app.database import get_db
from app.models import User
from app.config import settings
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)
from app.services.email_service import EmailService

router = APIRouter(prefix="/auth", tags=["auth"])


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    eco_score: float
    level: int
    total_points: int
    is_admin: bool = False
    is_active: bool = True
    email_verified: bool = False
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Normalize email (lowercase and strip whitespace)
        email = user_data.email.strip().lower()
        
        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        verification_expires = datetime.utcnow() + timedelta(hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS)
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        print(f"Registering user: {email}, password hash: {hashed_password[:30]}...")
        
        db_user = User(
            email=email,
            name=user_data.name,
            hashed_password=hashed_password,
            eco_score=0,
            level=1,
            total_points=0,
            email_verified=False,
            verification_token=verification_token,
            verification_token_expires=verification_expires,
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"User registered successfully: {db_user.email}, ID: {db_user.id}")
        
        # Send verification email (async, don't wait for it)
        try:
            await EmailService.send_verification_email(
                to_email=email,
                name=user_data.name,
                verification_token=verification_token
            )
        except Exception as email_error:
            print(f"⚠️ Failed to send verification email: {email_error}")
            # Don't fail registration if email fails
        
        # Create access token
        access_token = create_access_token(data={"sub": db_user.email})
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(db_user.id),
                email=db_user.email,
                name=db_user.name,
                eco_score=db_user.eco_score,
                level=db_user.level,
                total_points=db_user.total_points,
                is_admin=db_user.is_admin,
                is_active=db_user.is_active,
                email_verified=db_user.email_verified,
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = str(e)
        traceback_str = traceback.format_exc()
        print(f"Registration error: {error_detail}")
        print(f"Traceback: {traceback_str}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {error_detail}"
        )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user"""
    try:
        # Find user by email (username field is used for email in OAuth2PasswordRequestForm)
        email = form_data.username.strip().lower()  # Normalize email
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Debug: Check all users
            all_users = db.query(User.email).all()
            print(f"Login attempt: User '{email}' not found")
            print(f"Available users in database: {[u.email for u in all_users]}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if not user.is_active:
            print(f"Login attempt: User '{email}' is inactive")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )
        
        # Check if email is verified - allow login but frontend will block access
        if not user.email_verified:
            print(f"Login attempt: User '{email}' email not verified - access will be restricted")
        
        # Verify password
        password_valid = verify_password(form_data.password, user.hashed_password)
        if not password_valid:
            print(f"Login attempt: Invalid password for user '{email}'")
            print(f"Stored hash starts with: {user.hashed_password[:20]}...")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"Login successful: User '{email}' logged in")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                name=user.name,
                eco_score=user.eco_score,
                level=user.level,
                total_points=user.total_points,
                is_admin=user.is_admin,
                is_active=user.is_active,
                email_verified=user.email_verified,
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user info"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        eco_score=current_user.eco_score,
        level=current_user.level,
        total_points=current_user.total_points,
        is_admin=current_user.is_admin,
        is_active=current_user.is_active,
        email_verified=current_user.email_verified,
    )


@router.get("/verify-email")
async def verify_email(
    token: str = Query(..., description="Verification token"),
    db: Session = Depends(get_db)
):
    """Verify user email with token"""
    user = db.query(User).filter(User.verification_token == token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    if user.email_verified:
        return {"message": "Email already verified", "verified": True}
    
    # Check if token expired
    if user.verification_token_expires and user.verification_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new one."
        )
    
    # Verify email
    user.email_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    db.commit()
    
    return {"message": "Email verified successfully", "verified": True}


@router.post("/resend-verification")
async def resend_verification_email(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resend verification email"""
    if current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new verification token
    verification_token = secrets.token_urlsafe(32)
    verification_expires = datetime.utcnow() + timedelta(hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS)
    
    current_user.verification_token = verification_token
    current_user.verification_token_expires = verification_expires
    db.commit()
    
    # Send verification email
    try:
        await EmailService.send_verification_email(
            to_email=current_user.email,
            name=current_user.name,
            verification_token=verification_token
        )
        return {"message": "Verification email sent successfully"}
    except Exception as e:
        print(f"⚠️ Failed to send verification email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again later."
        )

