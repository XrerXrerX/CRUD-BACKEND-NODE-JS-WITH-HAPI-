/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            unique: false,
            notNull: true,
        },
        username: {
            type: 'VARCHAR(50)',
            unique: false,
            notNull: true,
        },
        songid: {
            type: 'VARCHAR(50)',
            unique: false,
            notNull: true,
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('playlist');
};


