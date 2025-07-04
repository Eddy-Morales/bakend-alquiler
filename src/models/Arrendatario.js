import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const arrendatarioSchema = new Schema({
  nombre: {
    type: String,
    require: true,
    trim: true
  },
  apellido: {
    type: String,
    require: true,
    trim: true
  },
  direccion: {
    type: String,
    trim: true,
    default: null
  },
  celular: {
    type: String,
    trim: true,
    default: null
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  status: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  rol: {
    type: String,
    default: "arrendatario"
  }
}, { timestamps: true })

arrendatarioSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  const passwordEncryp = await bcrypt.hash(password, salt)
  return passwordEncryp
}

arrendatarioSchema.methods.matchPassword = async function (password) {
  const response = await bcrypt.compare(password, this.password)
  return response
}

arrendatarioSchema.methods.crearToken = function () {
  const tokenGenerado = this.token = Math.random().toString(32).slice(2)
  return tokenGenerado
}

export default model('Arrendatario', arrendatarioSchema)
