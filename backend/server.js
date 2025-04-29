//ejecutador del servidor backend
const express = require('express');
const cors = require('cors');
const routesCitas = require('./routesCitas.js');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api", routesCitas);

app.listen(port, () => {
    console.log(`Servidor en puerto: ${port}`);
})