/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            references: 'playlist(id)',
            notNull: true,
            onDelete: 'CASCADE', // Tambahkan opsi ON DELETE CASCADE di sini
        },
        song_id: {
            type: 'VARCHAR(50)',
            references: 'songs(id)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('playlist_songs');
};