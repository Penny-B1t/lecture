const container = require("typedi").Container;

const setting = require("../config/config");
const MySQLRepository = require("../repository/MySQLrepository");

container.set("setting", setting);
container.set("MySQLRepository", new MySQLRepository(container));

module.exports = container;
