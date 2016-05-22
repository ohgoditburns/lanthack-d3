//hiveplot
var width = 800,
    height = 700,
    innerRadius = 20,
    outerRadius = 350;

var angle = d3.scale.ordinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
    radius = d3.scale.linear().range([innerRadius, outerRadius]),
    color = d3.scale.category10().domain(d3.range(20));

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var force = d3.layout.force()
    .charge(-120)
    .gravity(1)
    .linkDistance(30)
    .size([600, 600]);

var force_svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600);

//tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:red'>" + d.name + "</span>";
  })

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

svg.call(tip);

d3.json("docs.json", function(json) {
  var nodes = json.nodes;
  var links = [];
  var link_refs = json.links;
  
  json.links.forEach(function(d) {
    links.push({source: nodes[d.source], target: nodes[d.target]})
  })


  


  hive = svg.selectAll(".axis")
      .data(d3.range(3))
    .enter().append("line")
      .attr("class", "axis")
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
      .attr("x1", radius.range()[0])
      .attr("x2", radius.range()[1]);

  link = link
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.hive.link()
      .angle(function(d) { return angle(d.x); })
      .radius(function(d) { return radius(d.y); }));


  node = node
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) {return d.pub;})
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
      .attr("cx", function(d) { return radius(d.y); })
      .attr("r", 2)
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted)
      .on("click", mouseclicked);


  

});

var force_nodes = [];
var force_links = [];

  force
        .nodes(force_nodes)
        .links(force_links)
        .start();
  var force_link = force_svg.selectAll(".link")
      .data(force_links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });


  var force_node = force_svg.selectAll(".node")
      .data(force_nodes);

  force.on("tick", function() {
    force_link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    force_node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
/**/

function degrees(radians) {
  return radians / Math.PI * 180 - 90;
}

function mouseovered(d) {
link
      .classed("link--selected", function(l) { if (l.target === d || l.source == d) return l.target.active = l.source.active = true; });

// set node--selected for every node connected to a selected link
node
      .classed("node--selected", function(n) { return n.active; });
tip.show(d);

}

function mouseouted(d) {
  node
      .classed("node--selected", false);
  link
      .classed("link--selected", false)
      .each(function(l) {
        l.target.active = false;
        l.source.active = false;
      });  

  tip.hide(d);    

}


function mouseclicked(d) {
force_nodes.length = 0;
force_links.length = 0;
force_nodes.push(d);
link.each(function(l) {
  if(l.target == d) force_nodes.push(l.source);
  if(l.source == d) force_nodes.push(l.target);
});

var links_to_draw =
  link.filter(
    function(l) {return  (force_nodes.indexOf(l.target) > -1) & (force_nodes.indexOf(l.source) > -1); }
    );
links_to_draw.each(function(l) {force_links.push(l)});

start();
}

function graphclick(d) {
  window.open(d.url); 
}

function start() {
  force_link = force_link.data(force.links(), function(d) { return d.source.name + "-" + d.target.name; });
  force_link.enter().insert("line", ".node").attr("class", "link").style("stroke-width", "1px");
  force_link.exit().remove();

  force_node = force_node.data(force.nodes(), function(d) { return d.name;});
  force_node
    .enter().append("circle")
      .attr("class", function(d) {return d.pub;})
      .attr("r", 5)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .on("click", graphclick)
      .call(force.drag);
  force_node.exit().remove();

  force.start();
}
