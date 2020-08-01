
# QDB3

JSON Data Mangement

**From this release onwards, we will backport features from v4 and start to migrate to SQL (and JSON support).**

> QDB is a high level data management for storing local JavaScript Objects without corruptions. Connect to multiple JSON files, use connection pooling, edit data directly or use QDB's built-in functions.

# Main Features
* Store in JSON. Easily managable or use QDB's [utility functions](https://qdb.qbot.eu/documentations/functions).
* Create [pools](https://qdb.qbot.eu/documentations/pool) and manage multiple JSON databases.
* Introducing Collection classes from [Discord.js](https://discord.js.org/). (Full rights to them.)
* Extended to [Cache](https://qdb.qbot.eu/documentations/helpers/cache) collections and [DataStore](https://qdb.qbot.eu/documentations/helpers/datastore)s.
* Added [DataManager](https://qdb.qbot.eu/documentations/helpers/manager)s, [Queue](https://qdb.qbot.eu/documentations/helpers/queue)s and [Stacks](https://qdb.qbot.eu/documentations/helpers/stack).

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
    Polling: true // Multi-process access.
});

// Set an object into the 'Users' database.
// Check out utility methods to interact with data in the documentations.
MyDB.Set({User: "Smally", Job: "Software Engineer"});
```

The following example connects to a folder `./Databases/` of database files automatically using a pool.
```js
const QDB = require("qdatabase");
const DBS = new QDB.Pool("./Databases/");

// Fetch the 'User' from the database table.
DBS.Select("Users").Fetch("User");
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

// An ID tracker by the Cache.
// Automatically increments after use.
Cache.set(Cache.id, 872639);

// Utility functions.
Cache.increment(0);   // Increment key '0'.
Cache.decrement(1);   // Decrement key '1'.
Cache.add(2, 5);      // Add 5 to key '2'.
Cache.subtract(3, 5); // Subtract 5 from key '3'.
Cache.multiply(4, 3); // Multiply key '4' with 3.
Cache.divide(5, 3);   // Divide key '5' with 3.

// Additional math operations.
Cache.square(6);    // Square key '6'.
Cache.power(7, 4);  // Key '7' to the power of 4.
Cache.root(8);      // Key '8' to the power of 2.
Cache.exp(9);       // Euler's number ^ key '8'
Cache.absolute(10); // Make key '10' absolute.

// Accumulates a function on the cache key.
Cache.accumulate(4, (Val, Key, Self) => {
    return (Val + 10) * 3; // Adds 10 to key '4', multiplies it by 3.
});
```

### DataStore
##### Extends Collection
Base class that manages the creation, retrieval and deletion of a specific data model with additional methods that could be added.
```js
const DataStore = new QDB.DataStore();

// Set a data model in the DataStore.
// Note - You can only store objects, classes and functions.
DataStore.set("b0ce7d", {
    Name: "Smally",
    Job:  "Software Engineer"
});

// Resolve a data models to be used.
const Model = DataStore.resolve("b0ce7d");

// Last Recently Resolved model gets cached.
// Or resolve a model and, if the cached module is
// the one you want to resolve, that gets returned.
DataStore.LRR;
```

### Manager
##### Implements DataStore
Manages the API methods of DataModels and holds its cache.
```js
const {Manager} = require("qdatabase");

// Create an instance of this class.
class UserManager extends Manager {
    constructor (Client, ...Args) {
        super(...Args);
        this.Client = Client;
    }

    // Returns all the administrators in this Manager.
    get Administrators () {
        return this.Cache.filter(User => User.Administrator);
    }
}

// Create the manager with 'Users' as iterator.
const Users = new UserManager(Client, Users);
Users.Client; // Access your own variables in the Manager.
Users.Cache;  // All 'Users' as DataStore.

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

### Stack
A manager for temporarily storing mass data in sequence.
```js
// Push a datastream onto a Stack for later access.
const Stack = new QDB.Stack(DataStream);

// Seek in the Stack.
Stack.Seek(3);
```

## Bug/Issues/Features
If you have found a bug, want to suggest a feature or need help with QDB, please contact me at Discord with the tag `QSmally#3594`. On the other hand, if you would like to join the server, the invite link can be found [at our site](https://qdb.qbot.eu/discord). You can also subject an issue on the [Github repo](https://github.com/QSmally/QDB-Legacy).

## Contributing
This module is licensed under MIT. Feel free to contribute by forking the repository, or cloning [the master branch](https://github.com/QSmally/QDB-Legacy#master) for in-progress features.
