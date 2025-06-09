from flask import Flask, request, jsonify, render_template
import json
import re
import random

app = Flask(__name__)

# Cargar las respuestas desde el JSON
with open('respuestas.json', 'r', encoding='utf-8') as f:
    respuestas_data = json.load(f)


def encontrar_respuesta(mensaje):
    mensaje = mensaje.lower().strip()

    for categoria, datos in respuestas_data.items():
        for patron in datos['patrones']:
            if re.search(rf'\b{patron}\b', mensaje, re.IGNORECASE):
                return random.choice(datos['respuestas'])

    return "No estoy seguro de cómo responder a eso. ¿Puedes reformular tu pregunta?"

# Ruta principal para la interfaz gráfica


@app.route('/')
def index():
    return render_template('chat.html')

# Ruta para manejar el chat


@app.route('/chat', methods=['POST'])
def chat():
    mensaje_usuario = request.json.get('mensaje', '')
    respuesta = encontrar_respuesta(mensaje_usuario)
    return jsonify({'respuesta': respuesta})


if __name__ == '__main__':
    app.run(debug=True)
