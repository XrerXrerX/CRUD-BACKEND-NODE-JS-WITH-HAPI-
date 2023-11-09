const mapDBToModel = ({
    id,
    name,
    year,
    coverurl,
    created_at,
    updated_at,
}) => ({
    id,
    name,
    year,
    coverUrl: coverurl,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { mapDBToModel };