//IMPORTACIONES
import express from 'express';
import dotenv from 'dotenv';
import { conectaDB } from './config/supabase.js';
import authRoutes from './routes/Auth.js';
import userRoutes from './routes/User.js';
import heladosRoutes from "./routes/helados.js";


//CARGA DE VARIABLES DE ENTORNO
dotenv.config();
conectaDB();

//CREACION DE LA APLICACION EXPRESS
const app = express();

//LEER  EL JASON
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);
app.use("/user", userRoutes);
app.use('/helados', heladosRoutes);

//PRIMERA RUTA
app.get('/', (req, res) => { 
res.json({
    message: "¡Hola, Bienvenido al backend de MIMOS",
    estado: "En linea",
    Version: "1.0.0"
 });
});

//CONFGURACION DEL PUERTO
const PORT = 3000;

//PONER A ESCUCHAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});