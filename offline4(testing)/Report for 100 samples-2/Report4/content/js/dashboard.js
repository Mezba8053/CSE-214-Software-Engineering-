/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.0, "KoPercent": 10.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8945, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Moodle/v1/profile-435"], "isController": false}, {"data": [0.99, 500, 1500, "Moodle/moodle/-437"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-1"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-0"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-2"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/my/courses.php-443"], "isController": false}, {"data": [0.99, 500, 1500, "Moodle/complete/search-436"], "isController": false}, {"data": [0.965, 500, 1500, "Moodle/submit/firefox-desktop/newtab/1/6d103e41-e065-47fb-98ba-863943ccfa79-439"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/-440"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 100, 10.0, 189.94699999999995, 15, 1014, 142.5, 417.79999999999995, 460.89999999999986, 607.9200000000001, 9.936900680677697, 56.297510806379485, 9.087800280717444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Moodle/v1/profile-435", 100, 100, 100.0, 426.53999999999985, 320, 801, 399.5, 539.0, 594.3999999999999, 799.6899999999994, 1.006228554753927, 0.630858136867208, 1.2695774343184312], "isController": false}, {"data": ["Moodle/moodle/-437", 100, 0, 0.0, 216.89999999999998, 152, 944, 188.0, 264.70000000000005, 340.99999999999955, 943.89, 1.0075871310971616, 11.887747157974548, 0.4477071725089927], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-1", 100, 0, 0.0, 40.91000000000001, 15, 161, 30.0, 75.80000000000001, 100.89999999999998, 160.66999999999985, 1.009550346275769, 1.98163691017021, 0.5274506203686877], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-0", 100, 0, 0.0, 50.650000000000006, 24, 186, 43.5, 77.0, 99.74999999999994, 185.88999999999993, 1.0094688175082274, 2.0692139140134462, 0.5274080247723648], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441", 100, 0, 0.0, 137.80999999999997, 78, 387, 119.0, 206.0, 256.1999999999996, 386.96999999999997, 1.0086746015735324, 10.63826643509179, 1.575069031168045], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-2", 100, 0, 0.0, 46.139999999999986, 28, 148, 40.0, 71.10000000000005, 85.0, 147.6099999999998, 1.009214124960893, 6.594287879590662, 0.5213615938518675], "isController": false}, {"data": ["Moodle/moodle/my/courses.php-443", 100, 0, 0.0, 70.47000000000001, 47, 194, 63.0, 97.80000000000001, 124.79999999999995, 193.49999999999974, 1.009315986555911, 8.689619248160522, 0.5204285555678917], "isController": false}, {"data": ["Moodle/complete/search-436", 100, 0, 0.0, 328.89000000000016, 259, 918, 306.5, 399.20000000000005, 463.34999999999985, 914.6899999999982, 1.006117192530586, 1.9424350048293626, 0.28788314200338055], "isController": false}, {"data": ["Moodle/submit/firefox-desktop/newtab/1/6d103e41-e065-47fb-98ba-863943ccfa79-439", 100, 0, 0.0, 427.25000000000034, 322, 1014, 410.0, 478.5, 554.1499999999999, 1011.0099999999984, 1.005388884420494, 0.8037318307377543, 3.0259849040859006], "isController": false}, {"data": ["Moodle/moodle/-440", 100, 0, 0.0, 153.91000000000003, 128, 228, 149.0, 184.70000000000002, 204.89999999999998, 227.90999999999997, 1.0084406482256487, 11.896369487611308, 0.5091443507154887], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 100, 100.0, 10.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 100, "401/Unauthorized", 100, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Moodle/v1/profile-435", 100, 100, "401/Unauthorized", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
