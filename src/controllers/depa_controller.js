import Departamento from "../models/Departamento.js"
import mongoose from "mongoose"

import { Stripe } from "stripe"

const registrarDepartamento = async (req, res) => {
  try {
    const { arrendatario } = req.body;

    if (!mongoose.Types.ObjectId.isValid(arrendatario)) {
      return res.status(400).json({ msg: "Lo sentimos, el ID del arrendatario no es válido." });
    }

    const imagenesSubidas = [];

    // ✅ Verifica si hay imágenes adjuntas
    if (req.files?.imagenes) {
      const archivos = Array.isArray(req.files.imagenes) ? req.files.imagenes : [req.files.imagenes];

      for (const archivo of archivos) {
        const resultado = await cloudinary.uploader.upload(archivo.tempFilePath, {
          folder: "Departamentos"
        });

        imagenesSubidas.push({
          url: resultado.secure_url,
          public_id: resultado.public_id
        });

        await fs.remove(archivo.tempFilePath);
      }
    }

    const nuevoDepartamento = await Departamento.create({
      ...req.body,
      imagenes: imagenesSubidas
    });

    res.status(201).json({
      msg: "Registro exitoso de departamento",
      departamento: nuevoDepartamento
    });

  } catch (error) {
    console.error("Error al registrar departamento:", error);
    res.status(500).json({ msg: "Error al registrar el departamento", error: error.message });
  }
}

const listarDepartamento = async (req,res)=>{
    const departamentos = await Departamento.find()
    res.status(200).json(departamentos)
}

const eliminarDepa = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe ese Departamento`})
    await Departamento.findByIdAndDelete(req.params.id)
    res.status(200).json({msg:"Departamento eliminado correctamente"})
}


export {
    registrarDepartamento,
    listarDepartamento,
    eliminarDepa
  }