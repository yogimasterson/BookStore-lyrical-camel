'use strict'

const express = require('express')
const router = express.Router()
const database = require('../server/database')

router.get('/', (req, res, next) => {
  res,redirect('/')
})

router.get('/new',)
