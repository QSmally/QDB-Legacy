
process.on("QDB-Debug", Debug => console.log(Debug));
const QDB = require("../QDB");
// const DB  = new QDB.Connection("./Test/Database.json");

class TestingClass {
    constructor () {
        this.foo = "bar";
    }
}

const DS = new QDB.DataStore();
DS.set("foo", new TestingClass());
DS.set("bar", new TestingClass());
DS.set("roo", new TestingClass());

console.log( DS.resolve("bar") );


// const DBS = new QDB.Pool("./Test/");
// console.log( DBS.Select("Database") );
