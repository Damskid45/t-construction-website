# T-Construction Website

A full-stack website for T-Construction: a homepage, a project gallery with before/after
photos, a "Request a Job" form for customers, and a password-protected admin page for you to
add projects and manage incoming job requests.

## Structure

```
t-construction/
  frontend/   React + Vite site (what visitors see)
  backend/    Express + PostgreSQL API (stores projects and job requests)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — your PostgreSQL connection string (Render gives you one when you create a
  Postgres database)
- `CLIENT_ORIGIN` — your frontend's URL once deployed (e.g. `https://t-construction.vercel.app`)
- `RESEND_API_KEY`, `NOTIFY_TO_EMAIL` — optional. Get a free key at [resend.com](https://resend.com)
  and you'll get an email every time someone submits a job request or review. Skip these and the
  site still works fine — just check `/admin` instead.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — optional but
  **recommended before you deploy**. Get free ones at [cloudinary.com](https://cloudinary.com) →
  Dashboard. Without these, uploaded photos are stored on the server's local disk, which works
  fine for local development but gets wiped on Render's free tier every time you redeploy.

Create the database tables:

```bash
npm run migrate
```

Run the API locally:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
- `VITE_API_URL` — where your backend is running (`http://localhost:5000` locally, your Render
  URL once deployed)
- `VITE_ADMIN_PASSWORD` — the password for `/admin`. Change this to something only you know.

Run the site locally:

```bash
npm run dev
```

The site runs at `http://localhost:5173`.

## 3. Adding your projects

Go to `/admin` on your site, enter your admin password, and use the **Projects** tab to add
each job: title, location, category, description, and cover/before/after photos. They'll show
up immediately on the **Our Work** page.

Use the **Job requests** tab to see everyone who has filled out the "Request a Job" form, and
update their status as you follow up (New → Contacted → In progress → Done).

## 4. Deploying

**Backend (Render):**
1. Push this project to GitHub.
2. Create a new PostgreSQL database on Render — copy its connection string.
3. Create a new Web Service on Render pointing at the `backend` folder.
4. Set the environment variables (`DATABASE_URL`, `CLIENT_ORIGIN`, `PORT`) in Render's dashboard.
5. Run `npm run migrate` once (Render's Shell tab, or run it locally against the same
   `DATABASE_URL`) to create the tables.

**Frontend (Vercel):**
1. Import the `frontend` folder as a new Vercel project.
2. Set `VITE_API_URL` to your Render backend URL and `VITE_ADMIN_PASSWORD` in Vercel's
   environment variable settings.
3. Deploy.

Once both are live, update the backend's `CLIENT_ORIGIN` to match your real Vercel URL so the
API accepts requests from it.

## Notes

- The `/admin` password check happens in the browser — good enough to keep casual visitors out,
  but not bank-grade security. If this ever holds sensitive data, upgrade it to real
  server-side login.
- **Image storage:** if you set the Cloudinary variables, uploaded photos go straight to
  Cloudinary and are safe across redeploys. If you skip them, images are stored on the backend's
  local disk (`backend/uploads/gallery`), which is fine locally but isn't persistent on Render's
  free tier — set up Cloudinary before you go live.
- **Email notifications:** if you set the Resend variables, you'll get an email whenever someone
  submits a job request or a review. Without them, the site works the same — you'll just need to
  check `/admin` to see new activity instead of getting notified.
- **Project detail page:** photos open in a full-screen lightbox when clicked, and any project
  with both a before and after photo shows a draggable before/after comparison slider instead of
  two static images.
