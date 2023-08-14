import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
} from 'd3';

const titleText = 'Despesas';
const xAxisLabelText = 'Valores empenhados';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
  const xValue = (d) => d['Empenhado'];
  const yValue = (d) => d.Ano;
  const margin = {
    top: 50,
    right: 60,
    bottom: 17,
    left: 150,
  };
  const innerWidth =
    width - margin.left - margin.right;
  const innerHeight =
    height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  console.log("range " + xScale.range());
  console.log("domain -> "+ xScale.domain());


  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`
    );

  const xAxisTickFormat = (number) =>
    format('.3s')(number);

  const xAxis = axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);

  g.append('g')
    .call(axisLeft(yScale))
    .selectAll('.domain, .tick line')
    .remove();

  const xAxisG = g
    .append('g')
    .call(xAxis)
    .attr(
      'transform',
      `translate(0,${innerHeight})`
    );

  xAxisG.select('.domain').remove();

  xAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', 65)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabelText);

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', (d) => yScale(yValue(d)))
    .attr('width', (d) => xScale(xValue(d)))
    .attr('height', yScale.bandwidth());

  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
    .text(titleText);
};

csv('orcamentoData.csv').then((data) => {
  data.forEach((d) => {
    //populationNew = +d.population;
    d.population= +d.population;
  });
  render(data);
});
