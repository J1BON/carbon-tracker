#!/usr/bin/env python3
"""
Script to add email verification columns to existing database
Run this on Fly.io to update your database schema
"""

import sys
import sqlite3
from pathlib import Path

def migrate_database(db_path: str):
    """Add email verification columns to users table"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        
        print(f"Existing columns: {columns}")
        
        # Add email_verified column if it doesn't exist
        if 'email_verified' not in columns:
            print("Adding email_verified column...")
            cursor.execute("ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT 0")
            print("✅ Added email_verified column")
        else:
            print("✅ email_verified column already exists")
        
        # Add verification_token column if it doesn't exist
        if 'verification_token' not in columns:
            print("Adding verification_token column...")
            cursor.execute("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)")
            print("✅ Added verification_token column")
        else:
            print("✅ verification_token column already exists")
        
        # Add verification_token_expires column if it doesn't exist
        if 'verification_token_expires' not in columns:
            print("Adding verification_token_expires column...")
            cursor.execute("ALTER TABLE users ADD COLUMN verification_token_expires DATETIME")
            print("✅ Added verification_token_expires column")
        else:
            print("✅ verification_token_expires column already exists")
        
        # Create index on verification_token if it doesn't exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name='ix_users_verification_token'")
        if not cursor.fetchone():
            print("Creating index on verification_token...")
            cursor.execute("CREATE INDEX ix_users_verification_token ON users(verification_token)")
            print("✅ Created index")
        else:
            print("✅ Index already exists")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Default database path for Fly.io
    db_path = "/data/carbon_tracker.db"
    
    # Allow override via command line
    if len(sys.argv) > 1:
        db_path = sys.argv[1]
    
    print(f"Migrating database: {db_path}")
    print("=" * 50)
    
    if not Path(db_path).exists():
        print(f"❌ Database file not found: {db_path}")
        sys.exit(1)
    
    success = migrate_database(db_path)
    sys.exit(0 if success else 1)

