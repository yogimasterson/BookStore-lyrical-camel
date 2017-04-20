'use strict'

const express = require('express')
const router = express.Router()
const database = require('../server/database')

router.get('/', (request, response) =>  {
  let page = parseInt(request.query.page, 10)
  if (isNaN(page) || page < 1) page = 1
  const searchOptions = {
    search_query: request.query.search_query,
    page: page
  }
})

module.exports = router
