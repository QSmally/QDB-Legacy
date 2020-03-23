
const QDB = require("../QDB");
const DBS = new QDB.Pool("./Test/");

DBS.OnEvent(m => console.log(m));
