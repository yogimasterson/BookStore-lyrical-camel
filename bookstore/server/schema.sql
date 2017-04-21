DROP TABLE IF EXISTS main_table;

CREATE TABLE artwork (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  img_url TEXT NOT NULL,
  artist_id INTEGER NOT NULL FOREIGN KEY REFERENCES artist_id(id),
  genre_id INTEGER NOT NULL FOREIGN KEY REFERENCES genre_id(id)
);

DROP TABLE IF EXISTS artist;

CREATE TABLE artist (
  id SERIAL PRIMARY KEY,
  name TEXT
);

DROP TABLE IF EXISTS genre;

CREATE TABLE genre (
  id SERIAL PRIMARY KEY,
  genre TEXT NOT NULL
);

-- Join artwork to artist

SELECT
  *
FROM
  artwork
LEFT JOIN
  artist
ON artist.id = artist_id

-- Join artwork to genre

SELECT
  *
FROM
  artwork
LEFT JOIN
  genre
  ON genre.id = genre_id
