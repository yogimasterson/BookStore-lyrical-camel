'use strict';

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/michaelmasterson';

const getArtworkById = function(artworkId){
  return db.one("select * from artwork where artwor.id=$1", [artworkId])
}

const getAllArtworks = function(id){
  return db.any("select * from artwork");
}

const getAllGenres = function(id){
  return db.any("select * from genre");
}

const getAllArtists = function (id){
  return db.any("select * from artist")
}

const getAllArtworksWithArtists = function() {
  return getAllArtworks().then(function(artworks){
    console.log('GOT ARTWORK', artworks)
    const artworkIds = artworks.map(artwork => artwork.id)
    const sql = `
      SELECT
        artists.*,
        artwork.id
      FROM
        artists
      JOIN
        artwork
      ON
        artist.id = artwork.artist_id
      WHERE
        artwork.id IN ($1:csv)
    `;
    console.log('artworkIds', artwork)
  })
}
