import { useEffect, useState } from 'react';
import {
  createProject,
  deleteProject,
  fetchProjects,
  fetchRequests,
  updateRequestStatus,
  fetchAllReviews,
  updateReviewStatus,
  deleteReview,
  imageUrl
} from '../api.js';
import './Admin.css';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'change-me';

const emptyProject = {
  title: '',
  location: '',
  description: '',
  category: 'Residential',
  completed_on: ''
};

export default function Admin() {
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('tc_admin') === 'yes');
  const [passwordInput, setPasswordInput] = useState('');
  const [tab, setTab] = useState('projects');

  if (!unlocked) {
    return (
      <section className="section wrap admin-gate">
        <h1>Admin access</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === ADMIN_PASSWORD) {
              sessionStorage.setItem('tc_admin', 'yes');
              setUnlocked(true);
            } else {
              alert('Wrong password.');
            }
          }}
        >
          <input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Enter</button>
        </form>
        <p className="admin-gate__note">
          Set VITE_ADMIN_PASSWORD in your frontend .env to change this password.
        </p>
      </section>
    );
  }

  return (
    <section className="section wrap admin-page">
      <div className="admin-page__head">
        <h1>Admin</h1>
        <div className="admin-page__tabs">
          <button className={tab === 'projects' ? 'is-active' : ''} onClick={() => setTab('projects')}>
            Projects
          </button>
          <button className={tab === 'requests' ? 'is-active' : ''} onClick={() => setTab('requests')}>
            Job requests
          </button>
          <button className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}>
            Reviews
          </button>
        </div>
      </div>

      {tab === 'projects' && <ProjectsPanel />}
      {tab === 'requests' && <RequestsPanel />}
      {tab === 'reviews' && <ReviewsPanel />}
    </section>
  );
}

function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState('idle');

  function load() {
    fetchProjects().then(setProjects).catch(() => {});
  }

  useEffect(load, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFile(e) {
    const { name, files: fl } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fl[0] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      Object.entries(files).forEach(([k, v]) => v && data.append(k, v));
      await createProject(data);
      setForm(emptyProject);
      setFiles({});
      setStatus('idle');
      load();
    } catch (err) {
      setStatus('error');
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    load();
  }

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>Add a project</h2>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Renovation</option>
            <option>Site Development</option>
            <option>Block Production</option>
          </select>
        </label>
        <label>
          Completed on
          <input type="date" name="completed_on" value={form.completed_on} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>
        <label>
          Cover image
          <input type="file" name="cover_image" accept="image/*" onChange={handleFile} />
        </label>
        <label>
          Before image (optional)
          <input type="file" name="before_image" accept="image/*" onChange={handleFile} />
        </label>
        <label>
          After image (optional)
          <input type="file" name="after_image" accept="image/*" onChange={handleFile} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Add project'}
        </button>
      </form>

      <div className="admin-list">
        <h2>Existing projects</h2>
        {projects.map((p) => (
          <div className="admin-list__row" key={p.id}>
            {p.cover_image_url && <img src={imageUrl(p.cover_image_url)} alt={p.title} />}
            <div className="admin-list__info">
              <strong>{p.title}</strong>
              <span>{p.category} · {p.location}</span>
            </div>
            <button className="admin-list__delete" onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsPanel() {
  const [requests, setRequests] = useState([]);

  function load() {
    fetchRequests().then(setRequests).catch(() => {});
  }

  useEffect(load, []);

  async function handleStatus(id, status) {
    await updateRequestStatus(id, status);
    load();
  }

  return (
    <div className="admin-requests">
      <h2>Job requests</h2>
      {requests.length === 0 && <p>No requests yet.</p>}
      {requests.map((r) => (
        <div className="admin-requests__row" key={r.id}>
          <div className="admin-requests__info">
            <strong>{r.name}</strong> · {r.phone} {r.email && `· ${r.email}`}
            <div className="admin-requests__meta">
              {r.job_type} {r.location && `— ${r.location}`}
            </div>
            <p>{r.details}</p>
          </div>
          <select value={r.status} onChange={(e) => handleStatus(r.id, e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      ))}
    </div>
  );
}

function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('pending');

  function load() {
    fetchAllReviews(filter).then(setReviews).catch(() => {});
  }

  useEffect(load, [filter]);

  async function handleStatus(id, status) {
    await updateReviewStatus(id, status);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this review permanently?')) return;
    await deleteReview(id);
    load();
  }

  return (
    <div className="admin-requests">
      <div className="admin-page__tabs" style={{ marginBottom: '1rem' }}>
        <button className={filter === 'pending' ? 'is-active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter === 'approved' ? 'is-active' : ''} onClick={() => setFilter('approved')}>Approved</button>
        <button className={filter === 'rejected' ? 'is-active' : ''} onClick={() => setFilter('rejected')}>Rejected</button>
      </div>

      {reviews.length === 0 && <p>No {filter} reviews.</p>}
      {reviews.map((r) => (
        <div className="admin-requests__row" key={r.id}>
          <div className="admin-requests__info">
            <strong>{r.name}</strong> · {r.rating}/5
            <p>{r.comment}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {r.status !== 'approved' && (
              <button className="btn btn-outline" onClick={() => handleStatus(r.id, 'approved')}>Approve</button>
            )}
            {r.status !== 'rejected' && (
              <button className="admin-list__delete" onClick={() => handleStatus(r.id, 'rejected')}>Reject</button>
            )}
            <button className="admin-list__delete" onClick={() => handleDelete(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
