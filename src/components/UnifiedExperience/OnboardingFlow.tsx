"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Users, 
  Shield, 
  Zap,
  BarChart3,
  Settings,
  Globe,
  Database,
  Brain,
  ArrowRight,
  X,
  Info,
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Upload,
  FileText,
  Eye,
  ThumbsUp,
  Star,
  User,
  Building2,
  Flag,
  CheckSquare,
  BookOpen,
  Wrench,
  Rocket,
  Heart,
  Gift,
  Trophy,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useUnifiedExperience } from './UnifiedExperienceProvider';

interface OnboardingFlowProps {
  journeyId: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

interface StepComponentProps {
  step: any;
  onComplete: (data: any) => void;
  onSkip?: () => void;
  journeyProgress: number;
}

export function OnboardingFlow({ journeyId, onComplete, onSkip }: OnboardingFlowProps) {
  const { journeys, currentJourney, startJourney, completeStep } = useUnifiedExperience();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const journey = journeys.find(j => j.id === journeyId);
  
  useEffect(() => {
    if (journey && journey.status === 'not_started') {
      startJourney(journeyId);
    }
  }, [journey, journeyId, startJourney]);

  useEffect(() => {
    if (currentJourney && currentJourney.currentStep) {
      const stepIndex = currentJourney.steps.findIndex(s => s.id === currentJourney.currentStep);
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [currentJourney]);

  if (!journey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Journey Not Found</h3>
            <p className="text-gray-600 mb-4">The requested journey could not be found.</p>
            <Button onClick={onSkip}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStep = journey.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / journey.steps.length) * 100;

  const handleStepComplete = async (data: any) => {
    setIsCompleting(true);
    try {
      await completeStep(journeyId, currentStep.id, data);
      setStepData({ ...stepData, [currentStep.id]: data });
      
      if (currentStepIndex === journey.steps.length - 1) {
        // Journey completed
        onComplete?.();
      } else {
        // Move to next step
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } catch (error) {
      console.error('Error completing step:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const renderStepComponent = (step: any) => {
    const commonProps: StepComponentProps = {
      step,
      onComplete: handleStepComplete,
      onSkip: handleSkip,
      journeyProgress: progress
    };

    switch (step.type) {
      case 'learning':
        return <LearningStep {...commonProps} />;
      case 'action':
        return <ActionStep {...commonProps} />;
      case 'configuration':
        return <ConfigurationStep {...commonProps} />;
      case 'assessment':
        return <AssessmentStep {...commonProps} />;
      default:
        return <DefaultStep {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                {journey.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{journey.title}</h1>
                <p className="text-gray-600">{journey.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentStepIndex + 1} of {journey.steps.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderStepComponent(currentStep)}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0 || isCompleting}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {journey.steps.length}
            </div>
            
            <div className="flex items-center gap-2">
              {!currentStep.required && (
                <Button variant="ghost" onClick={handleSkip} disabled={isCompleting}>
                  Skip
                </Button>
              )}
              <Button 
                onClick={() => handleStepComplete({})}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                {currentStepIndex === journey.steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Learning Step Component
function LearningStep({ step, onComplete, journeyProgress }: StepComponentProps) {
  const [isRead, setIsRead] = useState(false);

  const handleMarkAsRead = () => {
    setIsRead(true);
    setTimeout(() => onComplete({ read: true }), 500);
  };

  const learningContent: Record<string, any> = {
    welcome: {
      title: "Welcome to Project Sentinel",
      content: {
        hero: {
          title: "Transform Your TPRM Process",
          subtitle: "AI-powered third-party risk management in minutes, not weeks",
          icon: <Rocket className="h-16 w-16 text-blue-600" />
        },
        keyFeatures: [
          {
            icon: <Zap className="h-8 w-8 text-yellow-500" />,
            title: "Fast Check",
            description: "2-minute risk assessments with AI analysis"
          },
          {
            icon: <Globe className="h-8 w-8 text-green-500" />,
            title: "Vendor Passports",
            description: "Reusable, secure vendor compliance profiles"
          },
          {
            icon: <Shield className="h-8 w-8 text-purple-500" />,
            title: "Multi-Framework",
            description: "SOC2, ISO27001, GDPR, HIPAA compliance tracking"
          },
          {
            icon: <Brain className="h-8 w-8 text-blue-500" />,
            title: "Explainable AI",
            description: "Transparent, source-cited risk findings"
          }
        ],
        benefits: [
          "95% reduction in assessment time",
          "89% first-pass approval rate",
          "68% passport utilization rate",
          "Enterprise-grade security"
        ]
      }
    },
    learn_fast_check: {
      title: "Understanding Fast Check",
      content: {
        overview: {
          title: "What is Fast Check?",
          description: "Fast Check is our revolutionary AI-powered tool that transforms vendor risk assessment from a weeks-long process to a 2-minute automated analysis."
        },
        howItWorks: [
          {
            step: 1,
            title: "Upload Documents",
            description: "Drag and drop compliance documents (SOC2, ISO27001, etc.)",
            icon: <Upload className="h-6 w-6" />
          },
          {
            step: 2,
            title: "AI Analysis",
            description: "Our AI analyzes documents for compliance gaps and risks",
            icon: <Brain className="h-6 w-6" />
          },
          {
            step: 3,
            title: "Risk Scoring",
            description: "Generate comprehensive risk scores and recommendations",
            icon: <Target className="h-6 w-6" />
          },
          {
            step: 4,
            title: "Decision Ready",
            description: "Get actionable insights for vendor decisions",
            icon: <CheckSquare className="h-6 w-6" />
          }
        ],
        keyBenefits: [
          "95% faster than manual assessments",
          "Explainable AI findings with sources",
          "Continuous learning and improvement",
          "Audit-ready documentation"
        ]
      }
    },
    understand_passports: {
      title: "Understanding Vendor Passports",
      content: {
        overview: {
          title: "What are Vendor Passports?",
          description: "Vendor Passports are secure, reusable compliance profiles that eliminate redundant assessments and create network effects."
        },
        benefits: [
          {
            icon: <RefreshCw className="h-6 w-6 text-green-500" />,
            title: "Reuse Compliance Data",
            description: "Use existing assessments across multiple customers"
          },
          {
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            title: "Secure Sharing",
            description: "Controlled access with encryption and permissions"
          },
          {
            icon: <Users className="h-6 w-6 text-purple-500" />,
            title: "Network Effects",
            description: "Build trust across the vendor ecosystem"
          },
          {
            icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
            title: "Continuous Updates",
            description: "Real-time compliance status and monitoring"
          }
        ]
      }
    }
  };

  const content = learningContent[step.id] || learningContent.welcome;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {content.content.hero && (
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              {content.content.hero.icon}
            </div>
            <h2 className="text-3xl font-bold mb-4">{content.content.hero.title}</h2>
            <p className="text-xl text-gray-600">{content.content.hero.subtitle}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Features */}
      {content.content.keyFeatures && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.content.keyFeatures.map((feature: any, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* How It Works */}
      {content.content.howItWorks && (
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.content.howItWorks.map((step: any) => (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-blue-600 mb-2">Step {step.step}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {content.content.benefits && (
        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.content.benefits.map((benefit: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{benefit.title || benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview */}
      {content.content.overview && (
        <Card>
          <CardHeader>
            <CardTitle>{content.content.overview.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{content.content.overview.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Learning Progress</h3>
            <Badge variant={isRead ? 'default' : 'secondary'}>
              {isRead ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          <Progress value={isRead ? 100 : 0} />
          <p className="text-sm text-gray-600 mt-2">
            {isRead ? 'Great! You\'ve completed this learning module.' : 'Read through the content above to continue.'}
          </p>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleMarkAsRead}
          disabled={isRead}
          className="px-8"
        >
          {isRead ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Mark as Read
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Action Step Component
function ActionStep({ step, onComplete }: StepComponentProps) {
  const [isActionComplete, setIsActionComplete] = useState(false);

  const handleActionComplete = () => {
    setIsActionComplete(true);
    setTimeout(() => onComplete({ completed: true }), 1000);
  };

  const actionContent: Record<string, any> = {
    upload_document: {
      title: "Upload Your First Document",
      description: "Let's upload a compliance document to see Fast Check in action",
      action: {
        type: "upload",
        accept: ".pdf,.doc,.docx",
        maxSize: "10MB",
        helpText: "Upload a SOC2, ISO27001, or similar compliance document"
      }
    },
    make_decision: {
      title: "Make Your Decision",
      description: "Based on the AI analysis, make your vendor decision",
      action: {
        type: "decision",
        options: [
          { id: "approve", label: "Approve Vendor", color: "green" },
          { id: "approve_with_conditions", label: "Approve with Conditions", color: "yellow" },
          { id: "reject", label: "Reject Vendor", color: "red" },
          { id: "need_more_info", label: "Need More Information", color: "blue" }
        ]
      }
    },
    create_passport: {
      title: "Create Your First Vendor Passport",
      description: "Let's create a passport for one of your vendors",
      action: {
        type: "create",
        fields: [
          { name: "vendorName", label: "Vendor Name", type: "text", required: true },
          { name: "vendorCategory", label: "Category", type: "select", options: ["Cloud Services", "Software", "Hardware", "Consulting"] },
          { name: "description", label: "Description", type: "textarea" }
        ]
      }
    },
    share_passport: {
      title: "Share a Vendor Passport",
      description: "Learn how to securely share vendor passports",
      action: {
        type: "share",
        demo: true
      }
    }
  };

  const content = actionContent[step.id];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {content.action.type === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here</p>
                <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                <Button variant="outline">Choose File</Button>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: {content.action.accept} • Max size: {content.action.maxSize}
                </p>
              </div>
              <p className="text-sm text-gray-600">{content.action.helpText}</p>
            </div>
          )}

          {content.action.type === "decision" && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">AI Analysis Summary</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Based on the uploaded documents, here's the AI-generated risk assessment:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Risk Score:</span> 72/100 (Medium Risk)
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span> 89%
                  </div>
                  <div>
                    <span className="font-medium">Key Findings:</span> 3 issues identified
                  </div>
                  <div>
                    <span className="font-medium">Recommendation:</span> Approve with conditions
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Select your decision:</Label>
                {content.action.options.map((option: any) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {}}
                  >
                    <div className={`w-3 h-3 rounded-full mr-3 bg-${option.color}-500`}></div>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {content.action.type === "create" && (
            <div className="space-y-4">
              {content.action.fields.map((field: any) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
                  {field.type === "text" && (
                    <Input id={field.name} placeholder={`Enter ${field.label.toLowerCase()}`} />
                  )}
                  {field.type === "textarea" && (
                    <Textarea id={field.name} placeholder={`Enter ${field.label.toLowerCase()}`} />
                  )}
                  {field.type === "select" && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option: string) => (
                          <SelectItem key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          )}

          {content.action.type === "share" && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a demo of the passport sharing feature. In the real system, you would be able to generate secure links and control access permissions.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Sharing Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Public Link</div>
                        <div className="text-sm text-gray-600">Anyone with the link can view</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Restricted Access</div>
                        <div className="text-sm text-gray-600">Email verification required</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Secure Portal</div>
                        <div className="text-sm text-gray-600">Password protected access</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Create</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Complete */}
      {isActionComplete && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Great! You've successfully completed this action. Moving to the next step...
          </AlertDescription>
        </Alert>
      )}

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleActionComplete}
          disabled={isActionComplete}
          className="px-8"
        >
          {isActionComplete ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Complete Action
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Configuration Step Component
function ConfigurationStep({ step, onComplete }: StepComponentProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigurationComplete = () => {
    setIsConfigured(true);
    setTimeout(() => onComplete(formData), 1000);
  };

  const configContent: Record<string, any> = {
    role_setup: {
      title: "Set Up Your Role",
      description: "Choose your primary role to customize your experience",
      fields: [
        {
          name: "role",
          label: "Your Role",
          type: "select",
          required: true,
          options: [
            { value: "administrator", label: "Administrator", description: "Full system access and configuration" },
            { value: "risk_analyst", label: "Risk Analyst", description: "Vendor assessment and risk analysis" },
            { value: "vendor_manager", label: "Vendor Manager", description: "Vendor relationship and passport management" },
            { value: "compliance_officer", label: "Compliance Officer", description: "Compliance monitoring and reporting" },
            { value: "executive", label: "Executive", description: "High-level overview and strategic insights" },
            { value: "read_only", label: "Read Only", description: "View-only access to vendor information" }
          ]
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
          placeholder: "e.g., IT Security, Procurement, Legal"
        },
        {
          name: "experience",
          label: "TPRM Experience",
          type: "select",
          options: [
            { value: "beginner", label: "Beginner (0-1 years)" },
            { value: "intermediate", label: "Intermediate (1-3 years)" },
            { value: "advanced", label: "Advanced (3-5 years)" },
            { value: "expert", label: "Expert (5+ years)" }
          ]
        }
      ]
    },
    organization_setup: {
      title: "Configure Organization",
      description: "Set up your organization details and compliance requirements",
      fields: [
        {
          name: "organizationName",
          label: "Organization Name",
          type: "text",
          required: true,
          placeholder: "Your company name"
        },
        {
          name: "industry",
          label: "Industry",
          type: "select",
          required: true,
          options: [
            "Technology", "Healthcare", "Finance", "Retail", "Manufacturing",
            "Education", "Government", "Consulting", "Other"
          ]
        },
        {
          name: "companySize",
          label: "Company Size",
          type: "select",
          required: true,
          options: [
            { value: "startup", label: "Startup (1-10 employees)" },
            { value: "small", label: "Small Business (11-50 employees)" },
            { value: "medium", label: "Medium Business (51-200 employees)" },
            { value: "large", label: "Large Business (201-1000 employees)" },
            { value: "enterprise", label: "Enterprise (1000+ employees)" }
          ]
        },
        {
          name: "country",
          label: "Country",
          type: "text",
          required: true,
          placeholder: "e.g., United States, United Kingdom"
        },
        {
          name: "complianceFrameworks",
          label: "Compliance Frameworks",
          type: "multiselect",
          options: [
            "SOC 2", "ISO 27001", "PCI DSS", "GDPR", "HIPAA", "SOX", "CCPA", "Other"
          ]
        },
        {
          name: "riskThreshold",
          label: "Risk Threshold",
          type: "select",
          options: [
            { value: "low", label: "Low Risk Tolerance" },
            { value: "medium", label: "Medium Risk Tolerance" },
            { value: "high", label: "High Risk Tolerance" }
          ]
        }
      ]
    },
    preferences: {
      title: "Customize Your Experience",
      description: "Set your preferences and notification settings",
      fields: [
        {
          name: "theme",
          label: "Theme Preference",
          type: "select",
          options: [
            { value: "light", label: "Light Theme" },
            { value: "dark", label: "Dark Theme" },
            { value: "auto", label: "Auto (System)" }
          ]
        },
        {
          name: "notifications",
          label: "Email Notifications",
          type: "checkbox",
          options: [
            { value: "riskAlerts", label: "Risk alerts and notifications" },
            { value: "complianceUpdates", label: "Compliance framework updates" },
            { value: "vendorUpdates", label: "Vendor passport updates" },
            { value: "weeklySummary", label: "Weekly summary reports" }
          ]
        },
        {
          name: "dashboard",
          label: "Default Dashboard View",
          type: "select",
          options: [
            { value: "overview", label: "Overview Dashboard" },
            { value: "risk", label: "Risk Analytics" },
            { value: "compliance", label: "Compliance Status" },
            { value: "vendors", label: "Vendor Management" }
          ]
        }
      ]
    }
  };

  const content = configContent[step.id];

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const isFormValid = () => {
    return content.fields
      .filter((field: any) => field.required)
      .every((field: any) => formData[field.name]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.fields.map((field: any) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "text" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
              )}
              
              {field.type === "select" && (
                <Select onValueChange={(value) => handleFieldChange(field.name, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option: any) => (
                      <SelectItem key={option.value || option} value={option.value || option}>
                        {option.label || option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.type === "multiselect" && (
                <div className="space-y-2">
                  {field.options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option}
                        checked={(formData[field.name] || []).includes(option)}
                        onChange={(e) => {
                          const currentValues = formData[field.name] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter((v: string) => v !== option);
                          handleFieldChange(field.name, newValues);
                        }}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              
              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options.map((option: any) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={(formData[field.name] || []).includes(option.value)}
                        onChange={(e) => {
                          const currentValues = formData[field.name] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v: string) => v !== option.value);
                          handleFieldChange(field.name, newValues);
                        }}
                      />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
              
              {field.description && (
                <p className="text-sm text-gray-600">{field.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      {Object.keys(formData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(formData).map(([key, value]) => {
                const field = content.fields.find((f: any) => f.name === key);
                if (!field) return null;
                
                return (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{field.label}:</span>
                    <span>
                      {Array.isArray(value) ? value.join(', ') : value?.toString() || 'Not set'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleConfigurationComplete}
          disabled={!isFormValid() || isConfigured}
          className="px-8"
        >
          {isConfigured ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Configuration Saved
            </>
          ) : (
            <>
              <Wrench className="h-4 w-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Assessment Step Component
function AssessmentStep({ step, onComplete }: StepComponentProps) {
  const [assessmentData, setAssessmentData] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAssessmentComplete = () => {
    setIsCompleted(true);
    setTimeout(() => onComplete(assessmentData), 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This is a demonstration of the assessment process. In the real system, you would review actual AI-generated risk analysis and provide your assessment.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Sample Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Risk Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Overall Risk Score:</span>
                      <span className="font-medium">72/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Posture:</span>
                      <span className="text-yellow-600">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Coverage:</span>
                      <span className="text-green-600">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Protection:</span>
                      <span className="text-yellow-600">Medium</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Key Findings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Missing encryption for data at rest</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>SOC2 Type II certification current</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>No incident response plan documented</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Your Assessment</Label>
              <Textarea
                placeholder="Provide your assessment of the vendor's risk profile..."
                value={assessmentData.assessment || ''}
                onChange={(e) => setAssessmentData(prev => ({ ...prev, assessment: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div>
              <Label>Recommendation</Label>
              <Select onValueChange={(value) => setAssessmentData(prev => ({ ...prev, recommendation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Vendor</SelectItem>
                  <SelectItem value="approve_with_conditions">Approve with Conditions</SelectItem>
                  <SelectItem value="reject">Reject Vendor</SelectItem>
                  <SelectItem value="need_more_info">Need More Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleAssessmentComplete}
          disabled={!assessmentData.assessment || !assessmentData.recommendation || isCompleted}
          className="px-8"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Assessment Complete
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Submit Assessment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Default Step Component
function DefaultStep({ step, onComplete }: StepComponentProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => onComplete({}), 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Continue</h3>
            <p className="text-gray-600">You're ready to move to the next step in your journey.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleComplete}
          disabled={isCompleted}
          className="px-8"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue
            </>
          )}
        </Button>
      </div>
    </div>
  );
}