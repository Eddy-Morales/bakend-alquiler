import { Router } from 'express'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import {login,perfil, registro} from '../controllers/administrador_controller.js'

const router = Router()

router.post('/administrador/registro', registro) // http://localhost:3000/api/registro
router.post('/loginAd', login)
router.get('/perfilAd',verificarTokenJWT,perfil)

export default router