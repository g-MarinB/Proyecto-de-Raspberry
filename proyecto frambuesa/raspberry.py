from flask import Flask, jsonify
from flask_cors import CORS
import RPi.GPIO as GPIO

app = Flask(__name__)
CORS(app)  # ⚠️ IMPORTANTE: permite que tu página (en otro origen) hable con la Pi

RELAY_PIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.output(RELAY_PIN, GPIO.HIGH)  # Apagado al inicio
estado_actual = "APAGADO"

@app.route('/on')
def encender():
    global estado_actual
    GPIO.output(RELAY_PIN, GPIO.LOW)
    estado_actual = "ENCENDIDO"
    return jsonify({"ok": True, "estado": estado_actual})

@app.route('/off')
def apagar():
    global estado_actual
    GPIO.output(RELAY_PIN, GPIO.HIGH)
    estado_actual = "APAGADO"
    return jsonify({"ok": True, "estado": estado_actual})

@app.route('/estado')
def estado():
    return jsonify({"estado": estado_actual})

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=8000)
    finally:
        GPIO.cleanup()