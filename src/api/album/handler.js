class AlbumHandler {
    constructor(service, validator, songsService, cacheService) {
        this._service = service;
        this._validator = validator;
        this._songsService = songsService;
        this._cacheService = cacheService;
    }

    postAlbumHandler = async (request, h) => {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            // const { id: credentialId } = request.auth.credentials;
            const albumId = await this._service.addAlbum({ name, year });
            const response = h.response({
                status: 'success',
                message: 'Data berhasil ditambahkan',
                data: {
                    albumId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }
    postAlbumLikesHandler = async (request, h) => {
        const authId = request.auth.credentials.id;
        const { id } = request.params;
        await this._service.checklike({ authId, id });
        await this._service.addlike({ authId, id });

        const response = h.response({
            status: 'success',
            message: 'anda menyukai album ini sudah dimasukan dalam list'
        });
        response.code(201);
        return response;
    }


    GetAlbumLikesHandler = async (request, h) => {
        const { id } = request.params;
        const tcount = await this._service.countlike({ id });
        const response = h.response({
            status: 'success',
            data: {
                likes: tcount.data
            },
        });
        response.code(200);
        if (tcount.headers) {
            response.headers = {
                'X-Data-Source': 'cache',
            };
        }

        return response;
    }

    getAllAlbumsHandler = async (request, h) => {
        // const { id: credentialId } = request.auth.credentials;
        // const albums = await this._service.getAllAlbums(credentialId);
        const albums = await this._service.getAllAlbums();
        if (albums.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'No albums found',
            });
            response.code(404);
            return response;
        }
        const response = h.response({
            status: 'success',
            data: {
                albums,
            },
        });
        response.code(200);
        return response;
    }
    // getimagealbums = async (request, h) => {

    //     let path = 'plain.txt';
    //     if (request.headers['x-magic'] === 'sekret') {
    //         path = 'awesome.png';
    //     }

    //     return h.file(path).vary('x-magic');
    // }

    getAlbumByIdHandler = async (request, h) => {
        try {
            const { id } = request.params;
            // const { id: credentialId } = request.auth.credentials;
            // await this._service.verifyNoteOwner(id, credentialId);
            const album = await this._service.getAlbumById(id);
            if (album.hasOwnProperty("coverurl")) {
                album.coverUrl = album.coverurl;
                delete album.coverurl;
            }
            // const songs = await songService.getSongsByAlbumId(albumId);
            const song = await this._songsService.getAlbumWithSongById(id);
            const songs = {
                ...album,
                songs: song || [], // Masukkan data lagu ke dalam properti songs
            };
            const response = h.response({
                status: 'success',
                data: {
                    album: songs, // Masukkan album yang telah dimodifikasi dengan songs
                },
            });
            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    updateAlbumByIdHandler = async (request, h) => {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { id } = request.params;
            // const { id: credentialId } = request.auth.credentials;
            // await this._service.verifyNoteOwner(id, credentialId);
            const { name, year } = request.payload;
            const albumId = await this._service.updateAlbumById(id, { name, year });
            if (albumId) { // Check if id matches albumId
                const response = h.response({
                    status: 'success',

                    message: 'Album berhasil diperbarui',

                });
                response.code(200);
                return response;
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'ID tidak cocok dengan albumId',
                });
                response.code(404); // You might want to return a 400 Bad Request in this case
                return response;
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
        }
    }

    deleteAlbumLikesHandler = async (request, h) => {
        const authId = request.auth.credentials.id;
        const { id } = request.params;
        await this._service.deletelike({ authId, id });

        const response = h.response({
            status: 'success',
            message: 'anda sudah tidak menyukai album ini'
        });
        response.code(200);
        return response;
    }



    deleteAlbumByIdHandler = async (request, h) => {
        try {
            const { id } = request.params;
            // const { id: credentialId } = request.auth.credentials;
            // await this._service.verifyNoteOwner(id, credentialId);

            const result = await this._service.deleteAlbumById(id);
            if (result) {
                const response = h.response({
                    status: 'success',

                    message: 'Album berhasil dihapus', // Pesan sesuai permintaan Anda

                });
                response.code(200); // Mengatur status code ke 201 (OK)
                return response;
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'Album tidak Ditemukan', // Pesan jika album tidak ditemukan
                });
                response.code(404); // Mengatur status code ke 404 (Not Found) jika album tidak ditemukan
                return response;
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = AlbumHandler;
