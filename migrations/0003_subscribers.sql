-- Tabell for de som abonnerer på nyhetsbrevet
CREATE TABLE IF NOT EXISTS Subscribers (
  subscriberId INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  devUpdates INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Subscriptions (
  subscriberId INTEGER NOT NULL REFERENCES Subscribers (subscriberId) ON DELETE CASCADE,
  author TEXT NOT NULL, 
  tag TEXT
);