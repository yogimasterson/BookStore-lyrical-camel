DROP TABLE IF EXISTS artwork;

CREATE TABLE artwork (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  img_url TEXT NOT NULL,
  artist_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS artist;

CREATE TABLE artist (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS genre;

CREATE TABLE genre (
  id SERIAL PRIMARY KEY,
  genre TEXT NOT NULL
);

SELECT
  *
FROM
  artwork
WHERE
  title
LIKE
  '%something%'
;

SELECT
  *
FROM
  artwork
LEFT JOIN
  artist
ON artist.id = artwork.artist_id
;

SELECT
  *
FROM
  artwork
LEFT JOIN
  genre
ON genre.id = artwork.genre_id
;
