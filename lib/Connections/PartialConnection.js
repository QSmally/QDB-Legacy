
"use strict";

const BaseCon    = require("./BaseConnection");
const Connection = require("./Connection");

const Colour  = require("chalk");
const FS      = require("fs");
const Session = Math.random()
.toString(36).substring(7);

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

        this.Cache.set("Connection", "close");
        this.Cache.set("Database", null);
        this.Cache.set("Session-id", Session);

        process.emit("QDB-Debug", Colour.white("[Database] ") + Colour.blue("Connected to idle database."));

    }


    /**
     * Tries to reconnect to a database.
     * @param {Pathlike} PathURL The path to the database file.
     * @param {?Object} Options Optiosn for the new connection.
     * @returns {Connection} The new database connection upon pass.
     */
    Resume (PathURL, Options = {}) {
        if (!FS.existsSync(PathURL)) {
            process.emit("QDB-Debug", Colour.white("[Database] ") + Colour.red("Unable to connect to " + Colour.white(PathURL) + ". Resuming connection to partial database."));
            return this;
        } else {
            this.State = "RECONNECTING";
            return new Connection(PathURL, Options);
        }
    }

}

module.exports = PartialConnection;
