const express = require('express');
const router = express.Router();
const { createTask, deleteTask, getAllTasks, updateTaskCompletion } = require('../controllers/taskcontroller');
const verifyToken = require('../middleware/verifyToken');

router.post('/tasks', verifyToken, createTask);
router.get('/tasks', verifyToken, getAllTasks);
router.delete('/tasks/:id', verifyToken, deleteTask);
router.put('/tasks/:id', verifyToken, updateTaskCompletion);

module.exports = router;
