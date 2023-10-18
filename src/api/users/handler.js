const ClientError = require("../../exceptions/ClientError");

class UsersHandler {

    constructor(service, uservalidator) {
        this._service = service;
        this._uservalidator = uservalidator;

    }

    postUserHandler = async (request, h) => {
        this._uservalidator.validateUserPayload(request.payload);
        const { username, password, fullname } = request.payload;
        const userId = await this._service.addUser({ username, password, fullname });
        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });
        response.code(201);
        return response;
    }

    getUserByIdHandler = async (request, h) => {
        const { id } = request.params;
        const user = await this._service.getUserById(id);
        return {
            status: 'success',
            data: {
                user,
            },
        };

    }
}

module.exports = UsersHandler;
