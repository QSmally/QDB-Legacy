
// QDB is built from the ground up by QSmally.
// Copyright © 2019 QDB by QSmally, all rights reserved.

// Obviously Node (and all external libraries)
// are not made by myself, they're created by their
// respective owners, all rights are reserved.

// Future included in Qulity (https://qbot.eu/go/qulity).


module.exports = {

    BaseConnection:    require("./lib/Connections/BaseConnection"),
    PartialConnection: require("./lib/Connections/PartialConnection"),
    Connection:        require("./lib/Connections/Connection"),
    Pool:              require("./lib/Connections/Pool"),


    /**
     * Connects to a database.
     * @param {Pathlike} Path Path to the JSON database file.
     * @param {?Object} [valOptions] Optional database settings.
     * @returns {Connection}
     */
    Connect: (Path, valOptions = {}) => new module.exports.Connection(Path, valOptions),

    /**
     * Connects locally to a database.
     * @param {Pathlike} Path Path to the JSON database file for a local connection.
     * @param {Function} Callback Callback with the Connection class.
     * @returns {Connection} Secondary Connection other than the callback.
     */
    Local: (Path, Callback) => Callback(new module.exports.Connection(Path)),


    Collection: require("./lib/Helpers/Collection"),
    Cache:      require("./lib/Helpers/Cache"),
    DataStore:  require("./lib/Helpers/DataStore")

};
