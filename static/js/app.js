// Función para enviar mensajes
async function enviarMensaje() {
  const input = document.getElementById("mensaje");
  const mensaje = input.value.trim();

  if (!mensaje) return;

  // Limpiar el input
  input.value = "";

  // Mostrar el mensaje del usuario
  mostrarMensaje(mensaje, "user");

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
      mostrarMensaje(data.respuesta, "bot");
    }, 500); // Pequeño retraso para simular "pensamiento"
  } catch (error) {
    mostrarMensaje("Lo siento, ocurrió un error al procesar tu mensaje", "bot");
    console.error("Error:", error);
  }
}

// Función para mostrar mensajes en el chat
function mostrarMensaje(texto, tipo) {
  const chatbox = document.getElementById("chatbox");
  const mensajeDiv = document.createElement("div");
  mensajeDiv.classList.add("message");
  mensajeDiv.classList.add(tipo === "user" ? "user-message" : "bot-message");
  mensajeDiv.textContent = texto;
  chatbox.appendChild(mensajeDiv);

  // Scroll automático al final
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Permitir enviar con Enter
document.getElementById("mensaje").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

// Enfocar el input al cargar
document.getElementById("mensaje").focus();
