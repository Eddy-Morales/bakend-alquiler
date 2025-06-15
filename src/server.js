import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// Cambiar esta línea:
import routerArrendatarios from './routers/arrendatario_routes.js'

const app = express()
dotenv.config()

app.set('port', process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

// Ruta base
app.get('/', (req, res) => {
  res.send("Server on")
})

// Rutas para arrendatarios
app.use('/api', routerArrendatarios) // http://localhost:3000/api

// Ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app
