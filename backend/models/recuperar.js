import {supabase} from '../config/supabase.js';

//CREAR CODIGO DE RECUPERACION
export const crearCodigoRecuperacion=async(usuarioId, codigo)=>{
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // El código expira en 15 minutos
    const {data, error} = await supabase
        .from('recovery_codes')
        .insert({
        usuario_id: usuarioId, 
        codigo: codigo,
        expires_at: expiresAt.toISOString()
    })
        .single();
    return {data, error};
};

//OBTENER CODIGO NO UTILIZADO POR USUARIO
export const obtenerCodigoValido=async(usuarioId,codigo)=>{
    const {data, error} = await supabase
        .from('recovery_codes')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('codigo', codigo)
        .eq('usado', false)
        .gt('expires_at', new Date().toISOString())
        .single();
    return {data, error};
};

//MARCAR CODIGO COMO USADO
export const marcarComoUsado=async(codigoId)=>{
    const {data, error} = await supabase
        .from('recovery_codes')
        .update({usado: true})
        .eq('id', codigoId)
        .single();
    return {data, error};
};