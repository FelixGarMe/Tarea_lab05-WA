const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Directorio donde se guardarán las imágenes de perfil
const profileImageUploadDir = './profile-images';

// Configuración de Multer para subir imágenes de perfil
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImageUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const profileImageUpload = multer({ storage: profileImageStorage });

app.post('/upload-profile-image', profileImageUpload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha seleccionado ninguna imagen.');
  }
  res.send('Imagen de perfil subida con éxito.');
});

io.on('connection', function(socket) {
  console.log("Usuario conectado");

  socket.on('chat message 1', function(msg) {
    console.log('Mensaje del chat 1: ' + msg.message);
    io.emit('chat message 1', msg);
  });

  socket.on('chat message 2', function(msg) {
    console.log('Mensaje del chat 2: ' + msg.message);
    io.emit('chat message 2', msg);
  });

  socket.on('disconnect', function() {
    console.log('Usuario desconectado');
  });
});

http.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
