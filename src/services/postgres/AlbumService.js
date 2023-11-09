const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const AuthorizationError = require('../../exceptions/AuthorizationError');



class AlbumService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
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


    async addlike({ authId, id }) {
        const query = {
            text: 'INSERT INTO liked_albums (album_id, user_id) VALUES ($2,$1) RETURNING id',
            values: [authId, id]
        };
        await this._pool.query(query);
        await this._cacheService.delete(`id:${id}`);
        return id;
    }
    async checklike({ authId, id }) {
        const check = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const querycheck = await this._pool.query(check);
        if (querycheck.rows[0] === undefined) {
            throw new ClientError('album tidak ada', 404);
        }
        const find = {
            text: 'SELECT * FROM liked_albums WHERE user_id = $1 AND album_id = $2',
            values: [authId, id],
        };
        const queryfind = await this._pool.query(find);
        if (queryfind.rows.length >= 1) {
            throw new ClientError('anda sudah menyukai album ini ', 400);
        }
        return;
    }

    async countlike({ id }) {
        try {
            // mendapatkan catatan dari cache
            const result = await this._cacheService.get(`id:${id}`);
            const datapars = JSON.parse(result);
            const response = {
                data: datapars,
                headers: {
                    'X-Data-Source': 'cache',
                },
            };
            return response;
        } catch (error) {
            // bila gagal, diteruskan dengan mendapatkan catatan dari database

            const count = {
                text: 'SELECT * FROM liked_albums WHERE album_id = $1',
                values: [id],
            };
            // const count = {
            //     text: 'SELECT * FROM liked_albums WHERE album_id = $1',
            //     values: [id],
            // };

            const countcheck = await this._pool.query(count);
            if (countcheck.rows.length == 0) {
                throw new ClientError('tidak ada user yang menyukai album ini', 404);
            }
            await this._cacheService.delete(`id:${id}`);
            await this._cacheService.set(`id:${id}`, JSON.stringify(countcheck.rows.length));
            const response = {
                data: countcheck.rows.length,
            };

            return response;
        };
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
        // return mapDBToModel(result.rows[0]);
        return result.rows[0];
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

    async updateAlbumcover(url, albumid) {
        const query = {
            text: 'UPDATE albums SET coverurl = $2 WHERE id = $1 RETURNING id',
            values: [albumid, url],
        };

        const result = await this._pool.query(query);
        if (result.rows.length == 0) {
            throw new NotFoundError('Album tidak ditemukan', 404);
        }
        return albumid;
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

    async deletelike({ authId, id }) {
        console.log('ini auth id :', authId);
        console.log('ini id :', id);
        const deletequery = {
            text: 'DELETE FROM liked_albums WHERE album_id = $1 AND user_id = $2',
            values: [id, authId],
        };

        const deleteresult = await this._pool.query(deletequery);
        if (deleteresult.rowCount === 0) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan', 404);
        }
        await this._cacheService.delete(`id:${id}`);

        return;

    }


}

module.exports = AlbumService;
