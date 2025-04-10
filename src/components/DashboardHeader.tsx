
import React from 'react';
import { Heart, Activity, Users } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="w-full py-6 bg-gradient-to-r from-dashboard-primary to-dashboard-secondary rounded-lg shadow-md mb-8 animate-fade-in">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Heart size={36} className="text-white mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Mental Wellbeing in Tech</h1>
              <p className="text-white/80">Interactive visualization of mental health in the technology workplace</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center bg-white/10 p-3 rounded-lg">
              <Activity className="text-white mr-2" size={20} />
              <div className="text-white">
                <p className="text-sm opacity-80">Data Points</p>
                <p className="font-semibold">1,433</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white/10 p-3 rounded-lg">
              <Users className="text-white mr-2" size={20} />
              <div className="text-white">
                <p className="text-sm opacity-80">Participants</p>
                <p className="font-semibold">1,259</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
