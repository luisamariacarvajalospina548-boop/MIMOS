import {crearCodigoRecuperacion, marcarComoUsado, obtenerCodigoValido} from '../models/recuperar.js';
import {actualizarUsuario, obtenerUsuarioPorEmail} from '../models/user.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

//CONFIGURAMOS EL TRANSPORTE DE NODMAILER
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//CONFIGURAR LA LOGICA PARA ENVIAR EL CODIGO DE RECUPERACION
export const enviarCodigoRecuperacion=async(req,res)=>{
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({error: 'El correo electronico es requerido'});
        }
    //VERIFICAR SI EL USUARIO EXISTE
        const {data: usuario, error: errorUsuario} = await obtenerUsuarioPorEmail(email);
        if (errorUsuario || !usuario) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
    //GENERARAMOS CODIGO DE RECUPERACION
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Codigo de 6 digitos
    //GUARDAR EL CODIGO EN LA BASE DE DATOS
    const {error:errorCodigo}=await crearCodigoRecuperacion(usuario.id,codigo);
    if (errorCodigo){
        return res.status(500).json({error: 'Error al generar el codigo de recuperacion'});
    }
    //CREAMOS EL EMAIL DEL CODIGO
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Codigo de Recuperacion: ${codigo}`,
        html:`
        <h2>Recuperacion de Contraseña</h2>
        <p>Hola ${usuario.nombre},</p>
        <p>Tu codigo de recuperacion es:</p>
        <h1 style="color: #39A900; font-size: 36px;">${codigo}</h1>
        <p>Este codigo es valido por 15 minutos. Si no solicitaste este código, ignora este correo.<p>
        <p>Gracias,<p>
        <p>El equipo de soporte.<p>
        <p>No compartas este codigo con nadie.<p>
        `
    });
    return res.status(200).json({message: 'Codigo de recuperacion enviado exitosamente al correo.'});
    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({error: 'Error al enviar el codigo de recuperacion'});
    }
};

//CAMBIAR LA CONTRASEÑA Y VERIFICAR EL CODIGO
export const verifycode= async (req,res)=>{
    try {
        const {email,codigo,newPassword}=req.body;
    //VERIFICAMOS LAS ENTRADAS
    if(!email||!codigo||!newPassword){
        return res.status(400).json({error:'Todos los campos son requeridos'});
        }
    //VERIFICAR SI EL USUARIO ESTA EN LA BASE DE DATOS
    const{data:usuario}=await obtenerUsuarioPorEmail(email);
    if (!usuario){
        return res.status(404).json({error:'Usuario no encontrado'});
    }
    //VERIFICAMOS EL CODIGO DE RECUPERACION
    const{data: codigoRecord}=await obtenerCodigoValido(usuario.id,codigo);
    if(!codigoRecord){
        return res.status(400).json({error:'Codigo de recuperacion invalido o expirado'});
    }
    //ENCRIPTAMOS LA NUEVA CONTRASEÑA
    const hashedPassword=await bcrypt.hash(newPassword,10);
    //ACTUALIZAMOS LA CONTRASEÑA DEL USUARIO EN LA BASE DE DATOS
    const {error:updateError}=await actualizarUsuario (usuario.id,{password:hashedPassword})
    if(updateError) throw updateError;
    //MARCAMOS EL CODIGO COMO USADO
    await marcarComoUsado(codigoRecord.id);

    //RESPODEMOS AL CLIENTE QUE LA CONTRASEÑA SE CAMBIO EXITOSAMENTE
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to: email,
        subject: 'Contraseña cambiada exitosamente',
        html:`
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; padding:20px; border-radius: 5px;">
        <h2 style="color: #333;">Notificacion de cambio de contraseña</h2>
        <p>Hola ${usuario.nombre||'Usuario'},</p>
        <p> Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #39a900; margin-top:20px;">
        <p style="margin: 0; font-size: 14px ;color #555;">
        Si no realizaste este cambio, te recomendamos que contactes a nuestro equipo de soporte inmediatamente.</p>
        </div>
        <p style=color: #555; font-size: 14px; margin-top: 30px ">Gracias,</p>
        </div>`
    });
    return res.status(200).json({message:'Contraseña cambiada exitosamente'});
    } catch (error) {
        console.error('Error en verifyCode:',error);
        return res.status(500).json({error: 'Error al verificar el codigo o cambiar la contraseña'});
    }
}