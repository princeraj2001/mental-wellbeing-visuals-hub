
import React from 'react';
import { FileText, InfoIcon } from 'lucide-react';

const DashboardFooter = () => {
  return (
    <div className="w-full mt-12 mb-6">
      <div className="container px-4 mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-dashboard-text mb-2 flex items-center">
                <FileText className="mr-2" size={20} />
                About This Visualization
              </h3>
              <p className="text-sm text-dashboard-neutral">
                This dashboard visualizes data from the 2014 Mental Health in Tech Survey, which measures 
                attitudes towards mental health and frequency of mental health disorders in the technology workplace.
                The visualizations aim to highlight key insights about mental health support, stigma, and employee 
                experiences across the industry.
              </p>
            </div>
            <div className="bg-dashboard-primary/10 p-4 rounded-lg">
              <h4 className="text-md font-medium text-dashboard-primary mb-2 flex items-center">
                <InfoIcon className="mr-2" size={16} />
                Methodology Notes
              </h4>
              <ul className="text-xs text-dashboard-neutral space-y-1 list-disc pl-4">
                <li>Data collected from 1,259 tech professionals across multiple countries</li>
                <li>All visualizations created using D3.js version 7</li>
                <li>Survey data anonymized to protect participant privacy</li>
                <li>Percentages rounded to nearest whole number</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-dashboard-neutral">
          <p>© 2025 Student Assignment | Data Storytelling with Social Impact | Created with D3.js</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter;
