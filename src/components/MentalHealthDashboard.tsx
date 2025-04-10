
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
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-dashboard-primary mb-6 text-center">Gender & Work Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GenderDistributionChart />
            <MentalHealthWorkImpactChart />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-dashboard-secondary mb-6 text-center">Wellness Programs & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WellnessProgramChart />
            <MentalHealthSupportChart />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-dashboard-accent mb-6 text-center">Communication & Global Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <WorkplaceCommunicationChart />
            <GeographicalDistributionChart />
          </div>
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentalHealthDashboard;
