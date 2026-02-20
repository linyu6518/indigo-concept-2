import { useState, useCallback } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { DAGView } from "./DAGView";
import { 
  Search, 
  List, 
  Grid3x3, 
  Database, 
  FileCode, 
  Clock, 
  ArrowRight, 
  Download,
  ChevronLeft,
  Plus,
  Filter,
  Columns3,
  MoreHorizontal,
  Edit2,
  ChevronDown,
  X,
  Bookmark,
  RefreshCw,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileWarning,
  FolderKanban,
  Lightbulb,
  Info,
  Target,
  Shield
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface FeedData {
  feed: string;
  ruleGroups: number;
  rules: number;
  lastUpdated?: string;
  status?: "active" | "pending" | "inactive";
  // Phase 1: Feed Health Metrics
  pendingChanges?: number;
  highRiskRules?: number;
  lastModified?: string;
  impactedReports?: number;
  dqFailures?: number;
  releaseStatus?: "deployed" | "staged" | "development";
  healthScore?: number; // 0-100
}

interface RuleGroupData {
  id: string;
  rulegroup: string;
  sequence: number;
  description: string;
  rules: number;
  outputViewFlag: boolean;
  outputViewName?: string;
  // Flow View Enhancements
  highRiskRules?: number;
  lastModified?: string;
  impactedReports?: number;
  blockRiskScore?: number;
  ruleDensity?: number;
}

interface SequenceRule {
  id: string;
  sequence: number;
  attributeName: string;
  type: "QUERY" | "EXPRESSION";
  value: string;
  description?: string;
  outputfile: boolean;
  // Phase 3: Smart Governance Features
  riskScore?: number;  // 0-100
  impactedFields?: string[];
  impactedReports?: number;
  lastModified?: string;
  modifiedBy?: string;
  hasChanges?: boolean;
  testStatus?: "passing" | "failing" | "untested";
}

const feedsData: FeedData[] = [
  { 
    feed: "Deriv_FXFWD", 
    ruleGroups: 4, 
    rules: 15, 
    status: "active",
    pendingChanges: 3,
    highRiskRules: 1,
    lastModified: "2 days ago",
    impactedReports: 5,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 85
  },
  { 
    feed: "Deriv_SWAP", 
    ruleGroups: 1, 
    rules: 3, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "1 week ago",
    impactedReports: 2,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 95
  },
  { 
    feed: "Deriv_AARO_ME", 
    ruleGroups: 2, 
    rules: 2, 
    status: "pending",
    pendingChanges: 5,
    highRiskRules: 2,
    lastModified: "1 hour ago",
    impactedReports: 8,
    dqFailures: 2,
    releaseStatus: "staged",
    healthScore: 55
  },
  { 
    feed: "USInvestment_Monthly", 
    ruleGroups: 2, 
    rules: 5, 
    lastUpdated: "7 months ago", 
    status: "active",
    pendingChanges: 1,
    highRiskRules: 0,
    lastModified: "3 days ago",
    impactedReports: 3,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 78
  },
  { 
    feed: "Deriv_ALL", 
    ruleGroups: 5, 
    rules: 10, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "1 month ago",
    impactedReports: 4,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 92
  },
  { 
    feed: "Deriv_GLBFX", 
    ruleGroups: 1, 
    rules: 2, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "2 weeks ago",
    impactedReports: 1,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 88
  },
  { 
    feed: "USInvestmentPledge", 
    ruleGroups: 2, 
    rules: 61, 
    lastUpdated: "1 month ago", 
    status: "active",
    pendingChanges: 2,
    highRiskRules: 1,
    lastModified: "4 days ago",
    impactedReports: 7,
    dqFailures: 1,
    releaseStatus: "deployed",
    healthScore: 72
  },
  { 
    feed: "USDepositsCollateralized", 
    ruleGroups: 3, 
    rules: 23, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "1 week ago",
    impactedReports: 6,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 90
  },
  { 
    feed: "USDepositsAmeritrade", 
    ruleGroups: 6, 
    rules: 32, 
    status: "active",
    pendingChanges: 1,
    highRiskRules: 0,
    lastModified: "5 hours ago",
    impactedReports: 9,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 82
  },
  { 
    feed: "USLoansCustomCashflowShaw", 
    ruleGroups: 2, 
    rules: 14, 
    status: "pending",
    pendingChanges: 7,
    highRiskRules: 3,
    lastModified: "30 minutes ago",
    impactedReports: 4,
    dqFailures: 1,
    releaseStatus: "development",
    healthScore: 48
  },
  { 
    feed: "USLoansCustomCashflowLoanID", 
    ruleGroups: 1, 
    rules: 13, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "3 weeks ago",
    impactedReports: 2,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 86
  },
  { 
    feed: "USCreditCardCorporate", 
    ruleGroups: 3, 
    rules: 60, 
    lastUpdated: "1 month ago", 
    status: "active",
    pendingChanges: 3,
    highRiskRules: 1,
    lastModified: "2 hours ago",
    impactedReports: 12,
    dqFailures: 0,
    releaseStatus: "staged",
    healthScore: 75
  },
  { 
    feed: "USCreditCardNordstrom", 
    ruleGroups: 3, 
    rules: 74, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "5 days ago",
    impactedReports: 8,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 94
  },
  { 
    feed: "USNonSystemDataForwardStartingLoans", 
    ruleGroups: 1, 
    rules: 2, 
    status: "inactive",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "6 months ago",
    impactedReports: 0,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 65
  },
  { 
    feed: "USNonSystemDataUSFHLBUtilizedCapacity", 
    ruleGroups: 1, 
    rules: 2, 
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "2 weeks ago",
    impactedReports: 3,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 89
  },
];

const mockRuleGroups: RuleGroupData[] = [
  { id: "1", rulegroup: "InitialLoad", sequence: 10, description: "InitialLoad", rules: 1, outputViewFlag: true, outputViewName: "InitialLoad", highRiskRules: 0, lastModified: "5 days ago", impactedReports: 2, blockRiskScore: 15, ruleDensity: 1 },
  { id: "2", rulegroup: "ScaramoucheLoad", sequence: 20, description: "", rules: 1, outputViewFlag: false, highRiskRules: 0, lastModified: "1 week ago", impactedReports: 1, blockRiskScore: 20, ruleDensity: 1 },
  { id: "3", rulegroup: "Onboarded", sequence: 40, description: "Adding Data and Fields", rules: 32, outputViewFlag: true, outputViewName: "Onboarded", highRiskRules: 2, lastModified: "2 days ago", impactedReports: 5, blockRiskScore: 55, ruleDensity: 32 },
  { id: "4", rulegroup: "TBSMReady", sequence: 50, description: "TBSMReady OutputFields", rules: 1, outputViewFlag: false, highRiskRules: 0, lastModified: "3 days ago", impactedReports: 3, blockRiskScore: 10, ruleDensity: 1 },
];

const mockSequenceRules: SequenceRule[] = [
  { 
    id: "1", 
    sequence: 1, 
    attributeName: "", 
    type: "QUERY", 
    value: "SELECT convert_date(Control.AsOfDate) as AsOfDate, TRIM(Control.RecordCount) as RecordCount, TRIM(Control.ParValueNotionalSum) as ParValueNotionalSum",
    outputfile: false,
    riskScore: 25,
    impactedFields: ["AsOfDate", "RecordCount", "ParValueNotionalSum"],
    impactedReports: 5,
    lastModified: "2 days ago",
    modifiedBy: "Yu",
    hasChanges: false,
    testStatus: "passing"
  },
  { 
    id: "2", 
    sequence: 20, 
    attributeName: "OriginalNotional", 
    type: "EXPRESSION", 
    value: "COALESCE(castfltrim(OriginalFcci) as decimal(22,2)) ,0,0)",
    outputfile: true,
    riskScore: 65,
    impactedFields: ["OriginalNotional", "OriginalFcci"],
    impactedReports: 12,
    lastModified: "5 hours ago",
    modifiedBy: "kapan08",
    hasChanges: true,
    testStatus: "untested"
  },
  { 
    id: "3", 
    sequence: 30, 
    attributeName: "OriginalPurchaseNotional", 
    type: "EXPRESSION", 
    value: "COALESCE(castfltrim(OriginalBal) as decimal(22,2)) ,0,0)",
    outputfile: true,
    riskScore: 85,
    impactedFields: ["OriginalPurchaseNotional", "OriginalBal", "AccountBalance"],
    impactedReports: 18,
    lastModified: "1 hour ago",
    modifiedBy: "ginnyzhi",
    hasChanges: true,
    testStatus: "failing"
  },
];

const recentlyVisited: FeedData[] = [
  { 
    feed: "USCreditCardCorporate", 
    ruleGroups: 3, 
    rules: 60, 
    lastUpdated: "2 hours ago", 
    status: "active",
    pendingChanges: 3,
    highRiskRules: 1,
    lastModified: "2 hours ago",
    impactedReports: 12,
    dqFailures: 0,
    releaseStatus: "staged",
    healthScore: 75
  },
  { 
    feed: "USDepositsAmeritrade", 
    ruleGroups: 6, 
    rules: 32, 
    lastUpdated: "5 hours ago", 
    status: "active",
    pendingChanges: 1,
    highRiskRules: 0,
    lastModified: "5 hours ago",
    impactedReports: 9,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 82
  },
  { 
    feed: "Deriv_FXFWD", 
    ruleGroups: 4, 
    rules: 15, 
    lastUpdated: "1 day ago", 
    status: "active",
    pendingChanges: 3,
    highRiskRules: 1,
    lastModified: "2 days ago",
    impactedReports: 5,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 85
  },
  { 
    feed: "USInvestmentPledge", 
    ruleGroups: 2, 
    rules: 61, 
    lastUpdated: "2 days ago", 
    status: "active",
    pendingChanges: 2,
    highRiskRules: 1,
    lastModified: "4 days ago",
    impactedReports: 7,
    dqFailures: 1,
    releaseStatus: "deployed",
    healthScore: 72
  },
  {
    feed: "EUCashEquity",
    ruleGroups: 5,
    rules: 44,
    lastUpdated: "3 days ago",
    status: "active",
    pendingChanges: 0,
    highRiskRules: 0,
    lastModified: "3 days ago",
    impactedReports: 18,
    dqFailures: 0,
    releaseStatus: "deployed",
    healthScore: 91
  },
  {
    feed: "APACLoansMortgage",
    ruleGroups: 4,
    rules: 28,
    lastUpdated: "4 days ago",
    status: "active",
    pendingChanges: 2,
    highRiskRules: 1,
    lastModified: "5 days ago",
    impactedReports: 6,
    dqFailures: 0,
    releaseStatus: "staged",
    healthScore: 78
  },
  {
    feed: "GlobalFXSpot",
    ruleGroups: 8,
    rules: 52,
    lastUpdated: "1 week ago",
    status: "active",
    pendingChanges: 1,
    highRiskRules: 2,
    lastModified: "1 week ago",
    impactedReports: 14,
    dqFailures: 1,
    releaseStatus: "deployed",
    healthScore: 68
  },
  {
    feed: "USWealthAdvisory",
    ruleGroups: 3,
    rules: 39,
    lastUpdated: "1 week ago",
    status: "active",
    pendingChanges: 4,
    highRiskRules: 0,
    lastModified: "1 week ago",
    impactedReports: 11,
    dqFailures: 0,
    releaseStatus: "development",
    healthScore: 88
  },
  {
    feed: "UKRegulatoryReporting",
    ruleGroups: 7,
    rules: 67,
    lastUpdated: "2 weeks ago",
    status: "active",
    pendingChanges: 2,
    highRiskRules: 3,
    lastModified: "2 weeks ago",
    impactedReports: 22,
    dqFailures: 2,
    releaseStatus: "deployed",
    healthScore: 65
  },
];

interface HistoryChange {
  id: string;
  status: "success" | "failed";
  versionId: string;
  user: string;
  jira?: string;
  submittedDate: string;
}

const mockHistoryChanges: HistoryChange[] = [
  { id: "1", status: "failed", versionId: "27566", user: "ginnyzhi", jira: "TDFP-1609", submittedDate: "2024/03/14" },
  { id: "2", status: "success", versionId: "10845", user: "kapan08", submittedDate: "2021/07/08" },
];

export function Onboarding() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [selectedRuleGroup, setSelectedRuleGroup] = useState<RuleGroupData | null>(null);
  
  // RuleGroup View Mode (Phase 2)
  const [ruleGroupViewMode, setRuleGroupViewMode] = useState<"table" | "flow">("flow");
  
  // Phase 3: Smart Governance States
  const [testModeEnabled, setTestModeEnabled] = useState(false);
  const [selectedRuleForImpact, setSelectedRuleForImpact] = useState<SequenceRule | null>(null);
  const [selectedRuleForLineage, setSelectedRuleForLineage] = useState<SequenceRule | null>(null);
  const [showImpactPreview, setShowImpactPreview] = useState(false);
  const [showFieldLineage, setShowFieldLineage] = useState(false);

  // Phase 4: SQL Editor States
  const [sqlValidation, setSqlValidation] = useState<{errors: string[], warnings: string[], suggestions: string[]}>(  {
    errors: [],
    warnings: [],
    suggestions: []
  });
  const [showFieldHelper, setShowFieldHelper] = useState(false);
  
  // Enhancement States
  const [showHealthScoreTooltip, setShowHealthScoreTooltip] = useState<string | null>(null);
  const [showImpactPreviewPanel, setShowImpactPreviewPanel] = useState(false);
  
  // Filter & Column Configuration States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  
  // History Panel State
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  
  // Edit RuleGroup States
  const [editingRuleGroupData, setEditingRuleGroupData] = useState<RuleGroupData | null>(null);
  const [editRuleGroupForm, setEditRuleGroupForm] = useState({
    rulegroup: "",
    sequence: "",
    description: "",
    outputViewName: "",
    outputViewFlag: false
  });
  
  // Edit & Add States
  const [editingRule, setEditingRule] = useState<SequenceRule | null>(null);
  const [editingRuleData, setEditingRuleData] = useState({
    sequence: "",
    attributeName: "",
    type: "QUERY" as "QUERY" | "EXPRESSION",
    value: "",
    description: "",
    outputfile: false
  });
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({
    sequence: "",
    attributeName: "",
    type: "QUERY" as "QUERY" | "EXPRESSION",
    value: "",
    description: "",
    outputfile: false
  });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    sequence: true,
    attributeName: true,
    type: true,
    value: true,
    description: true,
    outputfile: true
  });

  const filteredFeeds = feedsData.filter((feed) =>
    feed.feed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Feed Name", "Rule Groups", "Rules", "Last Updated"];
    const rows = filteredFeeds.map((feed) => [
      feed.feed,
      feed.ruleGroups.toString(),
      feed.rules.toString(),
      feed.lastUpdated || "Recently",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `onboarding-feeds-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFeedClick = (feedName: string) => {
    setSelectedFeed(feedName);
    setSelectedRuleGroup(null);
  };

  const handleBackToFeeds = () => {
    setSelectedFeed(null);
    setSelectedRuleGroup(null);
  };

  const handleRuleGroupClick = (ruleGroup: RuleGroupData) => {
    setSelectedRuleGroup(ruleGroup);
  };

  const handleBackToRuleGroups = () => {
    setSelectedRuleGroup(null);
  };

  // Phase 3: Risk Score & Status Helpers
  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    if (score >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passing': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failing': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Phase 4: SQL Validation & Analysis
  const validateSQL = (sql: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!sql.trim()) {
      errors.push("Query cannot be empty");
      return { errors, warnings, suggestions };
    }

    // Check for SELECT *
    if (/SELECT\s+\*/i.test(sql)) {
      warnings.push("Using SELECT * can impact performance. Consider specifying column names.");
    }

    // Check for missing WHERE in UPDATE/DELETE
    if ((/UPDATE\s+/i.test(sql) || /DELETE\s+FROM/i.test(sql)) && !/WHERE/i.test(sql)) {
      errors.push("UPDATE/DELETE without WHERE clause detected - this will affect all rows!");
    }

    // Check for unmatched parentheses
    const openParen = (sql.match(/\(/g) || []).length;
    const closeParen = (sql.match(/\)/g) || []).length;
    if (openParen !== closeParen) {
      errors.push(`Unmatched parentheses: ${openParen} open, ${closeParen} close`);
    }

    // Performance suggestions
    if (/SELECT.*FROM.*WHERE.*OR/i.test(sql) && !/INDEX/i.test(sql)) {
      suggestions.push("Consider adding indexes for OR conditions to improve performance");
    }

    // COALESCE optimization
    if ((sql.match(/COALESCE/gi) || []).length > 3) {
      suggestions.push("Multiple COALESCE calls detected - consider simplifying logic");
    }

    // Check for common typos
    if (/SELCT|FORM|WEHERE/i.test(sql)) {
      errors.push("Possible typo detected in SQL keywords");
    }

    return { errors, warnings, suggestions };
  };

  // Available fields for suggestions
  const availableFields = [
    "AsOfDate", "RecordCount", "ParValueNotionalSum", "OriginalNotional", 
    "OriginalFcci", "OriginalPurchaseNotional", "OriginalBal", "AccountBalance",
    "LoanId", "CustomerId", "InterestRate", "MaturityDate", "CurrentBalance"
  ];

  const handleEditRule = (rule: SequenceRule) => {
    setEditingRule(rule);
    setEditingRuleData({
      sequence: rule.sequence.toString(),
      attributeName: rule.attributeName,
      type: rule.type,
      value: rule.value,
      description: rule.description || "",
      outputfile: rule.outputfile
    });
  };
  
  const handleEditRuleGroup = (rg: RuleGroupData) => {
    setEditingRuleGroupData(rg);
    setEditRuleGroupForm({
      rulegroup: rg.rulegroup,
      sequence: rg.sequence.toString(),
      description: rg.description,
      outputViewName: rg.outputViewName || "",
      outputViewFlag: rg.outputViewFlag
    });
  };

  const handleSaveEdit = () => {
    // Save logic here
    setEditingRule(null);
  };
  
  const handleSaveRuleGroupEdit = () => {
    // Save RuleGroup logic here
    setEditingRuleGroupData(null);
  };

  const handleAddRow = () => {
    // Add logic here
    setShowAddRowDialog(false);
    setNewRowData({
      sequence: "",
      attributeName: "",
      type: "QUERY",
      value: "",
      description: "",
      outputfile: false
    });
  };

  const handleApplyFilter = () => {
    // Apply filter logic here
    setShowFilterPanel(false);
  };

  // Health Score Calculation Details
  const getHealthScoreBreakdown = (feed: FeedData) => {
    const breakdown = [];
    let total = 100;

    if (feed.dqFailures && feed.dqFailures > 0) {
      breakdown.push({ label: `DQ Failure Weight`, value: -10, detail: `${feed.dqFailures} failures` });
      total -= 10;
    }

    if (feed.highRiskRules && feed.highRiskRules > 0) {
      const deduction = feed.highRiskRules * 4;
      breakdown.push({ label: `${feed.highRiskRules} High Risk Rules`, value: -deduction });
      total -= deduction;
    }

    if (feed.pendingChanges && feed.pendingChanges > 3) {
      breakdown.push({ label: `${feed.pendingChanges} Pending Changes`, value: -5 });
      total -= 5;
    }

    // Positive factors
    if (feed.lastModified) {
      const daysAgo = parseInt(feed.lastModified.split(' ')[0]);
      if (daysAgo > 20) {
        breakdown.push({ label: `Last Release ${feed.lastModified}`, value: 5 });
        total += 5;
      }
    }

    // Rule test coverage (simulated)
    breakdown.push({ label: 'Rule Test Coverage 80%', value: 3 });
    total += 3;

    return { breakdown, total: Math.max(0, Math.min(100, total)) };
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // Helper function to get health score color
  const getHealthScoreColor = (score: number = 0) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  // Helper function to get release status badge style
  const getReleaseStatusStyle = (status?: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-700 border-green-200";
      case "staged":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "development":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Render Feed Health Card (Enhanced for Phase 1)
  const renderFeedHealthCard = (feed: FeedData) => {
    const feedData = feedsData.find(f => f.feed === feed.feed) || feed;
    const hasWarnings = (feedData.highRiskRules && feedData.highRiskRules > 0) || 
                        (feedData.dqFailures && feedData.dqFailures > 0) ||
                        (feedData.pendingChanges && feedData.pendingChanges > 3);

    return (
      <Card
        key={feedData.feed}
        className="p-5 bg-white border border-gray-200 hover:border-[#5BBD72] hover:shadow-md transition-all cursor-pointer"
        onClick={() => handleFeedClick(feedData.feed)}
      >
        {/* Header with Title and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{feedData.feed}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getStatusColor(feedData.status)}`}>
                  {feedData.status}
                </Badge>
                {feedData.releaseStatus && (
                  <Badge variant="outline" className={`text-xs ${getReleaseStatusStyle(feedData.releaseStatus)}`}>
                    {feedData.releaseStatus}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Health Score Badge with Tooltip */}
          {feedData.healthScore !== undefined && (() => {
            const { breakdown, total } = getHealthScoreBreakdown(feedData);
            return (
              <div className="relative flex flex-col items-end">
                <button
                  className={`text-2xl font-bold ${getHealthScoreColor(feedData.healthScore)} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHealthScoreTooltip(showHealthScoreTooltip === feedData.feed ? null : feedData.feed);
                  }}
                >
                  {feedData.healthScore}
                </button>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Health</span>
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/30 bg-muted/50">
                    <Info className="w-3 h-3" />
                  </span>
                </div>
                
                {/* Tooltip */}
                {showHealthScoreTooltip === feedData.feed && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <span className="text-sm font-semibold text-foreground">Health Score Breakdown</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHealthScoreTooltip(null);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs text-foreground font-medium">Base Score</span>
                        <span className="text-xs font-bold text-foreground">100</span>
                      </div>
                      {breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1">
                          <span className={`text-xs ${item.value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {item.label}
                          </span>
                          <span className={`text-xs font-semibold ${item.value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {item.value > 0 ? '+' : ''}{item.value}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm font-bold text-foreground">Final Score</span>
                        <span className={`text-lg font-bold ${getHealthScoreColor(total)}`}>
                          {total}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded flex items-center justify-center">
              <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Rule Groups</div>
              <div className="text-sm font-semibold text-foreground">{feedData.ruleGroups}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-50 rounded flex items-center justify-center">
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Rules</div>
              <div className="text-sm font-semibold text-foreground">{feedData.rules}</div>
            </div>
          </div>
        </div>

        {/* Health Indicators */}
        <div className="space-y-2 mb-4">
          {/* Pending Changes */}
          {feedData.pendingChanges !== undefined && feedData.pendingChanges > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-muted-foreground">Pending Changes</span>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {feedData.pendingChanges}
              </Badge>
            </div>
          )}

          {/* High Risk Rules */}
          {feedData.highRiskRules !== undefined && feedData.highRiskRules > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-muted-foreground">High Risk Rules</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {feedData.highRiskRules}
              </Badge>
            </div>
          )}

          {/* DQ Failures */}
          {feedData.dqFailures !== undefined && feedData.dqFailures > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-muted-foreground">DQ Failures</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {feedData.dqFailures}
              </Badge>
            </div>
          )}

          {/* Healthy State */}
          {feedData.pendingChanges === 0 && feedData.highRiskRules === 0 && feedData.dqFailures === 0 && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>No issues detected</span>
            </div>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <div className="text-xs">
              <span className="text-muted-foreground">Reports: </span>
              <span className="font-medium text-foreground">{feedData.impactedReports || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <div className="text-xs text-muted-foreground truncate">
              {feedData.lastModified || 'No updates'}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Feed List View (Level 1)
  if (!selectedFeed) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8faf9' }}>
        <div className="p-6 space-y-6">
          {/* Header with Search */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Onboarding</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure and manage data feed onboarding rules, transformations, and validation logic
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search feeds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-200"
                />
              </div>
              <Button onClick={handleDownloadCSV} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                CSV Download
              </Button>
              <div className="flex border border-gray-200 rounded-md bg-white">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recently visited - horizontal scroll: ~4.5 cards visible; width from section container (100cqw) */}
          <div className="w-full min-w-0" style={{ containerType: "inline-size" }}>
            <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recently visited
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 w-full">
              {recentlyVisited.map((feed) => (
                <div
                  key={feed.feed}
                  className="flex-shrink-0 min-w-[200px]"
                  style={{ width: "calc((100cqw - 4 * 1rem) / 4.5)" }}
                >
                  {renderFeedHealthCard(feed)}
                </div>
              ))}
            </div>
          </div>

          {/* All Feeds */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold text-foreground">All Feeds</h2>
              <Badge className="bg-primary/90 text-white border-0 px-2.5 py-0.5 text-xs font-medium">
                145 Feeds
              </Badge>
            </div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFeeds.map((feed) => renderFeedHealthCard(feed))}
              </div>
            ) : (
              <Card className="bg-white border-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Feed Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Health Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rule Groups
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rules
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Pending Changes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          High Risk Rules
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Impacted Reports
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          DQ Failures
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Release Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Last Modified
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFeeds.map((feed) => (
                        <tr
                          key={feed.feed}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleFeedClick(feed.feed)}
                        >
                          {/* Feed Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileCode className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{feed.feed}</span>
                            </div>
                          </td>

                          {/* Health Score - circle with fixed size via inline style so table cannot squash */}
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {feed.healthScore !== undefined && (
                              <div
                                className="inline-flex items-center justify-center rounded-full border box-border shrink-0"
                                style={{
                                  width: 36,
                                  height: 36,
                                  minWidth: 36,
                                  minHeight: 36,
                                  borderColor: feed.healthScore >= 80 ? '#5BBD72' : feed.healthScore >= 60 ? '#f59e0b' : '#ef4444'
                                }}
                              >
                                <span className="text-xs font-bold leading-none" style={{
                                  color: feed.healthScore >= 80 ? '#5BBD72' : feed.healthScore >= 60 ? '#f59e0b' : '#ef4444'
                                }}>
                                  {feed.healthScore}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Rule Groups */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{feed.ruleGroups}</td>

                          {/* Rules */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{feed.rules}</td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={getStatusColor(feed.status)}>
                              {feed.status}
                            </Badge>
                          </td>

                          {/* Pending Changes */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feed.pendingChanges !== undefined && feed.pendingChanges > 0 ? (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                {feed.pendingChanges}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>

                          {/* High Risk Rules */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feed.highRiskRules !== undefined && feed.highRiskRules > 0 ? (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                {feed.highRiskRules}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>

                          {/* Impacted Reports */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feed.impactedReports !== undefined ? (
                              <span className="text-sm text-foreground">{feed.impactedReports}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>

                          {/* DQ Failures */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feed.dqFailures !== undefined && feed.dqFailures > 0 ? (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                {feed.dqFailures}
                              </Badge>
                            ) : (
                              <span className="text-sm text-green-600">✓</span>
                            )}
                          </td>

                          {/* Release Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feed.releaseStatus && (
                              <Badge 
                                variant="outline" 
                                className={
                                  feed.releaseStatus === 'deployed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  feed.releaseStatus === 'staged' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }
                              >
                                {feed.releaseStatus}
                              </Badge>
                            )}
                          </td>

                          {/* Last Modified */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {feed.lastModified || feed.lastUpdated || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RuleGroup List View (Level 2)
  if (selectedFeed && !selectedRuleGroup) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8faf9' }}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBackToFeeds}
                className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Onboarding
              </button>
              <span className="text-2xl font-semibold text-muted-foreground">&gt;</span>
              <h1 className="text-2xl font-semibold text-foreground">{selectedFeed}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search rule groups..."
                  className="pl-10 w-64 bg-white border-gray-200"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync
              </Button>
              <Button 
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                variant="outline" 
                size="sm" 
                className="gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button size="sm" className="gap-2 bg-[#5BBD72] hover:bg-[#4da862] text-white">
                <Plus className="w-4 h-4" />
                Add RuleGroup
              </Button>
              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-md bg-white">
                <button
                  onClick={() => setRuleGroupViewMode("flow")}
                  className={`px-3 py-1.5 text-sm flex items-center gap-2 ${ruleGroupViewMode === "flow" ? "bg-gray-100 text-foreground" : "text-muted-foreground"}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  DAG View
                </button>
                <button
                  onClick={() => setRuleGroupViewMode("table")}
                  className={`px-3 py-1.5 text-sm flex items-center gap-2 ${ruleGroupViewMode === "table" ? "bg-gray-100 text-foreground" : "text-muted-foreground"}`}
                >
                  <List className="w-3.5 h-3.5" />
                  Table View
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns3 className="w-4 h-4" />
                Columns
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          {/* History Panel */}
          {showHistoryPanel && (
            <Card className="bg-white border border-gray-200 p-4 absolute right-6 top-32 z-10 shadow-lg w-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">History</h3>
                <button onClick={() => setShowHistoryPanel(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {mockHistoryChanges.map((change) => (
                  <div key={change.id} className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={change.status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                    >
                      {change.status}
                    </Badge>
                    <div className="text-sm text-foreground">
                      <span className="font-medium">{change.user}</span> submitted version <span className="font-medium">{change.versionId}</span> on {change.submittedDate}
                      {change.jira && (
                        <span className="ml-2 text-sm text-muted-foreground">({change.jira})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* RuleGroups Content - DAG View or Table View */}
          {ruleGroupViewMode === "flow" ? (
            /* DAG View */
            <DAGView 
              nodes={mockRuleGroups}
              onNodeClick={handleRuleGroupClick}
              onEditNode={handleEditRuleGroup}
            />
          ) : (
            /* Table View */
            <Card className="bg-white border-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 w-12">
                        <Checkbox />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Rulegroup
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Sequence
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Rules
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Output/ViewFlag
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Output/ViewName
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockRuleGroups.map((rg) => (
                      <tr key={rg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <Checkbox />
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {rg.rulegroup}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">{rg.sequence}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{rg.description}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleRuleGroupClick(rg)}
                            className="cursor-pointer hover:opacity-80">
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              {rg.rules}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">{rg.outputViewFlag ? "true" : "false"}</td>
                        <td className="px-4 py-4 text-sm text-foreground">{rg.outputViewName || "-"}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-muted-foreground hover:text-[#5BBD72] transition-colors">
                              <Bookmark className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRuleGroup(rg);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Items per page: <select className="ml-2 border border-gray-200 rounded px-2 py-1">
                    <option>15</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">1 - 4 of 4</div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Edit RuleGroup Dialog */}
        {editingRuleGroupData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit Row</h2>
                <button onClick={() => setEditingRuleGroupData(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">rulegroup*</label>
                  <Input
                    value={editRuleGroupForm.rulegroup}
                    onChange={(e) => setEditRuleGroupForm({...editRuleGroupForm, rulegroup: e.target.value})}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">sequence*</label>
                  <Input
                    value={editRuleGroupForm.sequence}
                    onChange={(e) => setEditRuleGroupForm({...editRuleGroupForm, sequence: e.target.value})}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">description</label>
                  <Input
                    value={editRuleGroupForm.description}
                    onChange={(e) => setEditRuleGroupForm({...editRuleGroupForm, description: e.target.value})}
                    className="bg-white"
                    placeholder="description"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">outputViewName</label>
                <Input
                  value={editRuleGroupForm.outputViewName}
                  onChange={(e) => setEditRuleGroupForm({...editRuleGroupForm, outputViewName: e.target.value})}
                  className="bg-white"
                  placeholder="outputViewName"
                />
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Checkbox
                  checked={editRuleGroupForm.outputViewFlag}
                  onCheckedChange={(checked) => setEditRuleGroupForm({...editRuleGroupForm, outputViewFlag: !!checked})}
                />
                <label className="text-sm">outputViewFlag</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setEditingRuleGroupData(null)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => {
                  if (editingRuleGroupData) {
                    setEditRuleGroupForm({
                      rulegroup: editingRuleGroupData.rulegroup,
                      sequence: editingRuleGroupData.sequence.toString(),
                      description: editingRuleGroupData.description,
                      outputViewName: editingRuleGroupData.outputViewName || "",
                      outputViewFlag: editingRuleGroupData.outputViewFlag
                    });
                  }
                }}>
                  Reset
                </Button>
                <Button onClick={handleSaveRuleGroupEdit} className="bg-[#5BBD72] hover:bg-[#4da862] text-white">
                  Submit
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Sequence List View (Level 3)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8faf9' }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBackToFeeds}
              className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Onboarding
            </button>
            <span className="text-2xl font-semibold text-muted-foreground">&gt;</span>
            <button 
              onClick={handleBackToRuleGroups}
              className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {selectedFeed}
            </button>
            <span className="text-2xl font-semibold text-muted-foreground">&gt;</span>
            <h1 className="text-2xl font-semibold text-foreground">{selectedRuleGroup?.rulegroup}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search rules..."
                className="pl-10 w-64 bg-white border-gray-200"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync
            </Button>
            <Button 
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowAddRowDialog(true)} 
              size="sm" 
              className="gap-2 bg-[#5BBD72] hover:bg-[#4da862] text-white"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </Button>
            {/* Test Mode Toggle */}
            <button
              onClick={() => setTestModeEnabled(!testModeEnabled)}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-all ${
                testModeEnabled 
                  ? 'bg-[#5BBD72] text-white shadow-md' 
                  : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
              }`}
            >
              {testModeEnabled ? '✓ Test Mode ON' : 'Test Mode OFF'}
            </button>
            {testModeEnabled && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                Changes won't affect production
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowFilterPanel(!showFilterPanel)} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              onClick={() => setShowColumnsPanel(!showColumnsPanel)} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Columns3 className="w-4 h-4" />
              Columns
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <Card className="bg-white border border-gray-200 p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Column</label>
                <select 
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select column...</option>
                  <option value="sequence">sequence</option>
                  <option value="attributeName">attributeName</option>
                  <option value="type">type</option>
                  <option value="description">description</option>
                  <option value="outputfile">outputfile</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Keyword</label>
                <Input
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  placeholder="Enter keyword..."
                  className="bg-white"
                />
              </div>
              <Button onClick={handleApplyFilter} size="sm" className="bg-[#5BBD72] hover:bg-[#4da862] text-white">
                Apply
              </Button>
              <Button onClick={() => {
                setFilterColumn("");
                setFilterKeyword("");
              }} variant="outline" size="sm">
                Reset all
              </Button>
            </div>
          </Card>
        )}

        {/* Columns Panel */}
        {showColumnsPanel && (
          <Card className="bg-white border border-gray-200 p-4 absolute right-6 top-32 z-10 shadow-lg w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Configure Columns</h3>
              <button onClick={() => setShowColumnsPanel(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {Object.keys(visibleColumns).map((col) => (
                <div key={col} className="flex items-center gap-2">
                  <Checkbox
                    checked={visibleColumns[col as keyof typeof visibleColumns]}
                    onCheckedChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                  />
                  <label className="text-sm text-foreground capitalize">{col}</label>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* History Panel */}
        {showHistoryPanel && (
          <Card className="bg-white border border-gray-200 p-4 absolute right-6 top-32 z-10 shadow-lg w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">History</h3>
              <button onClick={() => setShowHistoryPanel(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {mockHistoryChanges.map((change) => (
                <div key={change.id} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={change.status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                  >
                    {change.status}
                  </Badge>
                  <div className="text-sm text-foreground">
                    <span className="font-medium">{change.user}</span> submitted version <span className="font-medium">{change.versionId}</span> on {change.submittedDate}
                    {change.jira && (
                      <span className="ml-2 text-sm text-muted-foreground">({change.jira})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Sequence Rules Table */}
        <Card className="bg-white border-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 w-12">
                    <Checkbox />
                  </th>
                  {visibleColumns.sequence && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Sequence
                    </th>
                  )}
                  {visibleColumns.attributeName && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      AttributeName
                    </th>
                  )}
                  {visibleColumns.type && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Type
                    </th>
                  )}
                  {visibleColumns.value && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Value
                    </th>
                  )}
                  {visibleColumns.description && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Description
                    </th>
                  )}
                  {visibleColumns.outputfile && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Outputfile
                    </th>
                  )}
                  {/* Phase 3: Smart Governance Columns */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Risk Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Impact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockSequenceRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox />
                    </td>
                    {visibleColumns.sequence && (
                      <td className="px-4 py-4 text-sm text-foreground">{rule.sequence}</td>
                    )}
                    {visibleColumns.attributeName && (
                      <td className="px-4 py-4 text-sm text-foreground">{rule.attributeName || "-"}</td>
                    )}
                    {visibleColumns.type && (
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-gray-50">
                          {rule.type}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.value && (
                      <td className="px-4 py-4 text-sm text-foreground max-w-md">
                        <div className="truncate">{rule.value}</div>
                      </td>
                    )}
                    {visibleColumns.description && (
                      <td className="px-4 py-4 text-sm text-muted-foreground">{rule.description || "-"}</td>
                    )}
                    {visibleColumns.outputfile && (
                      <td className="px-4 py-4 text-sm text-foreground">{rule.outputfile ? "true" : "false"}</td>
                    )}
                    
                    {/* Phase 3: Risk Score Column */}
                    <td className="px-4 py-4">
                      {rule.riskScore !== undefined && (
                        <Badge 
                          variant="outline" 
                          className={`${getRiskScoreColor(rule.riskScore).bg} ${getRiskScoreColor(rule.riskScore).text} ${getRiskScoreColor(rule.riskScore).border} font-semibold`}
                        >
                          {rule.riskScore}
                        </Badge>
                      )}
                    </td>

                    {/* Phase 3: Impact Column */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            setSelectedRuleForImpact(rule);
                            setShowImpactPreview(true);
                          }}
                          className="text-xs text-primary hover:underline text-left"
                        >
                          {rule.impactedReports || 0} reports
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRuleForLineage(rule);
                            setShowFieldLineage(true);
                          }}
                          className="text-xs text-muted-foreground hover:text-primary hover:underline text-left"
                        >
                          {rule.impactedFields?.length || 0} fields
                        </button>
                      </div>
                    </td>

                    {/* Phase 3: Status Column */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          {getTestStatusIcon(rule.testStatus || 'untested')}
                          <span className="text-xs text-muted-foreground capitalize">{rule.testStatus || 'untested'}</span>
                        </div>
                        {rule.hasChanges && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleEditRule(rule)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Items per page: <select className="ml-2 border border-gray-200 rounded px-2 py-1">
                <option>15</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">1 - 3 of 3</div>
          </div>
        </Card>
      </div>

      {/* Edit Rule Dialog */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Edit Row</h2>
              <button onClick={() => setEditingRule(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form Fields */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">sequence*</label>
                <Input
                  value={editingRuleData.sequence}
                  onChange={(e) => setEditingRuleData({...editingRuleData, sequence: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">attributeName</label>
                <Input
                  value={editingRuleData.attributeName}
                  onChange={(e) => setEditingRuleData({...editingRuleData, attributeName: e.target.value})}
                  className="bg-white"
                  placeholder="attributeName"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">type</label>
                <select 
                  value={editingRuleData.type}
                  onChange={(e) => setEditingRuleData({...editingRuleData, type: e.target.value as "QUERY" | "EXPRESSION"})}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="QUERY">Query</option>
                  <option value="EXPRESSION">Expression</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">description</label>
                <Input
                  value={editingRuleData.description}
                  onChange={(e) => setEditingRuleData({...editingRuleData, description: e.target.value})}
                  className="bg-white"
                  placeholder="description"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={editingRuleData.outputfile}
                onCheckedChange={(checked) => setEditingRuleData({...editingRuleData, outputfile: !!checked})}
              />
              <label className="text-sm">outputfile</label>
            </div>

            {/* Phase 4: Smart SQL Editor */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Rule - Smart SQL Editor</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowImpactPreviewPanel(!showImpactPreviewPanel)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${showImpactPreviewPanel ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                  >
                    {showImpactPreviewPanel ? 'Hide' : 'Show'} Impact Preview
                  </button>
                  <button
                    onClick={() => setShowFieldHelper(!showFieldHelper)}
                    className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  >
                    {showFieldHelper ? 'Hide' : 'Show'} Field Helper
                  </button>
                  <button
                    onClick={() => {
                      const validation = validateSQL(editingRuleData.value);
                      setSqlValidation(validation);
                    }}
                    className="px-3 py-1.5 text-xs bg-[#5BBD72] text-white rounded-md hover:bg-[#4da862] transition-colors"
                  >
                    Validate Query
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                {/* Impact Preview Panel */}
                {showImpactPreviewPanel && (
                  <div className="col-span-1">
                    <Card className="bg-white border border-gray-200 h-full">
                      <div className="p-3 border-b border-gray-200 bg-amber-50">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-semibold text-foreground">Impact Preview</h4>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        {/* Impacted Fields */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1.5">Impacted Fields</div>
                          <div className="space-y-1">
                            {editingRule?.impactedFields?.map((field, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span className="text-foreground font-mono">{field}</span>
                              </div>
                            )) || (
                              <div className="text-xs text-muted-foreground italic">No fields detected</div>
                            )}
                          </div>
                        </div>

                        {/* Downstream Dependencies */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-muted-foreground mb-1.5">Downstream Impact</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">RuleGroups</span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                3
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">DQ Rules</span>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                2
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Reports</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {editingRule?.impactedReports || 1}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Risk Level */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-muted-foreground mb-1.5">Risk Level</div>
                          <div className={`px-2 py-1 rounded text-xs font-semibold text-center ${
                            editingRule?.riskScore && editingRule.riskScore >= 70 
                              ? 'bg-red-50 text-red-700' 
                              : editingRule?.riskScore && editingRule.riskScore >= 40 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {editingRule?.riskScore && editingRule.riskScore >= 70 
                              ? 'High' 
                              : editingRule?.riskScore && editingRule.riskScore >= 40 
                              ? 'Medium' 
                              : 'Low'}
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-[10px] text-muted-foreground italic">
                            💡 Modifying this rule may require downstream validation
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Editor Panel */}
                <div className={
                  showImpactPreviewPanel && showFieldHelper ? "col-span-2" : 
                  showImpactPreviewPanel || showFieldHelper ? "col-span-3" : 
                  "col-span-4"
                }>
                  <div className="bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden">
                    {/* Editor Toolbar */}
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <FileCode className="w-3 h-3" />
                        <span>SQL Editor</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{editingRuleData.value.split('\n').length} lines</span>
                        <span>•</span>
                        <span>{editingRuleData.value.length} chars</span>
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div className="relative">
                      <textarea
                        value={editingRuleData.value}
                        onChange={(e) => {
                          setEditingRuleData({...editingRuleData, value: e.target.value});
                          // Auto-validate on change
                          const validation = validateSQL(e.target.value);
                          setSqlValidation(validation);
                        }}
                        className="w-full bg-gray-900 text-gray-100 border-none outline-none resize-none font-mono text-sm leading-relaxed p-4"
                        rows={16}
                        style={{ minHeight: '300px' }}
                        spellCheck={false}
                      />
                    </div>

                    {/* Status Bar */}
                    <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {sqlValidation.errors.length > 0 && (
                          <span className="text-red-400 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            {sqlValidation.errors.length} error{sqlValidation.errors.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {sqlValidation.warnings.length > 0 && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {sqlValidation.warnings.length} warning{sqlValidation.warnings.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {sqlValidation.errors.length === 0 && sqlValidation.warnings.length === 0 && editingRuleData.value.trim() && (
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            No issues detected
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">Press Ctrl+Space for suggestions</span>
                    </div>
                  </div>
                </div>

                {/* Field Helper Panel */}
                {showFieldHelper && (
                  <div className="col-span-1 space-y-3">
                    {/* SQL Templates */}
                    <Card className="bg-white border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <h4 className="text-xs font-semibold text-foreground">SQL Templates</h4>
                      </div>
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => setEditingRuleData({...editingRuleData, value: "SELECT column1, column2\nFROM table_name\nWHERE condition"})}
                          className="w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 rounded transition-colors"
                        >
                          <div className="font-medium text-foreground">SELECT Query</div>
                          <div className="text-muted-foreground text-[10px]">Basic SELECT template</div>
                        </button>
                        <button
                          onClick={() => setEditingRuleData({...editingRuleData, value: "COALESCE(CAST(field AS DECIMAL(22,2)), 0, 0)"})}
                          className="w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 rounded transition-colors"
                        >
                          <div className="font-medium text-foreground">COALESCE</div>
                          <div className="text-muted-foreground text-[10px]">Null handling</div>
                        </button>
                        <button
                          onClick={() => setEditingRuleData({...editingRuleData, value: "TRIM(field_name)"})}
                          className="w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 rounded transition-colors"
                        >
                          <div className="font-medium text-foreground">TRIM</div>
                          <div className="text-muted-foreground text-[10px]">Remove whitespace</div>
                        </button>
                      </div>
                    </Card>

                    {/* Available Fields */}
                    <Card className="bg-white border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <h4 className="text-xs font-semibold text-foreground">Available Fields</h4>
                      </div>
                      <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                        {availableFields.map((field) => (
                          <button
                            key={field}
                            onClick={() => {
                              const newValue = editingRuleData.value + (editingRuleData.value ? ', ' : '') + field;
                              setEditingRuleData({...editingRuleData, value: newValue});
                            }}
                            className="w-full text-left px-2 py-1.5 text-xs font-mono text-foreground hover:bg-primary/10 rounded transition-colors"
                          >
                            {field}
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              {/* Validation Messages */}
              {(sqlValidation.errors.length > 0 || sqlValidation.warnings.length > 0 || sqlValidation.suggestions.length > 0) && (
                <div className="space-y-2">
                  {/* Errors */}
                  {sqlValidation.errors.map((error, idx) => (
                    <div key={`error-${idx}`} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-red-900">Error</div>
                        <div className="text-xs text-red-700">{error}</div>
                      </div>
                    </div>
                  ))}

                  {/* Warnings */}
                  {sqlValidation.warnings.map((warning, idx) => (
                    <div key={`warning-${idx}`} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-amber-900">Warning</div>
                        <div className="text-xs text-amber-700">{warning}</div>
                      </div>
                    </div>
                  ))}

                  {/* Suggestions */}
                  {sqlValidation.suggestions.map((suggestion, idx) => (
                    <div key={`suggestion-${idx}`} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-blue-900">Suggestion</div>
                        <div className="text-xs text-blue-700">{suggestion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded border border-gray-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded border border-gray-200">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditingRule(null)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditingRuleData({
                    sequence: editingRule.sequence.toString(),
                    attributeName: editingRule.attributeName,
                    type: editingRule.type,
                    value: editingRule.value,
                    description: editingRule.description || "",
                    outputfile: editingRule.outputfile
                  });
                }}>
                  Reset
                </Button>
                <Button onClick={handleSaveEdit} className="bg-[#5BBD72] hover:bg-[#4da862] text-white">
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Row Dialog */}
      {showAddRowDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add new row</h2>
              <button onClick={() => setShowAddRowDialog(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="sequence*"
                value={newRowData.sequence}
                onChange={(e) => setNewRowData({...newRowData, sequence: e.target.value})}
              />
              <Input
                placeholder="attributeName"
                value={newRowData.attributeName}
                onChange={(e) => setNewRowData({...newRowData, attributeName: e.target.value})}
              />
              <select 
                value={newRowData.type}
                onChange={(e) => setNewRowData({...newRowData, type: e.target.value as "QUERY" | "EXPRESSION"})}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="QUERY">QUERY</option>
                <option value="EXPRESSION">EXPRESSION</option>
              </select>
              <Input
                placeholder="description"
                value={newRowData.description}
                onChange={(e) => setNewRowData({...newRowData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={newRowData.outputfile}
                onCheckedChange={(checked) => setNewRowData({...newRowData, outputfile: !!checked})}
              />
              <label className="text-sm">outputfile</label>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Rule</label>
              <textarea
                value={newRowData.value}
                onChange={(e) => setNewRowData({...newRowData, value: e.target.value})}
                className="w-full h-64 border border-gray-200 rounded-md p-3 font-mono text-sm"
                placeholder="Enter rule value..."
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddRowDialog(false)}>
                Cancel
              </Button>
              <Button variant="outline">
                Reset
              </Button>
              <Button onClick={handleAddRow} className="bg-[#5BBD72] hover:bg-[#4da862] text-white">
                Submit
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Phase 3: Impact Preview Modal */}
      {showImpactPreview && selectedRuleForImpact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Impact Preview</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Rule: {selectedRuleForImpact.attributeName || `Sequence ${selectedRuleForImpact.sequence}`}
                </p>
              </div>
              <button onClick={() => setShowImpactPreview(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Risk Score */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Score</span>
                <Badge 
                  className={`${getRiskScoreColor(selectedRuleForImpact.riskScore || 0).bg} ${getRiskScoreColor(selectedRuleForImpact.riskScore || 0).text} font-bold text-lg px-4 py-1`}
                >
                  {selectedRuleForImpact.riskScore}/100
                </Badge>
              </div>
            </div>

            {/* Impacted Reports */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-primary" />
                Impacted Reports ({selectedRuleForImpact.impactedReports})
              </h3>
              <div className="space-y-2">
                {['Monthly Balance Sheet', 'Risk Exposure Report', 'Regulatory Filing - FR Y-14', 'Executive Dashboard', 'Credit Risk Analytics'].slice(0, selectedRuleForImpact.impactedReports).map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-sm">{report}</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Impacted Fields */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Impacted Fields ({selectedRuleForImpact.impactedFields?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedRuleForImpact.impactedFields?.map((field, idx) => (
                  <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Change Info */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Modified:</span>
                  <span className="ml-2 font-medium">{selectedRuleForImpact.lastModified}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Modified By:</span>
                  <span className="ml-2 font-medium">{selectedRuleForImpact.modifiedBy}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Phase 3: Field Lineage Modal */}
      {showFieldLineage && selectedRuleForLineage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Field Lineage</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Data flow for {selectedRuleForLineage.attributeName || `Sequence ${selectedRuleForLineage.sequence}`}
                </p>
              </div>
              <button onClick={() => setShowFieldLineage(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lineage Visualization */}
            <div className="space-y-6">
              {selectedRuleForLineage.impactedFields?.map((field, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {/* Source */}
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Source Field</div>
                      <Badge className="bg-gray-700 text-white">{field}</Badge>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="w-6 h-6 text-primary" />
                    
                    {/* Transformation */}
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Transformation</div>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                        {selectedRuleForLineage.type}
                      </Badge>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="w-6 h-6 text-primary" />
                    
                    {/* Target */}
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Target Field</div>
                      <Badge className="bg-[#5BBD72] text-white">
                        {selectedRuleForLineage.attributeName || field}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Usage */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-muted-foreground">Used in:</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Monthly Report</Badge>
                      <Badge variant="outline" className="text-xs">Risk Dashboard</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
