const express = require('express');
const open = require('open');
const Papa = require('papaparse');
const fs = require('fs');

var app = express();


// set the view engine to ejs
app.set('view engine', 'ejs');

// CSV file path
const csvFilePath = 'data/csv/Pricing Table Code Challenege ea845498b6f844d89f6fa14c522f787e.csv'

//Read the CSV file to json using papaparse
const readCSV = async (filePath) => {
    const csvFile = fs.readFileSync(filePath)
    const csvData = csvFile.toString()
    return new Promise(resolve => {
        Papa.parse(csvData, {
            header: true,
            complete: results => {
                resolve(results.data);
            }
        });
    });
};

// index page
app.get('/', async function (req, res) {
    let parsedData = await readCSV(csvFilePath);
    let sortedParsedData = []
    let header = []
    let tiersIndex = -1;

    //Sort the groups alphabetically (the titles in the csv)
    for (const item of parsedData) {
        let temp = Object.keys(item).sort().reduce((a, c) => (a[c] = item[c], a), {});
        sortedParsedData.push(temp);
    }

    //Finding the Tiers index to maintain the first column.
    var keysbyindex = Object.keys(sortedParsedData[0]);
    for (var i = 0; i < keysbyindex.length; i++) {
        let temp = encodeURIComponent(keysbyindex[i].replace(/^\uFEFF/gm, "").replace(/^\u00BB\u00BF/gm, "")); //It's has a byte code. So remove it.
        if (temp === "Tiers") {
            tiersIndex = i;
        }
        header.push(temp);
    }

    //Render the index page with provided data.
    res.render('pages/index', {
        header: header,
        sortedParsedData: sortedParsedData,
        tiersIndex: tiersIndex
    });
});

app.listen(8080);
console.log('Server is listening on port 8080');
open('http://localhost:8080/');