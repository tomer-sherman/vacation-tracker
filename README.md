# Vacation Tracker

> A CRUD application with extra AI sparkle on top.

**GitHub:** https://github.com/tomer-sherman/vacation-tracker.git

Hello world! This application is named **Vacation Tracker**.

I built it as my final project at John Bryce. I poured my heart into it, with a bunch of testing and edge cases that I solved. Hope you like it.

---

## What Is It

A full-stack application: database, frontend and backend.

A vacation tracker site. As a user you can:

- Browse vacations
- Like and unlike vacations
- Get AI recommendations about a specific location in the world
- Ask general questions about the site's vacations through a single-request, MCP-connected route

All of this is protected by a user funnel. You have to be a registered user to access any of it.

As an admin you can add, update and delete vacations, and get like analytics.

---

## Tech Stack

- **Frontend:** React, TypeScript, Redux, Recharts
- **Backend:** Node.js, TypeScript, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, SHA-512 password hashing
- **AI:** OpenAI + my own MCP server

---

## Getting Started

### Run Locally (without Docker)

1. Connect to MongoDB with **MongoDB Compass** beforehand.
2. Import both collections from the `database` folder into a `vacation-tracker` database.
3. Create a `.env` file in the backend (see [Environment Variables](#environment-variables)).
4. For the AI features, make sure ngrok is running (see [AI Features & ngrok](#ai-features--ngrok)).
5. Start the frontend, then the backend. In each folder, run:

```bash
npm install
npm start
```

Running `npm start` in the frontend opens the app automatically.

### Run with Docker

<!-- TODO: Docker setup -->

### Database

Users and vacations are seeded into the database using a seed script. Both collections are exported in the `database` folder.

### Test Accounts

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | tomersherman@gmail.com | 123Abc   |
| User  | user1@gmail.com        | 123Abc   |

All seeded users use the password `123Abc`.

### AI Features & ngrok

OpenAI has to reach my MCP server from the outside, so the server is exposed with ngrok. The ngrok URL lives in the env and is sent with the request to OpenAI. The AI features only work while ngrok is running. With a real domain, the server's address would simply go there instead.

```bash
ngrok http 4000
```

---

## Environment Variables

Create a `.env` file in the backend:

```dotenv
ENVIRONMENT = "development"
MONGO_CONNECTION_STRING = "mongodb://localhost:27017/vacation-tracker"

JWT_SECRET = "your-jwt-secret"
HASH_SALT = "your-hash-salt"

OPENAI_API_KEY = "your-openai-api-key"

# Public address of the MCP server that OpenAI calls
NGROK_URL = "https://your-ngrok-url.ngrok-free.dev"
```

---

## Authentication & Authorization

Register and login both return a JWT. The token is generated and signed in the backend using the JWT library and a JWT secret, which lives only in the backend. The token is verified and decoded on every protected request.

- The token is stored in local storage and is your ticket to the site's features for **one hour**.
- Every time you browse the site or use a feature, an interceptor sends the token and the backend middleware verifies it. If you're not logged in, you get notified.
- On logout, the token is removed from local storage. Logging back in gives you a new token.

The token unlocks the vacations page, the Ask MCP page and the recommendation page.

### Passwords

Passwords are hashed with SHA-512 combined with a secret salt. Only the hashed password is stored in the database.

### Frontend vs. Backend Protection

The menu and routes are protected in the frontend by this system. Only admins can see admin features and pages.

On its own, this could be exploited: a hacker could restructure his token so the frontend considers him an admin and shows what an admin is capable of. But if he tries to actually use those features, the backend blocks him with the `verifyAdmin` middleware. The JWT secret lives only in the backend, so a tampered token's signature no longer matches and the backend refuses it.

---

## API Routes

A Postman collection for testing the routes is in the backend, in the `POSTMAN` folder.

### Auth Routes (public)

- `POST /api/register`: register and receive a JWT.
- `POST /api/login`: log in and receive a JWT.

### User Routes (protected by `verifyLogin`)

- `GET /api/vacations`: brings the user all the vacations, not how they're stored but shaped with a Mongo aggregation, so the endpoint returns what the application actually needs.
- `GET /api/vacations/:_id`: brings a single vacation by its ID.
- `POST /api/vacations/like/:_id`: uses Mongoose `findByIdAndUpdate` with `$addToSet` to add the user's `_id` into the vacation's array of user IDs. `$addToSet` keeps every item unique, so if a like request somehow comes twice, the response says all is good but the data still contains the user only once.
- `POST /api/vacations/unlike/:_id`: same query with `$pull`, removing the user's ID from that vacation's array of users who liked it.
- `POST /api/mcp/ask`: uses the MCP service to send OpenAI a structured MCP request and responds with a simple string. Since it's plain questioning, I didn't want to overcomplicate it.
- `POST /api/ai/recommendation`: uses the same MCP request service function, but with different instructions (a different system prompt), to receive structured JSON that the frontend can design however we like.

### Admin Routes (protected by `verifyAdmin`)

All user routes are open to admins as well.

- `POST /api/vacations`: the admin fills a form and adds a picture.
- `PUT /api/vacations/:_id`: update any vacation with a new vacation form.
- `DELETE /api/vacations/:_id`: remove a vacation by its ID.

Like and unlike are theoretically open to admins too, but only if the admin knows how to use Postman. I decided not to make the like feature fully admin-protected, since I thought it was overkill.

### Like Analytics (Admin)

The like analytics page doesn't have its own route. All the data it needs is already open to users through `GET /api/vacations`, so I didn't want to create a special route for it.

The page uses Redux combined with the vacations service to fetch the vacations, extracts just the destination names and like counts into an array of `{ destination, likeCount }` objects, and then uses Recharts to build the graph for the admin.

### Image Routes (public)

- `GET /api/images/:imageId`: displays an image using the `imageId` in the params.

---

## AI & MCP

Both AI routes (ask-mcp and recommendation) use the same MCP service but send different instructions. I use the MCP for both, not just the plain Ask MCP page, because I wanted the AI to have contextual data about the site's current vacations when it brings the answer back.

### Request Flow

1. The request travels from the frontend to my backend.
2. My backend sends the MCP request to OpenAI.
3. OpenAI converses with my MCP server, which is exposed through ngrok.
4. OpenAI responds with structured output.

### MCP Security

Both AI routes are protected by `verifyLogin`, and so is the MCP server itself. The MCP request service attaches the user's JWT in its own header, so when the request travels back to my MCP server, it gets verified the same way.

That way, only users within my site can use the MCP connection, and outside people can't use my MCP server for any kind of structured questioning.

### The MCP Tool

The MCP has one tool: **get all vacations**. I didn't find a reason to add another tool that would add value.

This tool gives the user the ability to ask specific questions about the vacations data, and gives the recommendation route the same data so it can respond accordingly.

---

## Image & File Handling

My backend stores the images itself using Node's file system, saved with UUID names. The database only stores the `imageId`.

- **Displaying:** an `imageHandling` util + a `getImageById` service. Send it the image ID from the params, get back the path string for the image directory, and Express sends the file back using that path.
- **Add / update / delete:** the same util + a `getImagePath` service, which checks whether a given vacation has an image.

This took me a bit of time to make work properly.

---

## Validation & Error Handling

Validation lives in 3 separate areas:

1. **Frontend:** for a good user experience.
2. **Backend services (add / update):** I validate the actual document using a `document.validate` util combined with the Mongoose model.
3. **ID validation:** I prevent possible cast errors by validating ID types in every route that takes an ID, get routes included. These checks stop a 500 from being thrown for no reason.

**Errors:** I throw a `ClientError` when receiving unprocessable or invalid input, and a catch-all middleware handles them.

---

## Scaling

Theoretically, if I wanted to make this scalable, I wouldn't bring the AI the full collection JSON. Instead I would give it:

- **Filtered data:** a super-cut overview of the vacations, not every document.
- **Tools to get specific vacations** only when needed.