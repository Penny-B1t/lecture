import path from "path";
require("dotenv").config({ path : path.join(__dirname, "../.env") });

const config = {
    MYSQL : {
        User : process.env.User,
        Password : process.env.Password,
        Database : process.env.Database
    }
}

export default config;