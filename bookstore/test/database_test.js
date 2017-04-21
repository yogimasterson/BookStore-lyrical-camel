process.env.NODE_ENV = 'test'
const expect = require('expect.js')
const database = require('../server/database')

describe('database', () => {
  beforeEach( () => {
    return database.truncateAllTable()
  })
})

describe('getAllArtwork', () => {
  it('should return all artwork', () => {
    return database.getAllArtwork().then(Artwork => {
      expect(artwork).to.be.a(Array)
      expect(artwork.length).to.eql(0)
    })
  })
})

describe('createArtwork', () => {
  it('should insert art piece into the artwork table', () => {
    const attributes = {
      title: '',
      artist: [ {first_name: '', last_name: '',
    }
        ],
      genre: [],
    }
    return database.createArtwork(attributes).then(artworkId => {
      return database.getArtworkId(artworkId).then(artwork => {
        expect(artwork).to.be.a(object)
        expect(artwork.id).to.be.a('number')
        expect(artwork.title).to.eql('')
      })
    })
  })
})

describe('updateArt', () => {
  it('should update artwork info into the artwork table', () => {
  })
})
