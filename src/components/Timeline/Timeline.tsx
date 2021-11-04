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

  const width = containerRef.current?.getBoundingClientRect().width || 0;

  const padding = {
    left: 0,
    right: 150,
  };
  const margin = {
    left: 50,
    right: 50,
  };

  const lineData = tickData
    // .slice(-20)
    .map((d) => ({
      x: new Date(d.time),
      y: d.NetStates[0].ist, // TODO: make net selectable
    }));

  const dataXrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.x);

  const xScale = d3ScaleTime()
    // @ts-ignore
    .domain(dataXrange)
    .range([0, 4000]);

  const minX = xScale(lineData[0].x);
  const maxX = xScale(lineData[lineData.length - 1].x);
  const overwidth = Math.max(maxX - minX, width) + margin.left + margin.right;

  const renderEventTimeline = () => {
    const paddingTop = 20;
    const height = 60;
    const svg = d3Select('#event-timeline');
    svg.attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();

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
      .attr('transform', `translate(${padding.left}, ${paddingTop})`)
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
      .attr('transform', `translate(${padding.left - 15}, ${paddingTop})`)
      .text((d) => `${Math.abs(d.value)} MW`)
      .style('font-size', 13)
      .attr('x', (d) => xScale(d.start) + 22)
      .attr('text-anchor', 'start')
      .attr('y', 25);

    svg
      .append('g')
      .selectAll('line')
      .data(timeline)
      .enter()
      .append('line')
      .attr('transform', `translate(${padding.left}, ${paddingTop})`)
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
    const svg = d3Select('#power-timeline').attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();

    const dataYrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.y);

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
      .attr('transform', `translate(${padding.left}, ${paddingTop})`)
      .attr('fill', '#7CBE8150')
      .attr('stroke', '#7CBE81')
      .attr('stroke-width', strokeWidth)
      // @ts-ignore
      .attr('d', line(lineData));
  };

  const renderAxis = () => {
    const paddingTop = 0;
    const height = 30;
    const svg = d3Select('#timeline-axis');
    svg.attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();

    // @ts-ignore
    const xAxis = d3AxisBottom(xScale).tickFormat(d3TimeFormat('%B %d %H:%m'));
    svg
      .append('g')
      .attr('transform', `translate(${padding.left}, ${paddingTop * 4})`)
      .call(xAxis);
  };

  const renderTimeline = () => {
    renderEventTimeline();
    renderPowerTimeline();
    renderAxis();

    containerRef.current && containerRef.current.scrollBy(overwidth, 0);
  };

  useEffect(() => {
    renderTimeline();

    window.addEventListener('resize', renderTimeline);

    return () => {
      window.removeEventListener('resize', renderTimeline);
    };
  });

  const [animate, cycle] = useCycle({ y: 20 }, { y: 280 });
  const [animateBtn, cycleBtn] = useCycle(
    { rotate: 0, transition: { delay: 0.1, duration: 0.4 } },
    { rotate: -180, transition: { delay: 0.1, duration: 0.4 } },
  );

  return (
    <motion.div
      animate={animate}
      initial={{ y: 280 }}
      transition={{ duration: 1 }}
      className="bg-white p-4 pt-3 px-0 rounded shadow"
      style={{ height: '100%' }}
    >
      <div className="d-flex justify-content-between mb-3 ps-4 align-items-center">
        <p className="mb-0">
          <strong>DA/RE</strong> Timeline
        </p>
        <p>debug tick: {currentTick}</p>
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
      <div className="d-flex">
        <div style={{ overflowX: 'scroll' }} id="container" ref={containerRef}>
          <svg style={{ background: '#7CBE8120' }} id="power-timeline"></svg>
          <svg style={{ background: '#63636320' }} id="event-timeline"></svg>
          <svg id="timeline-axis"></svg>
        </div>
        <div>
          <p className="text-start small mb-0 px-4 pt-2" style={{ borderLeft: '', width: 150, height: 150 }}>
            Power Grid Current
          </p>
          <p className="text-start small mb-0 px-4 pt-2" style={{ width: 150, height: 60 }}>
            Redispatch Events
          </p>
          <p className="text-start small mb-0 px-4 pt-2" style={{ width: 150, height: 30 }}>
            Date
          </p>
        </div>
      </div>
    </motion.div>
  );
};
