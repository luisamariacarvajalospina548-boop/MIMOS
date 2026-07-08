// IMPORTAMOS EL ROUTER DE EXPRESS
import { Router } from "express";
import {getUsuarios,getUsuarioPorId,updateUsuario,deleteUsuario} from "../controllers/User.js";

// CREACION DEL ROUTER
const router = Router();

// DEFINICION DE LAS RUTAS
router.get("/", getUsuarios);

router.get("/obtener/:id", getUsuarioPorId);

router.put("/actualizar/:id", updateUsuario);

router.delete("/eliminar/:id", deleteUsuario);

export default router;