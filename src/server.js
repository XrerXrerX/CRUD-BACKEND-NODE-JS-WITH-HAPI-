require('dotenv').config()

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');


const album = require('./api/album');
const songs = require('./api/song'); // Import modul songs
const users = require('./api/users');
const playlist = require('./api/playlist');
const authentications = require('./api/authentications');
const _exports = require('./api/exports');
const uploads = require('./api/uploads');



const AlbumValidator = require('./validator/album');
const SongsValidator = require('./validator/song');
const UsersValidator = require('./validator/users');
const PlaylistValidator = require('./validator/playlist');
const songPlaylistvalidator = require('./validator/songplaylist');
const AuthenticationsValidator = require('./validator/authentications');
const ExportsValidator = require('./validator/exports');
const UploadsValidator = require('./validator/uploads');


const StorageService = require('./services/storage/StorageService');
const ClientError = require('./exceptions/ClientError');
const AlbumService = require('./services/postgres/AlbumService');
const SongsService = require('./services/postgres/SongService');
const UsersService = require('./services/postgres/UsersService');
const PlaylistService = require('./services/postgres/PlaylistService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const CacheService = require('./services/redis/CacheService'); // Adjust the path as needed





// authentications
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const playlistService = new PlaylistService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);




  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        songsService: songsService,
        service: albumService,
        validator: AlbumValidator,

      },
    },
    {
      plugin: playlist,
      options: {
        songsService: songsService,
        service: playlistService,
        playlistvalidator: PlaylistValidator,
        songplaylistvalidator: songPlaylistvalidator,

      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        uservalidator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: songs, // Daftarkan plugin songs
      options: {
        service: songsService, // Kirim instance service untuk songs
        songsvalidator: SongsValidator
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistservice: playlistService,

      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
        albumservice: albumService,

      },

    },
  ]);



  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {

      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.log(response)
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
