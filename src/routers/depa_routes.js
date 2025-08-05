import {Router} from 'express'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { registrarDepartamento,listarDepartamento,eliminarDepa} from '../controllers/depa_controller.js'

const router = Router()

router.post('/departamento/registro', verificarTokenJWT, registrarDepartamento)
router.get('/departamentos', verificarTokenJWT, listarDepartamento) 
router.delete('/departamento/:id',verificarTokenJWT,eliminarDepa)


export default router