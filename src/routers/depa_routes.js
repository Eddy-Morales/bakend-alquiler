import {Router} from 'express'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { registrarDepartamento,listarDepartamento,eliminarDepa,verDepartamentoPorId, pagarDepartamento} from '../controllers/depa_controller.js'

const router = Router()

router.post('/departamento/registro', verificarTokenJWT, registrarDepartamento)
router.get('/departamentos', verificarTokenJWT, listarDepartamento) 
router.delete('/departamento/eliminar/:id',verificarTokenJWT,eliminarDepa)
router.post('/departamento/pago',verificarTokenJWT,pagarDepartamento)
router.get("/departamento/:id",verificarTokenJWT, verDepartamentoPorId);


export default router