import Administrador from "../models/Administrador.js"

import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"


const registro = async (req, res) => {
  const { email, password } = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "todos los campos son obligatorios" })
  const administradorEmailBDD = await Administrador.findOne({ email })
  if (administradorEmailBDD) return res.status(400).json({ msg: "el Email ya está registrado" })
  const nuevoAdministrador = new Administrador(req.body)
  nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)
  await nuevoAdministrador.save()
  res.status(200).json({ msg: "Usuario registrado correctamente" })

  console.log("Administrador registrado:")
}



const login = async (req, res) => {
  const { email, password } = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  const administradorBDD = await Administrador.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")
  if (administradorBDD?.confirmEmail === false) return res.status(401).json({ msg: "Lo sentimos, debe verificar su cuenta, antes de iniciar sesión" })
  if (!administradorBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
  const verificarPassword = await administradorBDD.matchPassword(password)
  if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos, la contraseña es incorrecta" })
  const { nombre, apellido, direccion, telefono, _id, rol } = administradorBDD
  const token = crearTokenJWT(administradorBDD._id, administradorBDD.rol)

  res.status(200).json({ token, rol, nombre, apellido, direccion, telefono, _id })
}


const perfil =(req,res)=>{
    const {token,createdAt,updatedAt,__v,...datosPerfil} = req.administradorBDD
    res.status(200).json(datosPerfil)
}

export {
  registro,
  login,  
  perfil
}