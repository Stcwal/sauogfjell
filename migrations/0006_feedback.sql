CREATE TABLE
    IF NOT EXISTS Feedback (
        feedbackId INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT,
        feedbackText TEXT NOT NULL,
        location TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );