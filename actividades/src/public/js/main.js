const socket = io();

//envio mensaje al server
socket.emit('message', "Mensaje desde el cliente");

//recibo mensaje del server
socket.on('server:message', (data)=>{
    console.log(data);
})