import Chart from './chart.js';
let elem = document.querySelector('#chart');
let data = JSON.parse("{\"labels\": [\"\u041f\u041d\", \"\u0412\u0422\", \"\u0421\u0420\", \"\u0427\u0422\", \"\u041f\u0422\", \"\u0421\u0411\", \"\u0412\u0421\"], \"data\": [[1222700.0, 1486750.0, 1076850.0, 1020049.0, 1244225.0, 391700.0, 5800.0, 0], [39080426.0, 22925053.0, 20343752.0, 99570962.0, 20883899.0, 84275119.0, 17001320.0, 0], [1202713.0, 1871238.0, 1998395.0, 1793702.0, 1763703.0, 1520269.0, 1258234.0, 0], [1471370.0, 679555.0, 376484.0, 1346913.0, 1411492.0, 618641.0, 157515.0, 0], [1006650.0, 817950.0, 646899.0, 575099.0, 2067200.0, 970549.0, 577531.0, 0], [5680050.0, 4426200.0, 4492150.0, 4394800.0, 4902400.0, 3444200.0, 2371150.0, 0]]}");
new Chart(elem, {
  data: [
    [0, 0, 0, 0],
  ],
  // ...data,
  style: {
    lines: {
      fill: '#33c3f0',
    },
    points: {
      fill: '#fff',
      stroke: '#33c3f0',
    }
  },
  styles: [
    {}
    ,
    {
      lines: {
        fill: 'rgb(0, 190, 31)',
      },
      points: {
        fill: 'rgb(0, 190, 31)',
        stroke: 'rgb(0, 190, 31)',
      }
    }
  ]
})
