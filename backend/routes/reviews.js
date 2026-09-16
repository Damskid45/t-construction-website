import { Router } from 'express';
import pool from '../db/pool.js';
import { sendNotificationEmail, newReviewEmail } from '../email.js';

const router = Router();

// GET /api/reviews - public: approved reviews only (unless ?status= is passed for admin use)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const targetStatus = status || 'approved';

    const result = await pool.query(
      'SELECT * FROM reviews WHERE status = $1 ORDER BY created_at DESC',
      [targetStatus]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load reviews.' });
  }
});

// POST /api/reviews - customer submits a review (goes in as "pending" until approved)
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment, project_id } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ error: 'Name, rating, and comment are required.' });
    }
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (name, rating, comment, project_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, numericRating, comment, project_id || null]
    );

    res.status(201).json({
      message: 'Thanks for your review — it will appear once approved.',
      review: result.rows[0]
    });

    const { subject, html } = newReviewEmail(result.rows[0]);
    sendNotificationEmail({ subject, html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit review.' });
  }
});

// PATCH /api/reviews/:id - admin: approve or reject a review
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const result = await pool.query(
      'UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update review.' });
  }
});

// DELETE /api/reviews/:id - admin: remove a review
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete review.' });
  }
});

export default router;
