const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
        // options: {
        //     auth: 'notesapp_jwt',
        // },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postAlbumLikesHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.GetAlbumLikesHandler,

    },
    {
        method: 'GET',
        path: '/albums',
        handler: handler.getAllAlbumsHandler,
        // options: {
        //     auth: 'notesapp_jwt',
        // },
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler,
        // options: {
        //     auth: 'notesapp_jwt',
        // },
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.updateAlbumByIdHandler,
        // options: {
        //     auth: 'notesapp_jwt',
        // },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler,
        // options: {
        //     auth: 'notesapp_jwt',
        // },
    },

    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteAlbumLikesHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    }

];

module.exports = routes;