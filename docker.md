# Task: Dockerize Vacation Tracker using my Northwind project as the template

## Context
- You are running in the root of my Vacation Tracker project: React + TypeScript frontend, Node + Express + TypeScript backend, MongoDB via Mongoose, JWT auth with user/admin roles, vacation image upload, an AI recommendation page (OpenAI key), and an MCP page.
- My reference project is at: "C:\Users\tomer\OneDrive\Desktop\01 - Northwind". It is already Dockerized. It is READ-ONLY for you. Never edit, build, or run anything inside it.
- I'm on Windows with Docker Desktop. Paths are inside OneDrive and contain spaces, so quote every path.
- Goal: Dockerize Vacation Tracker with the SAME structure, conventions and style as Northwind, so I can read it and explain it in my course project defense.

## Ground rules
1. Northwind is the source of truth for structure. Mirror where Dockerfiles live and how they're named, how the compose file is organized, service naming, how env vars are passed, how the frontend is built and served, multi-stage builds, etc. If you would do something differently from Northwind, don't. Follow Northwind and put your suggestion in the final report instead.
2. Where Vacation Tracker genuinely differs from Northwind (for example, Northwind may use MySQL while I use MongoDB, and I have image uploads), adapt minimally, in Northwind's style, and tell me what you adapted and why.
3. STOP AND ASK whenever you would otherwise guess. In particular, stop and ask me before you:
   - choose any port, DB name, or service/container name that Northwind doesn't already settle
   - need any secret or env value (JWT secret, OpenAI key, Mongo credentials, etc.). Never invent real secrets, never hardcode them in Dockerfiles or compose, never print them in output.
   - change ANY application source code (e.g. making a hardcoded `localhost` connection string read from env). Show me the exact diff first and wait.
   - call the AI recommendation endpoint (it spends API credit that isn't mine)
   - run anything destructive: `docker compose down -v`, `docker volume rm`, `docker system prune`, deleting files, or touching images/containers/volumes that don't belong to this project
   - commit to git (never push)
   When you stop, ask clear numbered questions and wait for my answers. Do not continue on assumptions.
4. Run `git status` first. If there are uncommitted changes, stop and ask. Otherwise create a new branch called `docker` and work there.
5. My code style: in TypeScript use `type`, never `interface`. Keep any code change small and inside my existing structure. No refactoring.

## Phase 1: Study (read-only, change nothing)
1. Read Northwind fully: every Dockerfile, docker-compose file, .dockerignore, .env / .env.example, nginx config, DB init/seed scripts, and any package.json scripts that Docker uses. Skip node_modules and build output.
2. Read Vacation Tracker and find:
   - folder structure and package.json scripts (build/start) for front and back
   - how the backend reads config: Mongo connection string, port, JWT secret, OpenAI key
   - where uploaded vacation images are saved on disk and how they're served
   - how the frontend gets the API base URL (and whether it's a Vite `VITE_` variable baked in at build time)
   - CORS config
   - how the MCP page works (is it a separate server/process that needs its own container?)
3. Look for a course spec / requirements file in the repo that mentions Docker requirements.
4. Run `docker --version` and `docker compose version`, and confirm Docker Desktop is running.

## Checkpoint 1: STOP and report
Give me:
- A short breakdown of Northwind's Docker setup: files, services, volumes, networks, how each part is built and served.
- A mapping of each Northwind piece to Vacation Tracker, and where they differ.
- Your full plan: files you'll create, files you'll change (with the reason), services, ports, volumes, env vars.
- Your numbered questions.
Then WAIT for my approval before Phase 2.

## Phase 2: Build
- Create the Dockerfiles, compose file, .dockerignore files (exclude node_modules, .env, build output, uploads, .git), and a `.env.example` listing every variable with placeholder values. Make sure the real `.env` is gitignored.
- Volumes. Use named volumes, not bind mounts into OneDrive folders. If Northwind does this differently, ask me.
  - MongoDB data (`/data/db`) so the DB survives container removal and rebuilds
  - the uploaded vacation images folder, so images survive rebuilds
  - anything else that holds state
- Networking: inside compose, the backend reaches Mongo by its service name, not `localhost`. The frontend runs in the user's browser, so its API URL must be the host-exposed address (e.g. `http://localhost:<backend-port>`), not a service name.
- Startup order: the backend must not start before Mongo is ready. Follow Northwind's approach. If Northwind has none, propose one at Checkpoint 1.
- Seed data: if the DB needs initial data (like Northwind might do), ask me where my data comes from (dump, JSON export, seed script) before building any of it.

## Phase 3: Test it yourself
Do not hand me something untested. Run and verify all of this, and fix what fails (fixes to app code still need my approval):
1. `docker compose build` finishes with no errors.
2. `docker compose up -d`, then `docker compose ps`: all containers running (healthy, if healthchecks exist).
3. `docker compose logs` per service: no crash loops, backend connected to Mongo.
4. Backend auth: curl a public endpoint and get the expected response. Register/login a test user, get a JWT, call a protected route (e.g. get vacations) with it and get 200. Call it without a token and get 401.
5. Image upload: with an admin token, upload a test image via the API (curl multipart), then fetch it by its URL and get 200. Ask me for admin credentials or how admins are created.
6. Frontend: curl the frontend root and get 200 + HTML. Confirm the built JS points to the correct API URL.
7. Persistence: `docker compose down` (WITHOUT `-v`), then `docker compose up -d` again. Confirm the test user, the data, and the uploaded image are all still there.
8. `docker volume ls` shows the named volumes.
9. Remove only the test data you created. Ask if unsure.
If something fails, show me the error, what you think caused it, and your fix. If the same issue fails 3 times, stop and ask me.

## Final report
1. Every file created or changed, one line each on what it does.
2. Where you followed Northwind and where you adapted, and why.
3. Test results as a checklist: each test above, pass/fail, with evidence (status code or log line).
4. Commands for me (PowerShell), each with a one-line explanation:
   - first-time setup (creating .env from .env.example)
   - build and start everything
   - check status, view logs (all services / one service)
   - stop everything while keeping data
   - rebuild and restart a single service after a code change
   - list volumes and inspect them
   - open a Mongo shell inside the container
   - full reset including data, with a clear ⚠️ warning that it deletes the DB and uploaded images
   - the URLs to open the frontend and the backend
5. A short explanation of why each service and each volume exists, written so I can explain it in my project defense.
6. Anything you'd do differently from Northwind, as suggestions only. Do not apply them.