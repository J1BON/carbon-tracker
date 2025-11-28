#!/usr/bin/env python3
"""
Script to make a user an admin
Usage: python make_admin.py <user_email>
"""

import sys
from app.database import SessionLocal
from app.models import User

def make_admin(email: str):
    """Make a user an admin by email"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User with email '{email}' not found!")
            return False
        
        user.is_admin = True
        db.commit()
        print(f"✅ User '{email}' is now an admin!")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <user_email>")
        sys.exit(1)
    
    email = sys.argv[1]
    make_admin(email)

