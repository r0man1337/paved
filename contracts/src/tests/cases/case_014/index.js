// import fs
const fs = require('fs');

const plans = [
    "none",
    "ccccccccc",
    "cccccfffc",
    "cccccfrfc",
    "cfcfccccc",
    "cfcfcfcfc",
    "cfcfcfffc",
    "cffcfcffc",
    "cfffcfffc",
    "cfffcfrfc",
    "fccfcccfc",
    "fccfcfcfc",
    "ffcfcccff",
    "ffcfcfcfc",
    "ffcfffccc",
    "ffcfffcfc",
    "ffcfffcff",
    "ffcfffffc",
    "ffffcccff",
    "ffffffcff",
    "rfffffcfr",
    "rfffrfcff",
    "rfffrfcfr",
    "rfffrfffr",
    "rfrfcccff",
    "rfrfcccfr",
    "rfrfffccc",
    "rfrfffcff",
    "rfrfffcfr",
    "rfrfffffr",
    "rfrfrfcff",
    "sfffffffr",
    "sfrfrfcfr",
    "sfrfrfffr",
    "sfrfrfrfr",
    "wcccccccc",
    "wffffffff",
    "wfffffffr",
]

const orientations = [
    'none',
    'north',
    'east',
    'south',
    'west',
]

// read logs.json

const logs = JSON.parse(fs.readFileSync('./logs.json', 'utf8'));

// get only the data with data[0] == 0x54696c65
const edges = logs.data.events.edges.filter((edge) => {
    return edge.node.data[0] === '0x54696c65' && edge.node.data[2] === '0x12b' && parseInt(edge.node.data[7], 16) != 0;
});

// Extract data and remove duplicated and reverse
const data = edges.map((edge) => {
    return {
        plan: plans[parseInt(edge.node.data[6], 16)].toUpperCase(),
        orientation: orientations[parseInt(edge.node.data[7], 16)],
        x: parseInt(edge.node.data[8], 16) - 2147483647,
        y: parseInt(edge.node.data[9], 16) - 2147483647,
        spot: parseInt(edge.node.data[10], 16) === 1,
    };
}).reverse().filter((d, i, self) => {
    return i === self.findIndex((t) => (
        t.plan === d.plan && t.orientation === d.orientation && t.x === d.x && t.y === d.y
    ));
});

// show edges count

data.forEach((d) => {
    console.log(`Plan: ${d.plan}, Orientation: ${d.orientation}, X: ${d.x}, Y: ${d.y}, Spot: ${d.spot}`)
})