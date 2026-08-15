-- Remove duplicate local rows before adding the uniqueness guard.
DELETE FROM Posts
WHERE postId NOT IN (
  SELECT MIN(postId)
  FROM Posts
  GROUP BY title, author, publishDate
);

-- Prevent the same published post from being inserted twice.
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_identity
ON Posts(title, author, publishDate);