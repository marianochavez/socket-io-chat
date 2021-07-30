const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8000/api/auth/"
  : "https://node-socket-chat-io.herokuapp.com/api/auth/";

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const txtMensajePrivado = document.querySelector("#txtMensajePrivado");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");
const btnSalirGoogle = document.querySelector("#btnSalirGoogle");

// Validar el token del localstorage
const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.nombre;

  await conectarSocket();
};

const conectarSocket = async () => {
  // Establece la conexion con el server
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Socket online");
  });

  socket.on("disconnect", () => {
    console.log("Socket offline");
  });

  socket.on("recibir-mensajes", dibujarMensajes);

  socket.on("usuarios-activos", dibujarUsuarios);

  socket.on("mensaje-privado", (payload) => {
    console.log("Privado", payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success"> ${nombre} </h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsuarios.innerHTML = usersHtml;
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = "";
  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHTML += `
      <li>
        <p>
          <span class="text-primary"> ${nombre} </span>
          <span >${mensaje}</span>
        </p>
      </li>
    `;
  });

  ulMensajes.innerHTML = mensajesHTML;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value;

  if (keyCode !== 13) {
    return;
  } //Enter
  if (mensaje.length == 0) {
    return;
  }

  socket.emit("enviar-mensaje", { mensaje });

  txtMensaje.value = "";
});

txtMensajePrivado.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensajePrivado.value;
  const uid = txtUid.value;

  if (keyCode !== 13) {
    return;
  } //Enter
  if (mensaje.length == 0) {
    return;
  }

  socket.emit("enviar-mensaje", { mensaje, uid });

  txtMensajePrivado.value = "";
});

// btnSalir.addEventListener("click", () => {
//   socket.disconnect();
//   window.location = "index.html";
// });

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

// Cargar el gapi de google
function onLoad() {
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
}


const main = async () => {
  await validarJWT();
};

main();
