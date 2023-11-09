
class ExportsHandler {
    constructor(service, validator, playlistservice) {
        this._service = service;
        this._validator = validator;
        this._servicePlaylist = playlistservice;

    }


    postExportPlaylistHandler = async (request, h) => {
        this._validator.validateExportPlaylistPayload(request.payload);
        const playlistid = request.params.id;
        const authId = request.auth.credentials.id;
        // await this._servicePlaylist.checkUser(playlistid, authId);
        await this._servicePlaylist.checkPlaylist(playlistid, authId);
        const message = {
            playlistid,
            userId: request.auth.credentials.id,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrean',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;