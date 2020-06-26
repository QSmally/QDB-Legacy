
"use strict";

const BaseCon    = require("./BaseConnection");
const Connection = require("./Connection");

const Colour  = require("chalk");
const FS      = require("fs");

class PartialConnection extends BaseCon {

    /**
     * Partial Connection -
     * Initiates an idle connection.
     * @extends {BaseConnection}
     */
    constructor () {

        super();

        this.Path  = null;
        this.State = "PARTIAL";
        this.Cache.clear();

        process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.blue("Connected to idle database."));

    }


    /**
     * Tries to reconnect to a database.
     * @param {Pathlike} PathURL The path to the database file.
     * @param {?Object} Options Optiosn for the new connection.
     * @returns {Connection} The new database connection upon pass.
     */
    Resume (PathURL, Options = {}) {
        if (!FS.existsSync(PathURL)) {
            process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.red("Unable to connect to " + Colour.white(PathURL) + ". Resuming connection to partial database."));
            return this;
        } else {
            this.State = "RECONNECTING";
            return new Connection(PathURL, Options);
        }
    }

}

module.exports = PartialConnection;
