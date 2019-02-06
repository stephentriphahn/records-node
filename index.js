const fs = require('fs');
const through = require('through2');
const split = require('split2');
const pump = require('pump');

const fileStream = fs.createReadStream(process.argv[2]);

function parseWith(delimiter) {
    var fields = null;
    delimiter = delimiter || ","
    return through.obj((data, enc, cb) => {
        const line = data.toString().split(delimiter).map(d => d.trim());
        if (!fields) {
            fields = line;
            return cb(null, null);
        }
        var obj = {};

        fields.forEach((v, i) => {
            obj[v] = line[i];
        });

        return cb(null, obj);
    });
}

function logObject() {
    return through.obj((data, enc, cb) => {
        return cb(null, JSON.stringify(data))
    })
}

pump(fileStream, split(), parseWith(), logObject(), process.stdout, (err) => {
    console.error("An error occured!");
    console.error(err.message);
});
// fileStream
//     .pipe(split())
//     .pipe(parseCSV())
//     .pipe(process.stdout);