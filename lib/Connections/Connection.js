
"use strict";

const BaseCon = require("./BaseConnection");
const Colour  = require("chalk");
const FS      = require("fs");
const SS      = require("string-similarity");

class Connection extends BaseCon {

    /**
     * Database Connection -
     * Initiates a constant connection to a database.
     * @param {Pathlike} PathURL The path to the database file.
     * @param {?Object} [rawOptions] Options for the database.
     * @param {?Pool} [Pool] When connection is being used in a pool.
     * @extends {BaseConnection}
     */
    constructor (PathURL, rawOptions = {}, Pool = undefined) {

        /* Main database structure. */
        if (FS.existsSync(PathURL)) {

            super();

            /** Options. */
            Object.defineProperty(this, "valOptions", {
                value: {
                    Polling:  rawOptions.Polling || false,
                    Backups:  rawOptions.Backups || false,
                    Interval: rawOptions.Interval || 18000000,
                    Graceful: rawOptions.GracefulDisconnect || false
                },
                writable: false,
                configurable: false
            });

            this.Path  = PathURL;
            this.State = "CONNECTED";
            this.Cache.clear();

            process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.green("Successfully connected to database " + Colour.white(PathURL) + "."));

        } else {
            process.emit("QDB-Debug", Colour.white(`[Manager] [${PathURL}]`) + Colour.blue("Incorrect pathlike provided, redirecting to partially connected class."));
            const PartialCon = require("./PartialConnection");
            return new PartialCon();
        }


        /** Cached database property */
        Object.defineProperty(this, "Database", {value: JSON.parse(FS.readFileSync(PathURL)), writable: true});
        /** Returns the size of the database */
        this.Datalength = (Object.keys(this.Database) || this.Database).length;
        /** The instance of the database. */
        this.Datatype = this.Database instanceof Array ? "Array" : "Object";
        /** Database Pool, if any */
        this.Pool = Pool || null;


        /** Backup handler */
        if (typeof this.valOptions.Backups == "string" && typeof this.valOptions.Interval == "number")
        setInterval(() => {
            const BackupURL = `${this.valOptions.Backups}/${require("path").basename(PathURL).split(".")[0]}-${new Date().toISOString()}.json`;
            this._Backup(BackupURL);
            process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.green("Created a backup of database " + Colour.white(PathURL) + " as " + Colour.white(BackupURL)));
        }, this.valOptions.Interval);

        /** Polling handler */
        if (typeof this.valOptions.Polling == "number")
        setInterval(() => this._Poll(), this.valOptions.Polling);

        /** Automatic graceful disconnection */
        if (this.valOptions.Graceful && State == "CONNECTED") process.on("beforeExit", () => this.Disconnect());

    }


    /**
     * Disconnects from the database and allows you to gracefully exit the program.
     * @returns {PartialCon}
     */
    Disconnect () {
        process.emit("QDB-Debug", Colour.white("[Manager] ") + Colour.green("Disconnected from database " + Colour.white(this.Path) + "."));
        this.State = "DISCONNECTED";

        const PartialCon = require("./PartialConnection");
        return new PartialCon();
    }


    // ------------------------------------------------------------------------ Private functions.

    /** @private */ _BaseWrite ()       {FS.writeFileSync(this.Path, JSON.stringify(this.Database, null, 4))}
    /** @private */ _BaseSet (Key, Obj) {(Key ? this.Database[Key] = Obj : this.Database = Obj); return this._BaseWrite()}
    /** @private */ _Backup (Path)      {FS.copyFileSync(this.Path, Path)}
    /** @private */ _Poll ()            {Object.defineProperty(this, "Database", {value: JSON.parse(FS.readFileSync(this.Path)), writable: true})}

    /** @private */
    _CastPath (Obj, Pathlike, {Item = undefined, Erase = false, Push = false} = {}) {
        Pathlike = Pathlike.replace("[", ".").replace("]", "").split(".");
        Pathlike.forEach(p => p = p.replace(/[\[\]]/g, "") === "" ? Pathlike.splice(p, 1) : "");

        const Original = Obj;
        const LastKey  = Pathlike.pop();

        for (var i = 0, l = Pathlike.length; i < l; i++) {
            if (typeof Obj != "object") return {Result: undefined, Path: Pathlike, Last: LastKey};
            if (!Item && typeof Obj == "object" && !(Pathlike[i] in Obj)) return {Result: undefined, Path: Pathlike, Last: LastKey};
            if (typeof Obj == "object" && !(Pathlike[i] in Obj)) Obj[Pathlike[i]] = {};
            Obj = Obj[Pathlike[i]];
        }

        if (typeof Item !== "undefined") {
            if (Erase) {
                if (Obj instanceof Array)
                Obj.splice(Obj.indexOf(Item), 1);
                else delete Obj[LastKey]
            } else {
                if (Obj[LastKey] instanceof Array && Push) Obj[LastKey].push(Item);
                else typeof Obj == "object" ? Obj[LastKey] = Item : Obj = Item;
            }
            return {Result: Original, Relative: Obj, Path: Pathlike, Last: LastKey};
        } else {
            if (Erase) return Obj instanceof Array ? Obj.splice(LastKey, 1) : delete Obj[LastKey];
            else return {Result: Obj[LastKey], Original: Original, Path: Pathlike, Last: LastKey};
        }
    }


    // ------------------------------------------------------------------------ Database functions.
    // Main manager functions.

    /**
     * Manages the elements of the database.
     * @param {*} [Key] Key to specify on what table to set the element at. If none, the DBObject is the new database instance itself.
     * @param {*} DBObject Data to set into the database at the key.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {*} Returns the set object.
     */
    Set (Key, DBObject, Path = null) {
        if (![null, undefined].includes(Path)) this._BaseSet(null, this._CastPath(this.Database, `${Key}.${Path}`, {Item: DBObject}).Result);
        else {
            if (Key && !DBObject) DBObject = Key, Key = undefined;
            this._BaseSet(Key, DBObject);
        }

        return DBObject;
    }

    Get (Key, Path = null) {
        console.warn(Colour.white("Deprecation Warning") + Colour.red("`Con#Get()` is deprecated, use `Con#Fetch()` instead."));
        return this.Fetch(Key, Path);
    }

    /**
     * Manages the retrieval of the database.
     * @param {*} Key Key to specify retrieval of a table. If none, QDB will return the entire database itself. You may use the first argument to also refer to the main database model for properties, such as `[].length`.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {*} The database, table, or specific element or property when using dotaccess.
     */
    Fetch (Key, Path = null) {
        if (Key === undefined) return this.Database;
        if (![null, undefined].includes(Path)) return this._CastPath(this.Database, `${Key}.${Path}`).Result;
        else return this.Database[Key];
    }

    // Utility functions.

    /**
     * Inserts a unique data model into the database.
     * @param {*} [Key] Context key to specify under what key the data should be inserted as. If none, QDB will try to push the DBObject to the origin instead.
     * @param {*} DBObject Data to set or push into the database.
     * @returns {*|null} Returns a nill value when the key is not unique and will not overwrite, otherwise, QDB inserts the data model and returns it.
     */
    Append (Key, DBObject) {
        if (!DBObject) {
            if (this.Database instanceof Array) {
                if (this.Database.includes(Key)) return null;
                else this.Database.push(Key);
            } else this.Database["Cache"] = Key;

            this._BaseWrite();
            return Key;
        } else {
            if (typeof this.Database[Key] !== "undefined" || (Key && DBObject && this.Database instanceof Array)) return null;
            this._BaseSet(Key, DBObject);
            return DBObject;
        }
    }

    /**
     * Pushes a new data model into the database.
     * @param {*} DBObject Data to insert into the database.
     * @returns {*} Returns the inserted model.
     */
    Insert (DBObject) {
        if (this.Database instanceof Array) {
            this.Database.push(DBObject);
            this._BaseWrite();
            return DBObject;
        } else {
            return null; // Can't insert in non-array environment.
        }
    }

    /**
     * Pushes a new data model into the database.
     * @param {*} DBObject Data to push into the database.
     * @param {?Dotaccess} [Path] Optional dotaccess path. If not specified, this behaves as `DB.Insert();`.
     * @returns {*} Returns the inserted model.
     */
    Push (DBObject, Path = null) {
        if (![null, undefined].includes(Path)) {
            if (!(this._CastPath(this.Database, Path).Result instanceof Array)) return null;
            this._BaseSet(null, this._CastPath(this.Database, Path, {Item: DBObject, Push: true}).Result);
            return DBObject;
        } else {
            return this.Insert(DBObject); // Behaves like `Connection.Insert();`.
        }
    }

    /**
     * Edits an element of the database.
     * @param {*} Key Key to specify what element to edit.
     * @param {*} DBObject Data to replace the element with.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {*|null} Returns a nill value when the key doesn't exist and will not edit the element, otherwise, QDB updates the element and returns it.
     */
    Update (Key, DBObject, Path = null) {
        if (this.Database instanceof Array && (this.Database.includes(Key) || typeof this.Database[Key !== "undefined"])) {
            if (![null, undefined].includes(Path)) this.Database = this._CastPath(this.Database, `${Key}.${Path}`, {Item: DBObject}).Result;
            else this.Database[typeof Key == "number" ? Key : this.Database.indexOf(Key)] = DBObject;
        } else if (!(this.Database instanceof Array) && this.Database[Key] !== "undefined") {
            if (![null, undefined].includes(Path)) this.Database = this._CastPath(this.Database, `${Key}.${Path}`, {Item: DBObject}).Result;
            else this.Database[Key] = DBObject;
        } else {
            return null;
        }

        this._BaseWrite();
        return DBObject;
    }

    /**
     * Finds a table in the database and edits it with a callback.
     * @param {Function} cfn Function used to test with (should return a boolean).
     * @param {Function} efn Callback edit function, that has to return the new value of the found element.
     * @returns {*|null} Returns a nill value when the tester function doesn't match, otherwise returns the old element.
     */
    Edit (cfn, efn) {
        for (const Key in this.Database) {
            if (cfn(this.Database[Key], Key, this)) {
                const Prev = this.Database[Key];
                this._BaseSet(Key, efn(this.Database[Key], Key, this));
                return Prev;
            }
        }

        return undefined;
    }

    /**
     * Uses a callback to provide the database and the returned value is the new database instance.
     * @param {Function} efn Callback edit function, that has to return the new value of the database.
     * @returns {*} Returns the new database instance.
     */
    Modify (efn) {
        this.Database = efn(this.Database, this.Cache);
        this._BaseWrite();
        return this.Database;
    }

    /**
     * Ensures a value being there. This behaves as `if (!DB.includes(Element)) DB.push(Element);` or `if (!DB[Key]) DB[Key] = Element;` in context.
     * @param {*} Key Context key to see if a table exists.
     * @param {*} DBObject Data to insert if that specific element does not exist.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {Boolean} Returns whether or not the element was inserted. If true was returned, the element was not there.
     */
    Ensure (Key, DBObject, Path = null) {
        if (![null, undefined].includes(Path)) {
            const Result = this._CastPath(this.Database, `${Key}.${Path}`).Result;
            if (typeof Result == "undefined") {
                this.Database = this._CastPath(this.Database, `${Key}.${Path}`, {
                    Item: DBObject,
                    Push: Result instanceof Array
                }).Result;
            } else {
                return false;
            }
        } else {
            if (this.Database instanceof Array) {
                if (!DBObject) DBObject = Key, Key = undefined;
                if (Key && typeof this.Database[Key] === "undefined") this.Database[Key] = DBObject;
                else if (!Key && !this.Database.includes(DBObject))   this.Database.push(DBObject);
                else return false;
            } else {
                if (typeof this.Database[Key] == "undefined")
                this.Database[Key] = DBObject ? DBObject : Key;
                else return false;
            }
        }

        this._BaseWrite();
        return true;
    }

    /**
     * Inverts the boolean value on the given path.
     * @param {Dotaccess} Path Key or a dotaccess path to the value to invert.
     * @returns {Boolean} The new value of the entry.
     */
    Invert (Path) {
        if ([null, undefined].includes(Path)) return null;

        const Result = this._CastPath(this.Database, Path).Result;
        if (typeof Result == "undefined") return undefined;
        if (typeof Result !== "boolean")  return null;

        if (Path.split(".").length > 1) {
            this.Database = this._CastPath(this.Database, Path, {
                Item: !Result
            }).Result;
        } else {
            this.Database[Path] = !Result;
        }

        this._BaseWrite();
        return !Result;
    }


    // Lookup functions.

    /**
     * Searches the given path if an element exists.
     * @param {*} Key Key to specify what to search for.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {Boolean} A boolean value, either `true` or `false`.
     */
    Exists (Key, Path = null) {
        if (![null, undefined].includes(Path) && typeof this._CastPath(this.Database, `${Key}.${Path}`).Result !== "undefined") return true;
        else if ([null, undefined].includes(Path) && (this.Database[Key] || (this.Database instanceof Array && this.Database.includes(Key)))) return true;
        else return false;
    }

    /**
     * Searches the given path if an element exists.
     * Similar to `DB.Exists();`, but returns the value if it exists, else an empty object instead of a nill value.
     * @param {*} Key Key to specify what to search for.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @returns {*|Object} If it exists, returns that value, otherwise an empty object.
     */
    Has (Key, Path = null) {
        let Result = undefined;

        if ([null, undefined].includes(Path)) Result = this.Database[Key] || (this.Database instanceof Array ? this.Database.find(e => e == Key) : undefined);
        else Result = this._CastPath(this.Database, `${Key}.${Path}`).Result;

        if (typeof Result === "undefined")
        return {}; else return Result;
    }

    /**
     * Similar to `DB.Exists();`, but expects a value. If the value doesn't match, it automatically returns a `false` boolean.
     * @param {*} Key Context key to refer to a table.
     * @param {*} Value Value to see if the key element has this specific value. If not, QDB will return a false boolean.
     * @param {?Dotaccess} [Path] Optional dotaccess path.
     * @param {Boolean} [Overwrite] Overwrite the value regardless. If set, this behaves as a constant `DB.Set();`.
     * @returns {Boolean} Whether or not the expected value was there.
     */
    Expect (Key, Value, Path = null, Overwrite = false) {
        let isExist = false;

        if (typeof Value !== "undefined") {
            if (![null, undefined].includes(Path) && this._CastPath(this.Database, `${Key}.${Path}`).Result == Value) isExist = true;
            else if ([null, undefined].includes(Path) && this.Database[Key] == Value) isExist = true;
        }

        if (Overwrite) this.Set(Key, Value, Path);
        return isExist;
    }

    /**
     * Performs a function on an item. Similar to `DB.Edit();`, but finds an element first.
     * @param {String|Dotaccess} Path The key of the value to execute on, can be a dotaccess path.
     * @param {Function} fn Function to execute on the item.
     * @returns {*} The new vaule of the element.
     */
    Accumulate (Path, fn) {
        this.Database = this._CastPath(this.Database, Path, {Item: fn(
            this._CastPath(this.Database, Path).Result,
            this.Database,
            this.Cache
        )}).Result;

        this._BaseWrite();
        return this._CastPath(this.Database, Path).Result;
    }


    // Cleaner functions.

    /**
     * Clears the entire database.
     * **WARNING** Sets the database immediately to an empty object.
     * @returns {undefined}
     */
    Destroy () {
        this.Set({});
        return this.Database;
    }

    /**
     * Sweeps elements from an array or object. If the element passes the tester function, it will be removed from the database.
     * @param {Function} cfn Function used to test with. (Should return a boolean.) (If true, QDB will sweep the element.)
     * @param {?Dotaccess} [Path] Optional dotaccess path. Without it, QDB refers to the main database object or array.
     * @returns {Number} Amount of elements swept from the database.
     */
    Sweep (cfn, Path = null) {
        const Target = ![null, undefined].includes(Path) ? this._CastPath(this.Database, Path).Result : this.Database;
        let IdxArray = [], Swept = 0;

        for (const Key in Target) {
            if (cfn(Target[Key], Key, this.Database, this.Cache)) {
                if (Target instanceof Array) IdxArray.push(Key);
                else delete Target[Key];
                Swept++;
            }
        }

        if (Target instanceof Array) IdxArray.forEach(Id => Target.splice(Target.indexOf(Id), 1));
        this.Database = ![null, undefined].includes(Path) ? this._CastPath(this.Database, Path, {Item: Target}) : Target;
        this._BaseWrite();

        return Swept;
    }

    /**
     * Manages the deletion of the database.
     * @param {*} Key Key to specify what table to delete.
     * @param {?Dotaccess} [Path] Optional dotaccess path or just a key.
     * @returns {undefined}
     */
    Delete (Key, Path = null) {
        if (![null, undefined].includes(Path)) this._CastPath(this.Database, `${Key}.${Path}`, {Erase: true});
        else this.Database instanceof Array ? (this.Database[Key] || this.Database.includes(Key) ? this.Database.splice(this.Database[Key] ? Key : this.Database.indexOf(Key), 1) : null) : delete this.Database[Key];
        this._BaseWrite();
    }


    // Secondary functions.

    /**
     * Essentially a `DB.Fetch();`, but makes a callback instead.
     * @param {?Dotaccess} [Path] Optional dotaccess path. Without it, QDB refers to the main database object.
     * @param {Function} Ret Returns the value of the path.
     * @returns {undefined}
     */
    Return (Path, Ret) {
        if (!Ret) Ret = Path, Path = undefined
        if (typeof Ret !== "function") return undefined;
        Ret(![null, undefined].includes(Path) ? this.Fetch(Path.split(".")[0], Path.split(".").slice(1).join(".") || null) : this.Database);
    }

    /**
     * Iterates through an array or object. No changes are recorded on the database instance.
     * @param {?Dotaccess} [Path] Optional dotaccess path. Without it, QDB refers to the main database object.
     * @param {Function} Ret Function containing the value of the array or object it's iterating through.
     * @returns {undefined}
     */
    Each (Path, Ret) {
        if (!Ret) Ret = Path, Path = undefined;
        if (typeof Ret !== "function") return undefined;

        const Target = ![null, undefined].includes(Path) ? this.Fetch(Path.split(".")[0], Path.split(".").slice(1).join(".") || null) : this.Database;
        for (const Key in Target) Ret(Target[Key], Key, Target);
    }

    /**
     * Filter elements in the database and returns it. Database is not affected at all.
     * @param {?Dotaccess} [Path] Optional dotaccess path or just a key. Can be used to locate an array. Without it, QDB refers to the main database object.
     * @param {Function} cfn Function used to test with. (Should return a boolean.) (If true, QDB will filter it.)
     * @returns {Array} Array with the new elements that passed the test.
     */
    Filter (Path, cfn) {
        if (!cfn) cfn = Path, Path = undefined;
        if (typeof cfn !== "function") return undefined;

        const Target = ![null, undefined].includes(Path) ? this._CastPath(this.Database, Path).Result : this.Database;
        let Results = [];

        for (const Key in Target) if (cfn(Target[Key], Key, this.Database)) Results.push(Target[Key]);
        return Results;
    }

    /**
     * Search through an array in the database and get returned results.
     * @param {*} SearchTerm The term to search for in the database.
     * @param {Options.?Dotaccess} Path Optional dotaccess path pointing towards the array.
     * @param {Options.?String|Number} Target Optional dotaccess path pointing towards the entry to search for.
     * @param {Options.?Number} Amount The amount of results to return. Default is unlimited (nill-value).
     * @param {Options.?Case} Boolean Whether the search should be case sensitive.
     * @returns {Array} Array of values found, with `Result`, `Rating` and `Path` as extra values of this Array.
     */
    Search (SearchTerm, Options = {Path: null, Target: null, Amount: null, Case: false}) {

        let Context = this.Database;

        if (Options.Path && typeof Options.Path == "string")     Context = this._CastPath(Context, Options.Path).Result;
        if (!(Context instanceof Array) && !Options.Target)      Context = Object.keys(Context);
        if (Options.Target && typeof Options.Target == "string") Context = Context.map(a => this._CastPath(a, Options.Target).Result);

        if (Options.Case) {
            SearchTerm = SearchTerm.toLowerCase();
            Context = Context.map(a => a.toLowerCase());
        }

        const Search = SS.findBestMatch(SearchTerm, Context);
        const Casted = this._CastPath(this.Database, Options.Path || ".");

        Context = Search.ratings.map(Dir => {
            return {
                Root:     Casted.Result,
                Path:     [...Casted.Path, Casted.Last],
                Target:   Options.Target || null,
                Object:   Casted.Last,
                Target:   Dir.target,
                Rating:   Dir.rating * 100
            };
        });

        if (Options.Amount &&
            typeof Options.Amount == "number" &&
            Options.Amount > 0) Context.splice(0, Options.Amount + 1);

        Context.Result = Search.bestMatch.target;
        Context.Rating = Search.bestMatch.rating * 100;
        Context.Path   = [...Casted.Path, Casted.Last];
        Context.Path.Target = Options.Target;

        return Context;

    }

    /**
     * Finds an element in the given, optional path.
     * @param {?Dotaccess} [Path] Optional dotaccess path or just a key. Can be used to locate the root object or array. If none, QDB refers to the main database object.
     * @param {Function} cfn Function used to test with. (Should return a boolean.) (If true, QDB will filter it out.)
     * @returns {*} The found element of this search.
     */
    Find (Path, cfn) {
        if (!cfn) cfn= Path, Path = undefined;
        if (typeof cfn !== "function") return undefined;

        const Target = ![null, undefined].includes(Path) ? this._CastPath(this.Database, Path).Result : this.Database;
        for (const Key in Target) if (cfn(Target[Key], Key, this)) return Target[Key];
        
        return undefined;
    }

}

module.exports = Connection;
