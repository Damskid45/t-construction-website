import { useEffect, useState } from 'react';
import { fetchReviews, submitReview } from '../api.js';
import './Reviews.css';

const emptyForm = { name: '', rating: 5, comment: '' };

function Stars({ value }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {'★'.repeat(value)}
      <span className="stars__empty">{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [submitStatus, setSubmitStatus] = useState('idle');

  function load() {
    setStatus('loading');
    fetchReviews()
      .then((data) => {
        setReviews(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      await submitReview({ ...form, rating: Number(form.rating) });
      setForm(emptyForm);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      alert(err.message);
    }
  }

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="section reviews-page">
      <div className="wrap">
        <div className="reviews-page__head">
          <h1>What clients say</h1>
          {average && (
            <p className="reviews-page__average">
              <Stars value={Math.round(average)} /> {average} average from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {status === 'loading' && <p>Loading reviews…</p>}
        {status === 'error' && <p>Couldn't load reviews right now.</p>}
        {status === 'ready' && reviews.length === 0 && <p>No reviews yet — be the first to leave one below.</p>}

        <div className="reviews-list">
          {reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <Stars value={r.rating} />
              <p className="review-card__comment">{r.comment}</p>
              <span className="review-card__name">{r.name}</span>
            </div>
          ))}
        </div>

        <div className="review-form-wrap">
          <h2>Leave a review</h2>
          {submitStatus === 'success' ? (
            <p className="review-form__success">
              Thanks for your feedback — it will appear here once approved.
            </p>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <label>
                Your name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Rating
                <select name="rating" value={form.rating} onChange={handleChange}>
                  <option value={5}>5 — Excellent</option>
                  <option value={4}>4 — Good</option>
                  <option value={3}>3 — Okay</option>
                  <option value={2}>2 — Poor</option>
                  <option value={1}>1 — Very poor</option>
                </select>
              </label>
              <label>
                Your review
                <textarea name="comment" value={form.comment} onChange={handleChange} rows={4} required />
              </label>
              <button type="submit" className="btn btn-primary" disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? 'Sending…' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
