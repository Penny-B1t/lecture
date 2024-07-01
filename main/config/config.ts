const path = require("path");
require("dotenv").config({ path : path.join(__dirname, "../.env") });

const config = {
    MYSQL : {
        User : process.env.User,
        Password : process.env.Password,
        Database : process.env.Database
    }
}

module.exports = config;