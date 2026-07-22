import jwt from 'jsonwebtoken';

//VERIFICA QUE EXISTA EN UN TOKEN VÁLIDO( USUARIO AUTENTICADO)
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1]; //formato: "Bearer TOKEN"

    if (!token){
        return res.status(401).json({ error: 'Token no proporcionado, por favor inicie sesion'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err){
            return res.status(403).json({ error: 'Token inválido o expirado'});
        }
        req.usuario = decoded;
        next();
    });
};

//SOLO DEJA PASAR SI ELUSUARIO TIENE ROL DE ADMIN(PANEL ADMINISTRATIVO)
export const verificarAdmin = (req, res, next) => {
    if(req.usuario?.rol !=='admin'){
        return res.status(403).json({error: 'No tienes permisos de administrador'});
    }
    next();
};