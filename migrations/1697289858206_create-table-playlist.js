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
        user_id: {
            type: 'VARCHAR(50)',
            references: 'users(id)',
            notNull: true,
        }
    });

};

exports.down = pgm => {
    pgm.dropTable('playlist');
};


