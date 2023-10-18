const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { songmapDBToModel } = require('../../utils/song.js'); // Pastikan ini mengacu pada path yang benar
const { playlistsongmapDBToModelSongwithAlbum } = require('../../utils/songplaylist.js'); // Pastikan ini mengacu pada path yang benar
const { songmapDBToModelSongwithAlbum } = require('../../utils/songwithalbum.js'); // Pastikan ini mengacu pada path yang benar

const NotFoundError = require('../../exceptions/NotFoundError');
class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = nanoid(16);
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        if (albumId == undefined) {
            albumId = id;
        }

        const query = {
            text: 'INSERT INTO songs(id, title, year, genre, performer, duration, albumid, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, created_at, updated_at],
        };


        const result = await this._pool.query(query);
        if (result.rows[0].id == false) {
            throw new NotFoundError('Gagal menambahkan lagu', 404);
        }

        return result.rows[0].id;
    }


    async getAllSongs() {
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }));
    }

    async getSongById(id) {

        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);


        if (result.rows.length === 0) {
            return null; // Lagu tidak ditemukan
        }

        return songmapDBToModel(result.rows[0]);
    }


    async getSongByIdplaylist(id) {

        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);


        if (result.rows.length === 0) {
            return null; // Lagu tidak ditemukan
        }

        return playlistsongmapDBToModelSongwithAlbum(result.rows[0]);
    }




    async getAlbumWithSongById(id) {

        const query = {
            text: 'SELECT * FROM songs WHERE albumid = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            return null; // Lagu tidak ditemukan
        }

        const songs = result.rows.map((row) => ({
            id: row.id,
            title: row.title,
        }));


        return songs;
    }

    async updateSongById(id, { title, year, genre, performer, duration }) {
        const updated_at = new Date().toISOString();
        const albumid = id;

        const query = {
            text: 'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6, albumid = $7, updated_at = $8 WHERE id = $1 RETURNING id',
            values: [id, title, year, genre, performer, duration, albumid, updated_at],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            return null; // Lagu tidak ditemukan
        }

        return result.rows[0];
    }
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('Lagu gagal dihapus. ID tidak ditemukan', 404);
        }

        return result.rows[0].id;

    }
}

module.exports = SongsService;