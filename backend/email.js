// Sends notification emails via Resend (https://resend.com).
// If RESEND_API_KEY isn't set, this silently skips sending — the site still
// works fine without it, you just won't get emails (check /admin instead).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_FROM = process.env.NOTIFY_FROM_EMAIL || 'T-Construction <onboarding@resend.dev>';
const NOTIFY_TO = process.env.NOTIFY_TO_EMAIL;

export async function sendNotificationEmail({ subject, html }) {
  if (!RESEND_API_KEY || !NOTIFY_TO) {
    console.log('[email] Skipped — RESEND_API_KEY or NOTIFY_TO_EMAIL not set.');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject,
        html
      })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Failed to send:', res.status, body);
    }
  } catch (err) {
    console.error('[email] Error sending notification:', err.message);
  }
}

export function jobRequestEmail(request) {
  return {
    subject: `New job request from ${request.name}`,
    html: `
      <h2>New job request</h2>
      <p><strong>Name:</strong> ${request.name}</p>
      <p><strong>Phone:</strong> ${request.phone}</p>
      ${request.email ? `<p><strong>Email:</strong> ${request.email}</p>` : ''}
      ${request.location ? `<p><strong>Location:</strong> ${request.location}</p>` : ''}
      ${request.job_type ? `<p><strong>Job type:</strong> ${request.job_type}</p>` : ''}
      ${request.preferred_date ? `<p><strong>Preferred date:</strong> ${request.preferred_date}</p>` : ''}
      <p><strong>Details:</strong><br>${request.details}</p>
      <p style="color:#888;font-size:12px;">View and manage this in your site's /admin page.</p>
    `
  };
}

export function newReviewEmail(review) {
  return {
    subject: `New review from ${review.name} (${review.rating}/5)`,
    html: `
      <h2>New review — pending approval</h2>
      <p><strong>Name:</strong> ${review.name}</p>
      <p><strong>Rating:</strong> ${review.rating}/5</p>
      <p><strong>Comment:</strong><br>${review.comment}</p>
      <p style="color:#888;font-size:12px;">Approve or reject it in your site's /admin → Reviews tab.</p>
    `
  };
}
