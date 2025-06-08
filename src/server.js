// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerVeterinarios from './routers/veterinario_routes.js';

dotenv.config();


// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.PORT || 3000)  //const port=3000
app.use(cors({
    origin: "*", // Permite acceso desde cualquier dominio
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})
// Rutas para veterinarios
app.use('/api',routerVeterinarios)  //http://localhost:3000/api

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default  app