//controlador de citas
const connection = require('../config/db');

const citasController = {
    // Obtener todas las citas
    getCitas: (req, res) => {
        connection.query('SELECT * FROM citas', (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al obtener las citas' });
            }
            res.json(results);
        });
    },

    //obtener una cita por ID
    getCitaById: (req, res) => {
        const { id } = req.params;
        connection.query('SELECT * FROM citas WHERE id = ?', [id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al obtener la cita' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            res.json(results[0]);
        });
    },

    // Crear una nueva cita
    createCita: (req, res) => {
        const { fecha, nombre_paciente, especialidad, medico } = req.body;
        connection.query('INSERT INTO citas (fecha, nombre_paciente, especialidad, medico) VALUES (?, ?, ?, ?)', [fecha, nombre_paciente, especialidad, medico], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al crear la cita' });
            }
            res.status(201).json({ id: results.insertId, fecha, nombre_paciente, especialidad, medico });
        });
    },

    // Editar una cita existente
    updateCita: (req, res) => {
        const { id } = req.params;
        const { fecha, nombre_paciente, especialidad, medico } = req.body;
        connection.query('UPDATE citas SET fecha = ?, nombre_paciente = ?,  especialidad = ?, medico = ? WHERE id = ?', [fecha, nombre_paciente, especialidad, medico, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al editar la cita' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            res.json({ id, fecha, nombre_paciente, especialidad, medico });
        });
    },

    // Eliminar una cita
    deleteCita: (req, res) => {
        const { id } = req.params;
        connection.query('DELETE FROM citas WHERE id = ?', [id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al eliminar la cita' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            res.status(204).send();
        });
    }
}

module.exports = citasController;