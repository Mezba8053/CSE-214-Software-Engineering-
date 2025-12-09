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

    var data = {"OkPercent": 98.06593406593407, "KoPercent": 1.934065934065934};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9756043956043956, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Moodle/moodle/my/courses.php-468"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/Arrow-r.png-450"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/Arrow-l.png-448"], "isController": false}, {"data": [0.98, 500, 1500, "Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447"], "isController": false}, {"data": [0.99, 500, 1500, "Moodle/v1/profile-435"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Training.jpg-451"], "isController": false}, {"data": [1.0, 500, 1500, "Home/submit/firefox-desktop/newtab/1/f58e1b2d-4edc-4252-ac32-76c24aee5a4a-422"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-1"], "isController": false}, {"data": [0.98, 500, 1500, "Home/submit/telemetry/486f272a-7512-4efb-8700-65d97f24871d/event/Firefox/133.0.3/release/20241209150345?v=4-416"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-0"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441-2"], "isController": false}, {"data": [1.0, 500, 1500, "Home/home/ra-454"], "isController": false}, {"data": [0.995, 500, 1500, "Moodle/submit/firefox-desktop/newtab/1/6d103e41-e065-47fb-98ba-863943ccfa79-439"], "isController": false}, {"data": [1.0, 500, 1500, "Notice/home/notice-459"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-446"], "isController": false}, {"data": [0.99, 500, 1500, "Home/public/img/service/Outreach.jpg-453"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/complete/search-462"], "isController": false}, {"data": [1.0, 500, 1500, "Notice/home/notice-457"], "isController": false}, {"data": [0.98, 500, 1500, "Moodle/complete/search-461"], "isController": false}, {"data": [0.89, 500, 1500, "Notice/home/download/1300-458"], "isController": false}, {"data": [1.0, 500, 1500, "Home/home/pg_cc-456"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/theme/image.php/classic/core/1731384351/f/pdf-472"], "isController": false}, {"data": [1.0, 500, 1500, "Home/v1/buckets/main/collections/ms-language-packs/records/cfr-v1-en-US-421"], "isController": false}, {"data": [1.0, 500, 1500, "Home/web/assets/img/news/PG_Seminar_(CSE-BUET):_IMPACTS2.jpg-429"], "isController": false}, {"data": [0.97, 500, 1500, "Moodle/v1/profile-460"], "isController": false}, {"data": [0.98, 500, 1500, "Home/public/img/service/Consultancy.jpg-452"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/-463"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/-466"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/course/view.php-441"], "isController": false}, {"data": [1.0, 500, 1500, "Home/home/head_message-431"], "isController": false}, {"data": [0.99, 500, 1500, "Home/complete/search-445"], "isController": false}, {"data": [0.99, 500, 1500, "Home/complete/search-444"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/my/courses.php-443"], "isController": false}, {"data": [0.98, 500, 1500, "Home/public/img/service/Outreach.jpg-427"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/my/-467"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Consultancy.jpg-424"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/program/pg-ds.jpg-449"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/mod/forum/view.php-474"], "isController": false}, {"data": [1.0, 500, 1500, "Home/submit/firefox-desktop/newtab/1/f1436be5-da62-4c87-9a7e-746f5b316b35-430"], "isController": false}, {"data": [1.0, 500, 1500, "Notice/home/notice-434"], "isController": false}, {"data": [0.985, 500, 1500, "Moodle/moodle/-437"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-420"], "isController": false}, {"data": [1.0, 500, 1500, "Notice/home/notice-432"], "isController": false}, {"data": [1.0, 500, 1500, "Home/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-425"], "isController": false}, {"data": [1.0, 500, 1500, "Home/web/assets/img/news/elsiver2022.jpg-426"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/Arrow-r.png-423"], "isController": false}, {"data": [0.98, 500, 1500, "Home/complete/search-417"], "isController": false}, {"data": [0.98, 500, 1500, "Home/complete/search-418"], "isController": false}, {"data": [1.0, 500, 1500, "Home/complete/search-419"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/badges/view.php-469-0"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/pluginfile.php/13650/user/icon/classic/f2-471"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/badges/view.php-469"], "isController": false}, {"data": [0.99, 500, 1500, "Moodle/submit/firefox-desktop/newtab/1/791807dd-9115-4959-9463-972be0951073-465"], "isController": false}, {"data": [0.0, 500, 1500, "Moodle/moodle/blog/index.php-470"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/badges/view.php-469-1"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/theme/image.php/classic/core/1731384351/f/spreadsheet-473"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-415"], "isController": false}, {"data": [0.46, 500, 1500, "Notice/home/download/1303-433"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-455"], "isController": false}, {"data": [0.9633333333333334, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "Home/public/img/service/Training.jpg-428"], "isController": false}, {"data": [0.995, 500, 1500, "Moodle/complete/search-436"], "isController": false}, {"data": [1.0, 500, 1500, "Moodle/moodle/-440"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4550, 88, 1.934065934065934, 169.0204395604394, 7, 1693, 127.0, 337.0, 387.0, 590.4899999999998, 42.97033630190675, 2028.837880387819, 33.51293345146241], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Moodle/moodle/my/courses.php-468", 50, 0, 0.0, 102.58000000000003, 55, 197, 102.0, 140.29999999999998, 155.35, 197.0, 0.5084142559357365, 4.376980035207687, 0.2581791143423662], "isController": false}, {"data": ["Home/public/img/Arrow-r.png-450", 100, 0, 0.0, 57.12999999999999, 7, 146, 56.0, 93.9, 105.89999999999998, 145.82999999999993, 1.0105297196790557, 0.937503157905374, 0.45690943380019805], "isController": false}, {"data": ["Home/public/img/Arrow-l.png-448", 100, 0, 0.0, 54.969999999999985, 7, 151, 57.0, 84.0, 101.0, 150.54999999999978, 1.010662489261711, 0.9435481833341757, 0.4569694653595432], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447", 100, 2, 2.0, 297.8699999999999, 245, 724, 288.0, 329.9, 358.1999999999998, 722.4399999999991, 1.0071000553905032, 0.80413595536029, 3.109814819477315], "isController": false}, {"data": ["Moodle/v1/profile-435", 100, 0, 0.0, 358.60000000000014, 304, 614, 349.0, 423.8, 450.69999999999993, 612.9299999999995, 1.006988500191328, 0.925367361992226, 1.2705362717257769], "isController": false}, {"data": ["Home/public/img/service/Training.jpg-451", 100, 0, 0.0, 199.16000000000003, 55, 436, 198.0, 322.6000000000001, 339.79999999999995, 435.37999999999965, 1.0085220109928899, 196.2717777721749, 0.46486561444203517], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/f58e1b2d-4edc-4252-ac32-76c24aee5a4a-422", 50, 0, 0.0, 288.76, 246, 335, 288.5, 321.8, 326.7, 335.0, 0.4966920310730535, 0.4047555002433791, 1.5347007678858802], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-1", 100, 0, 0.0, 68.12999999999998, 15, 140, 67.0, 102.0, 116.64999999999992, 140.0, 1.0110712299681512, 1.9846222385117032, 0.5282452226884384], "isController": false}, {"data": ["Home/submit/telemetry/486f272a-7512-4efb-8700-65d97f24871d/event/Firefox/133.0.3/release/20241209150345?v=4-416", 50, 1, 2.0, 310.62000000000006, 260, 509, 303.0, 338.8, 358.49999999999994, 509.0, 0.5074751083459356, 0.40394820391872277, 3.791691458940189], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-0", 100, 0, 0.0, 80.43, 28, 184, 81.0, 117.40000000000003, 133.5999999999999, 183.71999999999986, 1.010969013799727, 2.0722890234039326, 0.5281918187332558], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441-2", 100, 0, 0.0, 83.39999999999998, 31, 209, 78.5, 127.70000000000002, 134.0, 208.8099999999999, 1.0109485730460892, 6.60546294494374, 0.522257612442755], "isController": false}, {"data": ["Home/home/ra-454", 100, 0, 0.0, 79.09, 26, 192, 77.5, 118.80000000000001, 134.74999999999994, 191.55999999999977, 1.0103867760578749, 4.939449414986057, 0.4894060946530332], "isController": false}, {"data": ["Moodle/submit/firefox-desktop/newtab/1/6d103e41-e065-47fb-98ba-863943ccfa79-439", 100, 0, 0.0, 386.0400000000001, 316, 519, 384.5, 423.9, 449.4499999999999, 518.7299999999999, 1.0069276623167391, 0.8086396124083696, 3.0306162649025294], "isController": false}, {"data": ["Notice/home/notice-459", 100, 0, 0.0, 74.16, 23, 217, 73.5, 112.0, 134.29999999999984, 216.7499999999999, 1.0134690030505418, 3.5461517948536043, 0.5047550698786877], "isController": false}, {"data": ["Home/-446", 100, 0, 0.0, 76.61999999999999, 26, 289, 76.5, 110.50000000000003, 119.0, 287.9899999999995, 1.0104276129658072, 7.39664588553876, 0.4420620806725406], "isController": false}, {"data": ["Home/public/img/service/Outreach.jpg-453", 100, 1, 1.0, 246.31999999999985, 56, 506, 244.0, 420.6, 432.9, 505.5799999999998, 1.0076277420069928, 188.31027440222485, 0.46445341233134835], "isController": false}, {"data": ["Moodle/complete/search-462", 50, 0, 0.0, 130.33999999999995, 111, 234, 126.0, 147.5, 175.19999999999985, 234.0, 0.5085952598921778, 0.7424994119367307, 0.14602246719560574], "isController": false}, {"data": ["Notice/home/notice-457", 100, 0, 0.0, 70.54, 21, 168, 67.5, 114.20000000000005, 122.0, 167.8499999999999, 1.0122174648001379, 3.5417726331825126, 0.5041317451641311], "isController": false}, {"data": ["Moodle/complete/search-461", 50, 1, 2.0, 301.02000000000004, 253, 573, 282.0, 363.6, 430.0999999999997, 573.0, 0.5078978109604347, 0.9538558966935853, 0.14532622911270254], "isController": false}, {"data": ["Notice/home/download/1300-458", 100, 11, 11.0, 134.16000000000003, 32, 370, 133.5, 223.70000000000002, 232.89999999999998, 369.6299999999998, 1.0122891907760208, 99.1213013483692, 0.5120759773652137], "isController": false}, {"data": ["Home/home/pg_cc-456", 100, 0, 0.0, 64.96, 14, 128, 66.0, 98.80000000000001, 116.64999999999992, 127.97999999999999, 1.0116030874126227, 4.5670322979575735, 0.49295892638564337], "isController": false}, {"data": ["Moodle/moodle/theme/image.php/classic/core/1731384351/f/pdf-472", 50, 0, 0.0, 58.05999999999996, 13, 123, 53.0, 95.29999999999998, 106.79999999999998, 123.0, 0.5092842519123624, 0.5266914284913982, 0.2556368217606975], "isController": false}, {"data": ["Home/v1/buckets/main/collections/ms-language-packs/records/cfr-v1-en-US-421", 50, 0, 0.0, 133.56, 106, 219, 128.5, 163.8, 173.49999999999994, 219.0, 0.49718098382173076, 0.4573676628516313, 0.19178368028279655], "isController": false}, {"data": ["Home/web/assets/img/news/PG_Seminar_(CSE-BUET):_IMPACTS2.jpg-429", 50, 0, 0.0, 65.13999999999997, 19, 189, 64.5, 104.6, 122.59999999999997, 189.0, 0.49962028858067864, 32.25868652324234, 0.24200357728126626], "isController": false}, {"data": ["Moodle/v1/profile-460", 50, 1, 2.0, 365.58000000000015, 306, 666, 348.5, 453.6, 497.5999999999998, 666.0, 0.5090612909794339, 0.46779948712074937, 0.6422921757279576], "isController": false}, {"data": ["Home/public/img/service/Consultancy.jpg-452", 100, 2, 2.0, 197.19, 36, 626, 197.0, 300.6, 349.9, 624.6799999999994, 1.0108361636745917, 155.52760751506148, 0.46889372826702247], "isController": false}, {"data": ["Moodle/moodle/-463", 50, 0, 0.0, 184.22, 137, 282, 181.0, 221.8, 227.89999999999998, 282.0, 0.508450446419492, 5.997848301267059, 0.2259228057820985], "isController": false}, {"data": ["Moodle/moodle/-466", 50, 0, 0.0, 186.18, 133, 243, 183.5, 227.8, 233.04999999999995, 243.0, 0.5080526342529086, 5.993016657775745, 0.2565070428796423], "isController": false}, {"data": ["Moodle/moodle/course/view.php-441", 100, 0, 0.0, 232.0299999999999, 80, 422, 237.0, 355.30000000000007, 381.1499999999998, 421.76999999999987, 1.0101316201501056, 10.653475452538967, 1.577344199824237], "isController": false}, {"data": ["Home/home/head_message-431", 50, 0, 0.0, 63.71999999999999, 22, 121, 61.0, 103.9, 110.79999999999998, 121.0, 0.5001500450135041, 2.121241841302391, 0.24714445583675101], "isController": false}, {"data": ["Home/complete/search-445", 100, 1, 1.0, 133.00000000000003, 111, 500, 126.5, 145.9, 171.89999999999998, 497.00999999999846, 1.0095095802459164, 1.4706602602768075, 0.2898396646409174], "isController": false}, {"data": ["Home/complete/search-444", 100, 1, 1.0, 138.36, 113, 591, 127.0, 154.9, 192.44999999999987, 588.0399999999985, 1.0101112132445782, 1.894777267320882, 0.28902596238345846], "isController": false}, {"data": ["Moodle/moodle/my/courses.php-443", 100, 0, 0.0, 99.70000000000002, 51, 185, 97.0, 141.9, 152.74999999999994, 184.7799999999999, 1.0107850767691267, 8.702237641257215, 0.5211860552090809], "isController": false}, {"data": ["Home/public/img/service/Outreach.jpg-427", 50, 1, 2.0, 197.55999999999992, 66, 509, 187.0, 285.4, 443.24999999999983, 509.0, 0.49826603420098065, 93.1183310205485, 0.22966950013951448], "isController": false}, {"data": ["Moodle/moodle/my/-467", 50, 0, 0.0, 149.89999999999995, 97, 260, 145.5, 190.0, 211.8999999999998, 260.0, 0.5081197536635433, 6.9864977496646405, 0.25654093031645697], "isController": false}, {"data": ["Home/public/img/service/Consultancy.jpg-424", 50, 0, 0.0, 176.96, 46, 384, 171.0, 272.9, 354.34999999999997, 384.0, 0.4977452141797657, 76.5832536422506, 0.23088767259315301], "isController": false}, {"data": ["Home/public/img/program/pg-ds.jpg-449", 100, 0, 0.0, 198.37999999999994, 37, 465, 194.0, 331.20000000000005, 355.95, 464.2199999999996, 1.0101622320544679, 114.3959403473948, 0.4626621941733842], "isController": false}, {"data": ["Moodle/moodle/mod/forum/view.php-474", 50, 0, 0.0, 158.51999999999998, 112, 228, 155.5, 204.6, 219.0, 228.0, 0.5091442303775814, 7.898795969359701, 0.2689912389006558], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/f1436be5-da62-4c87-9a7e-746f5b316b35-430", 50, 0, 0.0, 291.3199999999999, 246, 386, 293.0, 314.8, 354.3499999999998, 386.0, 0.49662296384584825, 0.4034091614521255, 1.5354573276718315], "isController": false}, {"data": ["Notice/home/notice-434", 50, 0, 0.0, 64.09999999999997, 21, 158, 61.5, 98.69999999999999, 120.74999999999994, 158.0, 0.5042152394013957, 1.7642609402101568, 0.25456960817433744], "isController": false}, {"data": ["Moodle/moodle/-437", 100, 1, 1.0, 324.35999999999996, 159, 1441, 318.5, 418.9, 441.84999999999997, 1431.9699999999953, 1.0085728693898135, 11.898470987771054, 0.44814517145738775], "isController": false}, {"data": ["Home/-420", 50, 0, 0.0, 79.10000000000001, 24, 170, 79.5, 114.6, 118.79999999999998, 170.0, 0.49771053155484773, 3.6433966255225965, 0.21774835755524588], "isController": false}, {"data": ["Notice/home/notice-432", 50, 0, 0.0, 66.68000000000002, 26, 112, 63.5, 99.6, 107.69999999999997, 112.0, 0.5012079110656683, 1.7537382278791889, 0.25305125978608445], "isController": false}, {"data": ["Home/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-425", 50, 0, 0.0, 178.12, 43, 323, 173.0, 294.0, 315.49999999999994, 323.0, 0.4974332444585937, 32.117476943969116, 0.2404584531318397], "isController": false}, {"data": ["Home/web/assets/img/news/elsiver2022.jpg-426", 50, 0, 0.0, 112.54, 34, 234, 108.5, 178.9, 202.2499999999999, 234.0, 0.49966522429971916, 47.372069307314106, 0.2322662566080726], "isController": false}, {"data": ["Home/public/img/Arrow-r.png-423", 50, 0, 0.0, 54.54000000000001, 7, 148, 51.5, 102.29999999999998, 141.24999999999997, 148.0, 0.4994855299041987, 0.4633898959072156, 0.22584160190004296], "isController": false}, {"data": ["Home/complete/search-417", 50, 1, 2.0, 149.96000000000004, 106, 765, 132.0, 191.39999999999995, 248.2499999999998, 765.0, 0.5050709119560386, 5.652138091438038, 0.1435308939250071], "isController": false}, {"data": ["Home/complete/search-418", 50, 1, 2.0, 166.49999999999997, 116, 1693, 130.0, 167.89999999999998, 217.2499999999999, 1693.0, 0.497116723006562, 0.9325793211871147, 0.14224140609465102], "isController": false}, {"data": ["Home/complete/search-419", 50, 0, 0.0, 132.76000000000002, 109, 193, 127.5, 165.59999999999997, 185.04999999999995, 193.0, 0.5050249987374376, 0.7402167188525832, 0.14499741174688147], "isController": false}, {"data": ["Moodle/moodle/badges/view.php-469-0", 50, 0, 0.0, 77.13999999999997, 28, 130, 80.5, 108.9, 119.0, 130.0, 0.5086987486010784, 1.0367717659477056, 0.2677623295859192], "isController": false}, {"data": ["Moodle/moodle/pluginfile.php/13650/user/icon/classic/f2-471", 50, 0, 0.0, 68.40000000000002, 23, 149, 68.0, 111.99999999999999, 133.35, 149.0, 0.508978378598477, 1.1243252855368704, 0.25846558288203914], "isController": false}, {"data": ["Moodle/moodle/badges/view.php-469", 50, 0, 0.0, 154.93999999999994, 62, 252, 160.5, 223.8, 234.24999999999997, 252.0, 0.5084452760349404, 4.358498170232563, 0.5317821197592003], "isController": false}, {"data": ["Moodle/submit/firefox-desktop/newtab/1/791807dd-9115-4959-9463-972be0951073-465", 50, 0, 0.0, 388.05999999999983, 324, 514, 384.5, 435.6, 462.5999999999999, 514.0, 0.507073677805385, 0.40511423419197806, 1.5791581626185285], "isController": false}, {"data": ["Moodle/moodle/blog/index.php-470", 50, 50, 100.0, 91.71999999999998, 43, 157, 91.5, 131.1, 143.89999999999998, 157.0, 0.5087453322615766, 12.392221506445802, 0.26778684969627903], "isController": false}, {"data": ["Moodle/moodle/badges/view.php-469-1", 50, 0, 0.0, 77.67999999999999, 34, 130, 75.5, 109.0, 120.89999999999999, 130.0, 0.5087971018917076, 3.3245418759094747, 0.26433599434217625], "isController": false}, {"data": ["Moodle/moodle/theme/image.php/classic/core/1731384351/f/spreadsheet-473", 50, 0, 0.0, 64.34, 12, 217, 58.5, 107.29999999999998, 141.45, 217.0, 0.5094399217500281, 0.6591873987488155, 0.25969496011085413], "isController": false}, {"data": ["Home/-415", 50, 0, 0.0, 76.95999999999997, 30, 185, 75.0, 114.5, 130.59999999999997, 185.0, 0.5097255637564735, 3.73135041593606, 0.22300493414345718], "isController": false}, {"data": ["Notice/home/download/1303-433", 50, 13, 26.0, 816.0799999999998, 319, 1467, 860.0, 1279.5, 1335.7, 1467.0, 0.4982709996312794, 722.5119265835053, 0.25205505645410425], "isController": false}, {"data": ["Home/-455", 100, 0, 0.0, 73.89000000000001, 23, 133, 77.0, 111.80000000000001, 117.0, 132.95, 1.0109587933195843, 7.40053429172227, 0.44229447207731815], "isController": false}, {"data": ["HTTP Request", 150, 0, 0.0, 260.86666666666673, 132, 1443, 206.5, 441.8, 532.8, 1007.9700000000078, 1.4614327887060474, 121.33342117153325, 0.26117402376289717], "isController": false}, {"data": ["Home/public/img/service/Training.jpg-428", 50, 0, 0.0, 187.5200000000001, 40, 345, 189.5, 287.2, 323.04999999999995, 345.0, 0.5000650084510986, 97.3192921329773, 0.2304987148329283], "isController": false}, {"data": ["Moodle/complete/search-436", 100, 0, 0.0, 298.35, 247, 739, 280.5, 349.6, 407.84999999999997, 736.2399999999986, 1.0071507704703395, 1.8893125566522306, 0.28817888256622015], "isController": false}, {"data": ["Moodle/moodle/-440", 100, 0, 0.0, 186.70000000000005, 135, 324, 188.0, 217.8, 228.74999999999994, 323.06999999999954, 1.0097950116126426, 11.911478844794507, 0.5098281455114612], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 666 milliseconds, but should not have lasted longer than 570 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 591 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 231 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 224 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, 2.272727272727273, 0.04395604395604396], "isController": false}, {"data": ["The operation lasted too long: It took 509 milliseconds, but should not have lasted longer than 485 milliseconds.", 2, 2.272727272727273, 0.04395604395604396], "isController": false}, {"data": ["The operation lasted too long: It took 506 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 573 milliseconds, but should not have lasted longer than 570 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["404/Not Found", 50, 56.81818181818182, 1.098901098901099], "isController": false}, {"data": ["The operation lasted too long: It took 500 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 765 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,129 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,324 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 494 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,441 milliseconds, but should not have lasted longer than 1,332 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 568 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 221 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,072 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,467 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,017 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 626 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, 2.272727272727273, 0.04395604395604396], "isController": false}, {"data": ["The operation lasted too long: It took 1,128 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 236 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,204 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,042 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,230 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 724 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,333 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,693 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 333 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,285 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 1,076 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 225 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, 2.272727272727273, 0.04395604395604396], "isController": false}, {"data": ["The operation lasted too long: It took 1,339 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}, {"data": ["The operation lasted too long: It took 370 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, 1.1363636363636365, 0.02197802197802198], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4550, 88, "404/Not Found", 50, "The operation lasted too long: It took 224 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, "The operation lasted too long: It took 509 milliseconds, but should not have lasted longer than 485 milliseconds.", 2, "The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, "The operation lasted too long: It took 225 milliseconds, but should not have lasted longer than 220 milliseconds.", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/submit/firefox-desktop/newtab/1/e4643b50-a43e-43b0-8c77-cdea35172535-447", 100, 2, "The operation lasted too long: It took 568 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "The operation lasted too long: It took 724 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/submit/telemetry/486f272a-7512-4efb-8700-65d97f24871d/event/Firefox/133.0.3/release/20241209150345?v=4-416", 50, 1, "The operation lasted too long: It took 509 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/public/img/service/Outreach.jpg-453", 100, 1, "The operation lasted too long: It took 506 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Moodle/complete/search-461", 50, 1, "The operation lasted too long: It took 573 milliseconds, but should not have lasted longer than 570 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Notice/home/download/1300-458", 100, 11, "The operation lasted too long: It took 224 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, "The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, "The operation lasted too long: It took 225 milliseconds, but should not have lasted longer than 220 milliseconds.", 2, "The operation lasted too long: It took 231 milliseconds, but should not have lasted longer than 220 milliseconds.", 1, "The operation lasted too long: It took 333 milliseconds, but should not have lasted longer than 220 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Moodle/v1/profile-460", 50, 1, "The operation lasted too long: It took 666 milliseconds, but should not have lasted longer than 570 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home/public/img/service/Consultancy.jpg-452", 100, 2, "The operation lasted too long: It took 626 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "The operation lasted too long: It took 494 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/complete/search-445", 100, 1, "The operation lasted too long: It took 500 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home/complete/search-444", 100, 1, "The operation lasted too long: It took 591 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/public/img/service/Outreach.jpg-427", 50, 1, "The operation lasted too long: It took 509 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Moodle/moodle/-437", 100, 1, "The operation lasted too long: It took 1,441 milliseconds, but should not have lasted longer than 1,332 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home/complete/search-417", 50, 1, "The operation lasted too long: It took 765 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home/complete/search-418", 50, 1, "The operation lasted too long: It took 1,693 milliseconds, but should not have lasted longer than 485 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Moodle/moodle/blog/index.php-470", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Notice/home/download/1303-433", 50, 13, "The operation lasted too long: It took 1,128 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, "The operation lasted too long: It took 1,204 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, "The operation lasted too long: It took 1,042 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, "The operation lasted too long: It took 1,230 milliseconds, but should not have lasted longer than 990 milliseconds.", 1, "The operation lasted too long: It took 1,129 milliseconds, but should not have lasted longer than 990 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
