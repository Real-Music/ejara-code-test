const fs = require('fs');
const { CSV_DATA_LOCATION } = require("./utils/contants");
const { processCSVFile } = require("./utils/helper");

fs.createReadStream(__dirname + CSV_DATA_LOCATION).pipe(processCSVFile);