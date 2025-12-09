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

    var data = {"OkPercent": 84.53846153846153, "KoPercent": 15.461538461538462};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8453846153846154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Home/public/img/Arrow-r.png-450"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/Arrow-l.png-448"], "isController": false}, {"data": [0.0, 500, 1500, "Home/complete/search-445"], "isController": false}, {"data": [0.99, 500, 1500, "Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447"], "isController": false}, {"data": [0.0, 500, 1500, "Home/complete/search-444"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Training.jpg-451"], "isController": false}, {"data": [1.0, 500, 1500, "Home/home/ra-454"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/program/pg-ds.jpg-449"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-446"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Outreach.jpg-453"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Consultancy.jpg-452"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-455"], "isController": false}, {"data": [1.0, 500, 1500, "Home/home/pg_cc-456"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 201, 15.461538461538462, 124.21153846153838, 6, 837, 50.0, 378.9000000000001, 472.95000000000005, 541.99, 12.911042914320332, 673.1861711091827, 8.199365745016834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Home/public/img/Arrow-r.png-450", 100, 0, 0.0, 20.08, 6, 75, 15.0, 38.900000000000006, 52.74999999999994, 74.88999999999994, 1.006866831792827, 0.9341049709015485, 0.4552532647657021], "isController": false}, {"data": ["Home/public/img/Arrow-l.png-448", 100, 0, 0.0, 22.689999999999987, 6, 156, 16.5, 48.0, 54.94999999999999, 155.1899999999996, 1.0069175233856595, 0.9400519065983305, 0.4552761848901956], "isController": false}, {"data": ["Home/complete/search-445", 100, 100, 100.0, 417.15999999999997, 257, 837, 409.0, 531.7, 553.9, 834.7799999999988, 1.0026771479851202, 1.2582423194930463, 0.2878780092847904], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447", 100, 1, 1.0, 300.4700000000001, 242, 806, 295.5, 324.0, 333.0, 802.009999999998, 1.0036432249064104, 0.8088051031494324, 3.0991405050332705], "isController": false}, {"data": ["Home/complete/search-444", 100, 100, 100.0, 419.50000000000006, 251, 559, 437.5, 528.4000000000001, 540.75, 558.97, 1.00409671459555, 1.2600237092336735, 0.2873050169692345], "isController": false}, {"data": ["Home/public/img/service/Training.jpg-451", 100, 0, 0.0, 65.13, 31, 231, 54.0, 102.80000000000001, 133.95, 230.8499999999999, 1.006198180793689, 195.81952955204056, 0.46379447395959106], "isController": false}, {"data": ["Home/home/ra-454", 100, 0, 0.0, 46.530000000000015, 26, 95, 42.5, 67.9, 74.94999999999999, 94.96999999999998, 1.006269056220252, 4.919319233826741, 0.4874115741066847], "isController": false}, {"data": ["Home/public/img/program/pg-ds.jpg-449", 100, 0, 0.0, 75.94, 31, 275, 62.0, 130.8, 141.95, 274.8499999999999, 1.0060868252930226, 113.93442043110821, 0.46079562603752705], "isController": false}, {"data": ["Home/-446", 100, 0, 0.0, 44.149999999999984, 22, 163, 37.0, 75.70000000000002, 85.84999999999997, 162.5999999999998, 1.006876969703072, 7.37065406727952, 0.44050867424509405], "isController": false}, {"data": ["Home/public/img/service/Outreach.jpg-453", 100, 0, 0.0, 72.41000000000003, 28, 234, 58.5, 128.30000000000004, 157.79999999999995, 233.89999999999995, 1.0060868252930226, 188.0223005432869, 0.4637431460335027], "isController": false}, {"data": ["Home/public/img/service/Consultancy.jpg-452", 100, 0, 0.0, 61.50999999999998, 25, 266, 51.0, 107.10000000000005, 132.89999999999998, 265.09999999999957, 1.0061070699143804, 154.79998748654333, 0.46670005684504945], "isController": false}, {"data": ["Home/-455", 100, 0, 0.0, 37.719999999999985, 20, 109, 33.0, 56.900000000000006, 78.64999999999992, 108.88999999999994, 1.0063601964415103, 7.366871125513244, 0.4402825859431608], "isController": false}, {"data": ["Home/home/pg_cc-456", 100, 0, 0.0, 31.460000000000015, 14, 139, 25.5, 57.60000000000002, 69.79999999999995, 138.85999999999993, 1.0063500689349798, 4.543316766295323, 0.49039910585796376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 806 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 0.4975124378109453, 0.07692307692307693], "isController": false}, {"data": ["403/Forbidden", 200, 99.50248756218906, 15.384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 201, "403/Forbidden", 200, "The operation lasted too long: It took 806 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/complete/search-445", 100, 100, "403/Forbidden", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447", 100, 1, "The operation lasted too long: It took 806 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home/complete/search-444", 100, 100, "403/Forbidden", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
