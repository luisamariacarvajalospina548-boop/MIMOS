import express from 'express';
import {
    listarHelados,
    obtenerHelado,
    obtenerPorCat,
    crear,
    editar,
    eliminar
} from '../controllers/heladoController.js';

const router = express.Router();

// GET Obtener todos
router.get('/', listarHelados);

// GET Obtener por ID
router.get('/:id', obtenerHelado);

// GET Obtener por categoría
router.get('/categoria/:categoria', obtenerPorCat);

// POST Crear helado
router.post('/', crear);

//PUT - Actualizar helado
router.put('/:id', editar);

//DELETE - Eliminar helado
router.delete('/:id', eliminar);

export default router;