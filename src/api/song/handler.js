class SongsHandler {
    constructor(service, songsvalidator) {
        this._service = service;
        this._songsvalidator = songsvalidator;
    }

    postSongHandler = async (request, h) => {
        try {
            this._songsvalidator.validateSongPayload(request.payload);

            const { title, year, genre, performer, duration, albumId } = request.payload;

            const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
            const response = h.response({
                status: 'success',
                message: 'Data berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201); // Mengatur status code ke 201 (Created)
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400); // Mengatur status code ke 400 (Bad Request) jika terjadi kesalahan dalam payload
            return response;
        }
    }

    getAllSongsHandler = async (request, h) => {

        try {
            const { title, performer } = request.query;

            if (title || performer) {
                const songs = await this._service.getAllSongs();

                let filteredSongs = songs;

                if (title) {
                    const loweredTitle = title.toLowerCase();
                    filteredSongs = filteredSongs.filter(song => song.title.toLowerCase().includes(loweredTitle));
                }

                if (performer) {
                    const loweredPerformer = performer.toLowerCase();
                    filteredSongs = filteredSongs.filter(song => song.performer.toLowerCase().includes(loweredPerformer));
                }
                const response = h.response({
                    status: 'success',
                    data: {
                        songs: filteredSongs,
                    },
                });
                response.code(200); // Mengatur status code ke 200 (OK)
                return response;
            } else {
                const songs = await this._service.getAllSongs();

                const response = h.response({
                    status: 'success',
                    data: {
                        songs,
                    },
                });
                response.code(200); // Mengatur status code ke 200 (OK)
                return response;

            }
        } catch (error) {
            const response = h.response({
                status: 'error',
                message: error.message,
            });
            response.code(500); // Mengatur status code ke 500 (Internal Server Error)
            return response;
        }
    }
    getSongByIdHandler = async (request, h) => {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);

            if (song) {
                const response = h.response({
                    status: 'success',
                    data: {
                        song,
                    },
                });
                response.code(200); // Mengatur status code ke 200 (OK)
                return response;
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'Lagu tidak ditemukan',
                });
                response.code(404); // Mengatur status code ke 404 (Not Found) jika lagu tidak ditemukan
                return response;
            }
        } catch (error) {
            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            });
            response.code(500); // Mengatur status code ke 500 (Internal Server Error)
            return response;
        }
    }
    updateSongByIdHandler = async (request, h) => {
        try {
            const { id } = request.params;
            this._songsvalidator.validateSongPayload(request.payload);

            const { title, year, genre, performer, duration, albumId } = request.payload;
            const updatedSong = await this._service.updateSongById(id, { title, year, genre, performer, duration, albumId });

            if (updatedSong) {
                const response = h.response({
                    status: 'success',

                    message: 'Lagu berhasil diperbarui',

                });
                response.code(200); // Mengatur status code ke 200 (OK)
                return response;
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'Lagu tidak ditemukan',
                });
                response.code(404); // Mengatur status code ke 404 (Not Found) jika lagu tidak ditemukan
                return response;
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400); // Mengatur status code ke 400 (Bad Request) jika ada kesalahan request payload
            return response;
        }
    }

    deleteSongByIdHandler = async (request, h) => {
        try {
            const { id } = request.params;

            const result = await this._service.deleteSongById(id);
            if (result) {
                const response = h.response({
                    status: 'success',
                    message: 'lagu berhasil dihapus', // Pesan sesuai permintaan Anda

                });
                response.code(200); // Mengatur status code ke 201 (OK)
                return response;
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'lagu tidak Ditemukan', // Pesan jika album tidak ditemukan
                });
                response.code(404); // Mengatur status code ke 404 (Not Found) jika album tidak ditemukan
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
}

module.exports = SongsHandler;
