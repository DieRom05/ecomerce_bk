const express = require("express")
const cors = require("cors")
const app = express()
const firebase = require("firebase/app")
const firestore = require("firebase/firestore")


const firebaseConfig = {
    apiKey: "AIzaSyDnt4EcxdsvI5QUn0BBv-1NgdNtalRE3Dg",
    authDomain: "final-teleco3.firebaseapp.com",
    projectId: "final-teleco3",
    storageBucket: "final-teleco3.appspot.com",
    messagingSenderId: "943832474003",
    appId: "1:943832474003:web:5d4cea28b7c4b8caf34866",
    measurementId: "G-01FVRL2Q7R"
};

const db = firestore.getFirestore(firebase.initializeApp(firebaseConfig))
const crearRegistro = async ({ coleccion = "", datos = {} }) => {
    console.warn(datos)
    const doc = await firestore.addDoc(firestore.collection(db, coleccion), datos)
    return doc
}

const leerTodosLosDatos = async ({ coleccion = "" }) => {
    const col = firestore.collection(db, coleccion)
    const peticion = await firestore.getDocs(col)
    let entidades = []
    peticion.forEach((doc) => {
        entidades.push({ id: doc.id, datos: doc.data() })
    })
    return entidades
}

const borrarDocumento = async ({ coleccion = '', campo = '', valor = '' }) => {
    let deleted = false
    const dataEntity = await findDataEntity({ coleccion, campo, valor })
    if (dataEntity.length === 1) {
        const docRef = firestore.doc(db, coleccion, dataEntity[0].id)
        await firestore.deleteDoc(docRef)
        deleted = true
    }
    return deleted
}

const buscarDato = async ({ coleccion = '', campo = '', valor = '' }) => {
    const collection = firestore.collection(db, coleccion)
    const query = firestore.query(collection, firestore.where(campo, '==', valor))
    const querySnapshot = await firestore.getDocs(query)
    let result = []
    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, data: doc.data() })
    });
    return result
}

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000

app.all("/", (req, res) => {
    res.send("Esta es mi primer petición")
})

app.get("/leerProductos", async (req, res) => {
    console.log("PETICION LEER PRODUCTOS")
    try {
        const productos = await leerTodosLosDatos({ coleccion: "productos" })
        res.status(200).json(
            {
                status: "Ok",
                productos: productos.map(function (dato) {
                    return {
                        "Id": dato.id,
                        "Imagen": dato.datos.Imagen,
                        "Descripcion": dato.datos.Descripcion,
                        "Existencias": dato.datos.Existencias,
                        "Precio": dato.datos.Precio,
                    }


                })
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                status: "Fallo en base de datos",
                descripcion: error
            }
        )
    }

})

app.post("/crearProducto", async (req, res) => {
    console.log("PETICION CREAR PRODUCTO")
    console.log(req.body)
    try {
        if (!req.body.hasOwnProperty("Imagen") || !req.body.hasOwnProperty("Descripcion") || !req.body.hasOwnProperty("Precio") || !req.body.hasOwnProperty("Existencias")) {
            res.status(400).json({
                status: "Verifique que los campos de entrada no esten vacios",
            })
        }
        const crearProducto = crearRegistro({ coleccion: "productos", datos: req.body })
        res.status(200).json(
            {
                status: "Ok",
                producto: req.body
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                status: "Fallo en base de datos",
                descripcion: String(error)
            }
        )
    }

}
)

app.post("/crearUsuario", async (req, res) => {
    console.log("PETICION CREAR USUARIO")
    console.log(req.body)
    try {

        if (!req.body.hasOwnProperty("NOMBRE") || !req.body.hasOwnProperty("CELULAR") || !req.body.hasOwnProperty("CONTRASEÑA")) {
            res.status(400).json({
                status: "Verifique que los campos de entrada no esten vacios",
            })
        }
        const crearUsuario = crearRegistro({ coleccion: "usuarios", datos: req.body })
        res.status(200).json(
            {
                status: "Ok",

            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                status: "Fallo en base de datos",
                descripcion: error
            }
        )
    }

}
)
app.get("/IniciarSesion", async (req, res) => {
    console.log("PETICION PARA INICIAR SESION")
    console.log(req.query)
    try {
        if (!req.query.hasOwnProperty("CELULAR") || !req.query.hasOwnProperty("CONTRASEÑA")) {
            res.status(400).json({
                status: "Verifique los datos ingresados, falta el celular o la contraseña"
            })
        } else {
            const usuario = await buscarDato({ coleccion: "usuarios", campo: "CELULAR", valor: req.query.CELULAR })
            if (usuario.length !== 1) {
                res.status(401).json({
                    status: "credenciales invalidas",

                })
            } else {
                if (req.query.CONTRASEÑA !== usuario[0].data.CONTRASEÑA) {
                    res.status(401).json({
                        status: "credenciales invalidas",

                    })
                } else {
                    res.status(200).json({
                        status: "ok",
                        usuario:{NOMBRE:usuario[0].data.NOMBRE,CELULAR:req.query.CELULAR}
                    })

                }

            }

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Falla en la base de datos"
        })

    }
})


app.listen(PORT, () => {
    console.log(`servidor listo para usarse en el puerto ${PORT}`)
})