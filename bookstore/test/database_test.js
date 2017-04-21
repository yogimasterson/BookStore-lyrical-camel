const expect = require('expect.js')
process.env.NODE_ENV = 'test'
const database = require('../server/database')

describe('database', () => {
  beforeEach( () => {
    return database.truncateAllTable()
  })
})

describe('getAllArtwork', () => {
  it('should return all artwork', () => {
    return database.getAllArtwork().then(artwork => {
      expect(artwork).to.be.a(Array)
      expect(artwork.length).to.eql(64)
    })
  })
})

describe('createArtwork', () => {
  it('should insert art piece into the artwork table', () => {
    const attributes = {
      artist: [ {name: '',
        }
      ],
      artwork: [ {title: '', img_url: '', } ],
      genre: [],
    }
    return database.createArtwork(attributes).then(artworkId => {
      return database.getArtworkId(artworkId).then(artwork => {
        expect(artwork).to.be.a(object)
        console.log('is object');
        expect(artwork.id).to.be.a('number')
        console.log('is number');
        expect(artwork.title).to.eql('')
        console.log('has title');
      })
    })
  })
})

describe('updateArt', () => {
  it('should update artwork info into the artwork table', () => {
  })
})
