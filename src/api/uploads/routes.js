const path = require('path'); // Tambahkan baris ini
const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 500000,
                output: 'stream',
                multipart: true     // <-- this fixed the media type error
            }

        },
    },
    {
        method: 'GET',
        path: '/file/images/{param*}',
        handler: (request, h) => {
            const { param } = request.params;
            return h.file(`src/api/uploads/file/images/${param}`); // Menyediakan file dari direktori yang sesuai
        },
    },
];
module.exports = routes;