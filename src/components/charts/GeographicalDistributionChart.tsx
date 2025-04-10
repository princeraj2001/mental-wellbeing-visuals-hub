
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

// Define custom type for our data with the properties required by d3.forceSimulation
interface CountryNode extends d3.SimulationNodeDatum {
  id: string;
  country: string;
  value: number;
  total: number;
}

const GeographicalDistributionChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Define country data with mental health support ratings
    const data: CountryNode[] = [
      { id: "USA", country: "United States", value: 58, total: 751, x: 0, y: 0 },
      { id: "CAN", country: "Canada", value: 63, total: 87, x: 0, y: 0 },
      { id: "GBR", country: "United Kingdom", value: 49, total: 55, x: 0, y: 0 },
      { id: "DEU", country: "Germany", value: 71, total: 38, x: 0, y: 0 },
      { id: "AUS", country: "Australia", value: 52, total: 32, x: 0, y: 0 },
      { id: "IND", country: "India", value: 42, total: 26, x: 0, y: 0 },
      { id: "NLD", country: "Netherlands", value: 75, total: 22, x: 0, y: 0 },
      { id: "IRL", country: "Ireland", value: 61, total: 21, x: 0, y: 0 },
      { id: "BRA", country: "Brazil", value: 45, total: 19, x: 0, y: 0 },
      { id: "FRA", country: "France", value: 68, total: 16, x: 0, y: 0 }
    ];

    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
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

    // Create tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([40, 60, 80])
      .range(['#fb7185', '#9b87f5', '#0EA5E9'])
      .interpolate(d3.interpolateHcl);
      
    // Size scale for bubbles
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.total) as number])
      .range([10, 50]);

    // Create a force simulation
    const simulation = d3.forceSimulation(data)
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('charge', d3.forceManyBody().strength(5))
      .force('collide', d3.forceCollide().radius(d => sizeScale(d.total) + 2))
      .on('tick', ticked);

    // Create bubble groups
    const bubbles = g.selectAll('.bubble')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bubble')
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
          
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
          
        tooltip.html(
          `<strong>${d.country}</strong><br>
           Support Rating: ${d.value}%<br>
           Participants: ${d.total}`
        )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('stroke', 'white')
          .attr('stroke-width', 1);
          
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add the bubbles with animation
    bubbles.append('circle')
      .attr('r', 0)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .transition()
      .delay((d, i) => i * 50)
      .duration(800)
      .attr('r', d => sizeScale(d.total));

    // Add country codes
    bubbles.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', d => Math.min(2 * sizeScale(d.total) / 3, 12))
      .attr('fill', 'white')
      .style('pointer-events', 'none')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d.id)
      .transition()
      .delay((d, i) => 800 + i * 50)
      .duration(500)
      .style('opacity', 1);

    // Function to update positions on each tick
    function ticked() {
      bubbles
        .attr('transform', d => {
          // Keep the bubbles within bounds
          d.x = Math.max(sizeScale(d.total), Math.min(innerWidth - sizeScale(d.total), d.x as number));
          d.y = Math.max(sizeScale(d.total), Math.min(innerHeight - sizeScale(d.total), d.y as number));
          return `translate(${d.x},${d.y})`;
        });
    }

    // Add legend
    const legendWidth = 200;
    const legendHeight = 15;
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - legendWidth - 20}, ${height - 55})`);

    // Create gradient for the legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'support-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(40));

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', colorScale(60));
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(80));

    // Add the gradient rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#support-gradient)');

    // Add labels for the color scale
    const legendLabels = [40, 60, 80];
    const legendScale = d3.scaleLinear()
      .domain([40, 80])
      .range([0, legendWidth]);

    legend.selectAll('.legend-label')
      .data(legendLabels)
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', d => legendScale(d))
      .attr('y', legendHeight + 15)
      .attr('text-anchor', (d, i) => i === 0 ? 'start' : i === legendLabels.length - 1 ? 'end' : 'middle')
      .attr('font-size', '10px')
      .text(d => `${d}%`);

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', legendHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .text('Mental Health Support Rating');

    // Add size legend
    const sizeLegend = svg.append('g')
      .attr('class', 'size-legend')
      .attr('transform', `translate(${width - legendWidth - 20}, ${height - 100})`);

    sizeLegend.append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    sizeLegend.append('text')
      .attr('x', 25)
      .attr('y', 15)
      .attr('font-size', '11px')
      .text('Size: Number of participants');

    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Geographic Distribution');
  }, []);

  return (
    <D3Container
      title="Global Mental Health Support"
      description="Mental health support ratings across different countries"
      renderChart={renderChart}
      className="col-span-1 md:col-span-3"
    />
  );
};

export default GeographicalDistributionChart;
