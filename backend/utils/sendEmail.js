import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'email',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const enviarConfirmacionPedido = async (email, nombreUsuario,
    pedidoId, total) =>{
        const mailOptions ={
            from: process.env.EMAIL_USER,
            to: email,
            subject:`✅Pedido Confirmado - Heladeria MIMOS'S #${pedidoId}`,
            html: `

            <h1 style="color: #28a745; font-size: 32px; font-weight: bold; font-family: sans-serif;">
            !Gracias por tu pedido!
            </h1>

            Hola ${nombreUsuario},

            Tu pedido ha sido confirmado exitosamente.

            Numero de peidido: #${pedidoId}

            Total: $${total.toLocaleString('es-CO')}

            Pronto nos comunicaremos contigo con los detalles de entrega.


            Saludos,
            Equipo Heladeria MIMOS'S🍧🍦
            
            `
        };
        try {
            await transpoorter.sendMail(mailOptions);
            return {succes: true, message: 'Correo enviado'};
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return {succes: false, message: error.message};
        }
    };