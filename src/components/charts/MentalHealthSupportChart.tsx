
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

const MentalHealthSupportChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Data for the radar chart
    const data = [
      { axis: "Benefits", value: 0.45 },
      { axis: "Care Options", value: 0.38 },
      { axis: "Wellness Programs", value: 0.32 },
      { axis: "Resources", value: 0.48 },
      { axis: "Anonymity", value: 0.56 },
      { axis: "Leave Policy", value: 0.41 }
    ];
    
    // Set up dimensions
    const width = container.clientWidth;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Circular segments
    const levels = 5;
    const angleSlice = (Math.PI * 2) / data.length;
    
    // Scale for the radius
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);
      
    // Draw the circular grid
    // Draw the background circles
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      svg.selectAll('.levels')
        .data([1]) // Dummy data of one element
        .enter()
        .append('circle')
        .attr('class', 'gridCircle')
        .attr('r', levelFactor)
        .style('fill', 'none')
        .style('stroke', '#ccc')
        .style('stroke-opacity', 0.5);
        
      // Add level values
      if (j > 0) {
        svg.append('text')
          .attr('class', 'axisLabel')
          .attr('x', 4)
          .attr('y', -levelFactor + 4)
          .attr('dy', '0.4em')
          .style('font-size', '10px')
          .text((j / levels).toFixed(1));
      }
    }
    
    // Create axis lines
    const axis = svg.selectAll('.axis')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'axis');
      
    // Append lines
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', '#ccc')
      .style('stroke-width', '1px');
      
    // Append axis labels
    axis.append('text')
      .attr('class', 'legend')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(1.15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(1.15) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis)
      .style('font-size', '11px')
      .style('fill', '#333');
    
    // Create the radar chart path
    const radarLine = d3.lineRadial<any>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
    
    // Create a wrapper for the radar area
    const radarWrapper = svg.append('g')
      .attr('class', 'radarWrapper');
    
    // Add radar area background
    radarWrapper.append('path')
      .datum(data)
      .attr('class', 'radarArea')
      .attr('d', radarLine as any)
      .style('fill', '#9b87f5')
      .style('fill-opacity', 0.1)
      .style('stroke', '#9b87f5')
      .style('stroke-width', '2px')
      .style('stroke-opacity', 0);
    
    // Create path with animation
    const path = radarWrapper.append('path')
      .datum(data)
      .attr('class', 'radarStroke')
      .style('stroke-width', '3px')
      .style('stroke', '#9b87f5')
      .style('fill', 'none')
      .style('opacity', 0);
    
    // Create animation function
    function pathTween(data: any[]) {
      const interpolator = d3.interpolate(
        data.map(d => ({ ...d, value: 0 })),
        data
      );
      return function(t: number) {
        return radarLine(interpolator(t)) as string;
      };
    }
    
    // Apply animation
    path.transition()
      .duration(1000)
      .style('opacity', 1)
      .attrTween('d', () => pathTween(data));
    
    // Add points at each axis
    radarWrapper.selectAll('.radarCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 0)
      .attr('cx', (d, i) => rScale(0) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(0) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', '#0EA5E9')
      .style('fill-opacity', 0.8)
      .style('stroke', '#fff')
      .style('stroke-width', '1px')
      .transition()
      .delay((d, i) => 1000 + 100 * i)
      .duration(500)
      .attr('r', 5)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));
    
    // Add tooltips
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
    
    // Create invisible circles for tooltip interaction
    radarWrapper.selectAll('.radarInvisibleCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', 12)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        
        const value = Math.round(d.value * 100);
        tooltip.html(`<strong>${d.axis}</strong>: ${value}%`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
      
    // Add radar area background with animation
    radarWrapper.select('.radarArea')
      .transition()
      .delay(1200)
      .duration(800)
      .style('fill-opacity', 0.4)
      .style('stroke-opacity', 1);
    
    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Mental Health Support');
  }, []);

  return (
    <D3Container
      title="Workplace Support Rating"
      description="Rating of mental health support across different dimensions"
      renderChart={renderChart}
      className="col-span-1 md:col-span-1"
    />
  );
};

export default MentalHealthSupportChart;
