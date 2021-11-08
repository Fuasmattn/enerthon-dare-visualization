import React, { useContext, useEffect, useRef } from 'react';
import { motion, useCycle } from 'framer-motion';
import { UIContext } from '../../context/UIStateProvider';
import {
  d3Area,
  d3AxisBottom,
  d3CurveStepAfter,
  d3Extent,
  d3LeastIndex,
  d3Pointer,
  d3ScaleLinear,
  d3ScaleTime,
  d3Select,
  d3TimeFormat,
} from '../../utils/d3Modules';
import { ActionType } from '../../context/types';
import { DataContext } from '../../context/DataProvider';

export const Timeline: React.FC = () => {
  const { dispatch } = useContext(UIContext);
  const {
    data: { timeline, tickData },
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

  const lineData = tickData.map((d) => ({
    x: new Date(d.time),
    y: d.NetStates ? d.NetStates[0].ist : 0, // TODO: make net selectable
    pot_minus: d.NetStates[0] ? d.NetStates[0].pot_minus : 0,
    pot_plus: d.NetStates[0] ? d.NetStates[0].pot_plus : 0,
  }));

  const dataYrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.y);

  const yScale = d3ScaleLinear()
    // @ts-ignore
    .domain(dataYrange)
    .range([100 - 20, 0]);

  const dataXrange = d3Extent(lineData, (d: { x: Date; y: number }) => d.x);

  const xScale = d3ScaleTime()
    // @ts-ignore
    .domain(dataXrange)
    .range([0, 4000]);

  const minX = xScale(lineData[0].x);
  const maxX = xScale(lineData[lineData.length - 1].x);
  const overwidth = Math.max(maxX - minX, width) + margin.left + margin.right;

  const renderEventTimeline = () => {
    const paddingTop = 10;
    const height = 60;
    const svg = d3Select('#event-timeline');
    svg.attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();

    const defs = svg.append('defs');

    defs
      .append('marker')
      .attr('id', 'timeline-arrow')
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
      .attr('x1', (d) => xScale(d.start) + 10)
      .attr('y1', 30)
      .attr('x2', (d) => xScale(d.finish))
      .attr('y2', 30)
      .attr('stroke', 'black')
      .style('stroke-dasharray', '2,5')
      .attr('stroke-width', 2);

    svg
      .append('g')
      .selectAll('text')
      .data(timeline)
      .enter()
      .append('text')
      .attr('transform', `translate(${padding.left - 15}, ${paddingTop})`)
      .text((d) => `${Math.abs(d.value).toFixed(2)} MW`)
      .style('font-size', 13)
      .attr('x', (d) => xScale(d.start) + 25)
      .attr('text-anchor', 'start')
      .attr('y', 20);

    svg
      .append('g')
      .selectAll('line')
      .data(timeline)
      .enter()
      .append('line')
      .attr('transform', `translate(${padding.left}, ${paddingTop})`)
      .attr('x1', (d) => xScale(d.start))
      .attr('x2', (d) => xScale(d.start))
      .attr('y1', (d) => (d.value < 0 ? 5 : 30))
      .attr('y2', (d) => (d.value < 0 ? 30 : 5))
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('marker-end', 'url(#timeline-arrow)');
  };

  const renderPowerTimeline = () => {
    const paddingTop = 10;
    const strokeWidth = 2;
    const height = 150;
    const svg = d3Select('#power-timeline').attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();

    const line = d3Area()
      .curve(d3CurveStepAfter)
      // @ts-ignore
      .x((d) => xScale(d.x))
      // @ts-ignore
      .y((d) => yScale(d.y));

    const areaPotMinus = d3Area()
      .curve(d3CurveStepAfter)
      // @ts-ignore
      .x((d) => xScale(d.x))
      // @ts-ignore
      .y0((d) => yScale(d.y))
      // @ts-ignore
      .y1((d) => yScale(d.y) + yScale(d.pot_minus));

    const areaPotPlus = d3Area()
      .curve(d3CurveStepAfter)
      // @ts-ignore
      .x((d) => xScale(d.x))
      // @ts-ignore
      .y0((d) => yScale(d.y))
      // @ts-ignore
      .y1((d) => yScale(d.y) - yScale(d.pot_plus));

    svg
      .append('g')
      .append('path')
      .datum(lineData.map((d) => ({ x: d.x, y: d.y })))
      .attr('transform', `translate(${padding.left}, ${paddingTop})`)
      .attr('stroke', '#7CBE81')
      .attr('stroke-width', strokeWidth)
      // @ts-ignore
      .attr('d', line(lineData));

    // svg
    //   .append('g')
    //   .append('path')
    //   .datum(lineData.map((d) => ({ x: d.x, y: d.y })))
    //   .attr('transform', `translate(${padding.left}, ${paddingTop})`)
    //   .attr('fill', '#ffffff80')
    //   .attr('stroke-width', strokeWidth)
    //   // @ts-ignore
    //   .attr('d', areaPotMinus(lineData));

    //   svg
    //   .append('g')
    //   .append('path')
    //   .datum(lineData.map((d) => ({ x: d.x, y: d.y })))
    //   .attr('transform', `translate(${padding.left}, ${paddingTop})`)
    //   .attr('fill', '#7CBE8120')
    //   .attr('stroke-width', strokeWidth)
    //   // @ts-ignore
    //   .attr('d', areaPotPlus(lineData));
  };

  const renderMouseOver = () => {
    const height = 240;
    const svg = d3Select('#mouseover');
    svg.attr('height', height).attr('width', overwidth);

    svg.selectAll('g').remove();
    const mouseG = svg.append('g').attr('class', 'mouse-over-effects');

    svg.append('g').append('text').attr('id', 'tooltip').attr('x', 50).attr('y', 50);

    mouseG
      .append('path')
      .attr('class', 'mouse-line')
      .style('stroke', '#636363')
      .style('stroke-width', '1px')
      .style('opacity', '0');

    mouseG
      .append('rect')
      .attr('width', overwidth)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () {
        d3Select('.mouse-line').style('opacity', '0');
        d3Select('#tooltip').style('opacity', '0');
      })
      .on('mouseover', function () {
        d3Select('.mouse-line').style('opacity', '1');
        d3Select('#tooltip').style('opacity', '1');
      })
      .on('mousemove', function (event) {
        const mousePosition = d3Pointer(event);
        d3Select('.mouse-line').attr('d', function () {
          return `M${mousePosition[0]}, ${height} ${mousePosition[0]}, -100`;
        });

        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d: { x: Date; y: number }): number =>
          // @ts-ignore
          Math.abs(d.x - hoveredDate);

        const closestIndex =
          d3LeastIndex(lineData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)) || 0;
        const closestDataPoint = lineData[closestIndex];

        // const closestXValue = closestDataPoint.x;
        const closestYValue = closestDataPoint.y;

        d3Select('#tooltip')
          .text(`${closestYValue.toFixed(2)} MW`)
          .attr('x', mousePosition[0] + 20)
          .attr('y', yScale(closestYValue) + 50);
      });
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
    renderMouseOver();

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
      <div className="d-flex justify-content-between mb-3 px-4 align-items-center">
        <p className="fs-5 mb-0">
          <strong>
            <span style={{ color: '#636363' }}>DA</span>
            <span style={{ color: '#7CBE82' }}>/</span>
            <span style={{ color: '#636363' }}>RE</span>
          </strong>{' '}
          Timeline
        </p>
        <p className="mb-0">
          Selected Grid: <strong>Mitte</strong>
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
      <div className="d-flex">
        <div className="position-relative" style={{ overflowX: 'scroll' }} id="container" ref={containerRef}>
          <svg className="position-absolute left-0 top-0" id="mouseover"></svg>
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
