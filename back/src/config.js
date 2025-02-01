require('dotenv').config()

module.exports = {
    app: {
        port: process.env.PORT || 4000,
        host: process.env.HOST || 'http://localhost:4000/',
        front_host: process.env.FRONT_HOST || 'http://localhost:5173',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    mysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
    }
}