// Función para enviar mensajes
async function enviarMensaje(textoAEnviar = null) {
  const input = document.getElementById("mensaje");
  let mensaje;

  // Si textoAEnviar no es nulo, significa que viene de un botón o un valor específico
  if (textoAEnviar !== null) {
    mensaje = textoAEnviar.trim();
  } else {
    // Si textoAEnviar es nulo, el mensaje viene del input
    mensaje = input.value.trim();
  }

  if (!mensaje) return;

  // Limpiar el input
  input.value = "";

  // Mostrar el mensaje del usuario
  mostrarMensaje(mensaje, "user", "../static/assets/pilot.svg");

  try {
    // Enviar el mensaje al servidor
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mensaje }),
    });

    const data = await response.json();

    // Mostrar la respuesta del bot
    setTimeout(() => {
      mostrarMensaje(data.respuesta, "bot", "../static/assets/robot.svg");
    }, 500);
  } catch (error) {
    mostrarMensaje("Lo siento, ocurrió un error al procesar tu mensaje", "bot");
    console.error("Error:", error);
  }
}

// Función para mostrar mensajes en el chat
function mostrarMensaje(texto, tipo, rutaImg) {
  const chatbox = document.getElementById("chatbox");

  // Crea el contenedor principal del mensaje (.msg-box-user o .msg-box-bot)
  const msgBox = document.createElement("div");
  msgBox.classList.add(tipo === "user" ? "msg-box-user" : "msg-box-bot");

  // Crea el elemento de la imagen
  const imgElement = document.createElement("img");
  imgElement.src = rutaImg;
  imgElement.width = 32;
  imgElement.classList.add(tipo === "user" ? "user-image" : "bot-image");

  // Crea el contenedor del texto del mensaje (.message)
  const messageTextDiv = document.createElement("div");
  messageTextDiv.classList.add("message");

  // Añade la clase específica según el tipo de usuario (user-message o bot-message)
  messageTextDiv.classList.add(
    tipo === "user" ? "user-message" : "bot-message"
  );
  messageTextDiv.textContent = texto; // Establece el texto del mensaje

  // Ahora, anexa los elementos hijos al msgBox
  msgBox.appendChild(imgElement);
  msgBox.appendChild(messageTextDiv);

  // Finalmente, anexa el msgBox completo al chatbox
  chatbox.appendChild(msgBox);

  // Scroll automático al final
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Permitir enviar con Enter
document.getElementById("mensaje").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

// Obtener todos los botones de respuesta rápida
const quickReplyButtons = document.querySelectorAll(".btn-shortcut");

// Iterar sobre ellos y añadir un event listener
quickReplyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const messageToSend = this.dataset.message; // Obtiene el valor del atributo data-message
    enviarMensaje(messageToSend); // Llama a enviarMensaje con el texto del botón
  });
});

// Enfocar el input al cargar
document.getElementById("mensaje").focus();
