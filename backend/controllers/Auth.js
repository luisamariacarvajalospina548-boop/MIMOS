import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { crearUser, obtenerUsuarioPorEmail} from "../models/user.js";

//REGISTRO
export const registro=async(req,res)=>{
  try{
    const {nombre,email,password}=req.body;
    //VALIDAR CAMPOS
    if(!nombre || !email || !password){
      return res.status(400).json({
        error:"Todos los campos son requeridos: nombre, emmil, contraseña"
      });
    }
    //VERIFICAR SI EL USUARIO YA EXISTE
    const {data: usuarioExiste}=await obtenerUsuarioPorEmail(email);
    if(usuarioExiste){
      return res.status(400).json({
        error:"El email ya existe"
      });
    }
    //ENCRIPTAR LA CONTRASEÑA
    //CODIGO PARA INCRIPTAR LA CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password,10);

    //ROL POR DEFECTO
    const rolPorDefecto = "usuario";

    //GUARDAR EN LA BASE DE DATOS
    const {data, error} = await crearUser(
      nombre,
      email,
      hashedPassword,
      rolPorDefecto
    );
    if(error){
      return res.status(500).json({
        error: "Error al crear el usuario"
      });
    }
    return res.status(201).json({
      usuario:{
        id: data[0].id,
        nombre: data[0].nombre,
        email: data[0].email,
        rol: data[0].rol
      }
    });
  }catch(error){
    console.error("Error en registro:", error);
    return res.status(500).json({
      error: error.message
    });
  }
};

//CREAR EL LOGIN

//EXPORTACIONES
export const login = async(req,res)=>{
  try {
    const {email,password} = req.body;

    //VALIDAMOS QUE LLEGUEN LOS CAMPOS
    if(!email||!password){
      return res.status(400).json({
      error: "Todos los campos son requeridos: email y contraseña"
      });
    }
    //BUSCAR EL USUARIO POR EMAIL
    const {data: usuario} = await obtenerUsuarioPorEmail(email);
    if(!usuario){
      return res.status(400).json({
        error: "El email no esta registrado"
      });
    }
      //VALIDAMOS LA CONTRASEÑA
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if(!passwordValida){
        return res.status(400).json({
          error: "Contraseña incorrecta"
        });
      }
      //GENERAMOS EL TOKEN JWT
      const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      "luisa0012@",
      { expiresIn: "1h" }
);
        return res.status(200).json({
        message: "Login exitoso",
        token: token,
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        });
  }catch (error) {
    console.error("Error en logon:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}