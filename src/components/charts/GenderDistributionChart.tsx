
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

const GenderDistributionChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Data for the chart (we'd normally load this from the CSV)
    const data = [
      { gender: 'Male', count: 750 },
      { gender: 'Female', count: 420 },
      { gender: 'Other/Non-Binary', count: 89 }
    ];

    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.gender))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) as number])
      .nice()
      .range([innerHeight, 0]);

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.gender))
      .range(['#9b87f5', '#0EA5E9', '#7E69AB']);

    // Add the X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', '12px');

    // Add X-axis label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('fill', '#666')
      .text('Gender');

    // Add the Y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px');

    // Add Y-axis label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -innerHeight / 2)
      .attr('fill', '#666')
      .text('Number of Respondents');

    // Create tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    // Add the bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.gender) as number)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', d => color(d.gender) as string)
      .attr('rx', 4)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.gender}</strong>: ${d.count} respondents`)
          .style('left', `${event.pageX}px`)
          .style('top', `${(event.pageY - 28)}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.count))
      .attr('height', d => innerHeight - y(d.count));

    // Add values on top of bars
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('text-anchor', 'middle')
      .attr('x', d => (x(d.gender) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text(d => d.count)
      .style('opacity', 0)
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 1);

    // Add annotations
    g.append('text')
      .attr('class', 'annotation')
      .attr('x', x('Male') as number + x.bandwidth() / 2)
      .attr('y', y(800))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .text('59.6% Male')
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);

    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Gender Distribution in Tech');
  }, []);

  return (
    <D3Container
      title="Gender Distribution"
      description="Breakdown of survey respondents by gender identity"
      renderChart={renderChart}
      className="col-span-1 md:col-span-2"
    />
  );
};

export default GenderDistributionChart;
