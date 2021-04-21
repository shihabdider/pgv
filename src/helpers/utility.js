import { Table } from "apache-arrow";
import * as d3 from "d3";

export async function loadArrowTable(file) {
  let results = await Table.from(fetch(file));
  let table = await results;
  return results;
}

export function rgbtoInteger(color) {
  let rgb = d3.rgb(color);
  return Math.floor(rgb.r) * 65536 + Math.floor(rgb.g) * 256 + Math.floor(rgb.b);
}

export function measureText(string, fontSize = 10) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.278125,0.278125,0.35625,0.55625,0.55625,0.890625,0.6671875,0.1921875,0.334375,0.334375,0.390625,0.584375,0.278125,0.334375,0.278125,0.278125,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.278125,0.278125,0.584375,0.584375,0.584375,0.55625,1.015625,0.6703125,0.6671875,0.7234375,0.7234375,0.6671875,0.6109375,0.778125,0.7234375,0.278125,0.5,0.6671875,0.55625,0.834375,0.7234375,0.778125,0.6671875,0.778125,0.7234375,0.6671875,0.6109375,0.7234375,0.6671875,0.9453125,0.6671875,0.6671875,0.6109375,0.278125,0.278125,0.278125,0.4703125,0.584375,0.334375,0.55625,0.55625,0.5,0.55625,0.55625,0.3125,0.55625,0.55625,0.2234375,0.2703125,0.5,0.2234375,0.834375,0.55625,0.55625,0.55625,0.55625,0.346875,0.5,0.278125,0.55625,0.5,0.7234375,0.5,0.5,0.5,0.334375,0.2609375,0.334375,0.584375]
  const avg = 0.528733552631579
  return string
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize
}

export function humanize(str) {
  return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
}