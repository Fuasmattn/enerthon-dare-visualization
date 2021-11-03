import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import { UIContext } from '../../context/UIStateProvider';
import {
  d3Area,
  d3AxisBottom,
  d3CurveStepAfter,
  d3Extent,
  d3Line,
  d3ScaleLinear,
  d3ScaleTime,
  d3Select,
  d3TimeFormat,
} from '../../utils/d3Modules';
import { ActionType } from '../../context/types';

// const mockdata = {
//   1635953982: {
//     powerplants: [
//       {
//         name: 'sonne001',
//         ist: 5,
//         potential_plus: 1,
//         potential_minus: 2,
//         command: 0,
//       },
//     ],

//     netStates: {
//       mitte: {
//         ist: 12,
//         potential_plus: 10,
//         potential_minus: 4,
//       },
//     },
//   },
// 1635951282: {
//   powerplants: {
//     sonne001: {
//       ist: 5,
//       potential_plus: 1,
//       potential_minus: 2,
//       command: 1,
//     },
//   },
//   netStates: {
//     mitte: {
//       ist: 12,
//       potential_plus: 10,
//       potential_minus: 4,
//     },
//   },
// },
// 1635952182: {
//   powerplants: {
//     sonne001: {
//       ist: 6,
//       potential_plus: 0,
//       potential_minus: 3,
//       command: 0,
//     },
//   },
//   netStates: {
//     mitte: {
//       ist: 13,
//       potential_plus: 9,
//       potential_minus: 5,
//     },
//   },
// },
// };

const data = [
  { start: new Date('2021-08-01T12:00Z'), finish: new Date('2021-08-01T15:00Z'), value: 1 },
  { start: new Date('2021-08-01T15:15Z'), finish: new Date('2021-08-01T15:45Z'), value: -1 },
  { start: new Date('2021-08-01T16:00Z'), finish: new Date('2021-08-01T17:00Z'), value: -1 },
  { start: new Date('2021-08-01T20:00Z'), finish: new Date('2021-08-01T23:00Z'), value: 3.5 },
];

const lineData = [
  { x: new Date('2021-08-01T12:00Z'), y: 13 },
  { x: new Date('2021-08-01T15:00Z'), y: 14 },
  { x: new Date('2021-08-01T15:15Z'), y: 14 },
  { x: new Date('2021-08-01T15:45Z'), y: 13 },
  { x: new Date('2021-08-01T16:00Z'), y: 13 },
  { x: new Date('2021-08-01T17:00Z'), y: 12 },
  { x: new Date('2021-08-01T20:00Z'), y: 12 },
  { x: new Date('2021-08-01T23:00Z'), y: 15.5 },
  { x: new Date('2021-08-02T01:00Z'), y: 15.5 },
];

export const Timeline: React.FC = () => {
  const { state, dispatch } = useContext(UIContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState(0);

  const paddingLeft = 150;

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
      .range([0, width - paddingLeft]);

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
      .data(data)
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
      .data(data)
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
      .data(data)
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

    // svg
    //   .append('g')
    //   .selectAll('line')
    //   .data(data)
    //   .enter()
    //   .append('line')
    //   .attr('transform', `translate(15, ${paddingTop})`)
    //   .attr('x1', (d) => xScale(d.finish))
    //   .attr('x2', (d) => xScale(d.finish))
    //   .attr('y1', 10)
    //   .attr('y2', 31)
    //   .attr('stroke-width', 2)
    //   .attr('stroke', 'black');
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
      .range([0, width - paddingLeft]);

    const yScale = d3ScaleLinear()
      // @ts-ignore
      .domain(dataYrange)
      .range([height - paddingTop - strokeWidth - 20, 20]);

    const line = d3Area()
      .curve(d3CurveStepAfter)
      // @ts-ignore
      .x((d) => xScale(d.x))
      // @ts-ignore
      // .y((d) => yScale(d.y));
      .y0((d) => yScale(d.y))
      // @ts-ignore
      .y1((d) => height - paddingTop - strokeWidth);

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
      .range([0, width - paddingLeft]);

    // @ts-ignore
    const xAxis = d3AxisBottom(xScale).tickFormat(d3TimeFormat('%H:%m'));
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTick((tick) => tick + 1);
  //     if (tick === 3) {
  //       data.push({ start: new Date('2021-08-01T20:00Z'), finish: new Date('2021-08-01T23:00Z'), value: 3.5 });
  //       lineData.push({ x: new Date('2021-08-01T23:00Z'), y: 15.5 }, { x: new Date('2021-08-02T01:00Z'), y: 15.5 });

  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // });

  useEffect(() => {
    renderTimeline();

    window.addEventListener('resize', renderTimeline);

    return () => {
      window.removeEventListener('resize', renderTimeline);
    };
  });

  const [animate, cycle] = useCycle({ y: 0 }, { y: 270 });
  const [animateBtn, cycleBtn] = useCycle(
    { rotate: 0, transition: { delay: 0.1, duration: 0.4 } },
    { rotate: -180, transition: { delay: 0.1, duration: 0.4 } },
  );

  return (
    <motion.div
      animate={animate}
      transition={{ duration: 0.2 }}
      className="bg-white p-4 pt-3 rounded shadow"
      style={{ height: '100%' }}
    >
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <p className="mb-0">
          <strong>DA/RE</strong> Timeline
        </p>
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
      <div style={{ paddingLeft: '0', paddingRight: '5%' }}>
        <div ref={containerRef}>
          <svg id="power-timeline"></svg>
          <svg id="event-timeline"></svg>
          <svg id="timeline-axis"></svg>
        </div>
      </div>
    </motion.div>
  );
};
