class PlaylistHandler {
    constructor(service, playlistvalidator, songplaylistvalidator, songsService) {
        this._service = service;
        this._validator = playlistvalidator;
        this._songvalidator = songplaylistvalidator;
        this._songsService = songsService;

    }

    postPlaylistHandler = async (request, h) => {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const authId = request.auth.credentials.id;
        const playlistId = await this._service.addPlaylist(name, authId);
        const response = h.response({
            status: 'success',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;

    }

    postSongToPlaylistHandler = async (request, h) => {

        this._songvalidator.validatesongPlaylistPayload(request.payload);
        const playlistid = request.params.id;
        const songid = request.payload.songId;
        const authId = request.auth.credentials.id;
        const playlistId = await this._service.addSongPlaylist(playlistid, songid, authId);

        const response = h.response({
            status: 'success',
            message: `songs berhasil ditambahkan. Playlist ID: ${playlistId}`,


        });
        response.code(201);
        return response;
    }

    getPlaylistsHandler = async (request, h) => {
        const authId = request.auth.credentials.id;
        const playlists = await this._service.getPlaylists(authId);
        const response = h.response({
            status: 'success',
            data: {
                playlists,
            },
        });
        response.code(200);
        return response;
    }


    getSongPlaylistsByIdHandler = async (request, h) => {

        const authId = request.auth.credentials.id;
        const playlistid = request.params.id;

        const getplaylist = await this._service.getPlaylistsSong(playlistid, authId);
        if (getplaylist[0] === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'song tidak ditemukan didalam playlist',
            });
            response.code(403);
            return response;
        }
        const songIds = getplaylist[0].songs;
        if (songIds === 0) {
            const response = h.response({
                status: 'fail',
                message: 'tidak ada song di dalam playlist ini',
            });
            response.code(404);
            return response;
        }
        const songs = [];
        for (const songId of songIds) {
            const song = await this._songsService.getSongByIdplaylist(songId);
            if (song) {
                songs.push((song));
            }
        }
        getplaylist[0].songs = songs; // Replace playlists[0].songs with the updated songs array
        const playlist = getplaylist[0];
        // Wrap songs in an array for each playlist
        if (playlist.length === 0) {
            const response = h.response({
                status: 'fail',
                message: 'Playlist tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                playlist,
            },
        });
        response.code(200);
        return response;

    }
    deleteSongInPlaylistsByIdHandler = async (request, h) => {
        this._songvalidator.validatesongPlaylistPayload(request.payload);
        const authId = request.auth.credentials.id;
        const playlistid = request.params.id
        const songid = request.payload.songId;

        const result = await this._service.deleteSongInPlaylistById(authId, playlistid, songid);
        if (result) {
            const response = h.response({
                status: 'success',

                message: `songs berhasil dihapus. dengan song_ID: ${result}`, // Pesan sesuai permintaan Anda

            });
            response.code(200); // Mengatur status code ke 201 (OK)
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: 'songs tidak Ditemukan', // Pesan jika album tidak ditemukan
            });
            response.code(404); // Mengatur status code ke 404 (Not Found) jika album tidak ditemukan
            return response;
        }

    }
    deletePlaylistsByIdHandler = async (request, h) => {
        const authId = request.auth.credentials.id;
        const playlistid = request.params.id

        const result = await this._service.deletePlaylistById(playlistid, authId);
        if (result) {
            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil dihapus', // Pesan sesuai permintaan Anda
            });
            response.code(200); // Mengatur status code ke 201 (OK)
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Playlist tidak Ditemukan', // Pesan jika album tidak ditemukan
            });
            response.code(403); // Mengatur status code ke 404 (Not Found) jika album tidak ditemukan
            return response;
        }

    }
}

module.exports = PlaylistHandler;