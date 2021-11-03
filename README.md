# WebServer + RestServer + Socket.io

 
Utilizar ```npm install``` para instalar módulos de Node.

Utilizado para **login**: jsonwebtoken + google-auth-library(desactualizado)

## Socket.IO
El canal bidireccional entre en Servido Socket.IO (Node.js) y el Cliente Socket.IO (browser, Node.js o app) es establecida mediante WebSocket, utilizando HTTP long-polling.
Socket.io se divide en dos capas:

- La "cañeria" de bajo nivel donde está el Engine.IO, que es el motor que utiliza socket.io
- La API en un alto nivel que sería el Socket.io propiamente

El Engine.IO es el responsable de establecer la conexion de bajo nivel del cliente-servidor. Maneja:
- **Los transportes:  HTTP long-polling y el WebSocket**
	- HTTP long-polling:
		- Es referenciado como "polling", consiste en sucesivos http requests por parte del cliente, ya que el primero que realiza una transacción de información es el cliente. Se producen:
			- long-running `GET` requests
			- short-running `POST` requests
	- **WebSocket**
		- Consiste en la conexión [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), que provee un canal de comunicación bidireccional y de baja latencia entre el servidor y el cliente.
- El mecanismo de actualización:
	- Consiste en los siguientes pasos resumidos:
		1. Realiza el Handshake, al comienzo de la conexión del Engine.io el servidor envia la siguiente informacion: 
		`{ "sid":  "FSDjX-WRwSA4zTZMALqx", "upgrades":  ["websocket"], "pingInterval":  25000, "pingTimeout":  20000}`
		El session id va a ser usado en las sub-siguientes requests.
		2. Enviar data (HTTP long-polling)
		3. Recibir data (HTTP long-polling)
		4. Actualizar (WebSocket)
		5. Recibir data (HTTP long-polling, donde se cierra una vez que el WebSocket estableció la conexión)
- **Detección de desconexión**
	- Cuando el http request falla (servidor caido, etc)
	- Cuando la conexion WebSocket se cierra (el cliente cierra el tab del browser)
	- Cuando se llama a socket.disconnect(), en alguno de los lados (cliente o servidor)
