const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async (server, { service, uservalidator }) => {
        const usersHandler = new UsersHandler(service, uservalidator);
        server.route(routes(usersHandler));
    },
};