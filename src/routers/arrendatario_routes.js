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
    const { nombre, apellido, direccion, celular, _id, rol, email } = usuario;
    
    // URL del frontend (debe configurarse en variables de entorno)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // Ajusta esto según tu configuración
    
    // Construir la URL de redirección con los datos necesarios
    const redirectUrl = `${frontendUrl}/auth/success?token=${token}&_id=${_id}&nombre=${encodeURIComponent(nombre || '')}&apellido=${encodeURIComponent(apellido || '')}&direccion=${encodeURIComponent(direccion || '')}&celular=${encodeURIComponent(celular || '')}&rol=${rol || 'arrendatario'}&email=${encodeURIComponent(email || '')}`;
    
    // Redirigir al frontend en lugar de enviar JSON
    res.redirect(redirectUrl);
  }
);

export default router
