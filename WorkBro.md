# Vacations Project: Work Plan
*Planning session, Oct 4, 2026*

## Where things stand
- Backend is about 90% done. The remaining 10% is debugging as you go.
- **Focus now: the frontend.**
- Already working: JWT auth, the axios interceptor that sends the JWT, and likes saving on the backend (F5 shows them correctly).

## Before you start (5 min)
- [ ] Run front and back, then log in as a **user** and as an **admin** and click around
- [ ] Check `git status` and your last commits for half-finished changes

## Open question
**Edit navlink:** is it only for adding new vacations, or also for editing existing ones?
If it's both, one shared form can handle add, edit, and image upload.

---

## Order of attack
- [ ] **1. Like bug.** Quick win and front-only, so it's a good warm-up.
- [ ] **2. Add Vacation page + picture upload.** This is the core admin feature, and it also puts images on the user page.
- [ ] **3. Like analytics page.** It needs likes data, which already exists.
- [ ] **4. AI recommendation page UI.** This is polish, so it comes after the features.
- [ ] **5. MCP chatbot layer (extra).** Do this only once 1–4 are done.
- [ ] **6. About page.** Last, once the whole project is finished.

---

## 1. Like button doesn't update (User)
**Problem:** Clicking like saves on the backend, but the component doesn't show it until F5.

**Likely cause:** After `like` / `unlike` succeeds, the state holding the vacation's `isLiked` isn't updated, so nothing re-renders.

**Where:** The like button micro-component, wherever the vacations list state lives, and `vacationsService.like` / `unlike`.

**Done when:**
- [ ] Like and unlike toggle instantly with no refresh
- [ ] Log in bug, when closing the app, and logging back in, It shows as if i am logged in, cause it fetches the last jwt token which is expired, it shows in the ui as if you are logged in, But you cannot acces the logged in pages.
- [ ] The UI still matches after F5
- [ ] The like count updates too, if you show one

---

## 2. Add Vacation page + picture upload (Admin, with images shown to users)
**What:** An admin page for creating a vacation, connected to the existing **Edit** navlink. The image upload is built into the same form.

**Backend:**
- [ ] The add-vacation route accepts an image file along with the vacation data (admin-only)
- [ ] Save the file and store its name/path on the vacation
- [ ] Serve the images so the front can display them

**Frontend:**
- [ ] Form page wired to the Edit navlink
- [ ] Admin operations added to `vacationsService`
- [ ] Vacation cards display the image

**Done when:** An admin adds a vacation with a picture, and it shows up with its image on the user's vacations page.

> If Edit also covers editing existing vacations, reuse the same form, prefilled with the vacation's data.

---

## 3. Like analytics page (Admin)
**What:** The admin sees the likes on every vacation.

- [ ] Check whether the backend has a likes-per-vacation endpoint, and add one (admin-only) if not
- [ ] Page shows likes per vacation as a table or chart
- [ ] Page is reachable by admins only

**Done when:** You like a vacation as a user and the number on the analytics page reflects it.

---

## 4. AI recommendation page (User)
**Problem:** The UI and input buttons need work.

- [ ] Rework the layout
- [ ] Fix the inputs and buttons
- [ ] Check loading and error states while waiting for the response

**Done when:** The page looks clean and the inputs feel good to use.

---

## 5. Extra: MCP chatbot layer
**What:** Turn "ask MCP" from a single API call into an actual chat.

- [ ] Keep the conversation history and send it with each request
- [ ] Chat UI with a message list and an input

**Rule:** Don't start this until 1–4 are done.

---

## 6. About page
Build this last, once everything else is finished.

---

## Notes
*(add anything you discover while coding)*