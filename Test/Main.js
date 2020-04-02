
const QDB = require("../QDB");
// const DB = new QDB.Connection("./Test/Database.json");


// Test: DS#LRR

// const DS = new QDB.DataStore();

// DS.set("foo", {name: "bar"});
// DS.set("bar", {name: "roo"});
// DS.set("roo", {name: "foo"});

// console.log(DS);

// console.log(DS.resolve("bar"));
// console.log(DS.resolve("foo"));
// console.log(DS.resolve("foo"));


// Test: Manager rename

const {Manager} = require("../QDB");
class DataManager extends Manager {
    constructor(Client, ...Args) {
        super(...Args);
        this.Client = Client;
    }

    get Admins () {
        return this.Cache.filter(m => m.Admin);
    }
}

const MyManager = new DataManager({
    _Id: "9caw67ahd1a",
    Foo: false,
    IsWorking: true
}, {
    "foo": {Name: "foo", Admin: false},
    "bar": {Name: "bar", Admin: true},
    "roo": {Name: "roo", Admin: false},
    "goo": {Name: "roo", Admin: false},
    "doo": {Name: "doo", Admin: true},
});

MyManager.Add("woo", {
    Name: "woo", Admin: false
});

console.log(MyManager);
console.log(MyManager.Admins);
