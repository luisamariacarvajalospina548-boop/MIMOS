//IMPORTACIONES
import express from "express";
import { login, registro } from "../controllers/Auth.js";
import { enviarCodigoRecuperacion, verifycode } from "../controllers/recuperar.js";

const router  = express.Router();

//RUTAS DE AUTENTIFICACION
router.post("/register", registro);
router.post("/login", login);
//RUTA DE RECUPERACION DE CONTRASEÑA
router.post("/forgot-password", enviarCodigoRecuperacion);
router.post("/verify-code", verifycode);

export default router;
