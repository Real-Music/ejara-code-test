const fs = require('fs');
const csvParser = require("csv-parse");
const csvStringify = require('csv-stringify');

const { CSV_OUTPUT_LOCATION, MALE, MALE_OUTPUT_LOCATION, FEMALE_OUTPUT_LOCATION, DATABASE, FEMALE } = require("./contants");

/**
 *This function sort an arr of obj into any repective key of that obj
 *with the respective type indicate eg sortByColunName("age", "int")
 * @param {*} property
 * @param {*} type
 * @returns
 */
function sortByColumnName(property, type) {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        switch (type) {
            case "int":
                return (Number(a[property]) - Number(b[property]));
            case "str":
            default:
                let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
        }
    };
}

/**
 *This function write our an arr of obj to .cvs filte
 *
 * @param {*} payload
 * @param {*} fileName
 */
function writeCSVFile(payload, fileName) {

    csvStringify(payload, { header: true }, (error, stringifyData) => fs.writeFile(__dirname + CSV_OUTPUT_LOCATION + fileName, stringifyData, result => print_to_console(`SUCCESSFULLY CREATED: ${fileName} WITH ${payload.length} RECORDS`)));
}

const print_to_console = (msg) => console.log(`====[${msg}]====\n`)

const processCSVFile = csvParser({ columns: true }, (error, csvRecords) => {
    print_to_console(`Processing CSV FILE WITH ${csvRecords.length} RECORDS`)
    csvRecords.map((record) => {
        const gender = record.gender.toLowerCase();
        const full_name = record?.first_name.concat(' ', record?.last_name)
        record["full_name"] = full_name;

        if (gender === MALE) return DATABASE.MALE_RECORDS.push(record);

        else if (gender === FEMALE) return DATABASE.FEMALE_RECORDS.push(record);

        console.error('INVALID FORMAT: "gender" must be either "male" or "female"')
    });
    writeCSVFile(DATABASE.MALE_RECORDS.sort(sortByColumnName("age", "int")), MALE_OUTPUT_LOCATION);
    writeCSVFile(DATABASE.MALE_RECORDS.sort(sortByColumnName("age", "int")), FEMALE_OUTPUT_LOCATION);
});


module.exports = { processCSVFile, writeCSVFile, sortByColumnName }