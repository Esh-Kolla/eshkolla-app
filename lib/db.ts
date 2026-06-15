import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), "data", "analytics.db");
  db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      referrer TEXT,
      country TEXT
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      unsubscribed_at TEXT
    );
  `);

  return db;
}

export function trackPageView(
  path: string,
  referrer?: string,
  country?: string
): void {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO page_views (path, referrer, country) VALUES (?, ?, ?)"
  );
  stmt.run(path, referrer || null, country || null);
}

export function getAnalytics(days?: number): {
  totalViews: number;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ referrer: string; views: number }>;
  viewsByDay: Array<{ date: string; views: number }>;
} {
  const database = getDb();

  const whereClause = days
    ? `WHERE timestamp >= datetime('now', '-${days} days')`
    : "";

  const totalViews = database
    .prepare(`SELECT COUNT(*) as count FROM page_views ${whereClause}`)
    .get() as { count: number };

  const topPages = database
    .prepare(
      `SELECT path, COUNT(*) as views FROM page_views ${whereClause} GROUP BY path ORDER BY views DESC LIMIT 10`
    )
    .all() as Array<{ path: string; views: number }>;

  const referrerWhereClause = days
    ? `WHERE timestamp >= datetime('now', '-${days} days') AND referrer IS NOT NULL AND referrer != ''`
    : "WHERE referrer IS NOT NULL AND referrer != ''";

  const topReferrers = database
    .prepare(
      `SELECT referrer, COUNT(*) as views FROM page_views ${referrerWhereClause} GROUP BY referrer ORDER BY views DESC LIMIT 10`
    )
    .all() as Array<{ referrer: string; views: number }>;

  const viewsByDay = database
    .prepare(
      `SELECT date(timestamp) as date, COUNT(*) as views FROM page_views ${whereClause} GROUP BY date(timestamp) ORDER BY date DESC LIMIT 30`
    )
    .all() as Array<{ date: string; views: number }>;

  return {
    totalViews: totalViews.count,
    topPages,
    topReferrers,
    viewsByDay,
  };
}

export function addSubscriber(
  email: string
): { success: boolean; error?: string } {
  const database = getDb();

  try {
    const stmt = database.prepare(
      "INSERT INTO subscribers (email) VALUES (?)"
    );
    stmt.run(email);
    return { success: true };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return { success: false, error: "Already subscribed" };
    }
    return { success: false, error: "Failed to subscribe" };
  }
}

export function getSubscriberCount(): number {
  const database = getDb();
  const result = database
    .prepare(
      "SELECT COUNT(*) as count FROM subscribers WHERE unsubscribed_at IS NULL"
    )
    .get() as { count: number };
  return result.count;
}

export function getAllActiveSubscribers(): string[] {
  const database = getDb();
  const rows = database
    .prepare(
      "SELECT email FROM subscribers WHERE unsubscribed_at IS NULL ORDER BY created_at"
    )
    .all() as Array<{ email: string }>;
  return rows.map((row) => row.email);
}

export function unsubscribeByEmail(email: string): boolean {
  const database = getDb();
  const result = database
    .prepare(
      "UPDATE subscribers SET unsubscribed_at = datetime('now') WHERE email = ? AND unsubscribed_at IS NULL"
    )
    .run(email);
  return result.changes > 0;
}
