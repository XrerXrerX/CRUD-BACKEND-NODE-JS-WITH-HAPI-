const songmapDBToModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumid,
    created_at,
    updated_at,
}) => ({
    id,
    songId: id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: albumid,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { songmapDBToModel };
