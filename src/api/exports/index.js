const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { service, validator, playlistservice }) => {
        const exportsHandler = new ExportsHandler(service, validator, playlistservice);
        server.route(routes(exportsHandler));
    },
};