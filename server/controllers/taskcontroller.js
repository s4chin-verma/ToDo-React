const Task = require("../models/taskmodels.js");

module.exports.createTask = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

        const task = await Task.create({ text, user: userId });
        return res.status(201).json({ status: true, task });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ error: 'Error creating task' });
    }
};


module.exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const deletedTask = await Task.deleteOne({ _id: taskId, user: userId });
        if (deletedTask.deletedCount > 0) {
            return res.status(204).json();
        } else {
            return res.status(500).json({ error: 'Error deleting task' });
        }

    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: 'Error deleting task' });
    }
};

module.exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ user: userId });
        return res.status(200).json({ status: true, tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ error: "Error fetching tasks" });
    }
};

module.exports.updateTaskCompletion = async (req, res) => {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
  
      const task = await Task.findOne({ _id: taskId, user: userId });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Toggle the isChecked property
      task.isChecked = !task.isChecked;
      await task.save();
  
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
  

