const cloudinary = require('cloudinary').v2
require('dotenv').config()
const cloudName = process.env.cloud_name
const apiKey = process.env.api_key
const secretApi = process.env.api_secret

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: secretApi
})

module.exports = { cloudinary }