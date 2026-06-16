# Next.js Movie Reviews App with GraphQL

A full-stack Next.js authentication and movie review application built with TypeScript, GraphQL, and SQLite.

## 🎯 Features

- **Authentication**: Secure user authentication with Lucia and SQLite adapter
- **GraphQL API**: Full GraphQL endpoint for queries and mutations
- **Movie Reviews**: Create, read, update, and delete movie reviews
- **Comments**: Comment on reviews with nested comment system
- **User Profiles**: Update user profiles with bio and avatar
- **Protected Routes**: Role-based access control with protected routes
- **Server-side GraphQL**: Execute GraphQL queries directly from server components
- **Client-side GraphQL**: Fetch wrapper for client mutations and queries
- **Type-safe**: Full TypeScript support throughout the stack

## 🛠 Tech Stack

- **Framework**: Next.js 14.1.4 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **Authentication**: Lucia 3.2.2
- **GraphQL**: graphql 16.8.0
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl

## 📋 Prerequisites

- Node.js 18+ (or use `nvm`)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd next-authentication-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   The SQLite database (`reviews.db`) is automatically initialized on first run with the schema defined in `lib/db.ts`.

## 🏃 Running the App

**Development server:**
```bash
npm run dev
```

The app runs on `http://localhost:3000`

**Build for production:**
```bash
npm run build
npm start
```

**Lint code:**
```bash
npm run lint
```

## 📁 Project Structure

```
.
├── actions/                 # Server Actions (auth, reviews, comments, profiles)
├── app/                     # Next.js App Router structure
│   ├── (protected)/         # Protected routes (require authentication)
│   │   ├── dashboard/       # User dashboard
│   │   ├── profile/         # User profile page
│   │   └── reviews/         # Review management pages
│   ├── (public)/            # Public routes
│   │   └── page.tsx         # Landing page
│   └── api/graphql/         # GraphQL endpoint
├── components/              # React components
│   ├── auth-form.tsx        # Login/signup form
│   ├── profile-form.tsx     # Profile update form
│   ├── comments/            # Comment components
│   ├── reviews/             # Review components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions and logic
│   ├── graphql.ts           # GraphQL schema and resolvers
│   ├── auth.ts              # Authentication helpers
│   ├── db.ts                # Database initialization
│   ├── reviews.ts           # Review database operations
│   ├── comments.ts          # Comment database operations
│   ├── user.ts              # User database operations
│   └── format.ts            # Formatting utilities
├── public/                  # Static assets
└── messages/                # i18n translation files
```

## 🔗 GraphQL API

### Endpoint
`POST /api/graphql`

### Sample Queries

**Get all reviews:**
```graphql
query {
  reviews(limit: 10, offset: 0) {
    id
    movie_title
    rating
    review_text
    user_name
    created_at
  }
}
```

**Get current user:**
```graphql
query {
  me {
    id
    email
    name
    bio
  }
}
```

**Search reviews:**
```graphql
query {
  searchReviews(query: "Inception") {
    id
    movie_title
    rating
    review_text
  }
}
```

### Sample Mutations

**Create a review:**
```graphql
mutation {
  createReview(input: {
    movie_title: "Inception"
    movie_year: 2010
    rating: 9
    review_text: "An incredible mind-bending thriller..."
  }) {
    id
    movie_title
    rating
  }
}
```

**Update profile:**
```graphql
mutation {
  updateProfile(input: {
    name: "John Doe"
    bio: "Movie enthusiast"
  })
}
```

**Create comment:**
```graphql
mutation {
  createComment(input: {
    reviewId: 1
    commentText: "Great review!"
  }) {
    id
    comment_text
    created_at
  }
}
```

## 🔐 Authentication Flow

1. User signs up/logs in via `/` (public page)
2. Session created and stored in SQLite
3. Protected routes verify session server-side
4. Lucia middleware handles session validation
5. User can access protected dashboard, profile, and reviews

## 📝 Usage Examples

### Server Component (SSR GraphQL)
```tsx
import { serverGraphql } from '@/lib/graphql';

export default async function Dashboard() {
  const { reviews } = await serverGraphql(`
    query {
      reviews(limit: 10) {
        id
        movie_title
        rating
      }
    }
  `);

  return <div>{/* render reviews */}</div>;
}
```

### Client Component (Client-side Mutation)
```tsx
'use client';
import { graphqlClient } from '@/components/graphql-client';

export default function ReviewForm() {
  const handleCreate = async (formData) => {
    const result = await graphqlClient(`
      mutation {
        createReview(input: {
          movie_title: "${formData.title}"
          rating: ${formData.rating}
          review_text: "${formData.text}"
        }) {
          id
          movie_title
        }
      }
    `);
    // handle result
  };

  return <form onSubmit={handleCreate}>{/* form */}</form>;
}
```

## 🗄 Database Schema

The SQLite database includes tables for:
- **users**: User accounts with hashed passwords
- **sessions**: Lucia authentication sessions
- **reviews**: Movie reviews with ratings and text
- **comments**: Comments on reviews

See `lib/db.ts` for the complete schema.

## 🐛 Debugging

- Check logs: `npm run dev` outputs all errors to console
- GraphQL errors: Check `/api/graphql` response for detailed error messages
- Database issues: Verify `reviews.db` exists and is readable
- Auth issues: Verify session cookie is present in browser DevTools

## 📦 Dependencies

See `package.json` for full list. Key packages:
- `next`: React framework with App Router
- `lucia`: Authentication library
- `graphql`: GraphQL query language
- `better-sqlite3`: Synchronous SQLite driver
- `tailwindcss`: Utility-first CSS framework

## 🚧 Future Enhancements

- [ ] Rate limiting for GraphQL mutations
- [ ] Full-text search on reviews
- [ ] Review filtering by rating and genre
- [ ] Notification system
- [ ] User follows/followers system
- [ ] Pagination improvements

## 📄 License

MIT

## 👤 Author

Created as a portfolio project demonstrating full-stack Next.js development with GraphQL.
