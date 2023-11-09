const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { service, validator, albumservice }) => {
        const uploadsHandler = new UploadsHandler(service, validator, albumservice);
        server.route(routes(uploadsHandler));
    },
};