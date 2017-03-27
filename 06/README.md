an iteration that fills the inside of a 142px by 22px space 
--- 

Uses `geoVoronoi` to compute triangles from a set of points on the sphere.

Antenna radomes make use of quasi-random lattices to help limiting <a href="http://www.radome.net/tl.html#pattern">signal degradation</a>.

The points on the are distributed by a <a href="https://web.archive.org/web/20160709100123/http://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere">Fibonnaci sphere algorithm</a>. Once could probably use <a href="https://www.jasondavies.com/maps/random-points/">Poisson-disc sampling</a> instead.

Inspiration: <a href="https://theintercept.com/2016/09/06/nsa-menwith-hill-targeted-killing-surveillance/">Trevor Paglen’s pictures of radomes at the NSA’s Menwith Hill Station</a> in the UK.
