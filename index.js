const through = require('through2');
const split = require('split2');
const pumpify = require('pumpify')


function parseLinesWith(delimiter) {
    var fields = null; // init as null, until first line of file containig fields is parsed. 
    delimiter = delimiter || ","
    return through.obj((data, enc, cb) => {
        const line = data.toString().split(delimiter).map(d => d.trim());
        if (!fields) {
            fields = line; //
            return cb(null, null); // essentially remove fields from stream
        }
        var obj = {};

        fields.forEach((v, i) => {
            obj[v] = line[i];
        });

        return cb(null, obj);
    });
}

function objectToJSONStream() {
    return through.obj((data, enc, cb) => {
        cb(null, JSON.stringify(data))
    });
}

//Creates a pumpified stream, parses lines with delimiter and writes to object stream
function createDelimitedPipeline(delimiter) {
    return pumpify(split(), parseLinesWith(delimiter), objectToJSONStream());
}

module.exports = createDelimitedPipeline;