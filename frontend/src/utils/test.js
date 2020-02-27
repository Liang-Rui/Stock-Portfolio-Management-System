
// test stock detail chart
import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
    return function (d) {
        d.date = parse(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;
        // d.change = (d.close - d.open) / d.open

        return d;
    };
}

const parseDate = timeParse("%Y-%m-%d");


export function getProfile() {
    const apiOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
            },
        }
    const promiseProfile = fetch("http://127.0.0.1:8000/getUserProfile/", apiOption)
        .then(response => response.json())
        .then(data => {
        

            return data
        })
    return promiseProfile;
}