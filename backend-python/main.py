from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Location(BaseModel):
    lat: float
    lng: float


class RiskRequest(BaseModel):
    message: str
    location: Location


@app.get("/")
def home():
    return {
        "message": "FastAPI Risk Engine Running"
    }


@app.post("/risk-score")
def risk_score(data: RiskRequest):

    score = 40

    message = data.message.lower()

    danger_words = [
        "help",
        "danger",
        "attack",
        "urgent",
        "kidnap",
        "harassment",
        "stalk"
    ]

    for word in danger_words:
        if word in message:
            score += 10

    score = min(score, 100)

    if score >= 80:
        level = "HIGH"
    elif score >= 50:
        level = "MEDIUM"
    else:
        level = "LOW"

    recommendation = (
        "Immediate response recommended"
        if level == "HIGH"
        else "Monitor situation"
    )

    return {
        "riskScore": score,
        "riskLevel": level,
        "recommendation": recommendation
    }