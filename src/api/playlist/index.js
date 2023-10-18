const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlist',
    version: '1.0.0',
    register: async (server, { service, playlistvalidator, songplaylistvalidator, songsService }) => {
        const playlistHandler = new PlaylistHandler(service, playlistvalidator, songplaylistvalidator, songsService);
        server.route(routes(playlistHandler));
    },
};

