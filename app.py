from flask import Flask, render_template, request
import numpy as np
import pywt
import joblib
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load model and scaler
model = load_model("ecg_model.h5")
scaler = joblib.load("scaler.pkl")


# DWT feature extraction (same as training)
def dwt_features(signal):

    coeffs = pywt.wavedec(signal, 'db4', level=4)

    features = []

    for c in coeffs:
        features.append(np.mean(c))
        features.append(np.std(c))
        features.append(np.max(c))
        features.append(np.min(c))

    return np.array(features)


@app.route("/", methods=["GET","POST"])
def index():

    prediction = None

    if request.method == "POST":

        ecg_input = request.form["ecg"]

        signal = np.array(list(map(float, ecg_input.split(","))))

        features = dwt_features(signal)

        features = scaler.transform([features])

        features = features.reshape(features.shape[0], features.shape[1],1)

        pred = model.predict(features)

        result = np.argmax(pred)

        if result == 0:
            prediction = "Normal Heartbeat"
        else:
            prediction = "Abnormal Arrhythmia Detected"

    return render_template("index.html", prediction=prediction)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)