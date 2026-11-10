# PromptShare

A web app for discovering, creating, and sharing AI prompts. Browse a public feed, sign in with Google, and publish prompts with tags to a MongoDB-backed collection.

PromptShare stores and shares prompt text; it does not call an AI model or generate responses.

## Features and status

- Public prompt feed displaying prompt text, tags, and creator details.
- Google sign-in through NextAuth, with user records saved to MongoDB.
- A form for publishing prompts with a tag.
- A personal profile listing the signed-in user's prompts.
- Clipboard copy action on prompt cards.
- Responsive desktop and mobile navigation.

Search, tag filtering, and editing are unfinished. Delete controls and an API endpoint are present, but deletion needs a Mongoose compatibility fix. See [Current limitations](#current-limitations) for details.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14.0.1 with the App Router |
| Frontend | React 18, JavaScript |
| Styling | Tailwind CSS 3, PostCSS |
| Authentication | NextAuth 4 with Google OAuth |
| Database | MongoDB with Mongoose 8 |
| API | Next.js route handlers |

## Getting started

### 1. Install dependencies

The locked Next.js version requires **Node.js 18.17 or later**. This is the package's minimum requirement; the repository does not pin a runtime version.

```bash
git clone https://github.com/daman-m/PromptShare.git
cd PromptShare
npm ci
```

### 2. Set up MongoDB

Create a MongoDB database deployment and obtain its connection string. Ensure the machine running Next.js can access it and that the database credentials allow reads and writes.

The database name is explicitly set to `share_prompt` in [`utils/database.js`](utils/database.js), regardless of the database name in the connection string. Mongoose manages the user and prompt collections through the models in `models/`.

### 3. Configure Google OAuth

Create a Google OAuth client for a web application. For local development, configure:

| Setting | Value |
| --- | --- |
| Authorized JavaScript origin | `http://localhost:3000` |
| Authorized redirect URI | `http://localhost:3000/api/auth/callback/google` |

Configure the OAuth consent screen and add test users if the client is restricted to testing.

### 4. Add environment variables

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/?retryWrites=true&w=majority
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-random-secret
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string, read by `utils/database.js`. |
| `GOOGLE_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `NEXTAUTH_URL` | Base URL used by NextAuth. |
| `NEXTAUTH_SECRET` | Secret used by NextAuth for authentication tokens and session protection. |

Generate a secret with:

```bash
openssl rand -base64 32
```

Keep `.env.local` private; it is excluded by `.gitignore`. Restart the development server after changing environment variables.

See the [NextAuth configuration reference](https://next-auth.js.org/configuration/options) for its URL and secret settings.

### 5. Start the app

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000), sign in with Google, and select **Create Post** to publish a prompt. Your avatar links to your profile.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build the production app. |
| `npm start` | Serve a production build after running `npm run build`. |
| `npm run lint` | Run the Next.js lint command. |

No test script or automated test suite is currently included. There is also no committed ESLint configuration, so the lint command may prompt for initial setup.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Public prompt feed |
| `/create-prompt` | New prompt form |
| `/profile` | Signed-in user's prompts |
| `/update-prompt?id=<prompt-id>` | Edit form; loads existing data, but saving is not implemented |

## API routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`, `POST` | `/api/auth/[...nextauth]` | Authentication and session endpoints |
| `GET` | `/api/prompt` | List prompts with populated creator details |
| `POST` | `/api/prompt/new` | Create a prompt from `userId`, `prompt`, and `tag` |
| `GET` | `/api/prompt/:id` | Fetch one prompt |
| `PATCH` | `/api/prompt/:id` | Update a prompt's `prompt` and `tag` fields |
| `DELETE` | `/api/prompt/:id` | Delete handler; currently uses an incompatible Mongoose method |
| `GET` | `/api/users/:id/posts` | List prompts by creator |

The prompt mutation handlers currently lack server-side session and ownership checks. The UI's owner-specific controls do not enforce API authorization.

## Project structure

```text
app/
├── api/
│   ├── auth/[...nextauth]/   # Google authentication and session callbacks
│   ├── prompt/              # Prompt list, create, read, update, and delete handlers
│   └── users/[id]/posts/     # Prompts belonging to one user
├── create-prompt/            # Publish form page
├── profile/                  # Personal profile page
├── update-prompt/            # Partially implemented edit page
├── layout.jsx               # Shared layout and session provider
└── page.jsx                 # Home page
components/                  # Navigation, feed, cards, forms, and profile UI
models/                      # User and Prompt Mongoose schemas
utils/database.js            # MongoDB connection helper
styles/globals.css           # Global styles and Tailwind components
public/assets/               # Icons and branding
```

### Data models

- **User:** email, username, and profile image URL. First-time Google sign-in derives the username from the Google profile name.
- **Prompt:** creator reference, prompt text, and tag.

## Deployment

Deploy to a host that supports Next.js server routes. Provide the environment variables above, set `NEXTAUTH_URL` to the deployed origin, and register that origin's `/api/auth/callback/google` URL with Google OAuth. Ensure the deployed server can reach MongoDB.

For a local production run:

```bash
npm run build
npm start
```

The current implementation has the limitations below; these commands describe the available scripts and do not imply a verified production deployment.

## Current limitations

- **Search and filtering:** the search handler does not update its input state or filter posts, and feed tag clicks have no implementation.
- **Editing:** the edit page fetches prompt details, but its submit handler is empty. The profile passes the edit callback as `handleTagClick` rather than `handleEdit`, leaving the card's Edit control unwired.
- **Deletion:** the API calls `findByIdAndRemove`, which was removed in Mongoose 8; see the [Mongoose migration guide](https://mongoosejs.com/docs/migrating_to_8.html#removed-findoneandremove). The UI also removes a prompt from local state without checking whether the request succeeded.
- **Authorization:** create, update, and delete handlers need server-side session checks and ownership validation before deployment for real users. Creation currently accepts a client-supplied `userId`.
- **First-time sign-in:** usernames derived from Google names can fail the schema's 8–20 character username validation.
- **Copy feedback:** the copied-state icon checks `post.promt` instead of `post.prompt`, and the copy icon path is relative, which can break on nested pages.

## License

No license file is currently included in this repository.
