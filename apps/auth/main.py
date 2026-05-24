import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import jwt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="N8tive Auth Service")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("AUTH_JWT_SECRET", "")
if not JWT_SECRET:
    print("ERROR: AUTH_JWT_SECRET environment variable must be set", file=sys.stderr)
    sys.exit(1)
JWT_ISSUER = os.getenv("AUTH_JWT_ISSUER", "n8tive-auth")
JWT_AUDIENCE = os.getenv("AUTH_JWT_AUDIENCE", "n8tive-suite")
JWT_EXPIRE_MINUTES = 60 * 8

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@app.post("/token", response_model=TokenResponse)
async def issue_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Demo only: accept any username/password; production would validate against DB/IdP
    now = datetime.now(timezone.utc)
    payload = {
        "sub": form_data.username,
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=JWT_EXPIRE_MINUTES)).timestamp()),
        "tenants": ["default"],
        "roles": ["user"]
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return TokenResponse(access_token=token)

@app.get("/health")
async def health():
    return {"status": "ok"}
