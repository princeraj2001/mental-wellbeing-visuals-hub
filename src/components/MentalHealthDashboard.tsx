
import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import GenderDistributionChart from './charts/GenderDistributionChart';
import MentalHealthWorkImpactChart from './charts/MentalHealthWorkImpactChart';
import WellnessProgramChart from './charts/WellnessProgramChart';
import MentalHealthSupportChart from './charts/MentalHealthSupportChart';
import WorkplaceCommunicationChart from './charts/WorkplaceCommunicationChart';
import GeographicalDistributionChart from './charts/GeographicalDistributionChart';
import MentalHealthFlowChart from './charts/MentalHealthFlowChart';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadMentalHealthData } from '../utils/dataUtils';

const MentalHealthDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [dataPoints, setDataPoints] = useState(1433);
  const [participants, setParticipants] = useState(1259);

  useEffect(() => {
    // Load dashboard data
    const fetchData = async () => {
      await loadMentalHealthData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Toggle dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-purple-500 text-white p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Mental Wellbeing in Tech</h1>
            <p className="text-sm">Interactive visualization of mental health in the technology workplace</p>
          </div>
          <div className="flex flex-row gap-6 items-center mt-4 md:mt-0">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold">{dataPoints.toLocaleString()}</div>
              <div className="text-xs">Data Points</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold">{participants.toLocaleString()}</div>
              <div className="text-xs">Participants</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Light/Dark</span>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </div>
        </div>
        
        {/* Country Filter */}
        <div className="flex justify-end mb-6">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="USA">United States</SelectItem>
              <SelectItem value="CAN">Canada</SelectItem>
              <SelectItem value="GBR">United Kingdom</SelectItem>
              <SelectItem value="DEU">Germany</SelectItem>
              <SelectItem value="AUS">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Section 1: Gender Distribution & Work Impact */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GenderDistributionChart />
            <MentalHealthWorkImpactChart />
          </div>
        </div>
        
        {/* Section 2: Wellness Programs & Support */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WellnessProgramChart />
            <MentalHealthSupportChart />
          </div>
        </div>
        
        {/* Section 3: Communication & Global Insights */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkplaceCommunicationChart />
            <GeographicalDistributionChart country={selectedCountry} />
          </div>
        </div>

        {/* Section 4: Mental Health Flow */}
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-6">
            <MentalHealthFlowChart />
          </div>
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentalHealthDashboard;
