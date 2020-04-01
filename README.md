
# QDB3

JSON wrapper data mangement package for Node.js

> QDB is a high level data management package which you can import for storing local JavaScript Objects without corruptions. You may connect to multiple JSON files, apart or in a pool, edit data directly or use built-in functions, use polling for multi-process data access and create backups of your databases. Our library can withdraw corruptions and allows for a wide diversity of data transfer.

# Main Features
* Store in JSON. Withdraw corruptions.
* Easily managable or use QDB's [utility functions](https://qdb.qbot.eu/documentations/functions).
* Create [pools](https://qdb.qbot.eu/documentations/pool) and manage multiple JSON files.
* Introducing collection classes from [Discord.js](https://discord.js.org/). (Full rights to them.)
* Extended to [Cache](https://qdb.qbot.eu/documentations/helpers/cache) collections and [DataStore](https://qdb.qbot.eu/documentations/helpers/datastore)s.
* Added [DataManager](https://qdb.qbot.eu/documentations/helpers/manager)s and [Queue](https://qdb.qbot.eu/documentations/helpers/queue)s.

## Links
* [Website](https://qdb.qbot.eu)
* [Documentations](https://qdb.qbot.eu/docs)
* [Discord Server](https://qdb.qbot.eu/discord)

## Main Import
`npm install qdatabase`
```js
const QDB  = require("qdatabase");
const MyDB = new QDB.Connection("./Data/Databases.json");
// ...
```

# Database Usage

The below example allows for debug logging, connects to a database `./Databases/Users.json` and sets an object in the database.
```js
// A debug logger for QDB.
process.on("QDB-Debug", n => console.log(n));
const QDB = require("qdatabase");

const MyDB = new QDB.Connection("./Databases/Users.json", {
    Polling: true // Multi-process access
});

// Set an object into the 'Users' database.
// Check out utility methods to interact with data in the documentations.
MyDB.Set({User: "Smally", Job: "Software Engineer"});
```

The following example connects to a folder `./Databases` of database files automatically using a pool.
```js
const QDB = require("qdatabase");
const DBS = new QDB.Pool("./Databases");

// Get the 'User' from the database table.
DBS.Select("Users").Get("User");
// -> "Smally"

// Append "Full-Stack Developer" to the 'Jobs' database,
// assuming the origin is an array of jobs.
DBS.Select("Jobs").Append("Full-Stack Developer");
```

# Utility Usage

### Collections
##### Modified From Discord.js
An extended JavaScript Map with additional utility methods. Optimised rather than arrays.
```js
const QDB = require("qdatabase");
const Collection = new QDB.Collection();
```

### Cache
##### Extends Collection
A Collection with extended custom caching features.
```js
const Cache = new QDB.Cache();

// An integer that is free to use within this Cache Collection.
Cache.Accumulator;

// An ID tracker by the Cache.
// Automatically increments after use.
Cache.set(Cache.id, {});

// Utility functions.
Cache.increment(0);   // Increment key '0'.
Cache.decrement(1);   // Decrement key '1'.
Cache.add(2, 5);      // Add 5 to key '2'.
Cache.subtract(3, 5); // Subtract 5 from key '3'.

// Accumulates a function on the cache key.
Cache.accumulate(4, (Val, Key, Self) => {
    return Val + 10; // Adds 10 to key '4'.
});
```

### DataStore
##### Extends Collection
Base class that manages the creation, retrieval and deletion of a specific data model with additional methods that could be added.
```js
const DataStore = new QDB.DataStore();

// Set a data model in the DataStore.
// Note - You can only store objects.
DataStore.set("Users", {
    List: ["Smally"],
    Jobs: []
});

// Resolve a data models to be used.
const Model = DataStore.resolve("Users");

// Last Recently Resolved model gets cached.
// Or resolve a model and, if the cached module is
// the one you want to resolve, that gets returned.
DataStore.LRR;
```

### Manager
##### Implements DataStore
Manages the API methods of DataModels and holds its cache.
```js
const BaseManager = new QDB.Manager();

// Create an instance of this class.
class UserManager extends BaseManager {
    constructor (Client, ...Args) {
        super(...Args);
        this.Client = Client;
    }

    // Returns all the administrators in this Manager 
    get Administrators () {
        return this.Cache.filter(User => User.Administrator);
    }
}

// Create the manager with 'Users' as iterator.
const Users = new UserManager(Client, Users);
Users.Cache; // All 'Users' as DataStore.

// Automatically get the administrators from this Manager.
const Admins = Users.Administrators;
```

### Queue
A manager for ordening values and iterating over them.
```js
const Queue = new QDB.Queue(Shards);

// Iterate over the Queue items.
Shards = Queue.Iterate(async (Shard, Cache) => {
    // Logs into the shard and caches it.
    await Shard.Login(Cache._Token);
    Cache.set(Shard._Id, Shard);
}, BaseCache);
```

## Bug/Issues/Features
If you have found a bug, want to suggest a feature or need help with QDB, please contact me at Discord with the tag `QSmally#3594`. On the other hand, if you would like to join the server, the invite link can be found [at our site](https://qdb.qbot.eu/discord). You can also subject an issue on the [Github repo](https://github.com/QSmally/qdb).
