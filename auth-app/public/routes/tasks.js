
const express = require("express");
const router = express.Router();

module.exports = function(db) {
  // Get all tasks for a user
  router.get("/tasks", (req, res) => {
    // In a real app, you would get the user_id from the session
    const userId = req.query.userId; // temporary approach
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "SELECT * FROM tasks WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }
      res.json(results);
    });
  });

  // Create a new task
  router.post("/tasks", (req, res) => {
    const { userId, title, description, dueDate, priority } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: "User ID and title are required" });
    }
    
    const sql = "INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userId, title, description, dueDate, priority], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create task" });
      }
      res.status(201).json({ id: result.insertId, message: "Task created successfully" });
    });
  });

  // Update a task
  router.put("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, dueDate, priority } = req.body;
    
    const sql = "UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE task_id = ?";
    db.query(sql, [title, description, dueDate, priority, taskId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update task" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json({ message: "Task updated successfully" });
    });
  });

  // Delete a task
  router.delete("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    
    const sql = "DELETE FROM tasks WHERE task_id = ?";
    db.query(sql, [taskId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete task" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json({ message: "Task deleted successfully" });
    });
  });

  // Mark a task as favorite
  router.post("/tasks/:taskId/favorite", (req, res) => {
    const taskId = req.params.taskId;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "INSERT INTO favorite_tasks (user_id, task_id) VALUES (?, ?)";
    db.query(sql, [userId, taskId], (err, result) => {
      if (err) {
        console.error(err);
        // If the user already favorited this task
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Task already marked as favorite" });
        }
        return res.status(500).json({ error: "Failed to mark task as favorite" });
      }
      res.status(201).json({ message: "Task marked as favorite" });
    });
  });

  // Remove a task from favorites
  router.delete("/tasks/:taskId/favorite", (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "DELETE FROM favorite_tasks WHERE user_id = ? AND task_id = ?";
    db.query(sql, [userId, taskId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to remove task from favorites" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Favorite task not found" });
      }
      
      res.json({ message: "Task removed from favorites" });
    });
  });

  // Get all favorite tasks for a user
  router.get("/favorites", (req, res) => {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = `
      SELECT t.*
      FROM tasks t
      JOIN favorite_tasks ft ON t.task_id = ft.task_id
      WHERE ft.user_id = ?
    `;
    
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch favorite tasks" });
      }
      res.json(results);
    });
  });

  // Mark a task as completed
  router.post("/tasks/:taskId/complete", (req, res) => {
    const taskId = req.params.taskId;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "INSERT INTO completed_tasks (user_id, task_id) VALUES (?, ?)";
    db.query(sql, [userId, taskId], (err, result) => {
      if (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Task already marked as completed" });
        }
        return res.status(500).json({ error: "Failed to mark task as completed" });
      }
      res.status(201).json({ message: "Task marked as completed" });
    });
  });

  // Remove a task from completed
  router.delete("/tasks/:taskId/complete", (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = "DELETE FROM completed_tasks WHERE user_id = ? AND task_id = ?";
    db.query(sql, [userId, taskId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to mark task as incomplete" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Completed task not found" });
      }
      
      res.json({ message: "Task marked as incomplete" });
    });
  });

  // Get all completed tasks for a user
  router.get("/completed", (req, res) => {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const sql = `
      SELECT t.*
      FROM tasks t
      JOIN completed_tasks ct ON t.task_id = ct.task_id
      WHERE ct.user_id = ?
    `;
    
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch completed tasks" });
      }
      res.json(results);
    });
  });

  return router;
};
