
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

const WorkplaceCommunicationChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Data for the chart
    const data = [
      { category: "Coworkers", yes: 340, some: 610, no: 309 },
      { category: "Supervisors", yes: 296, some: 480, no: 483 },
      { category: "Interviews", yes: 83, some: 207, no: 969 }
    ];

    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 30, right: 100, bottom: 40, left: 60 };
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
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);
      
    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerHeight])
      .padding(0.3);
      
    // Color scale
    const color = d3.scaleOrdinal()
      .domain(["yes", "some", "no"])
      .range(["#0EA5E9", "#9b87f5", "#fb7185"]);

    // Calculate percentages
    data.forEach(d => {
      const total = d.yes + d.some + d.no;
      d.yesPercent = (d.yes / total) * 100;
      d.somePercent = (d.some / total) * 100;
      d.noPercent = (d.no / total) * 100;
    });

    // Create tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('font-size', '12px');
      
    // Add X-axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Percentage of Respondents');

    // Add Y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('font-size', '12px');

    // Create stacked bars with animation
    data.forEach(d => {
      // "Yes" Segment
      g.append('rect')
        .attr('class', 'bar')
        .attr('y', y(d.category) as number)
        .attr('x', 0)
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', color('yes') as string)
        .attr('rx', 2) // Rounded corners
        .on('mouseover', function(event) {
          d3.select(this).attr('opacity', 0.8);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`<strong>Would discuss with ${d.category.toLowerCase()}</strong><br>Yes: ${d.yes} (${Math.round(d.yesPercent)}%)`)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .attr('width', x(d.yesPercent));
        
      // "Some" Segment
      g.append('rect')
        .attr('class', 'bar')
        .attr('y', y(d.category) as number)
        .attr('x', x(d.yesPercent))
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', color('some') as string)
        .attr('rx', 2) // Rounded corners
        .on('mouseover', function(event) {
          d3.select(this).attr('opacity', 0.8);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`<strong>Would discuss with ${d.category.toLowerCase()}</strong><br>Some/Maybe: ${d.some} (${Math.round(d.somePercent)}%)`)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .delay(800)
        .duration(800)
        .attr('width', x(d.somePercent));
        
      // "No" Segment
      g.append('rect')
        .attr('class', 'bar')
        .attr('y', y(d.category) as number)
        .attr('x', x(d.yesPercent) + x(d.somePercent))
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', color('no') as string)
        .attr('rx', 2) // Rounded corners
        .on('mouseover', function(event) {
          d3.select(this).attr('opacity', 0.8);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`<strong>Would discuss with ${d.category.toLowerCase()}</strong><br>No: ${d.no} (${Math.round(d.noPercent)}%)`)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .delay(1600)
        .duration(800)
        .attr('width', x(d.noPercent));
    });

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
      
    const legendItems = [
      { label: 'Yes', color: color('yes') as string },
      { label: 'Some/Maybe', color: color('some') as string },
      { label: 'No', color: color('no') as string }
    ];
    
    legendItems.forEach((item, i) => {
      const lg = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
        
      lg.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('fill', item.color);
        
      lg.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(item.label);
    });

    // Add annotations
    svg.append('text')
      .attr('class', 'annotation')
      .attr('x', margin.left + x(25))
      .attr('y', margin.top + y('Interviews') as number + 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#333')
      .text('77% wouldn\'t discuss')
      .attr('opacity', 0)
      .transition()
      .delay(2400)
      .duration(500)
      .attr('opacity', 1);
      
    svg.append('text')
      .attr('class', 'annotation')
      .attr('x', margin.left + x(25))
      .attr('y', margin.top + y('Interviews') as number + 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#333')
      .text('in interviews')
      .attr('opacity', 0)
      .transition()
      .delay(2400)
      .duration(500)
      .attr('opacity', 1);

    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Willingness to Discuss Mental Health');
  }, []);

  return (
    <D3Container
      title="Discussing Mental Health"
      description="Willingness to discuss mental health issues with different groups"
      renderChart={renderChart}
      className="col-span-1 md:col-span-3"
    />
  );
};

export default WorkplaceCommunicationChart;
