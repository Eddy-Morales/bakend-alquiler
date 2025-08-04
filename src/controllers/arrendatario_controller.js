import Arrendatario from "../models/Arrendatario.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js"

import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

const registro = async (req, res) => {
  const { email, password } = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "todos los campos son obligatorios" })
  const arrendatarioEmailBDD = await Arrendatario.findOne({ email })
  if (arrendatarioEmailBDD) return res.status(400).json({ msg: "el Email ya está registrado" })
  const nuevoArrendatario = new Arrendatario(req.body)
  nuevoArrendatario.password = await nuevoArrendatario.encrypPassword(password)
  const token = nuevoArrendatario.crearToken()
  await sendMailToRegister(email, token)
  await nuevoArrendatario.save()
  res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })
}

const confirmarMail = async (req, res) => {
  if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  const arrendatarioBDD = await Arrendatario.findOne({ token: req.params.token })
  if (!arrendatarioBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })
  arrendatarioBDD.token = null
  arrendatarioBDD.confirmEmail = true
  await arrendatarioBDD.save()
  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const recuperarPassword = async (req, res) => {
  const { email } = req.body
  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  const arrendatarioBDD = await Arrendatario.findOne({ email })
  if (!arrendatarioBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
  const token = arrendatarioBDD.crearToken()
  arrendatarioBDD.token = token
  sendMailToRecoveryPassword(email, token)
  await arrendatarioBDD.save()
  res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu contraseña" })
}

const comprobarTokenPasword = async (req, res) => {
  const { token } = req.params
  const arrendatarioBDD = await Arrendatario.findOne({ token })
  if (arrendatarioBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  await arrendatarioBDD.save()
  res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}

const crearNuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body
  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" })
  const arrendatarioBDD = await Arrendatario.findOne({ token: req.params.token })
  if (arrendatarioBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  arrendatarioBDD.token = null
  arrendatarioBDD.password = await arrendatarioBDD.encrypPassword(password)
  await arrendatarioBDD.save()
  res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  const arrendatarioBDD = await Arrendatario.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")
  if (arrendatarioBDD?.confirmEmail === false) return res.status(401).json({ msg: "Lo sentimos, debe verificar su cuenta, antes de iniciar sesión" })
  if (!arrendatarioBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
  const verificarPassword = await arrendatarioBDD.matchPassword(password)
  if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos, la contraseña es incorrecta" })
  const { nombre, apellido, direccion, telefono, _id, rol } = arrendatarioBDD
  const token = crearTokenJWT(arrendatarioBDD._id,arrendatarioBDD.rol)

  res.status(200).json({ token, rol, nombre, apellido, direccion, telefono, _id })
}

const perfil =(req,res)=>{
		const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.arrendatarioBDD
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    const {nombre,apellido,direccion,celular,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const arrendatarioBDD = await Arrendatario.findById(id)
    if(!arrendatarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el arrendatario ${id}`})
    if (arrendatarioBDD.email != email)
    {
        const arrendatarioBDDMail = await Arrendatario.findOne({email})
        if (arrendatarioBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el email existe ya se encuentra registrado`})  
        }
    }
    arrendatarioBDD.nombre = nombre ?? arrendatarioBDD.nombre
    arrendatarioBDD.apellido = apellido ?? arrendatarioBDD.apellido
    arrendatarioBDD.direccion = direccion ?? arrendatarioBDD.direccion
    arrendatarioBDD.celular = celular ?? arrendatarioBDD.celular
    arrendatarioBDD.email = email ?? arrendatarioBDD.email
    await arrendatarioBDD.save()
    console.log(arrendatarioBDD)
    res.status(200).json(arrendatarioBDD)
}

const actualizarPassword = async (req,res)=>{
    const arrendatarioBDD = await Arrendatario.findById(req.arrendatarioBDD._id)
    if(!arrendatarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await arrendatarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    arrendatarioBDD.password = await arrendatarioBDD.encrypPassword(req.body.passwordnuevo)
    await arrendatarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}
const listarArrendatarios = async (req, res) => {
    try {
        const arrendatarios = await Arrendatario.find()
            .select("-createdAt -updatedAt -__v"); // Excluye campos internos

        res.status(200).json(arrendatarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar arrendatarios", error });
    }
};

export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPasword,
  crearNuevoPassword,
  login,
  perfil,
  actualizarPerfil,
  actualizarPassword,
  listarArrendatarios
}