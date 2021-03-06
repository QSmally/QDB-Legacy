
/* Import QDB */
const QDB = require("../QDB");

/* Creation of base classes */
console.debug("Collection instance - ", new QDB.Collection());
console.debug("BaseConnection instance - ", new QDB.BaseConnection());
console.debug("PartialConnection instance - ", new QDB.PartialConnection());

/* Creation and retrieval of all classes */
const DB  = new QDB.Connection("./Test/Database.json");
const DBS = new QDB.Pool("./Test/");
const CC  = new QDB.Cache();
const DS  = new QDB.DataStore();

console.log("Connection instance - ", DB);
console.log("Pool connection instance - ", DBS);
console.log("Cache instance - ", CC);
console.log("DataStore instance - ", DS);

/* Clear database */
DB.Destroy();
console.log("Cleared initial database - ");



/* Base Connection */
const {BaseConnection} = require("../QDB");
class MyConnection extends BaseConnection {
    constructor (Path) {
        super();
        this.Path = Path;
        this.File = require(this.Path);
    }
}

const MyCon = new MyConnection("./Database.json");
console.log("Created custom extended Base - ", MyCon);



/* Connection */
// Connection#Set
DB.Set({foo: {bar: "roo"}, doo: false});
DB.Set("too", {loo: "boo!"});
DB.Set("too", "moo", "zoo");

console.log("Set various objects in database - ", DB.Database);


// Connection#Fetch
console.log("Fetched object - ", DB.Fetch("too"));
console.log("Fetched with Dotaccess - ", DB.Fetch("foo", "bar"));
console.log("Got property with Dotaccess - ", DB.Fetch("foo", "bar.length"));

console.log(DB.Fetch());


// Connection#ToInstance
console.log("ToInstance - ", DB.ToInstance(QDB.Collection));
console.log("ToCache - ", DB.ToCache("too"));
console.log("ToDataStore - ", DB.ToDataStore());
console.log("ToIntegratedManager - ", DB.ToIntegratedManager(null, class Foo {}));


// Connection#Append
console.log("Appending object without context key - ", DB.Append({example: "roo"}));
console.log("Adding object with taken key - ", DB.Append("foo", {roo: "bar"}));
console.log("Adding unique context key object - ", DB.Append("bar", {roo: "foo"}));

console.log(DB.Fetch());


// Connection#Insert
console.log("Can't insert on object - ", DB.Insert("roo"));
console.log("Setting database to array - ", DB.Set([]));
console.log("Can insert object 'foo' - ", DB.Insert({foo: "bar"}));

console.log(DB.Fetch());


// Connection#Push
console.log("Pushing value in database - ", DB.Push("Hello World!"));
console.log("Setting database to object - ", DB.Set({foo: []}));
console.log("Pushing value in 'foo' - ", DB.Push("bar", "foo"));

console.log(DB.Fetch());


// Connection#Update
console.log("Updating unknown pair - ", DB.Update("roo", "doo"));
console.log("Updating actual pair - ", DB.Update("foo", {bar: "roo", doo: "boo"}));
console.log("Updating pair using Dotaccess - ", DB.Update("foo", "goo", "doo"));

console.log(DB.Fetch());


// Connection#Edit
console.log("Editing unknown pair - ", DB.Edit((v, k) => k == "doo", (v, k) => "Hello World!"));
console.log("Editing actual pair - ", DB.Edit((v, k) => k == "roo", (v, k) => "boo!"));

console.log(DB.Fetch());


// Connection#Modify
console.log("Modifying the database - ", DB.Modify((d, c) => {
    d.foo = {name: "Smally", enabled: true};
    d.something = false;
    return d;
}));

console.log(DB.Fetch());


// Connection#Ensure
console.log("Ensuring a known key - ", DB.Ensure("foo", {name: "Secondary Smally"}));
console.log("Ensuring an unknown key - ", DB.Ensure("goo", {name: "Actual Smally"}));
console.log("Ensuring a known Dotaccess key - ", DB.Ensure("foo", "Hello World!", "name"));
console.log("Ensuring an unknown Dotaccess key - ", DB.Ensure("foo", "Smally's Address", "address"));

console.log(DB.Fetch());


// Connection#Invert
console.log("Inverting nothing - ", DB.Invert());
console.log("Inverting an unknown value - ", DB.Invert("bleh"));
console.log("Inverting an actual pair - ", DB.Invert("something"));
console.log("Inverting a Dotaccess pair - ", DB.Invert("foo.enabled"));

console.log(DB.Fetch());


// Connection#Exists
console.log("Seeing if nothing exists - ", DB.Exists("nothing"));
console.log("Seeing if key exists - ", DB.Exists("roo"));
console.log("Seeing if Dotaccess exists - ", DB.Exists("foo", "name"));
console.log("Seeing if boolean exists - ", DB.Exists("foo", "enabled"));


// Connection#Has
console.log("Has undefined - ", DB.Has("nothing"));
console.log("Has key - ", DB.Has("roo"));
console.log("Has Dotaccess - ", DB.Has("foo", "name"));
console.log("Has boolean - ", DB.Has("foo", "enabled"));


// Connection#Expect
console.log("Expect unknown key - ", DB.Expect("loo", "roo"));
console.log("Expect unknown value - ", DB.Expect("roo", "loo"));
console.log("Expect known value - ", DB.Expect("roo", "boo!"));
console.log("Expect unknown Dotaccess key - ", DB.Expect("foo", "Hello World!", "nothing"));
console.log("Expect unknown Dotaccess value - ", DB.Expect("foo", "nothing", "name"));
console.log("Expect known Dotaccess value - ", DB.Expect("foo", "Smally", "name"));
console.log("Overwrite unknown key - ", DB.Expect("foo", "Hello World!", "message", true));
console.log("Overwrite known key - ", DB.Expect("foo", "Smally v2", "name", true));

console.log(DB.Fetch());


// Connection#Accumulate
console.log("Accumulate key - ", DB.Accumulate("roo", (v, d, c) => "Hello World!"));
console.log("Accumulate Dotaccess - ", DB.Accumulate("goo.name", (v, d, c) => v + " :]"));

console.log(DB.Fetch());


// Connection#Fetch Properties
console.log("Length of 'Hello World!', should be 12 - ", DB.Fetch("roo", "length"));


// Connection#Sweep
console.log("Sweep false - ", DB.Sweep((v, k, d, c) => v == "Hello Smally!"));
console.log("Sweep true - ", DB.Sweep((v, k, d, c) => v == "Hello World!"));

console.log(DB.Fetch());


// Connection#Return
DB.Return(v => console.log("Return everything - ", v));
DB.Return("goo", v => console.log("Return specific item - ", v));


// Connection#Each
DB.Each(v => console.log("Each origin - ", v));
DB.Each("foo", v => console.log("Each value - ", v));
DB.Each("something", v => console.log("Each non-iteratable - ", v));


// Connection#Filter
console.log(DB.Filter((v, k, d) => typeof v == "object"));
console.log(DB.Filter((v, k, d) => typeof v == "boolean"));


// Connection#Search
console.log("Set database to array - ", DB.Set([
    "foo", "bar", "roo", "doo", "boo"
]));

console.log("Search database - ", DB.Search("oo"));

console.log("Set database to array with objects - ", DB.Set([
    {name: "foo"}, {name: "bar"}, {name: "roo"}, {name: "doo"}, {name: "boo"}
]));

console.log("Search database - ", DB.Search("oo", {Target: "name"}));


// Connection#Map
console.log("Database mapping - ", DB.Map((v, k, d, c) => {
    v["num"] = Math.random() * 100;
    v["key"] = k;
    v["foo"] = {"roo": "ree", "doo": "boo", "goo": "gru"};
    console.log("Map - ", v);
    return v;
}));

console.log("Database dotaccess mapping - ", DB.Map((v, k, d, c) => {
    console.log("Map - ", v);
    v = "abc";
    return v;
}, "0.foo"));


// Connection#Sort
console.log("Database sorting - ", DB.Sort((a, b) => a.num - b.num));
console.log("Database dotaccess sorting - ", DB.Sort("0.foo", (a, b) => a - b));


// Connection#Find
console.log("Set database to object - ", DB.Set([
    {name: "foo", admin: true},
    {name: "bar", admin: false},
    {name: "roo", admin: false},
    {name: "doo", admin: false},
    {name: "boo", admin: true}
]));

console.log("Find 'roo' - ", DB.Find((v, k, d) => v.name == "roo"));



/* Stack */
const ST = new QDB.Stack();
console.log("Add value to Stack - ", ST.Push("foo"));
console.log("Add value to Stack - ", ST.Push("bar"));
console.log("Add value to Stack - ", ST.Push("roo"));
console.log("Add value to Stack - ", ST.Push("doo"));
console.log("Add value to Stack - ", ST.Push("goo"));

console.log("Stack Size - ", ST.Size);

console.log("Seek recent - ", ST.Seek());
console.log("Seek 1 last - ", ST.Seek(1));
console.log("Seek 2 last - ", ST.Seek(2));
console.log("Seek 100 last - ", ST.Seek(100));

console.log("Pop last from Stack - ", ST.Pop());
console.log("Stack Size - ", ST.Size);
console.log("Seek recent - ", ST.Seek());

console.log("Pop last 2 from Stack - ", ST.Pop(2));
console.log("Stack Size - ", ST.Size);
console.log("Seek recent - ", ST.Seek());

console.log("Flush Stack - ", ST.Flush());
console.log("Stack Size - ", ST.Size);
console.log("Seek recent - ", ST.Seek());
console.log("Stack values - ", ST.Values);
