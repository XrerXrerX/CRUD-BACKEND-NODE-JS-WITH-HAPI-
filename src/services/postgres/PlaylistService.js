const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist(name, authId) {
        const playlistId = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist(id, name , username) VALUES($1, $2 ,$3) RETURNING id',
            values: [playlistId, name, authId],
        };


        const result = await this._pool.query(query);

        if (result.rows[0].id == false) {
            throw new InvariantError('Gagal menambahkan lagu', 400);
        }

        return result.rows[0].id;
    }

    async addSongPlaylist(playlistid, songid, authId) {

        // Cek apakah songid memiliki id yang sama di tabel songs
        const songCheckQuery = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songid],
        };
        const songCheckResult = await this._pool.query(songCheckQuery);
        if (songCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('Song tidak ditemukan', 404);
        }

        const userCheckQuery = {
            text: 'SELECT * FROM playlist WHERE id = $1 AND username = $2',
            values: [playlistid, authId],
        };
        const UserCheckResult = await this._pool.query(userCheckQuery);
        if (UserCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authentikasi playlist gagal', 403);
        }

        const arrsongCheckQuery = {
            text: 'SELECT * FROM playlist WHERE $1 = ANY(songid)',
            values: [songid],
        };
        const arrsongCheckResult = await this._pool.query(arrsongCheckQuery);
        if (arrsongCheckResult.rows.length) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('Song sudah ada di dalam playlist', 400);
        }



        // Jika songid ditemukan, tambahkan lagu ke playlist
        const query = {
            text: 'UPDATE playlist SET songid = array_append(songid, $3) WHERE id = $1 AND username = $2 RETURNING id',

            values: [playlistid, authId, songid,],
        };

        const result = await this._pool.query(query);


        if (result.rows[0].id == false) {
            throw new ClientError('Gagal menambahkan lagu', 404);
        }
        return result.rows[0].id;
    }



    async getPlaylists(authId) {
        const query = {
            text: 'SELECT * FROM playlist WHERE username = $1',
            values: [authId],
        };


        const result = await this._pool.query(query);
        // const result = await this._pool.query('SELECT * FROM playlist');
        return result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            username: row.username,
        }));
    }

    async getPlaylistsSong(playlistid, authId) {

        const userCheckQuery = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [authId],
        };
        const UserCheckResult = await this._pool.query(userCheckQuery);
        const username = UserCheckResult.rows[0].username;
        if (UserCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authentikasi playlist gagal', 403);
        }
        const query = {
            text: 'SELECT * FROM playlist WHERE id = $1 AND username = $2',
            values: [playlistid, authId],
        };
        const result = await this._pool.query(query);
        if (result.rows.songid == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new InvariantError('Song Tidak Ditemukan', 403);
        }
        // console.log(result.rows[0].songid);
        // const result = await this._pool.query('SELECT * FROM playlist');
        return result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            username,
            songs: row.songid
        }));


    }

    async deleteSongInPlaylistById(authId, playlistid, songid) {

        const query = {
            text: 'UPDATE playlist SET songid = array_remove(songid, $3) WHERE id = $2 AND username = $1 RETURNING id',
            values: [authId, playlistid, songid],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new ClientError('songs gagal dihapus. Id tidak ditemukan', 403);
        }

        return result.rows[0].id;
    }

    async deletePlaylistById(playlistid, authId) {

        const queryuser = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [playlistid,]
        };

        const user = await this._pool.query(queryuser);
        if (user.rows[0].username != authId) {
            throw new ClientError('songs gagal dihapus. Id tidak ditemukan', 403);
        };

        const query = {
            text: 'DELETE FROM playlist WHERE id = $1',
            values: [playlistid,]
        };
        const result = await this._pool.query(query);
        if (result.rows[0] != undefined) {
            throw new ClientError('songs gagal dihapus playlist tidak ada', 403);
        }
        return result.rows;
    }
}

module.exports = PlaylistService;

