

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');


class AlbumService {
    constructor() {
        this._pool = new Pool();
    }

    // Metode untuk menambahkan album
    async addAlbum({ name, year }) {

        const id = `album-${nanoid(16)}`;
        const created_at = new Date().toISOString();
        const query = {
            text: 'INSERT INTO albums (id, name, year, created_at, updated_at ) VALUES ($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, year, created_at],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new Error('Gagal menambahkan album');
        }

        return result.rows[0].id;
    }


    async getAllAlbums() {
        // const result = await this._pool.query('SELECT * FROM albums');
        // return result.rows.map(mapDBToModel);
        const query = {
            text: 'SELECT * FROM albums',
            values: [],
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModel);
    }

    async getAlbumById(id) {

        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('album tidak ada', 404);
        }
        return mapDBToModel(result.rows[0]);
    }


    async updateAlbumById(id, { name, year }) {
        const updated_at = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updated_at, id],
        };

        const result = await this._pool.query(query);
        if (result.rows.length == 0) {
            throw new NotFoundError('Album tidak ditemukan', 404);
        }

        return result.rows[0].id;
    }
    async verifyNoteOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan');
        }
        const note = result.rows[0];
        if (note.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }


    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (result.rows.length == 0) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan', 404);
        }

        return result.rows[0].id;
    }

    // Metode lainnya seperti getAlbum, updateAlbum, deleteAlbum
}

module.exports = AlbumService;
