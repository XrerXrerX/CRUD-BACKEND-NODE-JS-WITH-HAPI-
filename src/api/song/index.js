const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'song',
    version: '1.0.0',
    register: async (server, { service, songsvalidator }) => {
        const songsHandler = new SongsHandler(service, songsvalidator);
        server.route(routes(songsHandler));
    },
};