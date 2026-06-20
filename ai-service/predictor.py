import numpy as np
import pandas as pd
from prophet import Prophet
import shap
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

class FuelPredictor:
    def __init__(self):
        self.models = {}
        self.explainers = {}
        self.feature_names = [
            "day_of_week", "month", "day_of_year",
            "lag_1d", "lag_7d", "rolling_avg_7d",
            "hour", "is_weekend", "is_holiday"
        ]

    def _build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        features = pd.DataFrame(index=df.index)
        dates = pd.to_datetime(df["ds"])
        features["day_of_week"] = dates.dt.dayofweek
        features["month"] = dates.dt.month
        features["day_of_year"] = dates.dt.dayofyear
        features["hour"] = 12
        features["is_weekend"] = (dates.dt.dayofweek >= 5).astype(int)
        features["is_holiday"] = 0
        values = df["y"].values
        features["lag_1d"] = np.roll(values, 1)
        features["lag_7d"] = np.roll(values, 7)
        roll = pd.Series(values).rolling(7, min_periods=1).mean()
        features["rolling_avg_7d"] = roll.values
        features["lag_1d"][0] = values[0]
        features["lag_7d"][:7] = values[:7]
        return features

    def train(self, station_id: str, fuel_type: str, history_days: int = 90):
        np.random.seed(42 + hash(station_id + fuel_type) % 10000)
        dates = pd.date_range(
            end=datetime.now(), periods=history_days, freq="D"
        )
        base = 10000 + np.random.randn(history_days).cumsum() * 200
        weekly = 2000 * (1 + np.sin(dates.dayofweek * 2 * np.pi / 7))
        noise = np.random.normal(0, 500, history_days)
        values = np.maximum(base + weekly + noise, 500)

        df = pd.DataFrame({"ds": dates, "y": values})
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05,
        )
        model.add_regressor("day_of_week")
        model.add_regressor("month")
        model.add_regressor("is_weekend")
        features = self._build_features(df)
        train_df = pd.concat([df, features], axis=1)
        model.fit(train_df)

        rf = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
        rf.fit(features.fillna(0), df["y"])
        explainer = shap.TreeExplainer(rf)

        key = f"{station_id}:{fuel_type}"
        self.models[key] = {"prophet": model, "rf": rf, "explainer": explainer}
        return {"trained": True, "samples": history_days}

    def predict(self, station_id: str, fuel_type: str, days_ahead: int = 7):
        key = f"{station_id}:{fuel_type}"
        if key not in self.models:
            self.train(station_id, fuel_type, 90)
        model = self.models[key]["prophet"]

        future = model.make_future_dataframe(periods=days_ahead, include_history=False)
        fdates = pd.to_datetime(future["ds"])
        future["day_of_week"] = fdates.dt.dayofweek
        future["month"] = fdates.dt.month
        future["is_weekend"] = (fdates.dt.dayofweek >= 5).astype(int)

        forecast = model.predict(future)
        result = []
        for i, row in forecast.iterrows():
            result.append({
                "date": str(fdates[i].date()),
                "predicted_level": round(float(row["yhat"]), 2),
                "lower_bound": round(float(row["yhat_lower"]), 2),
                "upper_bound": round(float(row["yhat_upper"]), 2),
            })
        return result

    def explain(self, station_id: str, fuel_type: str, features: dict):
        key = f"{station_id}:{fuel_type}"
        if key not in self.models:
            self.train(station_id, fuel_type, 90)

        explainer = self.models[key]["explainer"]
        rf = self.models[key]["rf"]

        input_df = pd.DataFrame([features])[self.feature_names].fillna(0)
        shap_values = explainer.shap_values(input_df)

        factors = []
        for i, name in enumerate(self.feature_names):
            if abs(shap_values[0][i]) > 0.01:
                factors.append({
                    "factor": name,
                    "label": name.replace("_", " ").title(),
                    "weight": round(float(shap_values[0][i]), 4),
                    "value": float(features.get(name, 0)),
                })

        factors.sort(key=lambda f: abs(f["weight"]), reverse=True)
        total = sum(abs(f["weight"]) for f in factors) or 1
        for f in factors:
            f["importance_pct"] = round(abs(f["weight"]) / total * 100, 1)

        base_pred = float(rf.predict(input_df)[0])
        return {
            "base_prediction": round(base_pred, 2),
            "factors": factors,
            "confidence": round(min(abs(base_pred) / 20000 * 100, 95), 1),
        }
