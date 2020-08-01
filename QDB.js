
/*
    QDB is built from the ground up by QSmally.
    QDB © 2020 by QSmally, all rights reserved.

    Obviously Node (and all external libraries)
    are not made by myself, they're created by their
    respective owners, all rights are reserved.

    Future included in Qulity (https://qbot.eu/go/qulity).
*/


const Qulity = require("qulity");

module.exports = {

    // Database
    BaseConnection:    require("./lib/Connections/BaseConnection"),
    PartialConnection: require("./lib/Connections/PartialConnection"),
    Connection:        require("./lib/Connections/Connection"),
    Pool:              require("./lib/Connections/Pool"),

    // Supported utilities
    ...Qulity,

    // Extended utilities
    Cache: require("./lib/Utility/Cache"),
    Stack: require("./lib/Utility/Stack")

};
