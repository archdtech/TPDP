import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing ventures
  await prisma.venture.deleteMany();

  // Create ventures from our analysis
  const ventures = [
    {
      name: 'metabite-dna-nutrition-app',
      description: 'DNA-powered nutrition management application with enhanced features',
      category: 'Health & Nutrition',
      stage: 'mvp',
      maturity: 75,
      priority: 'high',
      status: 'active',
      problemWorld: '90% of nutrition plans fail because they\'re designed for averages, not individuals.',
      newWorld: 'Every person gets nutrition plans perfectly matched to their genetic blueprint.',
      valueUnlock: 'Trillions in healthcare savings through preventive, personalized nutrition.',
      originStory: 'Watching friends struggle with generic diets while knowing their DNA held the answers.',
      deepCapability: 'Technical expertise in both health data and consumer applications.',
      unfairAdvantage: 'Proprietary DNA interpretation algorithms that turn genetic data into actionable nutrition plans.',
      unlockFactor: 'DNA testing costs have collapsed from $1000 to $100 while AI can now interpret complex genetic interactions.',
      inevitability: 'Healthcare is shifting from treatment to prevention.',
      urgencyTrigger: 'First-mover advantage in DNA-personalized nutrition is being decided now.',
      marketSize: '$100B personalized nutrition market',
      fundingNeed: '$500K for Series A preparation',
      timeline: '6 months to market leadership',
      repository: 'https://github.com/ddevaix-commits/metabite-dna-nutrition-app',
      language: 'TypeScript'
    },
    {
      name: 'relationship-coaching-platform',
      description: 'A comprehensive relationship coaching platform with AI-powered insights and gamification',
      category: 'Relationships & Social',
      stage: 'mvp',
      maturity: 70,
      priority: 'high',
      status: 'active',
      problemWorld: '50% of marriages end in divorce because couples lack the tools to navigate modern relationship complexity.',
      newWorld: 'Every couple has an AI coach that provides personalized guidance and gamified growth.',
      valueUnlock: 'Trillions in economic productivity from stable, supportive relationships.',
      originStory: 'Seeing brilliant friends struggle in relationships not from lack of love, but lack of skills.',
      deepCapability: 'Expertise in behavioral psychology, AI, and user experience design.',
      unfairAdvantage: 'Proprietary relationship assessment algorithms that predict compatibility and growth areas.',
      unlockFactor: 'AI has reached the sophistication to understand human emotional complexity while social isolation has reached crisis levels.',
      inevitability: 'Mental health becoming mainstream healthcare priority.',
      urgencyTrigger: 'Relationship tech is moving from dating to maintenance and growth.',
      marketSize: '$50B relationship and mental health market',
      fundingNeed: '$750K for growth scaling',
      timeline: '4 months to category leadership',
      repository: 'https://github.com/ddevaix-commits/relationship-coaching-platform',
      language: 'TypeScript'
    },
    {
      name: 'tprm-monitor-platform',
      description: 'Enterprise-grade real-time vendor risk monitoring platform built with Next.js 15 and TypeScript',
      category: 'Vendor & Risk Management',
      stage: 'mvp',
      maturity: 80,
      priority: 'high',
      status: 'active',
      problemWorld: 'Enterprises lose billions to vendor failures because they monitor the wrong signals and react too slowly.',
      newWorld: 'Every vendor relationship is monitored in real-time with AI that predicts failures before they happen.',
      valueUnlock: 'Protection of global supply chains and enterprise value.',
      originStory: 'Consulting for enterprises that lost millions to vendor failures they should have seen coming.',
      deepCapability: 'Enterprise software architecture and risk modeling expertise.',
      unfairAdvantage: 'Proprietary risk prediction algorithms that analyze vendor health beyond financial metrics.',
      unlockFactor: 'Supply chain vulnerabilities have been exposed while AI can now process complex vendor data patterns.',
      inevitability: 'Risk management becoming CEO-level priority.',
      urgencyTrigger: 'First major vendor failure could happen any month now.',
      marketSize: '$25B vendor risk management market',
      fundingNeed: '$1M for enterprise scaling',
      timeline: '8 months to market dominance',
      repository: 'https://github.com/ddevaix-commits/tprm-monitor-platform',
      language: 'TypeScript'
    },
    {
      name: 'vendorhub-stage2-complete',
      description: 'VendorHub Platform - Stage 2 AI Engine Complete Implementation',
      category: 'Vendor & Risk Management',
      stage: 'growth',
      maturity: 85,
      priority: 'high',
      status: 'active',
      problemWorld: 'Enterprises operate with vendor data scattered across 50+ systems, creating dangerous blind spots.',
      newWorld: 'Every vendor relationship is visible, understood, and optimized through a single intelligence platform.',
      valueUnlock: 'Billions in cost savings and risk prevention through vendor optimization.',
      originStory: 'Watching enterprises make million-dollar decisions based on incomplete vendor information.',
      deepCapability: 'Data integration, enterprise sales, and procurement expertise.',
      unfairAdvantage: 'Proprietary vendor data aggregation and analysis engine.',
      unlockFactor: 'Digital transformation accelerating vendor ecosystem complexity.',
      inevitability: 'Procurement becoming strategic rather than tactical.',
      urgencyTrigger: 'Every month of delay means more vendor data silos get built.',
      marketSize: '$20B vendor intelligence market',
      fundingNeed: '$2M for enterprise expansion',
      timeline: '6 months to category leadership',
      repository: 'https://github.com/ddevaix-commits/vendorhub-stage2-complete',
      language: 'TypeScript'
    },
    {
      name: 'lens',
      description: 'A platform for bringing focus and clarity to expertise matching within organizations',
      category: 'Business & Networking',
      stage: 'prototype',
      maturity: 45,
      priority: 'medium',
      status: 'active',
      problemWorld: '80% of organizational expertise is trapped in people\'s heads, inaccessible when needed most.',
      newWorld: 'Every expert\'s knowledge is captured, categorized, and instantly available to those who need it.',
      valueUnlock: 'Massive productivity gains through knowledge accessibility and collaboration.',
      originStory: 'Working in organizations where brilliant people couldn\'t find each other to solve critical problems.',
      deepCapability: 'Expertise in organizational psychology, AI, and collaboration design.',
      unfairAdvantage: 'Proprietary expertise mapping that connects people based on real capability, not job titles.',
      unlockFactor: 'Remote work has made expertise visibility critical while AI can now understand and categorize human expertise.',
      inevitability: 'Companies competing on expertise rather than capital.',
      urgencyTrigger: 'Great resignation has made expertise retention urgent.',
      marketSize: '$15B expertise management market',
      fundingNeed: '$300K for MVP completion',
      timeline: '5 months to product-market fit',
      repository: 'https://github.com/ddevaix-commits/lens',
      language: 'TypeScript'
    },
    {
      name: 'ai-teacher-copilot',
      description: 'AI-powered teacher assistant system for education automation',
      category: 'Education & Learning',
      stage: 'prototype',
      maturity: 40,
      priority: 'medium',
      status: 'active',
      problemWorld: 'Teachers spend 70% of time on administration, leaving 30% for actual teaching and personalization.',
      newWorld: 'Every teacher has an AI copilot that handles administration while they focus on inspiring students.',
      valueUnlock: 'Trillions in economic productivity through better-educated populations.',
      originStory: 'Watching brilliant teachers burn out from administrative overload while students suffered from lack of personalization.',
      deepCapability: 'Education technology expertise and AI system design.',
      unfairAdvantage: 'Deep understanding of teacher workflows and student learning patterns.',
      unlockFactor: 'Teacher shortages are reaching crisis levels while AI has become sophisticated enough to handle educational tasks.',
      inevitability: 'Education technology moving from content delivery to personalization.',
      urgencyTrigger: 'Every month of delay means more teachers leave the profession.',
      marketSize: '$40B education technology market',
      fundingNeed: '$250K for MVP development',
      timeline: '7 months to market entry',
      repository: 'https://github.com/ddevaix-commits/ai-teacher-copilot',
      language: 'TypeScript'
    },
    {
      name: 'pokerface-networking',
      description: 'AI-powered strategic networking platform with gamification',
      category: 'Business & Networking',
      stage: 'idea',
      maturity: 15,
      priority: 'medium',
      status: 'active',
      problemWorld: 'Professionals waste hours on networking events with 1% success rates while missing crucial connections.',
      newWorld: 'Every professional interaction is optimized by AI that understands relationship potential and value.',
      valueUnlock: 'Billions in business value through better professional connections.',
      originStory: 'Watching brilliant professionals fail because they couldn\'t navigate relationship-building effectively.',
      deepCapability: 'Social psychology, business development, and platform design expertise.',
      unfairAdvantage: 'Proprietary relationship value assessment algorithms.',
      unlockFactor: 'Remote work has made networking more challenging while AI can now understand professional relationship patterns.',
      inevitability: 'Career success becoming dependent on network quality.',
      urgencyTrigger: 'Traditional networking is dying, strategic networking is emerging.',
      marketSize: '$30B professional networking market',
      fundingNeed: '$150K for prototype development',
      timeline: '9 months to MVP launch',
      repository: 'https://github.com/ddevaix-commits/pokerface-networking',
      language: 'TypeScript'
    },
    {
      name: 'curriculum-alignment',
      description: 'Advanced AI-Powered Curriculum Management System',
      category: 'Education & Learning',
      stage: 'prototype',
      maturity: 35,
      priority: 'medium',
      status: 'active',
      problemWorld: 'Educational content is scattered and misaligned, leaving learners confused and discouraged.',
      newWorld: 'Every learning journey is perfectly sequenced and personalized to ensure understanding and mastery.',
      valueUnlock: 'Massive improvement in learning outcomes and educational efficiency.',
      originStory: 'Seeing students fail not from lack of intelligence, but from poorly sequenced learning materials.',
      deepCapability: 'Curriculum design, educational psychology, and content management expertise.',
      unfairAdvantage: 'Proprietary learning sequence optimization algorithms.',
      unlockFactor: 'Online learning has exploded while AI can now understand and optimize learning sequences.',
      inevitability: 'Education moving from content delivery to learning science.',
      urgencyTrigger: 'Every day of misalignment means more learners give up.',
      marketSize: '$25B educational content market',
      fundingNeed: '$200K for MVP development',
      timeline: '6 months to market validation',
      repository: 'https://github.com/ddevaix-commits/curriculum-alignment',
      language: 'TypeScript'
    },
    {
      name: 'uae-events-hub',
      description: 'Complete events management platform for UAE with AI-powered features',
      category: 'Events & Regional',
      stage: 'idea',
      maturity: 10,
      priority: 'medium',
      status: 'active',
      problemWorld: 'Event attendees waste 50% of time on logistics and miss 80% of relevant connections and content.',
      newWorld: 'Every event experience is personalized and optimized for maximum learning and connection.',
      valueUnlock: 'Billions in productivity and opportunity cost savings through better events.',
      originStory: 'Attending major events where the real value happened in hallways, not sessions.',
      deepCapability: 'Event management, regional business development, and platform design expertise.',
      unfairAdvantage: 'Deep understanding of UAE market and event ecosystem.',
      unlockFactor: 'UAE is positioning as global event hub while event technology is becoming intelligent.',
      inevitability: 'Events becoming primary business development channel.',
      urgencyTrigger: 'Major event season approaching with inadequate technology.',
      marketSize: '$10B regional events market',
      fundingNeed: '$100K for MVP development',
      timeline: '4 months to regional launch',
      repository: 'https://github.com/ddevaix-commits/uae-events-hub',
      language: 'TypeScript'
    },
    {
      name: 'arabic-tech-news-summarizer',
      description: 'Advanced AI-powered Arabic Tech News Summarizer platform for technology professionals and decision makers',
      category: 'Events & Regional',
      stage: 'idea',
      maturity: 20,
      priority: 'medium',
      status: 'active',
      problemWorld: 'Arabic tech professionals drown in information while starving for actionable insights.',
      newWorld: 'Every tech professional receives personalized, curated intelligence that drives better decisions.',
      valueUnlock: 'Acceleration of technology adoption and innovation in Arabic-speaking markets.',
      originStory: 'Watching brilliant Arabic-speaking professionals struggle with English-only tech information.',
      deepCapability: 'Natural language processing, content curation, and regional market expertise.',
      unfairAdvantage: 'Proprietary Arabic language technology understanding and curation algorithms.',
      unlockFactor: 'Arabic NLP has matured while Arabic-speaking markets are experiencing tech booms.',
      inevitability: 'Regional markets demanding localized tech intelligence.',
      urgencyTrigger: 'Technology adoption accelerating without localized support.',
      marketSize: '$5B regional tech media market',
      fundingNeed: '$75K for prototype development',
      timeline: '3 months to MVP launch',
      repository: 'https://github.com/ddevaix-commits/arabic-tech-news-summarizer',
      language: 'TypeScript'
    }
  ];

  for (const venture of ventures) {
    await prisma.venture.create({
      data: venture
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });