/* global d3 */

console.clear();
const radians = Math.PI / 180;
const spherical = (cartesian) => {
  const r = Math.sqrt((cartesian[0] * cartesian[0]) + (cartesian[1] * cartesian[1]));
  const lat = Math.atan2(cartesian[2], r);
  const lng = Math.atan2(cartesian[1], cartesian[0]);
  return [lng / radians, lat / radians];
};
const cartesian = (spherical) => {
  const lambda = spherical[0] * radians;
  const phi = spherical[1] * radians;
  const cosphi = Math.cos(phi);
  return [
    cosphi * Math.cos(lambda),
    cosphi * Math.sin(lambda),
    Math.sin(phi),
  ];
};

function fibonacciSphere(samples = 1, randomize = true) {
  let rnd = 1.0;
  if (randomize) {
    rnd = Math.random() * samples;
  }

  const offset = 2.0 / samples; // 2.0
  const increment = Math.PI * (3.0 - Math.sqrt(5.0));

  return d3.range(samples)
  .map((i) => {
    const y = ((i * offset) - 1) + (offset / 2);
    const r = Math.sqrt(1 - Math.pow(y, 2));
    const phi = ((i + rnd) % samples) * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    return ([x, y, z]);
  });
}
const sites = fibonacciSphere(150, false).map(spherical);

const svg = d3.select('svg');
const width = +svg.attr('width');

const color = t => d3.hsl(280 + (40 * t), 0.18, 0.4);

const voronoi = d3.geoVoronoi();

const init = 53;

const projection = d3.geoOrthographic()
  .rotate([init, 0]);

const path = d3.geoPath()
    .projection(projection);

const diagram = voronoi(sites);

const line = d3.line();

let polygon = svg.append('g')
  .attr('class', 'polygons')
  .selectAll('path')
  .data(voronoi.triangles(sites).features)
  .enter().append('path')
  .attr('d', d => line(d.coordinates[0].map(projection)))
  .each((d) => {
    const p = d.coordinates[0][0].slice();
    p[0] += projection.rotate()[0];
    const c = cartesian(p);
    d.depth = c[0];
  })
  .sort((a, b) => d3.ascending(a.depth, b.depth))
  .each((d, i) => {
    const k = (Math.PI * i) / sites.length;
    d.fill = color((1 + Math.cos(k)) / 2);
  });

const points = svg.append('g')
    .attr('class', 'points')
  .selectAll('path')
  .data(sites)
  .enter().append('path')
  .attr('d', d => path({
    type: 'Point',
    coordinates: d,
  }))
  .style('fill-opacity', 0)
  .style('stroke-opacity', 0);

redraw();

// if (true) {
d3.interval((el) => {
  projection.rotate([init + (el / 30), 0]);
  redraw();
}, 60);
// }


function redraw() {
  const manualTweakConstant = -220;
  const globalXOffset = (-1 * (width / 2)) + manualTweakConstant;
  polygon = polygon.call(redrawPolygon);
  d3.select('g.polygons')
    .attr('transform', `translate(${globalXOffset},${0})`);
  d3.select('g.points')
    .attr('transform', `translate(${globalXOffset},${0})`);
  svg
    .attr('viewBox', '0 0 500 500');
}

function redrawPolygon(polygon) {
  polygon
  .each((d) => {
    const p = d.coordinates[0][0].slice();
    p[0] += projection.rotate()[0];
    d.cartesian = cartesian(p);
  })
  .attr('fill', (d) => {
    const color = d.fill;
    const c = d.cartesian;
    const t = (2.2 - (2.0 * c[1]) - (1.4 * c[2])) / 6;
    return d3.interpolate('white', color)(t);
  })
  .attr('stroke', (d) => {
    const c = d.cartesian;
    const t = 0.2 + ((2.2 - (2.0 * c[1]) - (1.4 * c[2])) / 7);
    return d3.interpolate('white', 'black')(t);
  });


  points
    .attr('fill', (d) => {
      const p = d.slice();
      p[0] += projection.rotate()[0];
      const c = cartesian(p);
      const t = (2.2 - (2.0 * c[1]) - (1.4 * c[2])) / 6;
      return d3.interpolate('#eee', '#334')(t);
    });
}

