-- Schema for the ELO song-rating feature on Cloudflare D1.
-- Booleans are stored as integers (0/1); eloHistory is a comma-separated list of elo values over time.

CREATE TABLE IF NOT EXISTS Songs (
  songID         INTEGER PRIMARY KEY,
  artistName     TEXT    NOT NULL,
  songName       TEXT    NOT NULL,
  elo            INTEGER NOT NULL,
  numMatches     INTEGER NOT NULL,
  qualified      INTEGER NOT NULL,
  albumCoverLink TEXT    NOT NULL,
  eloHistory     TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS Matches (
  matchID      INTEGER PRIMARY KEY AUTOINCREMENT,
  songID1      INTEGER NOT NULL REFERENCES Songs (songID),
  songID2      INTEGER NOT NULL REFERENCES Songs (songID),
  songIDwinner INTEGER NOT NULL REFERENCES Songs (songID)
);
