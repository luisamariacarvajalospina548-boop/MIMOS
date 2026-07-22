import express from 'express';
import {
    listarHelados,
    obtenerHelado,
    obtenerPorCat,
    crear,
    editar,
    eliminar
} from '../controllers/heladoController.js';

import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET Obtener todos
router.get('/', listarHelados);

// GET Obtener por ID
router.get('/:id', obtenerHelado);

// GET Obtener por categoría
router.get('/categoria/:categoria', obtenerPorCat);

// POST Crear helado
router.post('/', verificarToken, verificarAdmin, crear);
//PUT - Actualizar helado
router.put('/:id',verificarToken,verificarAdmin, editar);

//DELETE - Eliminar helado
router.delete('/:id', verificarToken,verificarAdmin, eliminar);

export default router;