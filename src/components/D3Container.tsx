
import React, { useRef, useEffect } from 'react';

interface D3ContainerProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  renderChart: (element: HTMLDivElement) => void;
}

const D3Container: React.FC<D3ContainerProps> = ({ 
  className, 
  title, 
  description, 
  renderChart
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Clear previous chart before redrawing
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
      
      // Render the chart
      renderChart(chartRef.current);
    }

    // Cleanup function to remove SVG when component unmounts
    return () => {
      if (chartRef.current) {
        while (chartRef.current.firstChild) {
          chartRef.current.removeChild(chartRef.current.firstChild);
        }
      }
    };
  }, [renderChart]);

  return (
    <div className={`dashboard-card bg-white rounded-lg shadow-md p-4 transition-all ${className}`}>
      <h3 className="text-lg font-medium text-dashboard-text mb-1">{title}</h3>
      {description && <p className="text-sm text-dashboard-neutral mb-4">{description}</p>}
      <div ref={chartRef} className="w-full h-full min-h-[200px]"></div>
    </div>
  );
};

export default D3Container;
