import Arrendatario from "../models/Arrendatario.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js"

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
  res.status(200).json({ rol, nombre, apellido, direccion, telefono, _id })
}

export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPasword,
  crearNuevoPassword,
  login
}