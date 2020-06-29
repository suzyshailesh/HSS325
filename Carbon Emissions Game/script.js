

// set the dimensions and margins of the line graph
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = (window.innerWidth/2) - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom - 200;

//set the dimensions and margins of the bar chart
var margin2 = {top: 20, right: 20, bottom: 40, left: 10},
    width2 = (window.innerWidth/2) - margin2.left - margin2.right,
    height2 = window.innerHeight - margin2.top - margin2.bottom - 200;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "display:block; margin-left:auto; margin-right:auto;")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//stuff for barchart
var svg2 = d3.select("#barchart")
  .append("svg")
  .attr("id", "svg_graph")
  .attr("style", "display:block; margin-left:auto; margin-right:auto;")

var g;

g = svg2.append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

g.append("g")
  .attr("class", "axis xaxis")

g.append("g")
  .attr("class", "axis yaxis");

svg2
    .attr("width", width2)
    .attr("height",height2)
    .attr("viewBox","-"+margin2.left+" -"+margin2.top+" "+(width2+margin2.left+margin2.right)+" "+(height2+margin2.top+margin2.bottom)); 

//create x axis for line graph
var x = d3.scaleLinear().range([0,width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","Xaxis")

x.domain([0, 50]);
svg.selectAll(".Xaxis")
  .call(xAxis);

svg.append("text")      // text label for the x axis
        .attr("class", "xLabel")
        .attr("x", width/2)
        .attr("y",  height + 40)
        .style("text-anchor", "middle")
        .text("Number of Years in the Future");


//create y axis for line graph
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","Yaxis")

y.domain([8, 16]);
svg.selectAll(".Yaxis")
  .call(yAxis);

svg.append("text")
        .attr("class", "yLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Carbon Emissions");


//axes for barchart
x2 = d3.scaleBand().rangeRound([0, width2]).padding(0.1);
y2 = d3.scaleLinear().rangeRound([height2, 0]);

x2.domain(["cost"]); //this just says, "the x axis is made up of categories defined by a given field"
y2.domain([0, 24]); 

//create the x axis
g.select(".xaxis")
  .attr("transform", "translate(0," + (height2 - 17) + ")")
  .call(d3.axisBottom(x2))
  .attr("class","Xaxis2")
;

//create the y axis
g.select(".yaxis")
  .call(g => g.select(".domain").remove())

var pred = 16; //predicted y-val for year 50
var num = 0; //number of wedges

//stores number for all possible wedges
var boxes = [0, 0, 0, 0, 0,
             0, 0, 0, 0, 0,
             0, 0, 0, 0, 0]

var prices = [1, 1, 1, 1, 2,
              3, 2, 1, 2, 2,
              3, 3, 2, 1, 1]

//at start, all text inputs set to 0
var str = "box";
for(var i = 1; i < 16; i++){
  var b = str.concat(i);
  document.getElementById(b).value = 0;
}

//update plot
function update(box) {

  var check = true; //make sure number of wedges do not exceed 8
  var inp = 0; //text input value
  var old = 0; //old value for changed box
  var index = -1; //index of box changed
  var total_price = 0;

  //make sure no rules have been broken
  function check_num(box){ 
    if(box != "start"){
      var inp_box = document.getElementById(box); //input wedge
      inp = parseInt(inp_box.value); //input value
      index = parseInt(box[box.length - 1] - 1); //boxes index number for input wedge

      old = boxes[index]; //stores old value in case of rule break
      boxes[index] = inp; //updates boxes[index]

      //counts total number of wedges
      var check_num = 0;
      for(var i = 0; i < 15; i++){
        check_num = check_num + boxes[i];
      }

      if(check_num > 8){
      //if there is a rule break
        boxes[index] = old; //replace boxes[index]
        document.getElementById(box).value = old; //replace value in text box
        alert("You can only choose 8 wedges.") //alert user
        return false;
      }
      else{
      //if no rules are broken
        num = check_num; //update num
        pred = 16 - num; //update pred

        for(var i = 0; i < 15; i++){
          total_price = total_price + (prices[i] * boxes[i]);
        }

        return true;
      }
    }
    else{
      return true;
    }

  }

  check = check_num(box); //make sure number of wedges do not exceed 8

  if(check == true){
  //if valid update

  //create dataset
    var data = [
      {x: 0, y: 8},
      {x: 50, y: pred},
    ];

    var red_data = [
      {x: 0, y: 8},
      {x: 50, y: 16},
    ];

    var data2 = [
      {x: "cost", y: total_price}
    ];


    // // update line
    var u = svg.selectAll(".line")
      .data([data], function(d){ return d.x });

    u
      .enter()
      .append("path")
      .attr("class","line")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); }))

    // var red_area = svg.append("path")
    //   .data([red_data])
    //   .attr("class", "redArea")
    //   .merge(red_area)
    //   .transition()
    //   .duration(1000)
    //   .attr("d", d3.area()
    //     .x(function(d) { return x(d.x); })
    //     .y0(height)
    //     .y1(function(d) { return y(d.y); }))

    //update area  
    var area = svg.selectAll(".area")
      .data([data]);

    area
      .enter()
      .append("path")
      .attr("class", "area")
      .merge(area)
      .transition()
      .duration(1000)
      .attr("d", d3.area()
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); }))

    //update area
    var bar = svg2.selectAll(".bar")
      .data(data2) 
    
    bar
      .enter()
      .append("rect") 
      .attr("class", "bar") 
      .merge(bar)
      .transition()
      .duration(1000)
      .attr("x", function(d) { return x2(d["x"]); })  
      .attr("y", function(d) { return y2(d["y"]); }) 
      .attr("width", x2.bandwidth()) 
      .attr("height", function(d) { return height2 - y2(d["y"]); }) 

  }

}

// run update function at beginning
update("start");
