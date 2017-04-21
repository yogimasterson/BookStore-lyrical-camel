'use strict';

// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/michaelmasterson';

const pgp = require('pg-promise')();
const connection = {
  host: 'localhost',
  port: 5432,
  database: 'michaelmasterson'
}

const db = pgp(connection);
console.log('am I connected?', connection)

const getArtworkById = function(artworkId){
  return db.one("select * from artwork where artwork.id=$1", [artworkId])
}

const getAllArtwork = function(id){
  return db.any("select * from artwork");
}

const getAllGenres = function(id){
  return db.any("select * from genre");
}

const getAllArtist = function (id){
  return db.any("select * from artist")
}

const getAllArtworkWithArtist = function() {
  return getAllArtwork().then(function(artwork){
    console.log('GOT ARTWORK', artwork)
    const artworkIds = artwork.map(artwork => artwork.id)
    const sql = `
      SELECT
        artist.*,
        artwork.id
      FROM
        artist
      JOIN
        artwork
      ON
        artist.id = artwork.artist_id
      WHERE
        artwork.id IN ($1:csv)
    `;
    console.log('artworkIds', artworkIds)
    return db.any(sql, [artworkIds]
      .then(function(artist) {
        artwork.forEach(artwork => {
          console.log('ARTWORK', artwork)
          artwork.artist = artist.filter(artist => artist.artwork_id === artwork.id);
        })
        return artwork
      })
      .catch(function(error){
        console.error(error)
        throw error;
      }))
    })
  }

const createArtist = function(attributes){
  const sql = `
    INSERT INTO
      artist (name)
    VALUES
     ($1)
    RETURNING
      *
  `
  return db.one(sql, [attributes.name])
}

const createGenre = function(attributes){
  const sql = `
    INSERT INTO
      genre (genre)
    VALUES
     ($1)
    RETURNING
      *
  `
  return db.one(sql, [attributes.genre])
}

const createArtwork = function(attributes){
  const sql = `
    INSERT INTO
      artwork (title)
    VALUES
     ($1)
    RETURNING
      *
  `
  var queries = [
    db.one(sql, [attributes.title])
  ]
  attributes.artist.forEach(function(artist){
    queries.push(createArtist(artist))
  })

  return Promise.all(queries)
    .then(function(artist){
      var artwork = artist.shift()
      return Promise.all([
        associateArtistWithArtwork(artwork.id, artist.map(a => a.id)),
        associateGenreWithArtwork(artwork.id, attributes.genre),
      ]).then(function(){
        return artwork;
      })
    })
}

const associateArtistWithArtwork = function(artworkId, artistIds){
  const queries = artistIds.map(artistId => {
    let sql = `
      INSERT INTO
        artwork (artist_id, artwork.id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [artistId, artworkId])
  })
  return Promise.all(queries)
}

const associateGenreWithArtwork = function(artworkId, genreIds){
  const queries = genreIds.map(genreId => {
    let sql = `
      INSERT INTO
        artwork (genre_id, artwork.id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [genreId, artworkId])
  })
  return Promise.all(queries)
}

const getArtistByArtworkId = function(artworkId){
  const sql = `
    SELECT
      artist.*
    FROM
      artist
    JOIN
      artwork
    ON
      artist.id=artist_id
    WHERE
      artwork.id=$1
  `
  return db.any(sql, [artworkId])
}

const getGenresByArtworkId = function(artworkId){
  const sql = `
    SELECT
      genre.*
    FROM
      genre
    JOIN
      artwork
    ON
      genre.id=genre_id
    WHERE
      artwork.id=$1
  `
  return db.any(sql, [artworkId])
}

const updateArtworkTitle = function(artworkId, title){
  const sql = `
    UPDATE
      artwork
    SET
      title=$2
    WHERE
      artwork.id=$1
  `
  db.none(sql, [artworkId, title])
}

const findOrCreateArtist = function(attribures){
  return db.oneOrNone('SELECT * FROM aritst WHERE artist.first_name=$1 AND artist.name=$1 LIMIT 1', [attributes.name])
    .then(author => {
      console.log('findOrCreateArtist', artist)
      if (artist) return artist;
      return createArtist(attributes)
    });
}

const updateArtistForArtwork = function(artworkId, artist){
  if (typeof artist === 'undefined') return;
  console.log('updating artits', artworkId, artist)

  return db.none('DELETE FROM artwork WHERE id=$1', [artwork.id])
    .then(()=> {
      const findOrCreateArtistQueries = []
        artist.forEach(artist => {
          if (artist.name === '') return;
          findOrCreateArtistQueries.push(findOrCreateArtist(artist))
        })

      return Promise.all(findOrCreateArtistQueries).then(artist => {
        console.log('FOUND OR CREATED ARTISTS: ', artist)
        return associateArtistWithArtwork(artworkId, artist.map(a => a.id))
      })
    })
}

const findOrCreateGenre = function(attributes){
  return db.oneOrNone('SELECT * FROM genre WHERE genre.genre=$1 LIMIT 1', [attributes.genre])
    .then(genre => {
      if (genre) return;
      return createGenre(attributes)
    });
}

const updateGenreForArtwork = function(artworkId, genreIds){
  if (typeof genreIds === 'undefined') return
  console.log('updating genre', artworkId, genreIds)

  return db.none('DELETE FROM genre WHERE genre_id=$1', [artworkId])
    .then(() => {
      return associateArtistWithArtwork(artworkId, genreIds)
    })
}

const updateArtwork = function(artworkId, attributes){
  console.log('UPDATE ARTWORK', artworkId, attributes)
  return Promise.all([
    updateArtworkTitle(artworkId, attributes.title),
    updateArtistForArtwork(artworkId, attributes.artist),
    updateGenreForArt(artworkId, attributes.genre),
  ])
}

const getArtworkWithArtistAndGenreByArtworkId = function(artworkId){
  return Promise.all([
    getArtworkById(artworkId),
    getArtistByArtworkId(artworkId),
    getGenreByArtworkId(artworkId)
  ])
    .then(function(results){
      const artwork = results[0];
      artwork.artist = results[1];
      artwork.genre = results[2];
      return artwork;
    })
}

const searchForArtwork = function(options){
  const variables = []
  let sql = `
    SELECT
      DISTINCT(artwork.*)
    FROM
      artwork
  `
  if (options.search_query){
    let search_query = options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')

    variables.push(search_query)
    sql += `
    LEFT JOIN
      *artist*
    ON
      artwork.artist_id=artist.id
    LEFT JOIN
      genre
    ON
      artwork.genre_id=genre.id
    WHERE
      LOWER(artwork.title) LIKE $${variables.length}
    OR
      LOWER(*artist.name) LIKE $${variables.legth}
    OR
      LOWER(genre.genre) LIKE $${variables.length}
    `
  }
  if (options.order){
  }else{
    sql += `
      ORDER BY artwork.id ASC
    `
  }
  if (options.page){
    let PAGE_SIZE = 10
    let offset = (options.page- 1) * PAGE_SIZE
    variables.push(offset)
    sql += `
    LIMIT ${PAGE_SIZE}
    OFFSET $${variables.length}
    `
  }
    console.log('----->', sql, variables)
    return db.any(sql, variables)
}

module.exports = {
  pgp,
  db,
  getAllArtwork,
  getAllArtist,
  getAllArtworkWithArtist,
  getArtworkWithArtistAndGenreByArtworkId,
  getArtworkById,
  createArtwork,
  createArtist,
  getAllGenres,
  getArtistByArtworkId,
  searchForArtwork,
  updateArtwork,
};
