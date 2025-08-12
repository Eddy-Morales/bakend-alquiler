import { Router } from 'express'
import passport from "passport";
import {
  actualizarPassword,
  actualizarPerfil,
  comprobarTokenPasword,
  confirmarMail,
  crearNuevoPassword,
  login,
  perfil,
  recuperarPassword,
  registro,
  listarArrendatarios
} from '../controllers/arrendatario_controller.js'

import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/registro', registro) // http://localhost:3000/api/registro
router.get('/confirmar/:token', confirmarMail)
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPasword)
router.post('/nuevopassword/:token', crearNuevoPassword)
router.post('/login', login)
router.get('/perfil',verificarTokenJWT,perfil)
router.put('/arrendatario/:id',verificarTokenJWT,actualizarPerfil)
router.put('/arrendatario/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)
router.get("/arrendatarios",verificarTokenJWT,listarArrendatarios)


router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { token, usuario } = req.user;
    const { nombre, apellido, direccion, celular, _id, rol } = usuario;
    res.status(200).json({ token, nombre, apellido, direccion, celular, _id, rol });
  }
);

export default router
