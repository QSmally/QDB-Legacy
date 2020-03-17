
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
     * Evaluates code with `this` being the class.
     * @param {String} Expr Expression code to be executed.
     * @returns Return value of the eval method.
     */
    async Eval (Expr) {
        return await eval(Expr);
    }

    /**
     * Reconnects to a different file and state under this class instance.
     * @param {Pathlike} PathURL The URL to the new database file.
     * @returns {Connection} A new connection to the database.
     */
    Reconnect (PathURL) {
        if (!FS.existsSync(PathURL)) {
            process.emit("QDB-Debug", Colour.white("[Database] ") + Colour.red("Invalid path to database file. Refusing connection."));
            return this;
        } else {
            process.emit("QDB-Debug", Colour.white("[Database] ") + Colour.green("Reconnecting to database " + Colour.white(PathURL) + "..."));
            const Connection = require("./Connection");
            return new Connection(PathURL);
        }
    }

}

module.exports = BaseConnection;
