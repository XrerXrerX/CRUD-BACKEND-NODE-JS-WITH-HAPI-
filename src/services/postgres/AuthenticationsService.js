const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');


class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }
    async addRefreshToken(accessToken, username, refreshToken) {
        const query = {
            text: 'UPDATE users SET accesstoken = $1 , refreshtoken = $2 WHERE username = $3',
            values: [accessToken, refreshToken, username],
        };
        await this._pool.query(query);
    }

    async verifyRefreshToken(refreshToken) {
        const query = {
            text: 'SELECT * FROM users WHERE refreshtoken = $1',
            values: [refreshToken],
        };




        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
        // if (refreshToken == result.rows[0].accesstoken) {
        //     throw new InvariantError('Refresh token tidak valid');
        // }



    }
    async deleteRefreshToken(refreshToken) {
        const query = {
            text: 'DELETE FROM users WHERE refreshtoken = $1',
            values: [refreshToken],
        };
        await this._pool.query(query);
    }

}

module.exports = AuthenticationsService;


