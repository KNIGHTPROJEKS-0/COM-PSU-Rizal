'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3ChartProps {
  data: any[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const D3Chart: React.FC<D3ChartProps> = ({
  data,
  width = 400,
  height = 300,
  margin = { top: 20, right: 30, bottom: 30, left: 40 }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i.toString()) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', '#3b82f6');

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

  }, [data, width, height, margin]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="d3-chart"
    />
  );
};

export default D3Chart;