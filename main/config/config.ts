import path from "path";
require("dotenv").config({ path : path.join(__dirname, "../.env") });

const config = {
    MYSQL : {
        User : process.env.USER,
        Password : process.env.PASSWORD,
        Database : process.env.DATABASE
    }
}

export default config;