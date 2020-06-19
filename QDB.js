
/*
    QDB is built from the ground up by QSmally.
    QDB © 2020 by QSmally, all rights reserved.

    Obviously Node (and all external libraries)
    are not made by myself, they're created by their
    respective owners, all rights are reserved.

    Future included in Qulity (https://qbot.eu/go/qulity).
*/


module.exports = {

    // Database
    BaseConnection:    require("./lib/Connections/BaseConnection"),
    PartialConnection: require("./lib/Connections/PartialConnection"),
    Connection:        require("./lib/Connections/Connection"),
    Pool:              require("./lib/Connections/Pool"),

    // Helpers
    Collection: require("./lib/Helpers/Collection"),
    Cache:      require("./lib/Helpers/Cache"),
    DataStore:  require("./lib/Helpers/DataStore"),
    Manager:    require("./lib/Helpers/Manager"),

    // Utilities
    Queue: require("./lib/Utility/Queue"),
    Stack: require("./lib/Utility/Stack")

};
