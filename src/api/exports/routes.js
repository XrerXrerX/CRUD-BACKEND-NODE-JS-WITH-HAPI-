const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/playlists/{id}',
        handler: handler.postExportPlaylistHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
];

module.exports = routes;