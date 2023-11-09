/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('liked_albums', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
        },
        album_id: {
            type: 'VARCHAR(50)',
            references: 'albums(id)',
            notNull: true,
            onDelete: 'CASCADE', // Tambahkan opsi ON DELETE CASCADE di sini
        },
        user_id: {
            type: 'VARCHAR(255)',
            references: 'users(id)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('liked_albums');
};