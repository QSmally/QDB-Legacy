
"use strict";

const Cache  = require("../Helpers/Cache");
const Colour = require("chalk");
const FS     = require("fs");

class BaseConnection {

    /**
     * Base Connection -
     * The base class of a connection.
     */
    constructor () {

        this.Path  = null;
        this.Cache = new Cache();
        this.State = "BASE";

    }


    /**
     * Reconnects to a different file and state under this class instance.
     * @param {Pathlike} PathURL The URL to the new database file.
     * @returns {Connection} A new connection to the database.
     */
    Reconnect (PathURL) {
        if (!FS.existsSync(PathURL)) {
            process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.red("Invalid path to database file. Refusing connection."));
            return this;
        } else {
            process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.green("Reconnecting to database " + Colour.white(PathURL) + "..."));
            this.State = "RECONNECTING";

            const Connection = require("./Connection");
            return new Connection(PathURL);
        }
    }

}

module.exports = BaseConnection;
