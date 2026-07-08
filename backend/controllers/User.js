import {ObtenerUsuarios,obtenerUsuarioPorId,actualizarUsuario,eliminarUsuario} from "../models/user.js";
// obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const { data, error } = await ObtenerUsuarios();
        if (error) {
            return res.status(500).json({
                error: "Error al obtener los usuarios"
            });
        }
        return res.status(200).json({
            usuarios: data
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({
            error: "Error al obtener los usuarios"
        });
    }
};
// obtener usuario por ID
export const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await obtenerUsuarioPorId(id);
        if (error || !data) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }
        return res.status(200).json({
            usuario: data
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({
            error: "Error al obtener el usuario"
        });
    }
};
//ACTUALIZAR USUARIO
export const updateUsuario = async(req,res)=>{
    try {
        const {id} = req.params;
        const {nombre,email,rol} = req.body;
        const {data,error} = await actualizarUsuario(id,{
            nombre,
            email,
            rol
        });
        if(error){
            return res.status(500).json({
                error:"Error al actualizar el usuario"
            });
        }
        return res.status(200).json({
            usuario:data
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({
            error:error.message
        });
    }
};
//ELIMINAR USUARIO
export const deleteUsuario = async(req,res)=>{
    try {
        const {id} = req.params;
        const {data,error} = await eliminarUsuario(id);
        if(error){
            return res.status(500).json({
                error:"Error al eliminar el usuario"
            });
        }
        return res.status(200).json({
            usuario:data
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({
            error:error.message
        });
    }
};