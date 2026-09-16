import { Router } from 'express';
import pool from '../db/pool.js';
import upload from '../middleware/upload.js';
import { storeImage } from '../images.js';

const router = Router();

// GET /api/projects - list all projects, optionally filtered by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM projects';
    const params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load projects.' });
  }
});

// GET /api/projects/:id - single project detail
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load project.' });
  }
});

// POST /api/projects - add a new project (with optional image uploads)
// Accepts multipart/form-data with fields: title, location, description, category, completed_on
// and file fields: cover_image, before_image, after_image
router.post(
  '/',
  upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'before_image', maxCount: 1 },
    { name: 'after_image', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, location, description, category, completed_on } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Project title is required.' });
      }

      const files = req.files || {};
      const coverUrl = files.cover_image ? await storeImage(files.cover_image[0]) : null;
      const beforeUrl = files.before_image ? await storeImage(files.before_image[0]) : null;
      const afterUrl = files.after_image ? await storeImage(files.after_image[0]) : null;

      const result = await pool.query(
        `INSERT INTO projects (title, location, description, category, before_image_url, after_image_url, cover_image_url, completed_on)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, location, description, category, beforeUrl, afterUrl, coverUrl, completed_on || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not create project.' });
    }
  }
);

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete project.' });
  }
});

export default router;
