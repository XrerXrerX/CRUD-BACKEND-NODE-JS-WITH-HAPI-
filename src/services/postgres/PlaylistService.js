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
            text: 'INSERT INTO playlist(id, name , user_id ) VALUES($1, $2 ,$3 ) RETURNING id',
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
            text: 'SELECT * FROM playlist WHERE id = $1 AND user_id = $2',
            values: [playlistid, authId],
        };
        const UserCheckResult = await this._pool.query(userCheckQuery);
        if (UserCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authentikasi playlist gagal', 403);
        }
        const arrsongCheckQuery = {
            text: 'SELECT * FROM playlist_songs WHERE $1 = song_id',
            values: [songid],
        };
        const arrsongCheckResult = await this._pool.query(arrsongCheckQuery);
        if (arrsongCheckResult.rows.length) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('Song sudah ada di dalam playlist', 400);
        }
        // Jika songid ditemukan, tambahkan lagu ke playlist
        const query = {
            text: 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1,$2) RETURNING id',
            values: [playlistid, songid]
        };
        const result = await this._pool.query(query);
        if (result.rows[0].id == false) {
            throw new ClientError('Gagal menambahkan lagu', 404);
        }
        return result.rows[0].id;
    }

    async getPlaylists(authId) {
        const queryuser = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [authId],
        };
        const quser = await this._pool.query(queryuser);
        const username = quser.rows[0].username;

        const query = {
            text: 'SELECT * FROM playlist WHERE user_id = $1',
            values: [authId],
        };
        const result = await this._pool.query(query);
        // const result = await this._pool.query('SELECT * FROM playlist');
        return result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            username,
        }));
    }

    async checkPlaylist(playlistid, authId) {

        const platlistcheckquery = {
            text: 'SELECT * FROM playlist WHERE id = $1 ',
            values: [playlistid],
        };
        const playlistcheckresult = await this._pool.query(platlistcheckquery);
        if (playlistcheckresult.rows[0] == undefined) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('Playlist tidak ditemukan', 404);
        }
        if (playlistcheckresult.rows[0].user_id) {
            try {
                if (playlistcheckresult.rows[0].user_id != authId) {
                    // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
                    throw new ClientError('user tidak di temukan', 403);
                }
            } catch (error) {
                throw new ClientError(error.message, 403);
            }
        }
    }

    async getPlaylistsSong(playlistid, authId) {
        //mengecek playlist
        const nameCheckQuery = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [playlistid],
        };
        const nameCheckResult = await this._pool.query(nameCheckQuery);

        if (nameCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('Playlist tidak ditemukan', 404);
        }

        const userCheckQuery = {
            text: 'SELECT * FROM playlist WHERE user_id = $1',
            values: [authId],
        };
        const UserCheckResult = await this._pool.query(userCheckQuery);

        if (UserCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authorization gagal', 403);
        }
        if (UserCheckResult.rows[0].user_id != authId) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authentikasi playlist gagal', 403);
        }
        const userCheckQuery2 = {
            text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
            values: [playlistid],
        };
        const UserCheckResult2 = await this._pool.query(userCheckQuery2);

        const songIds = UserCheckResult2.rows.map(row => row.song_id);
        if (UserCheckResult2.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('playlist tidak ditemukan .', 404);
        }
        const query = {
            text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
            values: [playlistid],
        };
        const result = await this._pool.query(query);


        if (result.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new InvariantError('Song Tidak Ditemukan', 403);
        }
        const userquery = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [authId],
        };
        const usernamequery = await this._pool.query(userquery);

        const username = usernamequery.rows[0].username;
        const title = nameCheckResult.rows[0].name

        // const result = await this._pool.query('SELECT * FROM playlist');
        return UserCheckResult2.rows.map((row) => ({
            id: playlistid,
            name: title,
            username,
            songs: songIds
        }));
    }

    async deleteSongInPlaylistById(authId, playlistid, songid) {
        const userCheckQuery = {
            text: 'SELECT * FROM playlist WHERE user_id = $1',
            values: [authId],
        };
        const UserCheckResult = await this._pool.query(userCheckQuery);
        if (UserCheckResult.rows.length == 0) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authorization gagal', 403);
        }
        if (UserCheckResult.rows[0].user_id != authId) {
            // Jika songid tidak ditemukan di tabel songs, lempar kesalahan
            throw new ClientError('authentikasi playlist gagal', 403);
        }
        const findsongs = {
            text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistid, songid],
        };
        const resultfindsongs = await this._pool.query(findsongs);
        const id = resultfindsongs.rows[0].song_id
        if (resultfindsongs.rows.length === 0) {
            throw new ClientError('songs gagal dihapus. Id tidak ditemukan', 403);
        }
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistid, songid]
        };
        await this._pool.query(query);
        return id;
    }

    async deletePlaylistById(playlistid, authId) {
        const queryuser = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [playlistid,]
        };
        const user = await this._pool.query(queryuser);
        const id = user.rows[0].id;
        if (user.rows[0].user_id != authId) {
            throw new ClientError('authorization gagal', 403);
        };
        if (user.rows[0].length == 0) {
            throw new ClientError('PLaylist gagal dihapus. Id tidak ditemukan', 404);
        };
        const query = {
            text: 'DELETE FROM playlist WHERE id = $1',
            values: [playlistid,]
        };
        await this._pool.query(query);

        return id;
    }
}
module.exports = PlaylistService;

