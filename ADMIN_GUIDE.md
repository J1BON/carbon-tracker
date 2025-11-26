# 🔐 Admin Panel Setup & Usage Guide

Complete guide for setting up and using the Carbon Tracker Admin Panel.

---

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Creating Admin Users](#creating-admin-users)
3. [Accessing the Admin Panel](#accessing-the-admin-panel)
4. [Admin Dashboard](#admin-dashboard)
5. [User Management](#user-management)
6. [Content Management](#content-management)
7. [API Endpoints](#api-endpoints)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Prerequisites

- Database is running and migrations are applied
- API service is running
- You have access to the database or API

### Verify Admin Fields

The admin panel requires the `is_admin` and `is_active` fields in the users table. These should already be added via migration, but you can verify:

```sql
-- Check if columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('is_admin', 'is_active');
```

Expected output:
- `is_admin` (boolean, default: false)
- `is_active` (boolean, default: true)

---

## 👤 Creating Admin Users

### Method 1: Using SQL (Recommended for First Admin)

Connect to your database and run:

```sql
-- Make an existing user an admin
UPDATE users 
SET is_admin = true, is_active = true 
WHERE email = 'admin@example.com';

-- Verify the change
SELECT email, name, is_admin, is_active 
FROM users 
WHERE email = 'admin@example.com';
```

### Method 2: Using Admin API (After First Admin Exists)

Once you have at least one admin user, you can promote other users via the admin API:

```bash
# Login as admin first to get token
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=yourpassword"

# Use the token to promote a user
curl -X PUT "http://localhost:8000/api/v1/admin/users/{user_id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_admin": true}'
```

### Method 3: Using Admin Panel UI

1. Log in as an existing admin
2. Navigate to `/admin/users`
3. Find the user you want to promote
4. Click the Shield icon to toggle admin status

---

## 🌐 Accessing the Admin Panel

### Frontend Access

1. **Login** to the website with an admin account
2. Navigate to any of these URLs:
   - **Dashboard**: `http://localhost:3000/admin`
   - **User Management**: `http://localhost:3000/admin/users`
   - **Content Management**: `http://localhost:3000/admin/content`

### Route Protection

- Admin routes are protected by `AdminRoute` component
- Non-admin users are automatically redirected to the dashboard
- Inactive users cannot access admin features

### API Access

All admin endpoints require:
- Valid JWT token in `Authorization: Bearer {token}` header
- User must have `is_admin = true`
- User must have `is_active = true`

---

## 📊 Admin Dashboard

**URL**: `/admin`

### Overview

The admin dashboard provides a comprehensive overview of platform statistics:

#### Key Metrics

- **Total Users**: All registered users
- **Active Users**: Users with `is_active = true`
- **Carbon Saved**: Total carbon emissions saved (kg)
- **Admin Users**: Number of administrators
- **Badges**: Total badges available
- **Recycling Points**: Total recycling locations

#### Activity Overview

- Total carbon logs
- Total CFC reports
- Total challenges
- Monthly statistics (new users, carbon logs)

### Features

- Real-time statistics
- Monthly growth metrics
- Quick access to management pages

---

## 👥 User Management

**URL**: `/admin/users`

### Features

#### View All Users

- **Search**: Search by name or email
- **Pagination**: 50 users per page
- **Filters**: Filter by admin status or active status
- **Sorting**: Sorted by creation date (newest first)

#### User Information Displayed

- Name and email
- Admin status (badge)
- Active status (badge)
- Level and eco score
- Total points

#### Actions Available

1. **Toggle Admin Status** (Shield icon)
   - Promote/demote users to/from admin
   - Admins cannot remove their own admin status

2. **Toggle Active Status** (UserCheck/UserX icon)
   - Activate/deactivate user accounts
   - Inactive users cannot log in

3. **Delete User** (Trash icon)
   - Soft delete (sets `is_active = false`)
   - Admins cannot delete themselves

### Best Practices

- Always verify before making changes
- Use search to find specific users quickly
- Deactivate instead of deleting when possible (preserves data)

---

## 📦 Content Management

**URL**: `/admin/content`

### Tabs

#### 1. Badges Management

**View Badges**
- See all available badges
- View badge details (name, description, rarity, points required)

**Actions**
- Delete badges (with confirmation)
- Create new badges (via API or database)

**Badge Properties**
- `name`: Badge name
- `description`: Badge description
- `icon`: Icon identifier
- `rarity`: common, rare, epic, legendary
- `points_required`: Points needed to earn

#### 2. Challenges Management

**View Challenges**
- See all challenges
- View challenge status (active/inactive)
- See target values and rewards

**Actions**
- Delete challenges (with confirmation)
- Create new challenges (via API or database)

**Challenge Properties**
- `name`: Challenge name
- `description`: Challenge description
- `target_value`: Target to achieve
- `current_unit`: Unit of measurement
- `reward_points`: Points awarded
- `badge_reward`: Optional badge reward
- `expires_at`: Expiration date
- `is_active`: Active status

#### 3. Recycling Points Management

**View Recycling Points**
- See all recycling locations
- View verification status
- See accepted waste types

**Actions**
- Delete recycling points (with confirmation)
- Create new points (via API or database)

**Recycling Point Properties**
- `name`: Location name
- `address`: Physical address
- `latitude` / `longitude`: GPS coordinates
- `waste_types_accepted`: Array of waste types
- `opening_hours`: Business hours
- `phone`: Contact phone
- `website`: Website URL
- `verified`: Verification status

---

## 🔌 API Endpoints

### Base URL

All admin endpoints are prefixed with `/api/v1/admin`

### Authentication

All endpoints require:
```
Authorization: Bearer {your_jwt_token}
```

### Endpoints

#### Statistics

```http
GET /api/v1/admin/stats
```

**Response:**
```json
{
  "total_users": 150,
  "active_users": 145,
  "admin_users": 3,
  "total_carbon_logs": 1250,
  "total_carbon_saved_kg": 12500.5,
  "total_cfc_reports": 45,
  "total_badges": 12,
  "total_challenges": 8,
  "total_recycling_points": 25,
  "users_this_month": 15,
  "carbon_logs_this_month": 120
}
```

#### User Management

**Get All Users**
```http
GET /api/v1/admin/users?skip=0&limit=50&search=john&is_admin=false&is_active=true
```

**Get User by ID**
```http
GET /api/v1/admin/users/{user_id}
```

**Update User**
```http
PUT /api/v1/admin/users/{user_id}
Content-Type: application/json

{
  "name": "New Name",
  "is_admin": true,
  "is_active": true,
  "eco_score": 85.5,
  "level": 5,
  "total_points": 1000
}
```

**Delete User** (Soft delete)
```http
DELETE /api/v1/admin/users/{user_id}
```

#### Carbon Logs

**Get All Carbon Logs**
```http
GET /api/v1/admin/carbon-logs?skip=0&limit=50&user_id={optional}
```

**Delete Carbon Log**
```http
DELETE /api/v1/admin/carbon-logs/{log_id}
```

#### Badges

**Get All Badges**
```http
GET /api/v1/admin/badges
```

**Create Badge**
```http
POST /api/v1/admin/badges
Content-Type: application/x-www-form-urlencoded

name=Green Warrior&description=Eco-friendly champion&rarity=rare&points_required=500
```

**Update Badge**
```http
PUT /api/v1/admin/badges/{badge_id}
Content-Type: application/x-www-form-urlencoded

name=Updated Name&rarity=epic
```

**Delete Badge**
```http
DELETE /api/v1/admin/badges/{badge_id}
```

#### Challenges

**Get All Challenges**
```http
GET /api/v1/admin/challenges
```

**Create Challenge**
```http
POST /api/v1/admin/challenges
Content-Type: application/x-www-form-urlencoded

name=Reduce Carbon&description=Reduce 100kg&target_value=100&current_unit=kg&reward_points=200&is_active=true
```

**Update Challenge**
```http
PUT /api/v1/admin/challenges/{challenge_id}
Content-Type: application/x-www-form-urlencoded

is_active=false
```

**Delete Challenge**
```http
DELETE /api/v1/admin/challenges/{challenge_id}
```

#### Recycling Points

**Get All Recycling Points**
```http
GET /api/v1/admin/recycling-points
```

**Create Recycling Point**
```http
POST /api/v1/admin/recycling-points
Content-Type: application/x-www-form-urlencoded

name=Green Center&address=123 Main St&latitude=40.7128&longitude=-74.0060&waste_types_accepted=["plastic","paper"]&verified=true
```

**Update Recycling Point**
```http
PUT /api/v1/admin/recycling-points/{point_id}
Content-Type: application/x-www-form-urlencoded

verified=true
```

**Delete Recycling Point**
```http
DELETE /api/v1/admin/recycling-points/{point_id}
```

#### CFC Reports

**Get All CFC Reports**
```http
GET /api/v1/admin/cfc-reports?skip=0&limit=50&user_id={optional}
```

**Delete CFC Report**
```http
DELETE /api/v1/admin/cfc-reports/{report_id}
```

---

## 🔒 Security Best Practices

### Admin Account Security

1. **Limit Admin Accounts**
   - Only create admin accounts for trusted users
   - Regularly audit admin user list
   - Remove admin access when no longer needed

2. **Strong Passwords**
   - Use complex passwords for admin accounts
   - Consider password rotation policies
   - Enable 2FA if available (future feature)

3. **Monitor Admin Activity**
   - Review admin actions regularly
   - Check for suspicious user modifications
   - Monitor content deletions

### API Security

1. **Token Management**
   - Tokens expire after 7 days (configurable)
   - Store tokens securely
   - Never share admin tokens

2. **HTTPS in Production**
   - Always use HTTPS for admin endpoints
   - Never send tokens over unencrypted connections

3. **Rate Limiting**
   - Consider implementing rate limiting for admin endpoints
   - Monitor for abuse patterns

### Data Protection

1. **Backup Before Major Changes**
   - Backup database before bulk operations
   - Test changes in development first

2. **Audit Trail** (Future Feature)
   - Log all admin actions
   - Track who made what changes

3. **Soft Deletes**
   - User deletion is soft (sets `is_active = false`)
   - Data is preserved for recovery

---

## 🛠️ Troubleshooting

### Cannot Access Admin Panel

**Problem**: Getting redirected to dashboard

**Solutions**:
1. Verify user has `is_admin = true`:
   ```sql
   SELECT email, is_admin, is_active FROM users WHERE email = 'your@email.com';
   ```

2. Check if user is active:
   ```sql
   UPDATE users SET is_active = true WHERE email = 'your@email.com';
   ```

3. Clear browser cache and cookies
4. Log out and log back in

### API Returns 403 Forbidden

**Problem**: `{"detail": "Admin access required"}`

**Solutions**:
1. Verify token is valid (not expired)
2. Check user has admin privileges
3. Ensure user account is active
4. Try logging in again to get a new token

### Database Connection Issues

**Problem**: Admin panel shows errors or cannot load data

**Solutions**:
1. Verify database is running:
   ```bash
   docker ps | grep postgres
   ```

2. Check database connection:
   ```bash
   docker exec carbon-tracker-db psql -U postgres -d carbon_tracker -c "SELECT 1;"
   ```

3. Verify API can connect:
   ```bash
   curl http://localhost:8000/health
   ```

4. Check API logs:
   ```bash
   docker logs carbon-tracker-api
   ```

### Migration Issues

**Problem**: Admin fields not showing in database

**Solutions**:
1. Check migration status:
   ```bash
   docker exec carbon-tracker-api alembic current
   ```

2. Run migrations:
   ```bash
   docker exec carbon-tracker-api alembic upgrade head
   ```

3. Verify columns exist:
   ```sql
   \d users
   ```

### User Cannot Be Promoted to Admin

**Problem**: Error when trying to make user admin

**Solutions**:
1. Verify user exists:
   ```sql
   SELECT id, email FROM users WHERE email = 'user@example.com';
   ```

2. Check for database constraints
3. Try using SQL directly:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'user@example.com';
   ```

---

## 📝 Quick Reference

### Common SQL Commands

```sql
-- Make user admin
UPDATE users SET is_admin = true WHERE email = 'user@example.com';

-- Deactivate user
UPDATE users SET is_active = false WHERE email = 'user@example.com';

-- List all admins
SELECT email, name, created_at FROM users WHERE is_admin = true;

-- Count users by status
SELECT 
  COUNT(*) FILTER (WHERE is_admin = true) as admins,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) as total
FROM users;
```

### Common API Calls

```bash
# Get admin stats
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/admin/stats

# List users
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/admin/users

# Update user
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_admin": true}' \
  http://localhost:8000/api/v1/admin/users/{user_id}
```

---

## 🎯 Next Steps

1. **Create Your First Admin**: Use SQL to promote your account
2. **Explore Dashboard**: Check out `/admin` for platform overview
3. **Manage Users**: Visit `/admin/users` to see all users
4. **Review Content**: Check `/admin/content` for badges, challenges, and recycling points
5. **Set Up Monitoring**: Regularly check admin stats and user activity

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review API logs: `docker logs carbon-tracker-api`
3. Check database status: `docker ps`
4. Verify migrations: `docker exec carbon-tracker-api alembic current`

---

**Last Updated**: November 2025  
**Version**: 1.0.0

