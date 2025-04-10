
import * as d3 from 'd3';

export interface MentalHealthData {
  Timestamp: string;
  Age: number;
  Gender: string;
  Country: string;
  state?: string;
  self_employed?: string;
  family_history: string;
  treatment: string;
  work_interfere: string;
  no_employees: string;
  remote_work: string;
  tech_company: string;
  benefits: string;
  care_options: string;
  wellness_program: string;
  seek_help: string;
  anonymity: string;
  leave: string;
  mental_health_consequence: string;
  phys_health_consequence: string;
  coworkers: string;
  supervisor: string;
  mental_health_interview: string;
  phys_health_interview: string;
  mental_vs_physical: string;
  obs_consequence: string;
  comments?: string;
}

/**
 * Load and parse the mental health survey CSV data
 */
export const loadMentalHealthData = async (): Promise<MentalHealthData[]> => {
  try {
    const rawData = await d3.csv('/data/mental_health_survey.csv');
    
    // Process data - handle missing values, convert types, etc.
    const data: MentalHealthData[] = rawData.map(d => ({
      Timestamp: d.Timestamp || '',
      Age: d.Age ? +d.Age : 0,
      Gender: d.Gender || '',
      Country: d.Country || '',
      state: d.state || undefined,
      self_employed: d.self_employed || undefined,
      family_history: d.family_history || '',
      treatment: d.treatment || '',
      work_interfere: d.work_interfere || '',
      no_employees: d.no_employees || '',
      remote_work: d.remote_work || '',
      tech_company: d.tech_company || '',
      benefits: d.benefits || '',
      care_options: d.care_options || '',
      wellness_program: d.wellness_program || '',
      seek_help: d.seek_help || '',
      anonymity: d.anonymity || '',
      leave: d.leave || '',
      mental_health_consequence: d.mental_health_consequence || '',
      phys_health_consequence: d.phys_health_consequence || '',
      coworkers: d.coworkers || '',
      supervisor: d.supervisor || '',
      mental_health_interview: d.mental_health_interview || '',
      phys_health_interview: d.phys_health_interview || '',
      mental_vs_physical: d.mental_vs_physical || '',
      obs_consequence: d.obs_consequence || '',
      comments: d.comments || undefined
    }));
    
    return data;
  } catch (error) {
    console.error('Error loading mental health data:', error);
    return [];
  }
};

/**
 * Calculate gender distribution from data
 */
export const getGenderDistribution = (data: MentalHealthData[]) => {
  const genderCounts: Record<string, number> = {};
  
  data.forEach(d => {
    // Normalize gender values
    let gender = d.Gender?.trim().toLowerCase();
    
    if (!gender) {
      gender = 'unknown';
    } else if (gender === 'm') {
      gender = 'male';
    } else if (gender === 'f') {
      gender = 'female';
    }
    
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  });
  
  return Object.entries(genderCounts).map(([gender, count]) => ({ 
    gender: gender.charAt(0).toUpperCase() + gender.slice(1), 
    count 
  }));
};

/**
 * Get work interference distribution
 */
export const getWorkInterferenceData = (data: MentalHealthData[]) => {
  const counts: Record<string, number> = {};
  
  data.forEach(d => {
    const response = d.work_interfere || 'Unknown';
    counts[response] = (counts[response] || 0) + 1;
  });
  
  return Object.entries(counts).map(([category, value]) => ({ category, value }));
};

/**
 * Get wellness program data
 */
export const getWellnessProgramData = (data: MentalHealthData[]) => {
  const counts: Record<string, number> = {};
  
  data.forEach(d => {
    const response = d.wellness_program || 'Unknown';
    counts[response] = (counts[response] || 0) + 1;
  });
  
  return Object.entries(counts).map(([response, count]) => ({ response, count }));
};

/**
 * Get communication willingness data
 */
export const getCommunicationData = (data: MentalHealthData[]) => {
  // Initialize result structure
  const result = [
    { category: 'Coworkers', yes: 0, some: 0, no: 0 },
    { category: 'Supervisors', yes: 0, some: 0, no: 0 },
    { category: 'Interviews', yes: 0, some: 0, no: 0 }
  ];
  
  // Count coworkers responses
  data.forEach(d => {
    // Coworkers
    if (d.coworkers === 'Yes') result[0].yes++;
    else if (d.coworkers === 'Some of them') result[0].some++;
    else result[0].no++;
    
    // Supervisors
    if (d.supervisor === 'Yes') result[1].yes++;
    else if (d.supervisor === 'Some of them') result[1].some++;
    else result[1].no++;
    
    // Mental health interview
    if (d.mental_health_interview === 'Yes') result[2].yes++;
    else if (d.mental_health_interview === 'Maybe') result[2].some++;
    else result[2].no++;
  });
  
  return result;
};

/**
 * Get geographical data
 */
export const getGeographicalData = (data: MentalHealthData[]) => {
  // Group by country
  const countryCounts: Record<string, number> = {};
  const countryRatings: Record<string, number[]> = {};
  
  data.forEach(d => {
    if (!d.Country) return;
    
    // Count participants by country
    countryCounts[d.Country] = (countryCounts[d.Country] || 0) + 1;
    
    // Calculate mental health support rating
    let supportRating = 0;
    if (d.benefits === 'Yes') supportRating += 25;
    if (d.care_options === 'Yes') supportRating += 25;
    if (d.wellness_program === 'Yes') supportRating += 25;
    if (d.seek_help === 'Yes') supportRating += 25;
    
    // Store individual ratings to calculate average later
    if (!countryRatings[d.Country]) countryRatings[d.Country] = [];
    countryRatings[d.Country].push(supportRating);
  });
  
  // Calculate average support rating by country
  const result = Object.entries(countryCounts).map(([country, total]) => {
    const ratings = countryRatings[country] || [];
    const avgRating = ratings.length ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    
    return {
      country, 
      value: avgRating,
      total
    };
  });
  
  return result;
};

/**
 * Get sankey data for mental health flow
 */
export const getSankeyData = (data: MentalHealthData[]) => {
  // This would normally calculate the actual flow data from the dataset
  // For now, returning placeholder data that matches what we hardcoded in the chart
  return {
    nodes: [
      { name: "Family History: Yes" },
      { name: "Family History: No" },
      // More nodes would go here
    ],
    links: [
      { source: 0, target: 2, value: 178 },
      { source: 0, target: 3, value: 82 },
      // More links would go here
    ]
  };
};
