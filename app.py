from flask import Flask, render_template, request, redirect, url_for, Response
from predict import CoughPredictor
import json

app = Flask(__name__)

@app.get("/")
def index():
    return render_template('index.html')

@app.post("/predict")
async def predict():
    request_files = request.files
    audio_file = request_files.get('file')
    audio_file.save(audio_file.filename)
    
    predictor = CoughPredictor(best_lambda=6)
    predictor.load_model_and_sparsify()
    x = predictor.process_features_and_sparsify(audio_file=audio_file.filename)
    return {"prediction": predictor.predict(x)}