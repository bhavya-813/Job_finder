# JobFinder – Job Search Portal

A responsive job search portal built with **React**, **Vite**, and **Tailwind CSS**
for a BSc Computer Science college project. Users can search and filter jobs,
view full job details, save jobs, apply, and track applications through a
status board — all working end-to-end.

---

## 1. How to Install Dependencies

Make sure you have **Node.js 18+** installed, then from the project folder run:

```bash
npm install
```

This installs React, React Router, Tailwind CSS, lucide-react (icons), and Vite.

## 2. How to Run the Project

Start the development server:

```bash
npm run dev
```

Then open the URL Vite prints in your terminal (usually **http://localhost:5173**).

Other useful scripts:

```bash
npm run build     # builds an optimized production bundle into /dist
npm run preview   # locally preview the production build
```

## 3. How to Configure the API Key

JobFinder fetches live job listings from the **Remotive API**
(`https://remotive.com/api/remote-jobs`), which is free and public and does
**not** require an API key — so the app works immediately after
`npm install` with no extra setup.

The project is still wired up to support a keyed API (for example if you
later swap in a provider like a RapidAPI jobs endpoint):

1. Copy `.env.example` to a new file named `.env`
2. Add your key:
   ```
   VITE_JOBS_API_KEY=your_real_key_here
   ```
3. `src/services/jobsApi.js` reads it via `import.meta.env.VITE_JOBS_API_KEY`
   and attaches it as a request header automatically.

**Never commit your `.env` file or hard-code a real key in source code** —
`.env` is already listed in `.gitignore`.

If the live API is ever unreachable (no internet, rate-limited, CORS issue),
the app automatically falls back to bundled sample data in
`src/data/mockJobs.js` so the app — and your demo — keeps working.

## 4. Project Folder Structure

```
jobfinder/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ .env.example
├─ src/
│  ├─ main.jsx              # React entry point, sets up the router
│  ├─ App.jsx                # Defines all page routes
│  ├─ index.css              # Tailwind + global styles
│  ├─ components/            # Reusable UI building blocks
│  │  ├─ Navbar.jsx
│  │  ├─ Footer.jsx
│  │  ├─ SearchBar.jsx
│  │  ├─ JobCard.jsx
│  │  ├─ FilterSidebar.jsx
│  │  ├─ CategoryCard.jsx
│  │  ├─ ProfileDropdown.jsx
│  │  ├─ SaveButton.jsx
│  │  ├─ ApplicationStatusBoard.jsx
│  │  ├─ LoadingSkeleton.jsx
│  │  ├─ ErrorMessage.jsx
│  │  └─ EmptyState.jsx
│  ├─ pages/                 # One file per route/page
│  │  ├─ Home.jsx
│  │  ├─ JobSearch.jsx
│  │  ├─ JobDetails.jsx
│  │  ├─ SavedJobs.jsx
│  │  ├─ Applications.jsx
│  │  ├─ Login.jsx
│  │  └─ Register.jsx
│  ├─ services/               # All external/localStorage data access
│  │  ├─ jobsApi.js           # Live API + mock fallback + normalization
│  │  └─ storageService.js    # localStorage: saved jobs, applications, auth
│  ├─ hooks/                  # Custom React hooks
│  │  ├─ useSavedJobs.js
│  │  └─ useApplications.js
│  ├─ utils/
│  │  └─ helpers.js           # timeAgo, cx, debounce, getInitials
│  └─ data/
│     └─ mockJobs.js          # Sample job data used as an API fallback
```

**API code is kept separate from UI components**: every page/component calls
functions from `src/services/`, never `fetch()` directly. This keeps the
app easy to maintain and easy to explain in a viva.

## 5. Explanation of Major Features

| Feature | How it works |
|---|---|
| **Smart Search & Filter** | `SearchBar` collects keyword + location; `FilterSidebar` collects job type, experience, work mode, and salary. `JobSearch.jsx` sends all of this to `fetchJobs()` in `jobsApi.js`. |
| **API Integration** | `jobsApi.js` calls the free Remotive API, converts (`normalizeRemotiveJob`) its response into a consistent `Job` shape used everywhere in the app, and falls back to `mockJobs.js` on any network error. |
| **Job Details** | `JobDetails.jsx` reads the `:jobId` route param and calls `fetchJobById()` to load one job's full description, responsibilities, requirements, and benefits. |
| **Save Jobs** | `useSavedJobs` hook wraps `storageService.js` functions (`saveJob`, `removeSavedJob`, `getSavedJobs`) so any component can toggle a job's saved state; the list is written to `localStorage` so it survives a page refresh. |
| **Apply & Track Applications** | Clicking "Apply Now" calls `apply(job)` from `useApplications`, which creates an application record (status: `Applied`) in `localStorage`. The `Applications` page groups them into four columns (Applied / Interview / Selected / Rejected) and lets the user move a card to a new column via a dropdown. |
| **Loading & Error States** | `LoadingSkeleton` shows shimmering placeholder cards while `fetchJobs` is in flight; `ErrorMessage` appears if the request fails entirely; `EmptyState` appears when a search or list is genuinely empty. |
| **Authentication (Mock)** | `Login.jsx`/`Register.jsx` call `loginUser`/`registerUser` in `storageService.js`, which check/store users in `localStorage`. **This is clearly a mock for demo purposes only** — no hashing, no server, no real security. |
| **Responsive Design** | Built mobile-first with Tailwind's responsive prefixes (`sm:`, `lg:`). The filter sidebar becomes a slide-over drawer below the `lg` breakpoint, and the navbar collapses into a hamburger menu below `md`. |


## Search, Location & Profile Menu (how they work)

**Search box** – type any mix of words. Every word must match at least one of a
job's title, company, skills, category, job type, work mode, experience or
location, and results are ranked so title/company matches come first.
Examples that work: `java developer`, `internship`, `remote internship`,
`hybrid`, `on-site`, `selenium`, `nimbusworks`, `cyber security`.
Matching is by whole word (or word start), so `java` does not return
JavaScript jobs, but `intern` finds internships. See `scoreJob()` in
`src/services/jobsApi.js`.

**Location box** – every word typed must appear in the job's location or work
mode: `hyderabad`, `india`, `remote`. Common alternative names work too
(`bangalore` = Bengaluru, `vizag` = Visakhapatnam, `gurgaon` = Gurugram).

**Data sources** – live jobs come from the Remotive API (remote jobs only).
The sample jobs in `src/data/mockJobs.js` are added to the results so that
internships, hybrid, on-site jobs and Indian cities can be searched too.
Experience level of live jobs is simulated because the API does not provide it.

**Profile dropdown** – after login/register the initials badge in the navbar
opens a menu with the user's name, email and a generated ID such as `JF-483920`
(created at registration, stored with the account in localStorage).

## 6. Viva Questions and Answers

**Q1: Why did you choose React for this project?**
A: React lets us build the UI as small, reusable components (JobCard,
SearchBar, Navbar, etc.) and update the interface efficiently when data
changes — for example, re-rendering only the job list when a filter changes,
not the whole page.

**Q2: How does the app get its job data?**
A: It calls the free Remotive jobs API from `src/services/jobsApi.js`. The
raw response is transformed into a consistent shape (`normalizeRemotiveJob`)
so the rest of the app doesn't need to know which API it came from. If the
API call fails, the app automatically falls back to local sample data in
`mockJobs.js`, so the demo never breaks.

**Q3: Where is API logic kept, and why is that a good practice?**
A: All API and localStorage logic lives in `src/services/`, completely
separate from UI components. This is called "separation of concerns" — it
makes the code easier to test, reuse, and maintain, and means a component
never needs to know *how* data is fetched or stored.

**Q4: How are saved jobs and applications kept after a page refresh?**
A: They're stored in the browser's `localStorage` via `storageService.js`.
`localStorage` persists data even after the browser is closed, unlike normal
JavaScript variables which reset on every page load.

**Q5: How does the search functionality work?**
A: The `SearchBar` component collects a keyword and a location and passes
them up to the page component, which calls `fetchJobs({ query, location, ...filters })`.
The text is split into words, and a job matches only if every word is found in
its title, company, skills, category, job type, work mode, experience or
location (see `scoreJob` in `jobsApi.js`). So "remote internship", "java developer",
"hybrid" or a company name all work, and the best matches are ranked first.
Common spellings are understood ("onsite", "wfh", "interns", "part time").

**Q6: How do the filters work together with search?**
A: `FilterSidebar` keeps its selected values in state on the parent page.
Every time a filter changes, the page re-calls `fetchJobs()` with the
updated filters object, which are all applied together in `matchesFilters()`.

**Q7: How does "Load More" pagination work?**
A: `fetchJobs()` accepts a `page` and `pageSize` and slices the filtered
results accordingly. Clicking "Load More" calls `fetchJobs()` again for the
next page and appends the new jobs to the existing list instead of
replacing it.

**Q8: Is the login/register feature secure?**
A: No — and the app is explicit about that. It's a mock authentication
system for demonstration purposes: it stores plain-text credentials in
`localStorage`, has no backend server, and has no encryption or sessions.
In a production app, this would use a secure backend, hashed passwords,
and proper session/token-based authentication (e.g. JWT over HTTPS).

**Q9: How would you make this production-ready?**
A: Replace the mock auth and localStorage layer with a real backend (e.g.
Node.js/Express with a database), add hashed passwords and JWT-based
sessions, add pagination directly from the API instead of client-side
slicing, add automated tests, and add proper error boundaries and logging.

**Q10: How is the app made responsive?**
A: Using Tailwind CSS's responsive utility prefixes (`sm:`, `md:`, `lg:`).
Layouts use CSS Grid/Flexbox that reflow from a single column on mobile to
multiple columns on larger screens, the filter sidebar becomes a slide-over
drawer on mobile, and the navbar collapses into a hamburger menu.

**Q11: What state management approach did you use, and why not Redux?**
A: The app uses React's built-in `useState`/`useEffect`, plus small custom
hooks (`useSavedJobs`, `useApplications`) that wrap `localStorage` access.
Given the app's size and the fact that most state is either local to a page
or synced to `localStorage` rather than shared deeply across the tree, a
library like Redux would add unnecessary complexity.

**Q12: What happens if the API returns zero results for a search?**
A: The `EmptyState` component is shown with a friendly message suggesting
the user try a different keyword or clear their filters, instead of a
blank page.

**Q13: How does the search return jobs for a role, company, internship or work mode?**
A: The search text is split into keywords. For each job, `scoreJob()` checks
every keyword against the title, company, skills, category, job type, work
mode, experience and location. A job is shown only if all keywords match, and
title/company matches rank higher. So "remote internship" returns only jobs
that are both remote and internships.

**Q14: How does the profile dropdown get the user's ID?**
A: When a user registers, `registerUser()` in `storageService.js` generates an
ID like `JF-483920` and stores it with the account and the logged-in user. The
navbar reads the current user on every route change and passes it to the
`ProfileDropdown` component, which displays the name, email and ID.

---

*Built for academic purposes. Mock authentication and salary/experience
labels are simulated for demo purposes and should not be treated as a
real production system.*
