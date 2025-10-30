from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import jwt
import os
import json
from typing import List, Optional, Dict, Any

app = FastAPI(title="N8tive Analytics Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

JWT_SECRET = os.getenv("AUTH_JWT_SECRET", "supersecret-dev")
JWT_ISSUER = os.getenv("AUTH_JWT_ISSUER", "n8tive-auth")
JWT_AUDIENCE = os.getenv("AUTH_JWT_AUDIENCE", "n8tive-suite")

DATA_FILE = os.getenv("DASHBOARD_DATA_FILE", "data/dashboards.json")

class KPI(BaseModel):
    key: str
    value: float

class Widget(BaseModel):
    id: str
    type: str  # kpi | chart
    title: str
    w: int
    h: int
    x: int
    y: int
    config: Dict[str, Any] = {}

class Dashboard(BaseModel):
    widgets: List[Widget]

class SaveDashboardRequest(BaseModel):
    widgets: List[Widget]

async def verify_jwt(authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], audience=JWT_AUDIENCE, issuer=JWT_ISSUER)
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e


def _load_store():
    if not os.path.exists(DATA_FILE):
        return {}
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {}


def _save_store(store):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(store, f)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/kpi")
async def post_kpi(kpi: KPI, _=Depends(verify_jwt)):
    # Stub: persist to DB later
    return {"ok": True, "kpi": kpi.model_dump()}

@app.get("/dashboard", response_model=Dashboard)
async def get_dashboard(user=Depends(verify_jwt)):
    store = _load_store()
    uid = user.get('sub')
    data = store.get(uid) or {"widgets": []}
    return data

@app.post("/dashboard")
async def save_dashboard(req: SaveDashboardRequest, user=Depends(verify_jwt)):
    store = _load_store()
    uid = user.get('sub')
    store[uid] = req.model_dump()
    _save_store(store)
    return {"ok": True}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        counter = 0
        while True:
            counter += 1
            await ws.send_json({
                "type": "kpi_update",
                "data": [
                    {"key": "revenue", "value": 1000 + counter * 5},
                    {"key": "uptime", "value": 99.9},
                    {"key": "conversion", "value": 2.5 + (counter % 10) * 0.1}
                ]
            })
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        return
