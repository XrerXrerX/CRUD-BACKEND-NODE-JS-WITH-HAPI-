const { nanoid } = require('nanoid');


class AlbumService {
    constructor() {
        this._albums = [];
    }

    addAlbum({ name, year }) {
        const albumId = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newAlbum = {
            name, year, id: albumId, createdAt, updatedAt,
        };

        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((album) => album.id === albumId).length > 0;

        if (!isSuccess) {
            throw new Error('Album gagal ditambahkan');
        }

        return albumId;
    }

    getAllAlbums() {
        return this._albums;
    }

    getAlbumById(id) {
        const album = this._albums.find((a) => a.id === id);
        if (!album) {
            throw new Error('Album tidak ditemukan');
        }
        return album;
    }

    updateAlbumById(id, { name, year }) {
        const index = this._albums.findIndex((album) => album.id === id);

        if (index === -1) {
            throw new Error('Gagal memperbarui album. Id tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        this._albums[index] = {
            ...this._albums[index],
            name,
            year,
            updatedAt,
        };

        return this._albums[index];
    }

    deleteAlbumById(id) {
        const index = this._albums.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new Error('Album gagal dihapus. Id tidak ditemukan');
        }

        this._albums.splice(index, 1);

        return true;
    }
}

module.exports = AlbumService;