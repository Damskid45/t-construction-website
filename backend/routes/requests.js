import { Router } from 'express';
import pool from '../db/pool.js';
import { sendNotificationEmail, jobRequestEmail } from '../email.js';

const router = Router();

// POST /api/requests - customer submits a job request (the "order" form)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, location, job_type, details, preferred_date } = req.body;

    if (!name || !phone || !details) {
      return res.status(400).json({ error: 'Name, phone, and job details are required.' });
    }

    const result = await pool.query(
      `INSERT INTO job_requests (name, phone, email, location, job_type, details, preferred_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, phone, email || null, location || null, job_type || null, details, preferred_date || null]
    );

    res.status(201).json({
      message: 'Request received. We will contact you shortly.',
      request: result.rows[0]
    });

    // Fire-and-forget — don't make the customer wait on the email send.
    const { subject, html } = jobRequestEmail(result.rows[0]);
    sendNotificationEmail({ subject, html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit request. Please try again.' });
  }
});

// GET /api/requests - view all incoming job requests (for T-Construction's own use)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM job_requests';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load requests.' });
  }
});

// PATCH /api/requests/:id - update status (new, contacted, in_progress, done, archived)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'in_progress', 'done', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const result = await pool.query(
      'UPDATE job_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update request.' });
  }
});

export default router;
