const Joi = require('joi');

const songPlaylistPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { songPlaylistPayloadSchema };