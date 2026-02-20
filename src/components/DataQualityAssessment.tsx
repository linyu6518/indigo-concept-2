import { useState } from "react";
import { 
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  BarChart3,
  Flame,
  Clock,
  FileWarning
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface DQStage {
  id: string;
  name: string;
  rules: number;
  failRate: number;
  highRiskRules: number;
  status: "healthy" | "warning" | "critical";
}

interface RuleGroup {
  id: string;
  name: string;
  stage: string;
  rules: number;
  failRate: number;
  lastRun: string;
  trend: "up" | "down" | "stable";
}

interface DQRule {
  id: string;
  name: string;
  ruleGroup: string;
  failCount7d: number;
  failPercentage: number;
  trend: "up" | "down" | "stable";
  impactedRecords: number;
  lastFailure: string;
  severity: "high" | "medium" | "low";
}

interface QualityFlow {
  stage: string;
  description: string;
  rules: number;
  status: "pass" | "fail" | "warning";
}

interface FieldHealth {
  fieldName: string;
  usedInRules: number;
  failureRate: number;
  lastFailureSpike: string;
  trend: "up" | "down" | "stable";
}

const mockStages: DQStage[] = [
  {
    id: "source",
    name: "Source Stage",
    rules: 87,
    failRate: 1.2,
    highRiskRules: 3,
    status: "warning"
  },
  {
    id: "conformed",
    name: "Conformed Stage",
    rules: 45,
    failRate: 0.4,
    highRiskRules: 0,
    status: "healthy"
  },
  {
    id: "enriched",
    name: "Enriched Stage",
    rules: 62,
    failRate: 2.8,
    highRiskRules: 5,
    status: "critical"
  }
];

const mockRuleGroups: RuleGroup[] = [
  { id: "1", name: "NotionalValidation", stage: "Source Stage", rules: 12, failRate: 0.8, lastRun: "2 hours ago", trend: "down" },
  { id: "2", name: "DateConsistencyCheck", stage: "Source Stage", rules: 8, failRate: 1.5, lastRun: "2 hours ago", trend: "up" },
  { id: "3", name: "RiskRatingValidation", stage: "Conformed Stage", rules: 15, failRate: 0.3, lastRun: "2 hours ago", trend: "stable" },
  { id: "4", name: "EnrichedFieldValidation", stage: "Enriched Stage", rules: 20, failRate: 3.2, lastRun: "2 hours ago", trend: "up" },
];

const mockQualityFlow: QualityFlow[] = [
  { stage: "Input", description: "Raw data ingestion", rules: 0, status: "pass" },
  { stage: "Validation", description: "Apply validation rules", rules: 12, status: "warning" },
  { stage: "Aggregate", description: "Aggregate validation results", rules: 3, status: "pass" },
  { stage: "Fail Output", description: "Failed records routing", rules: 2, status: "fail" },
  { stage: "Metrics Output", description: "Quality metrics reporting", rules: 1, status: "pass" }
];

const mockDQRules: DQRule[] = [
  { 
    id: "1", 
    name: "NotionalValidation_GT_Zero", 
    ruleGroup: "NotionalValidation",
    failCount7d: 45, 
    failPercentage: 0.8, 
    trend: "down", 
    impactedRecords: 45,
    lastFailure: "2 hours ago",
    severity: "medium"
  },
  { 
    id: "2", 
    name: "DateRange_ValidYear", 
    ruleGroup: "DateConsistencyCheck",
    failCount7d: 123, 
    failPercentage: 2.1, 
    trend: "up", 
    impactedRecords: 123,
    lastFailure: "1 hour ago",
    severity: "high"
  },
  { 
    id: "3", 
    name: "RiskRating_ValidRange", 
    ruleGroup: "RiskRatingValidation",
    failCount7d: 12, 
    failPercentage: 0.2, 
    trend: "stable", 
    impactedRecords: 12,
    lastFailure: "5 hours ago",
    severity: "low"
  },
];

const mockFieldHealth: FieldHealth[] = [
  { fieldName: "BorrowerRiskRatingGroup", usedInRules: 3, failureRate: 0.8, lastFailureSpike: "2 days ago", trend: "down" },
  { fieldName: "NotionalAmount", usedInRules: 5, failureRate: 1.2, lastFailureSpike: "1 day ago", trend: "up" },
  { fieldName: "MaturityDate", usedInRules: 4, failureRate: 0.3, lastFailureSpike: "1 week ago", trend: "stable" },
];

export function DataQualityAssessment() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedRuleGroup, setSelectedRuleGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"rules" | "metrics" | "fields">("rules");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    setSelectedRuleGroup(null);
  };

  const handleRuleGroupClick = (ruleGroupId: string) => {
    setSelectedRuleGroup(ruleGroupId);
  };

  const handleBackToStages = () => {
    setSelectedStage(null);
    setSelectedRuleGroup(null);
  };

  const handleBackToRuleGroups = () => {
    setSelectedRuleGroup(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-50 border-green-200 text-green-700";
      case "warning": return "bg-orange-50 border-orange-200 text-orange-700";
      case "critical": return "bg-red-50 border-red-200 text-red-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-red-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-green-600" />;
      case "stable": return <Activity className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-300";
      case "low": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Main dashboard - Stages view
  if (!selectedStage) {
    return (
      <div className="flex-1 p-6" style={{ backgroundColor: '#f8faf9' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Data Quality Assessment</h1>
            <p className="text-sm text-muted-foreground">Data Health Control & Monitoring</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white border-gray-200"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overall Health Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">97.2%</div>
                <div className="text-xs text-muted-foreground">Overall Pass Rate</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 inline text-green-600 mr-1" />
              +0.3% from last week
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-xs text-muted-foreground">High Risk Rules</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 inline text-red-600 mr-1" />
              +2 from yesterday
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">194</div>
                <div className="text-xs text-muted-foreground">Total Rules</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Across 3 stages
            </div>
          </div>
        </div>

        {/* Quality Stages */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quality Stages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => handleStageClick(stage.id)}
              className={`text-left p-6 rounded-lg border-2 transition-all hover:shadow-lg ${getStatusColor(stage.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">{stage.name}</h3>
                {stage.status === "critical" && <Flame className="w-5 h-5 text-red-600" />}
                {stage.status === "warning" && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                {stage.status === "healthy" && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rules:</span>
                  <span className="text-lg font-bold">{stage.rules}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fail Rate:</span>
                  <span className={`text-lg font-bold ${
                    stage.failRate > 2 ? "text-red-600" : 
                    stage.failRate > 1 ? "text-orange-600" : 
                    "text-green-600"
                  }`}>
                    {stage.failRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">High Risk Rules:</span>
                  <span className={`text-lg font-bold ${
                    stage.highRiskRules > 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    {stage.highRiskRules}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-current/20">
                <div className="flex items-center justify-between text-sm">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // RuleGroups view
  if (selectedStage && !selectedRuleGroup) {
    const currentStage = mockStages.find(s => s.id === selectedStage);
    const stageRuleGroups = mockRuleGroups.filter(rg => rg.stage === currentStage?.name);

    return (
      <div className="flex-1 p-6" style={{ backgroundColor: '#f8faf9' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Data Quality &gt; {currentStage?.name}
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{currentStage?.name}</h1>
          </div>
          
          <Button onClick={handleBackToStages} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Stages
          </Button>
        </div>

        {/* Stage Health Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Rules</div>
            <div className="text-2xl font-bold text-foreground">{currentStage?.rules}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Fail Rate</div>
            <div className={`text-2xl font-bold ${
              (currentStage?.failRate || 0) > 2 ? "text-red-600" : 
              (currentStage?.failRate || 0) > 1 ? "text-orange-600" : 
              "text-green-600"
            }`}>
              {currentStage?.failRate}%
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">High Risk</div>
            <div className="text-2xl font-bold text-red-600">{currentStage?.highRiskRules}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Last Run</div>
            <div className="text-sm font-medium text-foreground mt-1">2 hours ago</div>
          </div>
        </div>

        {/* Rule Groups */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Rule Groups</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stageRuleGroups.map((ruleGroup) => (
            <button
              key={ruleGroup.id}
              onClick={() => handleRuleGroupClick(ruleGroup.id)}
              className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#5BBD72] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-foreground pr-2">{ruleGroup.name}</h3>
                {getTrendIcon(ruleGroup.trend)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rules:</span>
                  <span className="font-medium text-foreground">{ruleGroup.rules}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fail Rate:</span>
                  <span className={`font-bold ${
                    ruleGroup.failRate > 2 ? "text-red-600" : 
                    ruleGroup.failRate > 1 ? "text-orange-600" : 
                    "text-green-600"
                  }`}>
                    {ruleGroup.failRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Run:</span>
                  <span className="text-foreground">{ruleGroup.lastRun}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-[#5BBD72]">
                  <span>View Quality Flow</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Rule Details view with Quality Flow
  const currentRuleGroup = mockRuleGroups.find(rg => rg.id === selectedRuleGroup);
  const currentStage = mockStages.find(s => s.name === currentRuleGroup?.stage);

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f8faf9' }}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Data Quality &gt; {currentStage?.name} &gt; {currentRuleGroup?.name}
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{currentRuleGroup?.name}</h1>
          </div>
          
          <Button onClick={handleBackToRuleGroups} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Rule Groups
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("rules")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "rules"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Rules & Health
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "metrics"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab("fields")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "fields"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Field Health
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Rules & Health Tab */}
        {activeTab === "rules" && (
          <div className="space-y-6">
            {/* Quality Flow Visualization */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#5BBD72]" />
                Quality Flow Process
              </h3>
              
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {mockQualityFlow.map((flow, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 ${
                        flow.status === "pass" ? "bg-green-100 border-2 border-green-300" :
                        flow.status === "fail" ? "bg-red-100 border-2 border-red-300" :
                        "bg-orange-100 border-2 border-orange-300"
                      }`}>
                        {flow.status === "pass" && <CheckCircle className="w-8 h-8 text-green-600" />}
                        {flow.status === "fail" && <AlertTriangle className="w-8 h-8 text-red-600" />}
                        {flow.status === "warning" && <AlertCircle className="w-8 h-8 text-orange-600" />}
                      </div>
                      <div className="font-semibold text-sm text-foreground mb-1">{flow.stage}</div>
                      <div className="text-xs text-muted-foreground mb-1">{flow.description}</div>
                      {flow.rules > 0 && (
                        <div className="text-xs font-medium text-[#5BBD72]">{flow.rules} rules</div>
                      )}
                    </div>
                    
                    {idx < mockQualityFlow.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rules with Health Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-[#5BBD72]" />
                Rules Health Status
              </h3>
              
              <div className="space-y-4">
                {mockDQRules.map((rule) => (
                  <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#5BBD72] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{rule.name}</h4>
                        <div className="text-sm text-muted-foreground">RuleGroup: {rule.ruleGroup}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                        {rule.severity.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Fail Count (7d)</div>
                        <div className="text-xl font-bold text-foreground">{rule.failCount7d}</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Fail %</div>
                        <div className={`text-xl font-bold ${
                          rule.failPercentage > 2 ? "text-red-600" : 
                          rule.failPercentage > 1 ? "text-orange-600" : 
                          "text-green-600"
                        }`}>
                          {rule.failPercentage}%
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Trend</div>
                        <div className="flex items-center gap-2 mt-1">
                          {getTrendIcon(rule.trend)}
                          <span className="text-sm font-medium text-foreground">
                            {rule.trend === "up" ? "Rising" : rule.trend === "down" ? "Falling" : "Stable"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Impacted Records</div>
                        <div className="text-xl font-bold text-foreground">{rule.impactedRecords}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Last failure: {rule.lastFailure}
                      </div>
                      <Button variant="outline" size="sm" className="text-[#5BBD72] border-[#5BBD72]">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-3xl font-bold text-foreground">1,245,678</div>
                <div className="text-xs text-muted-foreground mt-2">Last 24 hours</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Failed Records</div>
                </div>
                <div className="text-3xl font-bold text-red-600">34,823</div>
                <div className="text-xs text-muted-foreground mt-2">2.8% of total</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Pass Rate</div>
                </div>
                <div className="text-3xl font-bold text-green-600">97.2%</div>
                <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.3% from last week
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Active Rules</div>
                </div>
                <div className="text-3xl font-bold text-foreground">12</div>
                <div className="text-xs text-muted-foreground mt-2">In this group</div>
              </div>
            </div>

            {/* Top Failing Fields */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Top Failing Fields</h3>
              <div className="space-y-3">
                {[
                  { field: "NotionalAmount", failures: 12543, rate: 2.1 },
                  { field: "MaturityDate", failures: 8234, rate: 1.5 },
                  { field: "BorrowerRiskRating", failures: 5678, rate: 0.8 },
                  { field: "InterestRate", failures: 4521, rate: 0.6 },
                  { field: "CurrencyCode", failures: 3412, rate: 0.4 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{item.field}</div>
                      <div className="text-sm text-muted-foreground">{item.failures.toLocaleString()} failures</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        item.rate > 1.5 ? "text-red-600" : 
                        item.rate > 0.8 ? "text-orange-600" : 
                        "text-yellow-600"
                      }`}>
                        {item.rate}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Field Health Tab */}
        {activeTab === "fields" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-2">Field-Level Health Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Monitor individual field health metrics across all validation rules
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFieldHealth.map((field, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#5BBD72] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-foreground pr-2">{field.fieldName}</h4>
                    {getTrendIcon(field.trend)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Used in Rules</span>
                      <span className="font-bold text-blue-600">{field.usedInRules}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Failure Rate</span>
                      <span className={`font-bold ${
                        field.failureRate > 1 ? "text-red-600" : 
                        field.failureRate > 0.5 ? "text-orange-600" : 
                        "text-green-600"
                      }`}>
                        {field.failureRate}%
                      </span>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Last Failure Spike</div>
                      <div className="text-sm font-medium text-orange-700 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {field.lastFailureSpike}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="w-full text-[#5BBD72] border-[#5BBD72]">
                      View Field History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
