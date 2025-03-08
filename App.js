const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const port = 3000;

const users = [{ name: "Jorge", lastname: "Gonzalez" }];
const client = new Pool({
    user: "postgres",
    host: "192.168.100.102",
    database: "Grupo2Tienda",
    password: "19980720",
    port: 5432,
});

// Move middleware before routes
app.use(bodyParser.json());

app.use("/clientes", (request, responce, next) => {
    console.log("Se ejecuta primero el Middelware")
    console.log("Headers", request.headers)
    console.log("Body", request.body)
    next();
})

// app.post("/contactos", async (req, res) => {
//     // Add check for req.body
//     if (!req.body) {
//         return res.status(400).send("Request body is missing");
//     }
    
//     const { name, lastname } = req.body;
    
//     // Don't create a new Client from existing client config
//     try {
//         // Connect the existing client instance
//         await client.connect();
//         const result = await client.query(
//             "INSERT INTO prueba (name, lastname) VALUES ($1, $2) RETURNING *",
//             [name, lastname]
//         );
//         console.log(result.rows[0]);
//         res.send(result.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error al insertar contacto");
//     } finally {
//         await client.end();
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/clientes', async (req, res) => {
    try {
        const clientes = await client.connect();
        const result = await clientes.query('SELECT * FROM clientes');
        res.json(result.rows);
        clientes.release();
    } catch (err) {
        console.error('Error ejecutando la consulta', err);
        res.status(500).send('Error del servidor');
    }
});

app.get('/productos', async (req, res) => {
    try {
        const clientes = await client.connect();
        const result = await clientes.query('SELECT * FROM productos');
        res.json(result.rows);
        clientes.release();
    } catch (err) {
        console.error('Error ejecutando la consulta', err);
        res.status(500).send('Error del servidor');
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const { idcliente, nombres, telefono, ciudad, correo } = req.body;

        // Validate that all required fields are present
        if (!idcliente || !nombres || !telefono || !ciudad || !correo) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        const clientes = await client.connect();
        const result = await clientes.query('INSERT INTO clientes(idCliente, nombres, telefono, ciudad, correo) VALUES ($1, $2, $3, $4, $5)', [idcliente, nombres, telefono, ciudad, correo]);
        res.json(result.rows);
        clientes.release();
    } catch (err) {
        console.error('Error ejecutando la consulta', err);
        res.status(500).send('Error del servidor');
    }
});

app.post('/productos', async (req, res) => {
    try {
        const { nombre,categoria,precioCompra,stok } = req.body;
        const clientes = await client.connect();
        const result = await clientes.query('insert into productos(nombre,categoria,precioCompra,stok) values ($1,$2,$3,$4)', [nombre,categoria,precioCompra,stok]);
        res.json(result.rows);
        clientes.release();
    } catch (err) {
        console.error('Error ejecutando la consulta', err);
        res.status(500).send('Error del servidor');
    }
});