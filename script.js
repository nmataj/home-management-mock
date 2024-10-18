var tinycolor = require("tinycolor2");

const color = tinycolor({ r: 0, g: 220, b: 140, w: 0 });
const factor = Math.max(color.getLuminance() * 6, 1);

const colors = [];
for (;;) {
    color.darken(factor);
    const rgb = color.toRgb();
    console.log(rgb, color.getLuminance());
    colors.unshift(rgb);
    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        break;
    }
}
console.log('factor', factor, 'steps', colors.length);
//console.log(colors);