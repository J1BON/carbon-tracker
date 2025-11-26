"""
SQLAlchemy models for Carbon Tracker
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Gamification
    eco_score = Column(Float, default=0)
    level = Column(Integer, default=1)
    total_points = Column(Integer, default=0)
    
    # Admin
    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    carbon_logs = relationship("CarbonLog", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    cfc_reports = relationship("CFCReport", back_populates="user")


class CarbonLog(Base):
    __tablename__ = "carbon_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # transport, diet, energy, etc.
    activity = Column(String(255), nullable=False)
    carbon_amount_kg = Column(Float, nullable=False)
    meta_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="carbon_logs")


class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    rarity = Column(String(20), nullable=False)  # common, rare, epic, legendary
    points_required = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserBadge(Base):
    __tablename__ = "user_badges"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("badges.id"), primary_key=True)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")


class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=False)
    current_unit = Column(String(50), nullable=False)
    reward_points = Column(Integer, default=0)
    badge_reward = Column(UUID(as_uuid=True), ForeignKey("badges.id"), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class RecyclingPoint(Base):
    __tablename__ = "recycling_points"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    waste_types_accepted = Column(JSON, nullable=False)  # Array of waste types
    opening_hours = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CFCReport(Base):
    __tablename__ = "cfc_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    device = Column(String(50), nullable=False)  # AC / Refrigerator
    issue_type = Column(String(50), nullable=False)  # Gas leak / Disposal / Servicing
    notes = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="cfc_reports")

