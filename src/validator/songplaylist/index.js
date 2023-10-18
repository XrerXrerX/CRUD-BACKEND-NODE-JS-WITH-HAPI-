const InvariantError = require('../../exceptions/InvariantError');
const { songPlaylistPayloadSchema } = require('./schema');

const songPlaylistvalidator = {
    validatesongPlaylistPayload: (payload) => {
        const validationResult = songPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = songPlaylistvalidator;