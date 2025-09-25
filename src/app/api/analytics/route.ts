import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Venture {
  id: string;
  name: string;
  category: string;
  stage: string;
  maturity: number;
  priority: string;
  status: string;
  marketSize?: string;
  fundingNeed?: string;
  timeline?: string;
  problemWorld?: string;
  newWorld?: string;
  valueUnlock?: string;
  originStory?: string;
  deepCapability?: string;
  unfairAdvantage?: string;
  unlockFactor?: string;
  inevitability?: string;
  urgencyTrigger?: string;
  createdAt: string;
  lastUpdated: string;
}

interface AnalyticsResult {
  portfolioHealth: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  };
  maturityAnalysis: {
    averageMaturity: number;
    maturityDistribution: { [key: string]: number };
    maturityTrend: 'improving' | 'stable' | 'declining';
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    riskFactors: {
      concentration: number;
      execution: number;
      market: number;
      funding: number;
    };
    recommendations: string[];
  };
  performanceMetrics: {
    totalVentures: number;
    activeVentures: number;
    highPriorityVentures: number;
    mvpReadyVentures: number;
    averageMaturity: number;
    portfolioScore: number;
  };
  strategicInsights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

function calculatePortfolioHealth(ventures: Venture[]): AnalyticsResult['portfolioHealth'] {
  const avgMaturity = ventures.reduce((sum, v) => sum + v.maturity, 0) / ventures.length;
  const activeRatio = ventures.filter(v => v.status === 'active').length / ventures.length;
  const highPriorityRatio = ventures.filter(v => v.priority === 'high').length / ventures.length;
  
  // Weighted score calculation
  const maturityScore = avgMaturity * 0.4;
  const activeScore = activeRatio * 100 * 0.3;
  const priorityScore = highPriorityRatio * 100 * 0.3;
  
  const totalScore = Math.round(maturityScore + activeScore + priorityScore);
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  let status: AnalyticsResult['portfolioHealth']['status'];
  
  if (totalScore >= 80) {
    grade = 'A';
    status = 'Excellent';
  } else if (totalScore >= 60) {
    grade = 'B';
    status = 'Good';
  } else if (totalScore >= 40) {
    grade = 'C';
    status = 'Fair';
  } else if (totalScore >= 20) {
    grade = 'D';
    status = 'Poor';
  } else {
    grade = 'F';
    status = 'Critical';
  }
  
  return {
    score: totalScore,
    grade,
    status
  };
}

function calculateMaturityAnalysis(ventures: Venture[]): AnalyticsResult['maturityAnalysis'] {
  const averageMaturity = Math.round(ventures.reduce((sum, v) => sum + v.maturity, 0) / ventures.length);
  
  const maturityDistribution = {
    '0-20': ventures.filter(v => v.maturity <= 20).length,
    '21-40': ventures.filter(v => v.maturity > 20 && v.maturity <= 40).length,
    '41-60': ventures.filter(v => v.maturity > 40 && v.maturity <= 60).length,
    '61-80': ventures.filter(v => v.maturity > 60 && v.maturity <= 80).length,
    '81-100': ventures.filter(v => v.maturity > 80).length
  };
  
  // Simple trend analysis (in real implementation, this would use historical data)
  const highMaturityCount = ventures.filter(v => v.maturity > 60).length;
  const totalVentures = ventures.length;
  const maturityTrend: 'improving' | 'stable' | 'declining' = 
    highMaturityCount / totalVentures > 0.4 ? 'improving' : 
    highMaturityCount / totalVentures > 0.2 ? 'stable' : 'declining';
  
  return {
    averageMaturity,
    maturityDistribution,
    maturityTrend
  };
}

function calculateRiskAssessment(ventures: Venture[]): AnalyticsResult['riskAssessment'] {
  // Concentration risk (too many ventures in one category)
  const categoryCounts: { [key: string]: number } = {};
  ventures.forEach(v => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
  });
  const maxCategoryCount = Math.max(...Object.values(categoryCounts));
  const concentrationRisk = Math.min((maxCategoryCount / ventures.length) * 100, 100);
  
  // Execution risk (low maturity ventures)
  const lowMaturityCount = ventures.filter(v => v.maturity < 30).length;
  const executionRisk = (lowMaturityCount / ventures.length) * 100;
  
  // Market risk (based on stage distribution)
  const earlyStageCount = ventures.filter(v => ['idea', 'prototype'].includes(v.stage)).length;
  const marketRisk = (earlyStageCount / ventures.length) * 100;
  
  // Funding risk (high priority ventures with low maturity)
  const highPriorityLowMaturity = ventures.filter(v => v.priority === 'high' && v.maturity < 50).length;
  const fundingRisk = (highPriorityLowMaturity / ventures.length) * 100;
  
  const overallRiskScore = (concentrationRisk + executionRisk + marketRisk + fundingRisk) / 4;
  const overallRisk: 'low' | 'medium' | 'high' = 
    overallRiskScore < 30 ? 'low' : overallRiskScore < 60 ? 'medium' : 'high';
  
  const recommendations = [];
  
  if (concentrationRisk > 40) {
    recommendations.push('Diversify portfolio across different categories to reduce concentration risk');
  }
  if (executionRisk > 40) {
    recommendations.push('Focus on accelerating low-maturity ventures or consider pausing underperforming ones');
  }
  if (marketRisk > 40) {
    recommendations.push('Balance portfolio with more growth-stage ventures to reduce market risk');
  }
  if (fundingRisk > 40) {
    recommendations.push('Secure additional funding for high-priority ventures or adjust priorities');
  }
  
  return {
    overallRisk,
    riskFactors: {
      concentration: Math.round(concentrationRisk),
      execution: Math.round(executionRisk),
      market: Math.round(marketRisk),
      funding: Math.round(fundingRisk)
    },
    recommendations
  };
}

function generateStrategicInsights(ventures: Venture[]): AnalyticsResult['strategicInsights'] {
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];
  
  // Analyze strengths
  const highMaturityVentures = ventures.filter(v => v.maturity > 70);
  if (highMaturityVentures.length > 0) {
    const ventureNames = highMaturityVentures.map(v => v.name).join(', ');
    strengths.push(`Strong portfolio of mature ventures ready for scaling: ${ventureNames}`);
  }
  
  const diverseCategories = new Set(ventures.map(v => v.category)).size;
  if (diverseCategories > 3) {
    strengths.push(`Well-diversified across ${diverseCategories} different categories`);
  }
  
  // Analyze weaknesses
  const lowMaturityVentures = ventures.filter(v => v.maturity < 30);
  if (lowMaturityVentures.length > ventures.length * 0.3) {
    const ventureNames = lowMaturityVentures.map(v => v.name).join(', ');
    weaknesses.push(`High proportion of early-stage ventures may delay returns: ${ventureNames}`);
  }
  
  const pausedVentures = ventures.filter(v => v.status === 'paused');
  if (pausedVentures.length > 0) {
    const ventureNames = pausedVentures.map(v => v.name).join(', ');
    weaknesses.push(`${pausedVentures.length} ventures are currently paused, indicating execution challenges: ${ventureNames}`);
  }
  
  // Analyze opportunities
  const mvpVentures = ventures.filter(v => v.stage === 'mvp');
  if (mvpVentures.length > 0) {
    const ventureNames = mvpVentures.map(v => v.name).join(', ');
    opportunities.push(`Ventures at MVP stage ready for market entry and growth: ${ventureNames}`);
  }
  
  const highPriorityVentures = ventures.filter(v => v.priority === 'high');
  if (highPriorityVentures.length > 0) {
    const ventureNames = highPriorityVentures.map(v => v.name).join(', ');
    opportunities.push(`High-priority ventures with significant market potential: ${ventureNames}`);
  }
  
  // Analyze threats
  const highCompetitionCategories = ['Health & Nutrition', 'Relationships & Social'];
  const venturesInCompetitiveSpace = ventures.filter(v => highCompetitionCategories.includes(v.category));
  if (venturesInCompetitiveSpace.length > 0) {
    const ventureNames = venturesInCompetitiveSpace.map(v => v.name).join(', ');
    threats.push(`${venturesInCompetitiveSpace.length} ventures in highly competitive markets require strong differentiation: ${ventureNames}`);
  }
  
  const longTimelineVentures = ventures.filter(v => v.timeline && v.timeline.includes('year'));
  if (longTimelineVentures.length > ventures.length * 0.4) {
    const ventureNames = longTimelineVentures.map(v => v.name).join(', ');
    threats.push(`Extended timelines increase market risk and funding requirements: ${ventureNames}`);
  }
  
  return {
    strengths,
    weaknesses,
    opportunities,
    threats
  };
}

function generateRecommendations(ventures: Venture[]): AnalyticsResult['recommendations'] {
  const immediate = [];
  const shortTerm = [];
  const longTerm = [];
  
  // Immediate recommendations (next 30 days)
  const criticalVentures = ventures.filter(v => v.priority === 'high' && v.maturity < 40);
  if (criticalVentures.length > 0) {
    const ventureNames = criticalVentures.map(v => v.name).join(', ');
    immediate.push(`Accelerate development of critical high-priority ventures: ${ventureNames}`);
  }
  
  const duplicateVentures = ventures.filter(v => v.category.includes('DNA') || v.category.includes('Relationship'));
  if (duplicateVentures.length > 3) {
    const ventureNames = duplicateVentures.map(v => v.name).join(', ');
    immediate.push(`Consolidate duplicate/redundant ventures to focus resources: ${ventureNames}`);
  }
  
  // Short-term recommendations (next 90 days)
  const mvpVentures = ventures.filter(v => v.stage === 'mvp');
  if (mvpVentures.length > 0) {
    const ventureNames = mvpVentures.map(v => v.name).join(', ');
    shortTerm.push(`Launch and scale MVP-ready ventures to capture market share: ${ventureNames}`);
  }
  
  const prototypeVentures = ventures.filter(v => v.stage === 'prototype');
  if (prototypeVentures.length > 0) {
    const ventureNames = prototypeVentures.map(v => v.name).join(', ');
    shortTerm.push(`Complete MVP development for prototype-stage ventures: ${ventureNames}`);
  }
  
  // Long-term recommendations (next 12 months)
  const growthVentures = ventures.filter(v => v.stage === 'growth');
  if (growthVentures.length > 0) {
    const ventureNames = growthVentures.map(v => v.name).join(', ');
    longTerm.push(`Scale growth-stage ventures to market leadership positions: ${ventureNames}`);
  }
  
  const matureVentures = ventures.filter(v => v.maturity > 80);
  if (matureVentures.length > 0) {
    const ventureNames = matureVentures.map(v => v.name).join(', ');
    longTerm.push(`Develop exit strategies for mature ventures and prepare for Series A funding: ${ventureNames}`);
  }
  
  longTerm.push('Expand portfolio with 2-3 new ventures in emerging categories');
  
  return {
    immediate,
    shortTerm,
    longTerm
  };
}

export async function GET() {
  try {
    const ventures = await db.venture.findMany();
    
    const analytics: AnalyticsResult = {
      portfolioHealth: calculatePortfolioHealth(ventures),
      maturityAnalysis: calculateMaturityAnalysis(ventures),
      riskAssessment: calculateRiskAssessment(ventures),
      performanceMetrics: {
        totalVentures: ventures.length,
        activeVentures: ventures.filter(v => v.status === 'active').length,
        highPriorityVentures: ventures.filter(v => v.priority === 'high').length,
        mvpReadyVentures: ventures.filter(v => v.stage === 'mvp').length,
        averageMaturity: Math.round(ventures.reduce((sum, v) => sum + v.maturity, 0) / ventures.length),
        portfolioScore: calculatePortfolioHealth(ventures).score
      },
      strategicInsights: generateStrategicInsights(ventures),
      recommendations: generateRecommendations(ventures)
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json({ error: 'Failed to calculate analytics' }, { status: 500 });
  }
}