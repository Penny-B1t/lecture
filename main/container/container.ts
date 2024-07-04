const container = require("typedi").Container;
import "reflect-metadata";

const setting = require("../config/config");
const MySQLRepository = require("../repository/MySQLrepository");

container.set("setting", setting);
container.set("Repository", new MySQLRepository(container));

module.exports = container;
