import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import { UIContext } from '../../context/UIStateProvider';
import {
  d3Area,
  d3AxisBottom,
  d3CurveStepAfter,
  d3Extent,
  d3ScaleLinear,
  d3ScaleTime,
  d3Select,
  d3TimeFormat,
} from '../../utils/d3Modules';
import { ActionType } from '../../context/types';
import { DataContext } from '../../context/DataProvider';

// const lineData = [
//   { x: 1622629800000, y: 13 },
//   { x: 1622670300000, y: 11.5 },
//   { x: 1622802600000, y: 11.5 },
//   { x: 1622843100000, y: 10 },
//   { x: 1622930400000, y: 10 },
//   { x: 1622956500000, y: 10.5 },
//   { x: 1622975400000, y: 10.5 },
//   { x: 1623015900000, y: 9 },
// ].map((d) => ({ ...d, x: new Date(d.x) }));

export const Timeline: React.FC = () => {
  const { state, dispatch } = useContext(UIContext);
  const {
    data: { timeline, tickData, currentTick },
  } = useContext(DataContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const paddingLeft = 150;
  const paddingRight = 170;

  const lineData = tickData
    // .slice(-20)
    .map((d) => ({
      x: new Date(d.time),
      y: d.NetStates[0].ist, // TODO: make net selectable
    }));

  console.debug('lineData', lineData);

  const renderEventTimeline = () => {
    const paddingTop = 20;
    const height = 60;
    const width = containerRef.current?.getBoundingClientRect().width || 0;
    const svg = d3Select('#event-timeline');
    svg.attr('height', height).attr('width', width);

    svg.selectAll('g').remove();

    const dataXrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.x);

    const xScale = d3ScaleTime()
      // @ts-ignore
      .domain(dataXrange)
      .range([0, width - paddingRight]);

    const defs = svg.append('defs');

    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'arrowHead');

    svg
      .append('g')
      .selectAll('line')
      .data(timeline)
      .enter()
      .append('line')
      .attr('transform', `translate(${paddingLeft}, ${paddingTop})`)
      .attr('x1', (d) => xScale(d.start) + 5)
      .attr('y1', 30)
      .attr('x2', (d) => xScale(d.finish) - 5)
      .attr('y2', 30)
      .attr('stroke', 'black')
      .style('stroke-dasharray', '2,2')
      .attr('stroke-width', 2);

    svg
      .append('g')
      .selectAll('text')
      .data(timeline)
      .enter()
      .append('text')
      .attr('transform', `translate(${paddingLeft - 15}, ${paddingTop})`)
      .text((d) => `${Math.abs(d.value)} MW`)
      .style('font-size', 13)
      .attr('x', (d) => xScale(d.start) + 22)
      .attr('text-anchor', 'start')
      .attr('y', 25);

    svg
      .append('g')
      .append('text')
      .attr('transform', `translate(0, ${paddingTop})`)
      .text('Redispatch Events')
      .style('font-size', 13)
      .attr('x', 0)
      .attr('text-anchor', 'start')
      .attr('y', 25);

    svg
      .append('g')
      .selectAll('line')
      .data(timeline)
      .enter()
      .append('line')
      .attr('transform', `translate(${paddingLeft}, ${paddingTop})`)
      .attr('x1', (d) => xScale(d.start))
      .attr('x2', (d) => xScale(d.start))
      .attr('y1', (d) => (d.value < 0 ? 10 : 30))
      .attr('y2', (d) => (d.value < 0 ? 30 : 10))
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('marker-end', 'url(#arrow)');
  };

  const renderPowerTimeline = () => {
    const paddingTop = 10;
    const strokeWidth = 2;
    const height = 150;
    const width = containerRef.current?.getBoundingClientRect().width || 0;
    const svg = d3Select('#power-timeline').attr('height', height).attr('width', width);

    svg.selectAll('g').remove();

    const dataXrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.x);
    const dataYrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.y);

    const xScale = d3ScaleTime()
      // @ts-ignore
      .domain(dataXrange)
      .range([0, width - paddingRight]);

    const yScale = d3ScaleLinear()
      // @ts-ignore
      .domain(dataYrange)
      .range([height - paddingTop - strokeWidth - 20, 0]);

    const line = d3Area()
      .curve(d3CurveStepAfter)
      // @ts-ignore
      .x((d) => xScale(d.x))
      // @ts-ignore
      .y((d) => yScale(d.y));
    // .y0((d) => yScale(d.y))
    // @ts-ignore
    // .y1((d) => height - paddingTop - strokeWidth - 20);

    svg
      .append('g')
      .append('path')
      .datum(lineData)
      .attr('transform', `translate(${paddingLeft}, ${paddingTop})`)
      .attr('fill', '#7CBE8150')
      .attr('stroke', '#7CBE81')
      .attr('stroke-width', strokeWidth)
      // @ts-ignore
      .attr('d', line(lineData));

    svg
      .append('g')
      .append('text')
      .attr('transform', `translate(0, ${paddingTop})`)
      .text('Grid Power Current')
      .style('font-size', 13)
      .attr('x', 0)
      .attr('text-anchor', 'start')
      .attr('y', '75%');
  };

  const renderAxis = () => {
    const paddingTop = 0;
    const height = 20;
    const width = containerRef.current?.getBoundingClientRect().width || 0;
    const svg = d3Select('#timeline-axis');
    svg.attr('height', height).attr('width', width);

    svg.selectAll('g').remove();

    const dataXrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.x);

    const xScale = d3ScaleTime()
      // @ts-ignore
      .domain(dataXrange)
      .range([0, width - paddingRight]);

    // @ts-ignore
    const xAxis = d3AxisBottom(xScale).tickFormat(d3TimeFormat('%B %d %H:%m'));
    svg
      .append('g')
      .attr('transform', `translate(${paddingLeft}, ${paddingTop * 4})`)
      .call(xAxis);
  };

  const renderTimeline = () => {
    renderEventTimeline();
    renderPowerTimeline();
    renderAxis();
  };

  useEffect(() => {
    renderTimeline();

    window.addEventListener('resize', renderTimeline);

    return () => {
      window.removeEventListener('resize', renderTimeline);
    };
  });

  const [animate, cycle] = useCycle({ y: 20 }, { y: 270 });
  const [animateBtn, cycleBtn] = useCycle(
    { rotate: 0, transition: { delay: 0.1, duration: 0.4 } },
    { rotate: -180, transition: { delay: 0.1, duration: 0.4 } },
  );

  return (
    <motion.div
      animate={animate}
      initial={{ y: 270 }}
      transition={{ duration: 1 }}
      className="bg-white p-4 pt-3 rounded shadow"
      style={{ height: '100%' }}
    >
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <p className="mb-0">
          <strong>DA/RE</strong> Timeline
        </p>
        <p>tick: {currentTick}</p>
        <motion.button
          type="button"
          animate={animateBtn}
          style={{}}
          className="btn btn-light"
          aria-label="Close"
          onClick={() => {
            dispatch({ type: ActionType.TOGGLE_TIMELINE });
            cycle();
            cycleBtn();
          }}
        >
          <i className="fs-5 bi bi-chevron-down"></i>
        </motion.button>
      </div>
      <div ref={containerRef}>
        <svg id="power-timeline"></svg>
        <svg id="event-timeline"></svg>
        <svg id="timeline-axis"></svg>
      </div>
    </motion.div>
  );
};
