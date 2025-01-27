const express = require('express'); 
const path = require('path'); 
const app = express(); 

app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial 

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});
