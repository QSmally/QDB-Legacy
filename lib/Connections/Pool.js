
"use strict";

const Connection = require("./Connection");
const Colour     = require("chalk");
const FS         = require("fs");

const {Collection, DataStore} = require("qulity");
const Cache = require("../Utility/Cache");


class Pool {

    /**
     * Database Pool -
     * A utility class for managing multilpe database connections.
     * @param {Pathlike} Path The path to the main directory of the databases.
     * @param {?Object} [rawOptions] An object object to pass to each and every database connection.
     */
    constructor (Path, rawOptions = {}) {

        /* Main pool structure. */
        if (FS.existsSync(Path)) {

            if (FS.lstatSync(Path).isFile() && rawOptions.Logging) return process.emit("QDB-Debug", Colour.white("[Pool] ") + Colour.blue("Pool end path was provided a file, not a folder. Function has cancelled."));

            /** Initiate Pool */
            this.Path      = Path;
            this.Datatypes = new Collection();
            this.Databases = new DataStore();
            this.Cache     = new Cache();


            /** Options */
            Object.defineProperty(this, "valOptions", {
                value: {
                    Polling:  rawOptions.Polling || false,
                    Backups:  rawOptions.Backups || false,
                    Interval: rawOptions.Interval || 18000000
                },
                writable: false,
                configurable: false
            });


            /** Iterate through files */
            let Bases = [];

            const BaseOptions = Object.assign({}, {
                Polling:  false,
                Backups:  false,
                Interval: 18000000,
                Graceful: rawOptions.GracefulDisconnect
            });

            FS.readdirSync(this.Path).forEach(File => {
                if (File.split(".").pop() != "json") return Bases.push(false);
                const DBConnection = new Connection(`${this.Path}/${File}`, BaseOptions, this);

                this.Databases.set(File.split(".")[0], DBConnection);
                this.Datatypes.set(File.split(".")[0], DBConnection.Datatype);
                Bases.push(true);
            });

            /** Finalising the constructor */
            if (Bases.filter(b => b == false).length > 0) process.emit("QDB-Debug", Colour.white("[Pool] ") + Colour.blue(`${Bases.filter(b => b == false).length == 1 ? "File" : `${Bases.filter(b => b == false).length} files`} in pool directory is not JSON-formatted. Ignoring the file${Bases.filter(b => b == false).length == 1 ? "" : "s"}.`));
            process.emit("QDB-Debug", Colour.white("[Pool] ") + Colour.green("Successfully connected to pool " + Colour.white(this.Path) + " with " + Colour.white(Bases.filter(b => b == true).length) + " databases."));

        } else {
            process.emit("QDB-Debug", Colour.white("[Pool] ") + Colour.red("Incorrect pathlike provided, function has cancelled."));
            return undefined;
        }

        /** Backup handler */
        if (this.valOptions.Backups && typeof this.valOptions.Interval == "number")
        setInterval(() => {
            const Dest  = `${this.valOptions.Backups}/Backup-${new Date().toISOString()}`;
            const Shell = require("child_process").execSync;
            Shell(`mkdir -p ${Dest}`);
            Shell(`cp -r ${this.Path} ${Dest}`);
        }, this.valOptions.Interval);

        /** Polling handler */
        if (typeof this.valOptions.Polling == "number")
        setInterval(() => this.Databases.tap(Base => Base._Poll()), this.valOptions.Polling);

    }


    /**
     * Selects and returns a a database.
     * @param {String} Base Name of the database in this pool.
     * @returns {Connection}
     */
    Select (Base) { return this.Databases.resolve(Base); }

    /** 
     * Returns the Last Recently Resolved database from this pool.
     * This variable is mostly used as cache, internally from the `Select()` method.
     * @returns {Connection}
     */
    get LRR () { return this.Databases.LRR; }

}

module.exports = Pool;
