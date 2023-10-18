const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongToPlaylistHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongPlaylistsByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongInPlaylistsByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistsByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
];

module.exports = routes;
