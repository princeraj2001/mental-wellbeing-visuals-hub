
import React, { useCallback } from 'react';
import * as d3 from 'd3';
import D3Container from '../D3Container';

// Define types for Sankey diagram
interface SankeyNode {
  name: string;
  index?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  sourceLinks?: SankeyLink[];
  targetLinks?: SankeyLink[];
}

interface SankeyLink {
  source: SankeyNode | number;
  target: SankeyNode | number;
  value: number;
  width?: number;
  y0?: number;
  y1?: number;
}

interface SankeyGraph {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Create our own Sankey utility functions instead of extending d3
const createSankey = () => {
  let nodeWidth = 24;
  let nodePadding = 8;
  let size = [1, 1];
  
  function sankeyGenerator(graph: SankeyGraph) {
    graph.nodes.forEach((node: SankeyNode, i: number) => {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    
    graph.links.forEach((link: SankeyLink) => {
      // Convert indices to actual node references
      const sourceIndex = typeof link.source === 'number' ? link.source : link.source.index!;
      const targetIndex = typeof link.target === 'number' ? link.target : link.target.index!;
      
      link.source = graph.nodes[sourceIndex];
      link.target = graph.nodes[targetIndex];
      
      (link.source as SankeyNode).sourceLinks!.push(link);
      (link.target as SankeyNode).targetLinks!.push(link);
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
    graph.links.forEach((link: SankeyLink) => {
      link.width = Math.max(1, Math.sqrt(link.value));
      // Y-positions for the link endpoints - simplified
      link.y0 = (link.source as SankeyNode).y0! + ((link.source as SankeyNode).y1! - (link.source as SankeyNode).y0!) / 2;
      link.y1 = (link.target as SankeyNode).y0! + ((link.target as SankeyNode).y1! - (link.target as SankeyNode).y0!) / 2;
    });
    
    return graph;
  }
  
  sankeyGenerator.nodeWidth = function(_: number) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = _;
    return sankeyGenerator;
  };
  
  sankeyGenerator.nodePadding = function(_: number) {
    if (!arguments.length) return nodePadding;
    nodePadding = _;
    return sankeyGenerator;
  };
  
  sankeyGenerator.extent = function(_: number[][]) {
    if (!arguments.length) return [[0, 0], size];
    size = [_[1][0] - _[0][0], _[1][1] - _[0][1]];
    return sankeyGenerator;
  };

  return sankeyGenerator;
};

// Create our Sankey link horizontal function
const createSankeyLinkHorizontal = () => {
  return function(d: SankeyLink) {
    const source = d.source as SankeyNode;
    const target = d.target as SankeyNode;
    const x0 = source.x1!;
    const x1 = target.x0!;
    const y0 = d.y0!;
    const y1 = d.y1!;
    
    return `
      M ${x0},${y0}
      C ${(x0 + x1) / 2},${y0}
        ${(x0 + x1) / 2},${y1}
        ${x1},${y1}
    `;
  };
};

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
    const sankey = createSankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Format the data for sankey
    const graph = {
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    };

    // Generate the layout
    sankey(graph);

    // Create the horizontal link function
    const sankeyLinkHorizontal = createSankeyLinkHorizontal();

    // Add the links
    const link = g.append("g")
      .selectAll(".link")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal)
      .attr("stroke-width", d => Math.max(1, d.width as number))
      .style("stroke", d => {
        const source = d.source as SankeyNode;
        const sourceColor = d3.color(colorMap[source.name]);
        return sourceColor ? sourceColor.brighter(0.5).toString() : "#ccc";
      })
      .style("stroke-opacity", 0.5)
      .style("fill", "none")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("stroke-opacity", 0.8);
          
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          
        const sourceName = (d.source as SankeyNode).name;
        const targetName = (d.target as SankeyNode).name;
          
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
      .attr("height", d => Math.max(d.y1! - d.y0!, 1))
      .attr("width", d => d.x1! - d.x0!)
      .style("fill", d => colorMap[d.name])
      .style("shape-rendering", "crispEdges")
      .style("stroke", d => {
        const color = d3.rgb(colorMap[d.name]);
        return color.darker(0.8).toString();
      })
      .style("stroke-width", 1)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .style("opacity", 1);

    // Add the title for the nodes
    node.append("text")
      .attr("x", d => (d.x0! < width / 2) ? (d.x1! - d.x0! + 6) : -6)
      .attr("y", d => (d.y1! - d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0! < width / 2) ? "start" : "end")
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

export default MentalHealthFlowChart;
