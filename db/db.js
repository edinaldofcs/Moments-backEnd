const firebase = require('firebase')
const config = require('../config/firebase-config')

const db = firebase.initializeApp(config.firebaseConfig)

module.exports = {db}