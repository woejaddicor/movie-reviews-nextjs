import sql from "better-sqlite3";

const db = sql("reviews.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    bio TEXT,
    avatar TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

// Add missing columns to existing users table
try {
  db.exec(`ALTER TABLE users ADD COLUMN name TEXT`);
} catch (e) {
  // Column already exists
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN bio TEXT`);
} catch (e) {
  // Column already exists
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT`);
} catch (e) {
  // Column already exists
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN created_at INTEGER`);
  // Update existing rows to have a created_at value
  db.exec(
    `UPDATE users SET created_at = strftime('%s', 'now') WHERE created_at IS NULL`,
  );
} catch (e) {
  // Column already exists
}

// Create movie reviews table
db.exec(`
  CREATE TABLE IF NOT EXISTS movie_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    movie_year INTEGER,
    movie_poster TEXT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
    review_text TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create comments table
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment_text TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (review_id) REFERENCES movie_reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create indexes for better query performance
db.exec(
  `CREATE INDEX IF NOT EXISTS idx_reviews_user ON movie_reviews(user_id)`,
);
db.exec(
  `CREATE INDEX IF NOT EXISTS idx_reviews_created ON movie_reviews(created_at DESC)`,
);
db.exec(
  `CREATE INDEX IF NOT EXISTS idx_comments_review ON comments(review_id)`,
);
db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id)`);

export default db;
