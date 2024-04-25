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

const roles = [
    'None',
    'Lord',
    'Lady',
    'Adventurer',
    'Paladin',
    'Algrim',
    'Woodsman',
    'Herdsman',
]

const spots = [
    'None',
    'Center',
    'NorthWest',
    'North',
    'NorthEast',
    'East',
    'SouthEast',
    'South',
    'SouthWest',
    'West',
]

// read logs.json

const logs = JSON.parse(fs.readFileSync('./logs.json', 'utf8'));

// get only the data with data[0] == 0x436861726163746572506f736974696f6e
const edges = logs.data.events.edges.filter((edge) => {
    return edge.node.data[0] === '0x436861726163746572506f736974696f6e' && edge.node.data[2] === '0x12b';
});

edges.reverse().forEach((e) => {
    const data = {
        game_id: parseInt(e.node.data[2], 16),
        tile_id: parseInt(e.node.data[3], 16),
        spot: spots[parseInt(e.node.data[4], 16)],
        player_id: e.node.data[6],
        role: roles[parseInt(e.node.data[7], 16)],
    }
    console.log(data)
})

// // Extract data and remove duplicated and reverse
// const data = edges.map((edge) => {
//     return {
//         plan: plans[parseInt(edge.node.data[6], 16)].toUpperCase(),
//         orientation: orientations[parseInt(edge.node.data[7], 16)],
//         x: parseInt(edge.node.data[8], 16) - 2147483647,
//         y: parseInt(edge.node.data[9], 16) - 2147483647,
//         spot: parseInt(edge.node.data[10], 16) === 1,
//     };
// }).reverse().filter((d, i, self) => {
//     return i === self.findIndex((t) => (
//         t.plan === d.plan && t.orientation === d.orientation && t.x === d.x && t.y === d.y
//     ));
// });

// // show edges count

// data.forEach((d) => {
//     console.log(`Plan: ${d.plan}, Orientation: ${d.orientation}, X: ${d.x}, Y: ${d.y}, Spot: ${d.spot}`)
// })