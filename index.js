const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000

app.all("/", (req, res) => {
    res.send("Esta es mi primer petición")
})

app.get("/leerProductos", (req, res) => {
    let productos = [
        {
            ID: "1A",
            Imagen: "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SX466_.jpg",
            Descripción: "Camara de alta resolución marca Logitec",
            Precio: "600",
            Existencias: "26",
        }, {
            ID: "2A",
            Imagen: "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SX466_.jpg",
            Descripción: "Video conferencia",
            Precio: "120",
            Existencias: "14",
        }, {
            ID: "3A",
            Imagen: "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SX466_.jpg",
            Descripción: "Tecnologia de video",
            Precio: "420",
            Existencias: "8",
        },
    ]

    res.status(200).json(
        {
            status: "Ok",
            productos
        }
    )
})

app.post("/crearUsuario", (req, res) => {

    console.log("PETICIÓN PARA CREAR USUARIO")
    console.log(req.body)

    if (!req.body.hasOwnProperty("NOMBRE") || !req.body.hasOwnProperty("CELULAR") || !req.body.hasOwnProperty("CONTRASEÑA")) {
        res.status(400).json({
            status: "Verifique que los campos de entrada no esten vacios",
        })
    }

    res.status(200).json(
        {
            status: "Ok",

        }
    )
})

app.listen(PORT, () => {
    console.log(`servidor listo para usarse en el puerto ${PORT}`)
})