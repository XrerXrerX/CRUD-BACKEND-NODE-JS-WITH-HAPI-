exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('albums', {
        coverurl: {
            type: 'TEXT',
        },
    });
};

exports.down = pgm => {
    pgm.dropColumns('albums', 'coverurl');
};