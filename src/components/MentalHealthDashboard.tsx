
import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import GenderDistributionChart from './charts/GenderDistributionChart';
import MentalHealthWorkImpactChart from './charts/MentalHealthWorkImpactChart';
import WellnessProgramChart from './charts/WellnessProgramChart';
import MentalHealthSupportChart from './charts/MentalHealthSupportChart';
import WorkplaceCommunicationChart from './charts/WorkplaceCommunicationChart';
import GeographicalDistributionChart from './charts/GeographicalDistributionChart';

const MentalHealthDashboard = () => {
  return (
    <div className="min-h-screen bg-dashboard-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-dashboard-primary mb-2">Mental Health in Tech</h2>
            <p className="text-sm text-dashboard-neutral">
              This dashboard explores the state of mental health in the technology industry, 
              highlighting support systems, challenges, and opportunities for improvement.
              Explore each visualization to discover insights about how mental health is addressed
              in tech workplaces around the world.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dashboard-secondary mb-2">Key Findings</h2>
              <ul className="text-sm text-dashboard-neutral list-disc pl-5 space-y-1">
                <li>45% of respondents have access to mental health benefits</li>
                <li>27% report that mental health often interferes with work</li>
                <li>Only 32% of companies have wellness programs</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-dashboard-accent mb-2">About the Data</h2>
            <p className="text-sm text-dashboard-neutral">
              This visualization uses data from the 2014 Mental Health in Tech Survey,
              which collected responses from 1,259 tech professionals about mental health
              attitudes, support systems, and challenges in the workplace.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <GenderDistributionChart />
          <MentalHealthWorkImpactChart />
          <WellnessProgramChart />
          <MentalHealthSupportChart />
          <WorkplaceCommunicationChart />
          <GeographicalDistributionChart />
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentalHealthDashboard;
