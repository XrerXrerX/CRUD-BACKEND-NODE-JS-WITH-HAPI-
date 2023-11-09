const ClientError = require('../../exceptions/ClientError');
class UploadsHandler {
    constructor(service, validator, albumservice) {
        this._service = service;
        this._validator = validator;
        this._albumservice = albumservice;

    }
    postUploadImageHandler = async (request, h) => {
        try {
            const albumid = request.params.id;
            const { cover } = request.payload;
            this._validator.validateImageHeaders(cover.hapi.headers);
            const filename = await this._service.writeFile(cover, cover.hapi); // Ubah ini juga
            const url = `http://${process.env.HOST}:${process.env.PORT}/file/images/${filename}`;
            const id = await this._albumservice.updateAlbumcover(url, albumid);
            const response = h.response({
                status: 'success',
                message: `id album cover : ${id}`,
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = UploadsHandler;