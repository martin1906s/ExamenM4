const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const app = express();
const port = 3000;

const users = [{ name: "Jorge", lastname: "Gonzalez" }];
const client = new Client({
    user: "postgres",
    host: "192.168.100.163",
    database: "prueba",
    password: "postgres",
    port: 5432
});

// Move middleware before routes
app.use(bodyParser.json());

app.post("/contactos", async (req, res) => {
    // Add check for req.body
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }
    
    const { name, lastname } = req.body;
    
    // Don't create a new Client from existing client config
    try {
        // Connect the existing client instance
        await client.connect();
        const result = await client.query(
            "INSERT INTO prueba (name, lastname) VALUES ($1, $2) RETURNING *",
            [name, lastname]
        );
        console.log(result.rows[0]);
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar contacto");
    } finally {
        await client.end();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});