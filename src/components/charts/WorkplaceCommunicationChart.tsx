
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

interface CommunicationData {
  category: string;
  yes: number;
  some: number;
  no: number;
  yesPercent?: number;
  somePercent?: number;
  noPercent?: number;
}

const WorkplaceCommunicationChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Sample data
    const data: CommunicationData[] = [
      { category: 'Coworkers', yes: 320, some: 400, no: 539 },
      { category: 'Supervisors', yes: 220, some: 380, no: 659 },
      { category: 'Interviews', yes: 112, some: 290, no: 857 }
    ];
    
    // Calculate percentages
    data.forEach(d => {
      const total = d.yes + d.some + d.no;
      d.yesPercent = Math.round((d.yes / total) * 100);
      d.somePercent = Math.round((d.some / total) * 100);
      d.noPercent = Math.round((d.no / total) * 100);
    });
    
    // Set up dimensions
    const width = container.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 60, left: 80 };
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
    
    // Set up scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerHeight])
      .padding(0.2);
    
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);
    
    // Define colors - updated colors as requested
    const colors = {
      yes: '#90EE90', // Light Green
      some: '#9b87f5', // Purple
      no: '#FA8072'    // Light Red
    };
    
    // Add axes
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('font-size', '12px');
    
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('font-size', '12px');
    
    // Add x-axis label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('fill', '#666')
      .text('Percentage of Respondents');
    
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
      .style('pointer-events', 'none')
      .style('z-index', '100');
    
    // Add the 'Yes' bars
    g.selectAll('.bar-yes')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-yes')
      .attr('y', d => y(d.category)!)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', colors.yes)
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.category}</strong><br>Yes: ${d.yes} (${d.yesPercent}%)`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.yesPercent!));
    
    // Add the 'Some' bars
    g.selectAll('.bar-some')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-some')
      .attr('y', d => y(d.category)!)
      .attr('height', y.bandwidth())
      .attr('x', d => x(d.yesPercent!))
      .attr('width', 0)
      .attr('fill', colors.some)
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.category}</strong><br>Some/Maybe: ${d.some} (${d.somePercent}%)`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.somePercent!));
    
    // Add the 'No' bars
    g.selectAll('.bar-no')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-no')
      .attr('y', d => y(d.category)!)
      .attr('height', y.bandwidth())
      .attr('x', d => x(d.yesPercent! + d.somePercent!))
      .attr('width', 0)
      .attr('fill', colors.no)
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.category}</strong><br>No: ${d.no} (${d.noPercent}%)`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.noPercent!));
    
    // Add a legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
    
    const legendItems = [
      { color: colors.yes, label: 'Yes' },
      { color: colors.some, label: 'Some/May' },
      { color: colors.no, label: 'No' }
    ];
    
    legend.selectAll('rect')
      .data(legendItems)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 25)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color);
    
    legend.selectAll('text')
      .data(legendItems)
      .enter()
      .append('text')
      .attr('x', 25)
      .attr('y', (d, i) => i * 25 + 12.5)
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text(d => d.label);
    
    // Add a title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Willingness to Discuss Mental Health');
    
    // Add annotations
    g.append('text')
      .attr('class', 'annotation')
      .attr('x', x(80))
      .attr('y', y('Interviews')! + y.bandwidth() / 2)
      .attr('dy', '-15')
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', '#d44')
      .text('77% wouldn\'t discuss in interviews')
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);
  }, []);

  return (
    <D3Container
      title="Discussing Mental Health"
      description="Willingness to discuss mental health issues with different groups"
      renderChart={renderChart}
      className="col-span-1"
    />
  );
};

export default WorkplaceCommunicationChart;
