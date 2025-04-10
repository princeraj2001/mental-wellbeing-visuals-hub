
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

const WellnessProgramChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Data for the chart
    const data = [
      { response: 'Yes', count: 285 },
      { response: 'No', count: 687 },
      { response: 'Don\'t Know', count: 287 }
    ];

    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.response))
      .range(['#0EA5E9', '#9b87f5', '#d1d5db']);

    // Setup the pie chart
    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);

    // Setup the arc
    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Create a donut chart
      .outerRadius(radius * 0.8);

    // Setup the outer arc for labels
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Create tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Add arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc as any)
      .attr('fill', (d: any) => color(d.data.response) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('stroke', '#333');
          
        const percent = Math.round((d.data.count / d3.sum(data, d => d.count)) * 100);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`<strong>${d.data.response}</strong>: ${d.data.count} (${percent}%)`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7)
          .attr('stroke', 'white');
          
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Add labels
    const text = svg.selectAll('.label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('dy', '.35em')
      .text(function(d: any) {
        const percent = Math.round((d.data.count / d3.sum(data, d => d.count)) * 100);
        return `${d.data.response}: ${percent}%`;
      })
      .style('font-size', '12px')
      .style('text-anchor', 'middle')
      .style('fill', '#333')
      .style('opacity', 0);

    text.transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1)
      .attr('transform', function(d: any) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      });

    // Add lines connecting slices to labels
    svg.selectAll('.pointer')
      .data(pie(data))
      .enter()
      .append('polyline')
      .attr('class', 'pointer')
      .style('fill', 'none')
      .style('stroke', '#999')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 0.5)
      .attr('points', function(d: any) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      } as any); // Add type assertion here to fix the error

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('fill', '#333')
      .style('opacity', 0)
      .text('Wellness')
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.8em')
      .style('font-size', '16px')
      .style('fill', '#333')
      .style('opacity', 0)
      .text('Programs')
      .transition()
      .delay(1300)
      .duration(500)
      .style('opacity', 1);

  }, []);

  return (
    <D3Container
      title="Wellness Program Availability"
      description="Has your employer discussed mental health as part of wellness programs?"
      renderChart={renderChart}
      className="col-span-1 md:col-span-1"
    />
  );
};

export default WellnessProgramChart;
