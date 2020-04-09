require('dotenv').config();

module.exports={ 
    domain    : process.env.DOMAIN,
    port      : process.env.PORT,
    db        : process.env.MONGODB,
    token     : process.env.TOKEN,
    salt      : process.env.SALT,
};