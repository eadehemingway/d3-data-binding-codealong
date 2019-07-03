let data = [
  { id: 1, height: 90, liquidHeight: 35, color: '#FDA7DF' },
  { id: 2, height: 100, liquidHeight: 40, color: '#54a0ff' },
  { id: 3, height: 50, liquidHeight: 10, color: '#e84118' },
  { id: 4, height: 30, liquidHeight: 20, color: '#FF851B' },
  { id: 5, height: 80, liquidHeight: 30, color: '#3D9970' },
  { id: 6, height: 20, liquidHeight: 5, color: '#9980FA' }
];

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', 700)
  .attr('height', 500);

const vaseY = 300;
const vaseWidth = 15;
const margin = 230;
const padding = 60;

const vaseGroups = svg
  .selectAll('g.vase')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'vase');

vaseGroups
  .append('rect')
  .attr('class', 'vase')
  .attr('width', vaseWidth)
  .attr('height', d => d.height)
  .attr('x', (d, i) => i * padding + margin)
  .attr('y', d => vaseY - d.height)
  .attr('fill', 'none')
  .attr('stroke', d => d.color);

vaseGroups
  .append('rect')
  .attr('class', 'liquid')
  .attr('width', vaseWidth)
  .attr('height', d => d.liquidHeight)
  .attr('x', (_, i) => i * padding + margin)
  .attr('y', d => vaseY - d.liquidHeight)
  .attr('fill', d => d.color)
  .attr('stroke', d => d.color);

const updateLiquid = () => {
  vaseGroups
    .select('rect.liquid')
    .transition()
    .duration(1500)
    .ease(d3.easeElasticOut)
    .attr('height', d => d.liquidHeight)
    .attr('y', d => vaseY - d.liquidHeight);
};

updateLiquid();
///////////////////////////////////////////////////////////////////////////

const increaseButton = document.querySelector('#increase');
increaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const plusTen = d.liquidHeight + 10;
    const newLiquidHeight = plusTen > d.height ? d.height : plusTen;
    return { ...d, liquidHeight: newLiquidHeight };
  });
  data = newData;
  vaseGroups.data(newData);
  updateLiquid();
});

const decreaseButton = document.querySelector('#decrease');
decreaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const minusTen = d.liquidHeight - 10;
    const newLiquidHeight = minusTen > 0 ? minusTen : 0;
    return { ...d, liquidHeight: newLiquidHeight };
  });

  data = newData;
  vaseGroups.data(newData);
  updateLiquid();
});