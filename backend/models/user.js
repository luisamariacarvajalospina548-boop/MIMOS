//importamos la conexion a la base de datos 
import {supabase} from "../config/supabase.js";
//obtener usuarios
export const userModel={
    obtenerTodos:async()=>{const {data,error}=await supabase
        .from('usuarios')
        .select('*');
        return {data,error};
}
};
//obtener usuarios
export const ObtenerUsuarios=async()=>
    {const {data,error}=await supabase
    .from('usuarios')
    .select('id,nombre,email,rol');
    return {data,error};
};
//crear un nuevo usuario
export const crearUser=async(nombre,email,password,rol)=>{
    const{data,error}=await supabase
    .from("usuarios")
    .insert({nombre,email,password,rol})
    .select("id,nombre,email,password,rol")
    return {data,error}
};

//obtener ususarios por email
export const obtenerUsuarioPorEmail = async (email)=>{
    const{data,error}=await supabase
    .from("usuarios")
    .select("*")
    .eq("email",email)
    .single();
    return{data,error};
};
//obtener usuario por id
export const obtenerUsuarioPorId = async (id)=>{
    const{ data,error }=await supabase
    .from("usuarios")
    .select("id,nombre,email,password,rol")
    .eq("id",id)
    .single();
    return{data,error};
};
//actualizar usuario
export const actualizarUsuario = async (id,campos) => {
    const { data, error } = await supabase
    .from("usuarios")
    .update(campos)
    .eq("id", id)
    .select("id,nombre,email,rol");
    return { data, error };
};
//ELIMINAR USUARIO
export const eliminarUsuario = async (id) => {
    const {data,error} = await supabase
        .from("usuarios")
        .delete()
        .eq("id",id)
        .select("id,nombre,email,password,rol");

    return {data,error};
};