const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchProjects(category) {
  const url = category ? `${API_URL}/api/projects?category=${encodeURIComponent(category)}` : `${API_URL}/api/projects`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load projects.');
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${API_URL}/api/projects/${id}`);
  if (!res.ok) throw new Error('Could not load project.');
  return res.json();
}

export async function submitJobRequest(payload) {
  const res = await fetch(`${API_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Could not submit request.');
  }
  return res.json();
}

export async function createProject(formData) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Could not create project.');
  }
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Could not delete project.');
  return res.json();
}

export async function fetchRequests(status) {
  const url = status ? `${API_URL}/api/requests?status=${status}` : `${API_URL}/api/requests`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load requests.');
  return res.json();
}

export async function updateRequestStatus(id, status) {
  const res = await fetch(`${API_URL}/api/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Could not update request.');
  return res.json();
}

export async function fetchReviews() {
  const res = await fetch(`${API_URL}/api/reviews`);
  if (!res.ok) throw new Error('Could not load reviews.');
  return res.json();
}

export async function fetchAllReviews(status) {
  const url = status ? `${API_URL}/api/reviews?status=${status}` : `${API_URL}/api/reviews?status=pending`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load reviews.');
  return res.json();
}

export async function submitReview(payload) {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Could not submit review.');
  }
  return res.json();
}

export async function updateReviewStatus(id, status) {
  const res = await fetch(`${API_URL}/api/reviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Could not update review.');
  return res.json();
}

export async function deleteReview(id) {
  const res = await fetch(`${API_URL}/api/reviews/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Could not delete review.');
  return res.json();
}

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}
