const firebase = require('firebase')
import config from '../config/firebase-config'

export const db = firebase.initializeApp(config.firebaseConfig)

