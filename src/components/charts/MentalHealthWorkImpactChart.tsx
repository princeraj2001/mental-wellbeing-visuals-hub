
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

const MentalHealthWorkImpactChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Data for the chart
    const data = [
      { category: 'Often', value: 340 },
      { category: 'Sometimes', value: 450 },
      { category: 'Rarely', value: 270 },
      { category: 'Never', value: 140 },
      { category: 'Don\'t Know', value: 59 }
    ];

    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 30, right: 40, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create a group for the visualization elements
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number * 1.1]) // Add 10% padding
      .nice()
      .range([innerHeight, 0]);

    // Color scales - using a gradient from red (Often) to green (Never)
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(['#f87171', '#fb923c', '#fbbf24', '#bef264', '#d4d4d4']);

    // Add gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      );

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Style x-axis
    xAxis.selectAll('text')
      .attr('font-size', '12px')
      .attr('transform', 'rotate(-20)')
      .style('text-anchor', 'end');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px');

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

    // Add bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category) as number)
      .attr('width', x.bandwidth())
      .attr('fill', d => colorScale(d.category) as string)
      .attr('rx', 4) // Rounded corners
      .attr('y', innerHeight)
      .attr('height', 0)
      .on('mouseover', function(event, d) {
        // Highlight the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('stroke', '#333')
          .attr('stroke-width', 1);
          
        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.category}</strong>: ${d.value} employees`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        // Restore bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke', 'none');
          
        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value));

    // Add labels
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('text-anchor', 'middle')
      .attr('x', d => (x(d.category) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#666')
      .text(d => d.value)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => 800 + i * 100)
      .style('opacity', 1);

    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Mental Health Impact on Work');

    // Add x-axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 5)
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text('How often mental health interferes with work');

    // Add annotation for "Often" category
    g.append('text')
      .attr('class', 'annotation')
      .attr('x', (x('Often') as number) + x.bandwidth() / 2)
      .attr('y', y(340) - 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#f87171')
      .text('27% report frequent')
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);

    g.append('text')
      .attr('class', 'annotation')
      .attr('x', (x('Often') as number) + x.bandwidth() / 2)
      .attr('y', y(340) - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#f87171')
      .text('work interference')
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);
      
  }, []);

  return (
    <D3Container
      title="Mental Health & Work Performance"
      description="How often mental health conditions interfere with work"
      renderChart={renderChart}
      className="col-span-1 md:col-span-2"
    />
  );
};

export default MentalHealthWorkImpactChart;
