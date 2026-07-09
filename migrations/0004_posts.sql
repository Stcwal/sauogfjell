
-- Forslag til skjema for Posts database 
CREATE TABLE IF NOT EXISTS Posts (
    postId INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT NOT NULL, 
    author TEXT,
    draft BOOLEAN,
    publishDate DATE,
    editDate DATE,
    tags TEXT,
    bodytext TEXT,
    -- fileLink TEXT, # enten denne eller bodytext
)