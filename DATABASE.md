# Database setup for Quizly

## Recommended: **Supabase** (PostgreSQL)

| Why Supabase | |
|--------------|---|
| Free tier | 500 MB database, good for student projects |
| SQL | Fits flashcards + quiz JSON cleanly (`jsonb` columns) |
| Dashboard | Browse and edit data in the browser |
| Auth later | Easy to add user accounts when you need them |

**Alternatives:** MongoDB Atlas (flexible JSON), Firebase Firestore (real-time), PlanetScale (MySQL) — Supabase is the simplest fit for this app.

---

## Quick start (no cloud — local file DB)

Works immediately for localhost testing:

**Windows (if `npm start` fails in PowerShell):**

```bat
start.bat
```

Or in any terminal:

```bat
npm.cmd install
npm.cmd start
```

Or skip npm scripts entirely:

```bat
node server.js
```

**Mac / Linux:**

```bash
npm install
npm start
```

Open **http://localhost:8080**. Sets are saved to `data/sets.json` on disk.

### PowerShell “running scripts is disabled”

PowerShell blocks `npm.ps1`. Use one of these:

- **`start.bat`** (double-click or run from cmd)
- **`npm.cmd start`** instead of `npm start`
- **`node server.js`** after `npm.cmd install`
- Or allow scripts for your user (one time):  
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## Connect Supabase (production)

### 1. Create a project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. **New project** → pick a name and password → wait ~2 minutes.

### 2. Create the table

1. In Supabase: **SQL Editor** → **New query**.
2. Paste the contents of `supabase/schema.sql` and click **Run**.

### 3. Add API keys to `.env`

1. Copy `.env.example` to `.env`.
2. In Supabase: **Project Settings** → **API**.
3. Copy **Project URL** → `SUPABASE_URL`
4. Copy **service_role** key (secret — never put in frontend code) → `SUPABASE_SERVICE_ROLE_KEY`

```env
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
PORT=8080
```

### 4. Restart the server

```bash
npm start
```

Visit **http://localhost:8080/api/health** — you should see:

```json
{ "ok": true, "database": "supabase" }
```

Saved quizzes now persist in PostgreSQL instead of `data/sets.json`.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server + database type |
| GET | `/api/sets` | List all study sets |
| GET | `/api/sets/:id` | One study set |
| POST | `/api/sets` | Create or update a set |
| DELETE | `/api/sets/:id` | Delete one set |
| DELETE | `/api/sets` | Clear all sets |

---

## Security notes

- The **service role** key stays in `.env` on the server only.
- Do not commit `.env` to Git (it is in `.gitignore`).
- For a public deployment, add authentication before exposing delete/clear endpoints.
