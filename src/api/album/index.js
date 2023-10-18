const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'album',
    version: '1.0.0',
    register: async (server, { service, validator, songsService }) => {
        const albumHandler = new AlbumHandler(service, validator, songsService);
        server.route(routes(albumHandler));
    },
};