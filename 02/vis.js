console.clear()
    var radians = Math.PI / 180;
    var spherical = function (cartesian) {
        var r = Math.sqrt(cartesian[0] * cartesian[0] + cartesian[1] * cartesian[1]),
            lat = Math.atan2(cartesian[2], r),
            lng = Math.atan2(cartesian[1], cartesian[0]);
        return [lng / radians, lat / radians];
    }
    var cartesian = function (spherical) {
        var lambda = spherical[0] * radians,
            phi = spherical[1] * radians,
            cosphi = Math.cos(phi);
        return [
    cosphi * Math.cos(lambda),
    cosphi * Math.sin(lambda),
    Math.sin(phi)
  ];
    }

  
  function fibonacci_sphere(samples=1, randomize=true){
    rnd = 1.
    if (randomize) {
        rnd = Math.random() * samples
    }

    var offset = 2./samples
    var increment = Math.PI * (3. - Math.sqrt(5.));

    return d3.range(samples)
    .map(function(i) {
        var y = ((i * offset) - 1) + (offset / 2),
            r = Math.sqrt(1 - Math.pow(y,2)),
            phi = ((i + rnd) % samples) * increment,
            x = Math.cos(phi) * r,
            z = Math.sin(phi) * r
        return([x,y,z])
    });
}
 var sites = fibonacci_sphere(150, false).map(spherical);
 
  
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = function(t) {
return d3.hsl(280+40*t, 0.18, 0.4)
} 
  
var voronoi = d3.geoVoronoi();
 
var init = 53;

var projection = d3.geoOrthographic().rotate([init,0]);
var path = d3.geoPath()
    .projection(projection);

var diagram = voronoi(sites);

var line = d3.line();
  
var polygon = svg.append("g")
    .attr("class", "polygons")
  .selectAll("path")
  .data(voronoi.triangles(sites).features)
  .enter().append("path")
  .attr("d", function(d) {
     return line(d.coordinates[0].map(projection))
  })
  .each(function(d){
    var p = d.coordinates[0][0].slice();
    p[0] += projection.rotate()[0]
    var c = cartesian(p);
    d.depth = c[0];
  })
  .sort(function(a,b){ return d3.ascending(a.depth, b.depth);})
  .each(function(d, i) {
    var k = Math.PI * i/sites.length;
    d.fill = color((1+Math.cos(k))/2);
  })

var points = svg.append("g")
    .attr("class", "points")
  .selectAll("path")
  .data(sites)
  .enter().append("path")
  .attr("d", function(d){
    return path({
      type: 'Point',
      coordinates: d
    })
  });

redraw();

if(true)
d3.interval(function(el){
  projection.rotate([init+el/30, 0]);
  redraw()
},60);
 
 
function redraw() {
  polygon = polygon.call(redrawPolygon);
}

function redrawPolygon(polygon) {
  polygon
  .each(function(d) {
    var p = d.coordinates[0][0].slice();
    p[0] += projection.rotate()[0]
    d.cartesian = cartesian(p);
  })
  .attr('fill', function(d) {
    var color = d.fill,
        c = d.cartesian,
        t = (2.2 -2.*c[1] -1.4*c[2])/6;
    return d3.interpolate('white', color)(t);
  })
  .attr('stroke', function(d) {
    var c = d.cartesian,
        t = 0.2+(2.2 -2.*c[1] -1.4*c[2])/7;
    return d3.interpolate('white', 'black')(t);
  });
  
  
  points
    .attr('fill', function(d) {
    var p = d.slice();
        p[0] += projection.rotate()[0];
    var c = cartesian(p),
        t = (2.2 -2.*c[1] -1.4*c[2])/6;
    return d3.interpolate('#eee', '#334')(t);
  })

}

