
const QDB = require("../QDB");

// Test: Manager Helper
// ------------------------------- Initialiser

// const BM = new QDB.Manager();

// console.log(BM);

// ------------------------------- Main Functions

// BM.Add("Foo", {Data: "Bar"});
// BM.Add("Bar", {Data: "Roo"});
// BM.Add("Roo", {Data: "Foo"});

// console.log(BM);
// console.log( BM.Resolve("Foo") );
// console.log( BM.Cache.LRR );

// BM.Remove("Foo");

// console.log( BM );
// console.log( BM.Resolve("Foo") );
// console.log( BM.Cache.LRR );


// ------------------------------- Iterable


// const BM = new QDB.Manager({
//     "Foo": {Data: "Roo"},
//     "Bar": {Data: "Foo"},
//     "Roo": {Data: "Bar"}
// });

// console.log(BM);


// ------------------------------- Holds


// class TesterClass { constructor (self) { this.self = self; } }
// const BM = new QDB.Manager({}, TesterClass);

// console.log(BM.Holds);
// console.log(BM.Resolve(new TesterClass("Foo")));
