let windowWidth = document.documentElement["clientWidth"];


window.onresize = function() {
    location.reload()
};

queue()
    .defer(d3.csv, "salaries.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
    
    let chartWidth = 300;

    if (windowWidth < 768) {
        chartWidth = windowWidth;
    }
    else {
        chartWidth = windowWidth / 5;
    }

    let genderDim = ndx.dimension(dc.pluck("sex"));

    let salaryByGender = genderDim.group().reduce(
        function(c, v) {
            //Add function, run once for each record
            //thats added to the group
            c.count++;
            c.total += +v.salary;
            c.average = c.total / c.count;
            return c;

        },
        function(c, v) {
            //Remove function, run once for each record
            //thats removed to the group
            c.count--;
            c.count -= +v.salary;
            c.average = c.total / c.count;
            return c;

        },
        function() {
            //initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, avverage: 0 };
        });

    let salaryChart = dc.barChart("#salary-by-gender");

    salaryChart
        .width(chartWidth)
        .height(150)
        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
        .dimension(genderDim)
        .group(salaryByGender)
        .valueAccessor(function(c) {
            return c.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
        .yAxis().ticks(6);


    let rankDim = ndx.dimension(dc.pluck("rank"));

    let salaryByRank = rankDim.group().reduce(
        function(c, v) {
            //Add function, run once for each record
            //thats added to the group
            c.count++;
            c.total += +v.salary;
            c.average = c.total / c.count;
            return c;

        },
        function(c, v) {
            //Remove function, run once for each record
            //thats removed to the group
            c.count--;
            c.count -= +v.salary;
            c.average = c.total / c.count;
            return c;

        },
        function() {
            //initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, avverage: 0 };
        });
        
        
    let rankChart = dc.barChart("#salary-by-rank");

    rankChart
        .width(chartWidth)
        .height(150)
        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
        .dimension(rankDim)
        .group(salaryByRank)
        .valueAccessor(function(c) {
            return c.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Rank")
        .yAxis().ticks(6);


    dc.renderAll();

}
