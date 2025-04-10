
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

const MentalHealthFlowChart = () => {
  const renderChart = useCallback((container: HTMLDivElement) => {
    // Set up dimensions
    const width = container.clientWidth;
    const height = 400;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define nodes and links for the Sankey diagram
    const nodes: SankeyNode[] = [
      { name: "Family History: Yes" },
      { name: "Family History: No" },
      { name: "Treatment: Yes" },
      { name: "Treatment: No" },
      { name: "Work Interference: Often" },
      { name: "Work Interference: Sometimes" },
      { name: "Work Interference: Rarely" },
      { name: "Work Interference: Never" },
      { name: "Mental Health Consequence: Yes" },
      { name: "Mental Health Consequence: Maybe" },
      { name: "Mental Health Consequence: No" }
    ];

    const links: SankeyLink[] = [
      // Family History -> Treatment
      { source: 0, target: 2, value: 178 },
      { source: 0, target: 3, value: 82 },
      { source: 1, target: 2, value: 122 },
      { source: 1, target: 3, value: 877 },
      
      // Treatment -> Work Interference
      { source: 2, target: 4, value: 196 },
      { source: 2, target: 5, value: 83 },
      { source: 2, target: 6, value: 16 },
      { source: 2, target: 7, value: 5 },
      { source: 3, target: 4, value: 144 },
      { source: 3, target: 5, value: 367 },
      { source: 3, target: 6, value: 254 },
      { source: 3, target: 7, value: 194 },
      
      // Work Interference -> Mental Health Consequence
      { source: 4, target: 8, value: 149 },
      { source: 4, target: 9, value: 115 },
      { source: 4, target: 10, value: 76 },
      { source: 5, target: 8, value: 112 },
      { source: 5, target: 9, value: 178 },
      { source: 5, target: 10, value: 160 },
      { source: 6, target: 8, value: 45 },
      { source: 6, target: 9, value: 87 },
      { source: 6, target: 10, value: 138 },
      { source: 7, target: 8, value: 21 },
      { source: 7, target: 9, value: 48 },
      { source: 7, target: 10, value: 130 }
    ];

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
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('z-index', '100');

    // Set up the colors for different sections
    const colorMap: { [key: string]: string } = {
      "Family History: Yes": "#f59e0b",
      "Family History: No": "#fcd34d",
      "Treatment: Yes": "#0ea5e9",
      "Treatment: No": "#93c5fd",
      "Work Interference: Often": "#f87171",
      "Work Interference: Sometimes": "#fca5a5",
      "Work Interference: Rarely": "#bef264",
      "Work Interference: Never": "#d9f99d",
      "Mental Health Consequence: Yes": "#c084fc",
      "Mental Health Consequence: Maybe": "#d8b4fe",
      "Mental Health Consequence: No": "#e9d5ff"
    };

    // Create the Sankey diagram
    const sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Format the data for d3-sankey
    const graph = {
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    };

    // Generate the layout
    sankey(graph);

    // Add the links
    const link = g.append("g")
      .selectAll(".link")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width as number))
      .style("stroke", d => {
        const source = graph.nodes[d.source.index];
        return d3.color(colorMap[source.name])?.brighter(0.5) as string;
      })
      .style("stroke-opacity", 0.5)
      .style("fill", "none")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("stroke-opacity", 0.8);
          
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          
        const sourceName = graph.nodes[d.source.index].name;
        const targetName = graph.nodes[d.target.index].name;
          
        tooltip.html(`<strong>${sourceName}</strong> → <strong>${targetName}</strong><br>${d.value} respondents`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("stroke-opacity", 0.5);
          
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add the links with animation
    link.style("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .style("stroke-dashoffset", function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 20)
      .style("stroke-dashoffset", 0);

    // Add the nodes
    const node = g.append("g")
      .selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .on("mouseover", function(event, d) {
        // Highlight connected links
        link
          .style("stroke-opacity", l => 
            l.source === d || l.target === d ? 0.8 : 0.1
          );
          
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          
        // Count total value
        const incoming = graph.links.filter(l => l.target === d).reduce((sum, l) => sum + (l.value || 0), 0);
        const outgoing = graph.links.filter(l => l.source === d).reduce((sum, l) => sum + (l.value || 0), 0);
        const total = Math.max(incoming, outgoing);
          
        tooltip.html(`<strong>${d.name}</strong><br>${total} respondents`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function() {
        // Restore all links
        link.style("stroke-opacity", 0.5);
          
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add the rectangles for the nodes
    node.append("rect")
      .attr("height", d => Math.max(d.y1 - d.y0, 1))
      .attr("width", d => d.x1 - d.x0)
      .style("fill", d => colorMap[d.name])
      .style("shape-rendering", "crispEdges")
      .style("stroke", d => d3.rgb(colorMap[d.name]).darker(0.8) as string)
      .style("stroke-width", 1)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .style("opacity", 1);

    // Add the title for the nodes
    node.append("text")
      .attr("x", d => (d.x0 < width / 2) ? (d.x1 - d.x0 + 6) : -6)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0 < width / 2) ? "start" : "end")
      .text(d => {
        const nameParts = d.name.split(": ");
        return nameParts.length > 1 ? nameParts[1] : d.name;
      })
      .style("font-size", 10)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => 500 + i * 50)
      .style("opacity", 1);

    // Add section labels
    const sections = [
      { name: "Family History", x: innerWidth * 0.05, y: 20 },
      { name: "Treatment", x: innerWidth * 0.35, y: 20 },
      { name: "Work Interference", x: innerWidth * 0.65, y: 20 },
      { name: "Mental Health Consequence", x: innerWidth * 0.95, y: 20 }
    ];

    g.selectAll(".section-label")
      .data(sections)
      .enter()
      .append("text")
      .attr("class", "section-label")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 12)
      .text(d => d.name);

    // Add title
    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .text("Flow of Mental Health Experiences");

  }, []);

  return (
    <D3Container
      title="Flow of Mental Health Experiences"
      description="This Sankey diagram shows how personal and workplace factors shape mental health outcomes."
      renderChart={renderChart}
      className="col-span-1"
    />
  );
};

// Add the missing d3.sankey type and implementation
declare module 'd3' {
  export function sankey(): any;
  export function sankeyLinkHorizontal(): any;
}

// Simple implementation of d3.sankey for TypeScript
// Note: This is a placeholder. In a real app, you'd use the d3-sankey library
d3.sankey = function() {
  let nodeWidth = 24;
  let nodePadding = 8;
  let size = [1, 1];
  let nodes: any[] = [];
  let links: any[] = [];
  
  function sankey(graph: any) {
    graph.nodes.forEach((node: any, i: number) => {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    
    graph.links.forEach((link: any) => {
      link.source = graph.nodes[link.source];
      link.target = graph.nodes[link.target];
      link.source.sourceLinks.push(link);
      link.target.targetLinks.push(link);
    });
    
    // Simple layout algorithm (X positions based on levels, Y positions equally spaced)
    const levels = [
      [0, 1], // Family History
      [2, 3], // Treatment
      [4, 5, 6, 7], // Work Interference
      [8, 9, 10] // Mental Health Consequence
    ];
    
    // Set X positions based on levels
    levels.forEach((level, i) => {
      const xPos = i * (size[0] / (levels.length - 1));
      level.forEach(nodeIdx => {
        graph.nodes[nodeIdx].x0 = xPos;
        graph.nodes[nodeIdx].x1 = xPos + nodeWidth;
      });
    });
    
    // Set Y positions within each level
    levels.forEach(level => {
      const nodesInLevel = level.length;
      const step = size[1] / nodesInLevel;
      level.forEach((nodeIdx, i) => {
        graph.nodes[nodeIdx].y0 = i * step;
        graph.nodes[nodeIdx].y1 = (i + 0.9) * step; // 0.9 to leave some space
      });
    });
    
    // Set link paths
    graph.links.forEach((link: any) => {
      link.width = Math.max(1, Math.sqrt(link.value));
      // Y-positions for the link endpoints - simplified
      link.y0 = link.source.y0 + (link.source.y1 - link.source.y0) / 2;
      link.y1 = link.target.y0 + (link.target.y1 - link.target.y0) / 2;
    });
    
    return graph;
  }
  
  sankey.nodeWidth = function(_: number) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = _;
    return sankey;
  };
  
  sankey.nodePadding = function(_: number) {
    if (!arguments.length) return nodePadding;
    nodePadding = _;
    return sankey;
  };
  
  sankey.extent = function(_: number[][]) {
    if (!arguments.length) return [[0, 0], size];
    size = [_[1][0] - _[0][0], _[1][1] - _[0][1]];
    return sankey;
  };

  return sankey;
};

d3.sankeyLinkHorizontal = function() {
  return function(d: any) {
    const x0 = d.source.x1;
    const x1 = d.target.x0;
    const y0 = d.y0;
    const y1 = d.y1;
    
    return `
      M ${x0},${y0}
      C ${(x0 + x1) / 2},${y0}
        ${(x0 + x1) / 2},${y1}
        ${x1},${y1}
    `;
  };
};

export default MentalHealthFlowChart;
