import {Router} from 'express'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { registrarDepartamento,listarDepartamento,eliminarDepa} from '../controllers/depa_controller.js'

const router = Router()

router.post('/departamento/registro', verificarTokenJWT, registrarDepartamento) // http://localhost:3000/api/departamento/registro
router.get('/departamentos', verificarTokenJWT, listarDepartamento) 
router.delete('/tratamiento/:id',verificarTokenJWT,eliminarDepa)


export default router