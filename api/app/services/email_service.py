"""
Email service for sending verification emails
Supports SMTP and Resend API
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import httpx
import os
from app.config import settings


class EmailService:
    """Service for sending emails via SMTP or Resend API"""
    
    @staticmethod
    async def send_verification_email(
        to_email: str,
        name: str,
        verification_token: str
    ) -> bool:
        """
        Send email verification email
        
        Args:
            to_email: Recipient email address
            name: Recipient name
            verification_token: Verification token to include in link
            
        Returns:
            True if email sent successfully, False otherwise
        """
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
        subject = "Verify Your Email - MyCarbonFootprint"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌱 Welcome to MyCarbonFootprint!</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>Thank you for registering with MyCarbonFootprint! Please verify your email address to complete your registration.</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #059669;">{verification_url}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2024 MyCarbonFootprint. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to MyCarbonFootprint!
        
        Hi {name},
        
        Thank you for registering with MyCarbonFootprint! Please verify your email address by clicking the link below:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        
        © 2024 MyCarbonFootprint. All rights reserved.
        """
        
        # Try Resend API first if configured
        # Check both settings and environment variables
        resend_key = os.getenv('RESEND_API_KEY', '') or getattr(settings, 'RESEND_API_KEY', '') or ''
        resend_key = resend_key.strip() if resend_key else ''
        
        print(f"🔍 Checking Resend configuration...")
        print(f"   RESEND_API_KEY from env: {os.getenv('RESEND_API_KEY', 'NOT_SET')[:15] if os.getenv('RESEND_API_KEY') else 'NOT_SET'}...")
        print(f"   RESEND_API_KEY from settings: {getattr(settings, 'RESEND_API_KEY', 'NOT_SET')[:15] if getattr(settings, 'RESEND_API_KEY', '') else 'NOT_SET'}...")
        print(f"   Final resend_key: {resend_key[:15] if resend_key else 'NOT_SET'}...")
        
        if resend_key:
            print(f"📧 Resend API key found, attempting to send email...")
            result = await EmailService._send_via_resend(
                to_email=to_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            if result:
                return True
            # If Resend fails, continue to SMTP fallback
        else:
            print(f"⚠️ RESEND_API_KEY not found in environment or settings")
        
        # Fallback to SMTP
        if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
            return await EmailService._send_via_smtp(
                to_email=to_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
        
        # If no email service configured, log and return False
        print(f"⚠️ Email service not configured. Would send verification email to {to_email}")
        print(f"   RESEND_API_KEY: {'Set' if resend_key else 'Not set'}")
        print(f"   SMTP_HOST: {settings.SMTP_HOST or 'Not set'}")
        print(f"   Verification URL: {verification_url}")
        print(f"   🔗 For localhost development, use this URL to verify: {verification_url}")
        print(f"   📝 Or manually verify in database or use: http://localhost:3000/verify-email?token={verification_token}")
        return False
    
    @staticmethod
    async def _send_via_resend(
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str
    ) -> bool:
        """Send email via Resend API"""
        try:
            # Get Resend API key from settings or environment
            resend_key = getattr(settings, 'RESEND_API_KEY', '') or os.getenv('RESEND_API_KEY', '')
            if not resend_key or not resend_key.strip():
                print(f"❌ RESEND_API_KEY not found")
                return False
            
            # Format the "from" field correctly for Resend
            # Resend accepts: "email@example.com" or "Name <email@example.com>"
            from_email = (getattr(settings, 'SMTP_FROM_EMAIL', '') or os.getenv('SMTP_FROM_EMAIL', '')).strip()
            from_name = (getattr(settings, 'SMTP_FROM_NAME', '') or os.getenv('SMTP_FROM_NAME', 'MyCarbonFootprint')).strip()
            
            # Validate email format
            if not from_email or "@" not in from_email:
                print(f"❌ Invalid SMTP_FROM_EMAIL: {from_email}")
                print(f"   It should be an email address like: noreply@jibanahammed.com")
                print(f"   Current value: {from_email}")
                return False
            
            # Format: "Name <email@example.com>" or just "email@example.com"
            if from_name:
                from_field = f"{from_name} <{from_email}>"
            else:
                from_field = from_email
            
            print(f"📧 Sending email via Resend from: {from_field}")
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {resend_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": from_field,
                        "to": [to_email],
                        "subject": subject,
                        "html": html_content,
                        "text": text_content,
                    },
                    timeout=10.0,
                )
                
                if response.status_code == 200:
                    response_data = response.json()
                    print(f"✅ Verification email sent to {to_email} via Resend")
                    print(f"   Email ID: {response_data.get('id', 'N/A')}")
                    return True
                else:
                    error_detail = response.text
                    try:
                        error_json = response.json()
                        error_detail = error_json.get('message', error_detail)
                    except:
                        pass
                    print(f"❌ Failed to send email via Resend")
                    print(f"   Status Code: {response.status_code}")
                    print(f"   Error: {error_detail}")
                    print(f"   From Email: {from_field}")
                    print(f"   To Email: {to_email}")
                    if response.status_code == 422:
                        print(f"   💡 Common issue: Domain not verified in Resend dashboard")
                        print(f"   💡 Go to https://resend.com/domains to verify your domain")
                    return False
        except Exception as e:
            print(f"❌ Error sending email via Resend: {e}")
            return False
    
    @staticmethod
    async def _send_via_smtp(
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str
    ) -> bool:
        """Send email via SMTP"""
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg["To"] = to_email
            
            # Add both plain text and HTML versions
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            
            msg.attach(part1)
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            print(f"✅ Verification email sent to {to_email} via SMTP")
            return True
        except Exception as e:
            print(f"❌ Error sending email via SMTP: {e}")
            return False

