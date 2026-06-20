from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predictor import FuelPredictor
import uvicorn

app = FastAPI(title="SmartFuel Jordan - AI Prediction Service")

app.add_middleware(
    CORSMiddlewarnpm run deve,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = FuelPredictor()

class TrainRequest(BaseModel):
    station_id: str
    fuel_type: str
    history_days: int = 90

class PredictRequest(BaseModel):
    station_id: str
    fuel_type: str
    days_ahead: int = 7

class ExplainRequest(BaseModel):
    station_id: str
    fuel_type: str
    features: dict

@app.get("/health")
def health():
    return {"status": "ok", "service": "smartfuel-ai"}

@app.post("/train")
def train(req: TrainRequest):
    try:
        predictor.train(req.station_id, req.fuel_type, req.history_days)
        return {"status": "trained", "station_id": req.station_id, "fuel_type": req.fuel_type}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        forecast = predictor.predict(req.station_id, req.fuel_type, req.days_ahead)
        return {"station_id": req.station_id, "fuel_type": req.fuel_type, "forecast": forecast}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.post("/explain")
def explain(req: ExplainRequest):
    try:
        explanation = predictor.explain(req.station_id, req.fuel_type, req.features)
        return {"station_id": req.station_id, "fuel_type": req.fuel_type, "explanation": explanation}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
