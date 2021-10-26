import React, { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { d3AxisBottom, d3AxisLeft, d3ScaleLinear, d3Select } from '../../utils/d3Modules';

export const Visualization: React.FC = () => {
  const { data } = useData();

  const initViz = (selector: string, data: Array<{ x: number; y: number }>) => {
    const margin = { top: 10, right: 40, bottom: 30, left: 30 },
      width = 450 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3Select(selector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3ScaleLinear().domain([0, 100]).range([0, width]);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3AxisBottom(x));

    const y = d3ScaleLinear().domain([0, 100]).range([height, 0]);
    svg.append('g').call(d3AxisLeft(y));

    svg
      .selectAll()
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 5);
  };

  useEffect(() => {
    initViz('#dummy-viz', data);
  });

  return data.length ? <div id="dummy-viz"></div> : null;
};
