from flask import Flask, request, jsonify, render_template
import json
import re
import random

app = Flask(__name__)

# Cargar las respuestas desde el JSON
with open('respuestas.json', 'r', encoding='utf-8') as f:
    respuestas_data = json.load(f)

# Variable para mantener el estado de la conversación
last_bot_message = ""


def encontrar_respuesta(mensaje):
    global last_bot_message
    mensaje = mensaje.lower().strip()

    # Comprobar si el mensaje actual es una categoría y si la pregunta anterior fue sobre categorías
    if "las categorias son:" in last_bot_message.lower():
        for categoria_key, datos in respuestas_data.items():
            if categoria_key.startswith("categoria_") and mensaje in datos['patrones']:
                last_bot_message = random.choice(datos['respuestas'])
                return last_bot_message

    # Búsqueda general de patrones
    for categoria, datos in respuestas_data.items():
        for patron in datos['patrones']:
            if re.search(rf'\b{patron}\b', mensaje, re.IGNORECASE):

                # Manejo especial para la categoría "categorias"
                if categoria == "categorias":
                    category_names = []
                    for cat_key in respuestas_data.keys():
                        if cat_key.startswith("categoria_"):

                            # Se asume el primer patrón como el nombre de la categoría
                            category_names.append(
                                respuestas_data[cat_key]['patrones'][0].capitalize())

                    response_text = f"¡Claro! Las categorías principales de las 24 Horas de Le Mans son: '{', '.join(category_names)}'. ¿Te gustaría saber más sobre una categoría en especifico?... ¡Escriba la palabra *categoria* seguida de su nombre!"
                    last_bot_message = response_text
                    return response_text
                else:
                    last_bot_message = random.choice(datos['respuestas'])
                    return last_bot_message

    last_bot_message = "No estoy seguro de cómo responder a eso. ¿Puedes reformular tu pregunta?. Sí necestas ayuda adicional, usa los atajos en la parte inferior."
    return last_bot_message

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
