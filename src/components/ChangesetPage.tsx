import { useState } from "react";
import { SensitiveText, sensitiveInputBlurClass, sensitiveAvatarBlurClass } from "./SensitiveText";
import { 
  ExternalLink, 
  MessageSquare, 
  Edit2, 
  Filter, 
  Download, 
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  Database,
  FileText,
  GitBranch,
  Eye,
  ShieldAlert,
  Clock,
  BarChart3,
  Network,
  Sparkles,
  X,
  Search,
  ChevronsRight as DoubleChevronRight
} from "lucide-react";
import { cn } from "./ui/utils";

interface ChangesetItem {
  id: string;
  jiraTicket: string;
  category: string;
  versionId: string;
  number: string;
  comments: number;
  commentList?: Array<{
    id: string;
    user: string;
    userColor: string;
    time: string;
    content: string;
  }>;
  createdBy: string;
  createdByColor: string;
  createOn: string;
  releaseVersion: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  daysPending: number;
  changeSummary: {
    modifiedRuleGroups: number;
    modifiedRules: number;
    addedFields: number;
    deletedFields: number;
    outputSchemaChanged: boolean;
    referenceChanged: boolean;
  };
  impact: {
    feeds: number;
    reports: number;
    dqRules: number;
    requiresRebuild: boolean;
  };
  sqlDiff?: {
    oldLogic: string;
    newLogic: string;
  };
  aiSuggestion?: {
    summary: string;
    risks: string[];
    actions: string[];
  };
  ruleGroups?: Array<{
    id: string;
    name: string;
    sequence: number;
    description: string;
    rules: number;
    outputViewPog: boolean;
    outputViewName: string;
  }>;
  comment?: string;
}

export function ChangesetPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showSqlDiff, setShowSqlDiff] = useState<string | null>(null);
  const [showImpactGraph, setShowImpactGraph] = useState<string | null>(null);
  const [showModifyPanel, setShowModifyPanel] = useState<string | null>(null);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommentTooltip, setShowCommentTooltip] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ChangesetItem | null>(null);
  const [editForm, setEditForm] = useState({
    jiraTicket: "",
    releaseVersion: "",
    comments: ""
  });

  // Mock data for pending changesets with risk analysis
  const pendingData: ChangesetItem[] = [
    {
      id: "1",
      jiraTicket: "USTFM-395",
      category: "EbMedsData",
      versionId: "37943",
      number: "23726",
      comments: 3,
      commentList: [
        {
          id: "c1",
          user: "Sarah Chen",
          userColor: "#FF6B6B",
          time: "2 hours ago",
          content: "This changeset modifies critical credit scoring logic. Please ensure all downstream reports are validated before approval."
        },
        {
          id: "c2",
          user: "Michael Brown",
          userColor: "#4ECDC4",
          time: "5 hours ago",
          content: "I've reviewed the SQL changes. The new credit_score filter looks good, but we need to update the ETL documentation."
        },
        {
          id: "c3",
          user: "Lisa Wang",
          userColor: "#95E1D3",
          time: "1 day ago",
          content: "Flagging this for DQ team review. The output schema change requires regression testing."
        }
      ],
      createdBy: "L",
      createdByColor: "#FF8A65",
      createOn: "Feb 10, 2026, 2:16:56 PM",
      releaseVersion: "BAL_Dev_5.91",
      riskLevel: "high",
      riskScore: 18,
      daysPending: 35,
      changeSummary: {
        modifiedRuleGroups: 3,
        modifiedRules: 8,
        addedFields: 2,
        deletedFields: 1,
        outputSchemaChanged: true,
        referenceChanged: true
      },
      impact: {
        feeds: 12,
        reports: 5,
        dqRules: 15,
        requiresRebuild: true
      },
      sqlDiff: {
        oldLogic: "SELECT borrower_id, risk_rating\nFROM borrowers\nWHERE status = 'ACTIVE'",
        newLogic: "SELECT borrower_id, risk_rating, credit_score\nFROM borrowers\nWHERE status IN ('ACTIVE', 'PENDING')\nAND credit_score > 600"
      },
      aiSuggestion: {
        summary: "This changeset modifies 3 RuleGroups and adds 1 new output field (credit_score). Output schema changed.",
        risks: [
          "Output schema modified - downstream reports may break",
          "Impacts 5 regulatory reports",
          "Reference table changed - requires mapping update",
          "Pending for 35 days - potential stale logic"
        ],
        actions: [
          "Run DQ regression test",
          "Validate downstream report mapping",
          "Update reference documentation",
          "Coordinate with reporting team"
        ]
      }
    },
    {
      id: "2",
      jiraTicket: "TGDS-5085",
      category: "EbMedsData",
      versionId: "37975",
      number: "23757",
      comments: 2,
      commentList: [
        {
          id: "c4",
          user: "David Kim",
          userColor: "#A8DADC",
          time: "3 hours ago",
          content: "The date filter change looks straightforward. Added VERIFIED status check is a good improvement."
        },
        {
          id: "c5",
          user: "Emily Rodriguez",
          userColor: "#F4A261",
          time: "6 hours ago",
          content: "Approved from data quality perspective. This aligns with our new validation requirements."
        }
      ],
      createdBy: "M",
      createdByColor: "#7E57C2",
      createOn: "Feb 10, 2026, 9:57:00 AM",
      releaseVersion: "BAL_Dev_5.91",
      riskLevel: "medium",
      riskScore: 9,
      daysPending: 12,
      changeSummary: {
        modifiedRuleGroups: 1,
        modifiedRules: 3,
        addedFields: 0,
        deletedFields: 0,
        outputSchemaChanged: false,
        referenceChanged: true
      },
      impact: {
        feeds: 5,
        reports: 1,
        dqRules: 8,
        requiresRebuild: false
      },
      sqlDiff: {
        oldLogic: "SELECT * FROM collateral WHERE value_date >= '2025-01-01'",
        newLogic: "SELECT * FROM collateral WHERE value_date >= '2026-01-01' AND status = 'VERIFIED'"
      },
      aiSuggestion: {
        summary: "This changeset modifies 1 RuleGroup with logic updates. No schema change detected.",
        risks: [
          "Reference table changed",
          "Impacts 1 report (non-regulatory)"
        ],
        actions: [
          "Validate reference mapping",
          "Test with sample data"
        ]
      }
    },
    {
      id: "3",
      jiraTicket: "TGMS-65221",
      category: "EbMedsData",
      versionId: "37790",
      number: "23582",
      comments: 0,
      commentList: [],
      createdBy: "S",
      createdByColor: "#66BB6A",
      createOn: "Feb 10, 2026, 8:52:55 AM",
      releaseVersion: "BAL_ARCNo_5",
      riskLevel: "low",
      riskScore: 3,
      daysPending: 5,
      changeSummary: {
        modifiedRuleGroups: 1,
        modifiedRules: 1,
        addedFields: 0,
        deletedFields: 0,
        outputSchemaChanged: false,
        referenceChanged: false
      },
      impact: {
        feeds: 2,
        reports: 0,
        dqRules: 3,
        requiresRebuild: false
      },
      sqlDiff: {
        oldLogic: "-- Comment update only\nSELECT loan_id FROM loans",
        newLogic: "-- Updated documentation\nSELECT loan_id FROM loans"
      },
      aiSuggestion: {
        summary: "This changeset contains documentation updates only. No logic or schema changes.",
        risks: [],
        actions: [
          "Review documentation accuracy"
        ]
      }
    },
    {
      id: "4",
      jiraTicket: "USTFM-420",
      category: "EbMedsData",
      versionId: "37724",
      number: "23519",
      comments: 5,
      commentList: [
        {
          id: "c6",
          user: "John Anderson",
          userColor: "#9B59B6",
          time: "30 minutes ago",
          content: "High risk - this adds 3 new fields to the core output. All ETL jobs downstream need to be updated."
        },
        {
          id: "c7",
          user: "Rachel Green",
          userColor: "#E74C3C",
          time: "1 hour ago",
          content: "Coordination required with the reporting team. These changes affect multiple regulatory reports."
        },
        {
          id: "c8",
          user: "Alex Turner",
          userColor: "#3498DB",
          time: "2 hours ago",
          content: "I've tested this in UAT environment. Schema changes validated successfully but rebuild is mandatory."
        },
        {
          id: "c9",
          user: "Sophie Martin",
          userColor: "#1ABC9C",
          time: "4 hours ago",
          content: "Business has approved the logic changes. We can proceed once all technical validations are complete."
        },
        {
          id: "c10",
          user: "Tom Wilson",
          userColor: "#F39C12",
          time: "6 hours ago",
          content: "Created JIRA tickets for all downstream system updates. Tracking as USTFM-421 through USTFM-424."
        }
      ],
      createdBy: "L",
      createdByColor: "#EC407A",
      createOn: "Feb 11, 2026, 11:53:02 AM",
      releaseVersion: "BAL_ARCNo_5.91",
      riskLevel: "high",
      riskScore: 17,
      daysPending: 8,
      changeSummary: {
        modifiedRuleGroups: 2,
        modifiedRules: 6,
        addedFields: 3,
        deletedFields: 0,
        outputSchemaChanged: true,
        referenceChanged: false
      },
      impact: {
        feeds: 8,
        reports: 3,
        dqRules: 12,
        requiresRebuild: true
      },
      aiSuggestion: {
        summary: "This changeset adds 3 new fields and modifies core calculation logic. Output schema changed.",
        risks: [
          "Output schema modified",
          "Impacts 3 regulatory reports",
          "Requires rebuild of downstream processes"
        ],
        actions: [
          "Run full regression test",
          "Update ETL mappings",
          "Notify stakeholders"
        ]
      }
    }
  ];

  // Filter data by search query
  const filteredData = pendingData.filter(item =>
    item.jiraTicket.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = 192;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <ShieldAlert className="w-4 h-4" />;
      case "medium": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <CheckCircle2 className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getAgingColor = (days: number) => {
    if (days >= 30) return "text-red-600 bg-red-50";
    if (days >= 7) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableItems = filteredData.filter(item => item.riskLevel !== "high");
      setSelectedItems(new Set(selectableItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const item = filteredData.find(i => i.id === id);
    if (item?.riskLevel === "high") {
      return;
    }
    
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleBatchApprove = () => {
    if (selectedItems.size > 0) {
      setShowApprovalConfirm(true);
    }
  };

  const isAllSelected = filteredData.filter(item => item.riskLevel !== "high").length > 0 && 
                        selectedItems.size === filteredData.filter(item => item.riskLevel !== "high").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8faf9' }}>
      <div className="p-6 space-y-6">
        {/* Header with Title and Search */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Changeset Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and approve changesets with risk analysis and impact assessment
            </p>
          </div>

          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Jira Ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5BBD72] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Tabs and Filters Combined Row */}
        <div className="flex items-center justify-between">
          {/* Left: Tabs */}
          <div className="flex items-center gap-4">
            {/* Pending Tab */}
            <button
              onClick={() => setActiveTab("pending")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                activeTab === "pending"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>Pending</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                activeTab === "pending"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                2
              </span>
            </button>

            {/* Approved Tab */}
            <button
              onClick={() => setActiveTab("approved")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                activeTab === "approved"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>Approved</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                activeTab === "approved"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                3894
              </span>
            </button>

            {/* Rejected Tab */}
            <button
              onClick={() => setActiveTab("rejected")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                activeTab === "rejected"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>Rejected</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                activeTab === "rejected"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                149
              </span>
            </button>
          </div>

          {/* Right: Filter Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Action Buttons */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBatchApprove}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#5BBD72] rounded-lg hover:bg-[#4a9d5f] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Selected ({selectedItems.size})
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                <XCircle className="w-4 h-4" />
                Reject Selected ({selectedItems.size})
              </button>
            </div>
          )}

          {/* Warning Banner for High Risk Items */}
          {filteredData.filter(item => item.riskLevel === "high").length > 0 && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">High Risk Changesets Require Individual Review</h4>
                  <p className="text-sm text-red-700">
                    {filteredData.filter(item => item.riskLevel === "high").length} changesets flagged as high risk cannot be batch-approved. 
                    Each requires individual approval with confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#5BBD72] focus:ring-[#5BBD72]"
                        title="Only non-high-risk items can be batch selected"
                      />
                    </th>
                    <th className="w-12 px-4 py-3"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      JiraTicket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      VersionId
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Impact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aging
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CreatedBy
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        CreateOn
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <>
                      <tr 
                        key={item.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors",
                          item.riskLevel === "high" ? "bg-red-50/30" : index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        )}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            disabled={item.riskLevel === "high"}
                            className={cn(
                              "w-4 h-4 rounded border-gray-300 text-[#5BBD72] focus:ring-[#5BBD72]",
                              item.riskLevel === "high" && "opacity-50 cursor-not-allowed"
                            )}
                            title={item.riskLevel === "high" ? "High risk items cannot be batch selected" : ""}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleRowExpansion(item.id)}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            {expandedRows.has(item.id) ? (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold uppercase",
                            getRiskColor(item.riskLevel)
                          )}>
                            {getRiskIcon(item.riskLevel)}
                            {item.riskLevel}
                            <span className="ml-1 text-[10px] opacity-75">({item.riskScore})</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 font-medium"><SensitiveText>{item.jiraTicket}</SensitiveText></span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-[#5BBD72] cursor-pointer transition-colors" />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{item.category}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{item.versionId}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{item.number}</td>
                        <td className="px-4 py-4 relative">
                          <button 
                            onClick={() => setShowCommentTooltip(showCommentTooltip === item.id ? null : item.id)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors relative group"
                          >
                            <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-[#5BBD72]" />
                            {item.comments > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5BBD72] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {item.comments}
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{item.releaseVersion}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Database className="w-3.5 h-3.5" />
                              <span className="font-medium">{item.impact.feeds}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="font-medium">{item.impact.reports}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <BarChart3 className="w-3.5 h-3.5" />
                              <span className="font-medium">{item.impact.dqRules}</span>
                            </div>
                            {item.impact.requiresRebuild && (
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" title="Requires Rebuild" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold",
                            getAgingColor(item.daysPending)
                          )}>
                            <Clock className="w-3 h-3" />
                            {item.daysPending}d
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${sensitiveAvatarBlurClass}`}
                            style={{ backgroundColor: item.createdByColor }}
                          >
                            <SensitiveText>{item.createdBy}</SensitiveText>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{item.createOn}</td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setEditForm({
                                jiraTicket: item.jiraTicket,
                                releaseVersion: item.releaseVersion,
                                comments: item.comment || ""
                              });
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400 hover:text-[#5BBD72]" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows.has(item.id) && (
                        <tr>
                          <td colSpan={14} className="px-4 py-6 bg-gray-50/80">
                            <div className="grid grid-cols-12 gap-6">
                              {/* Left Column */}
                              <div className="col-span-8 space-y-4">
                                {/* Change Summary */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-[#5BBD72]" />
                                    Change Summary
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Modified RuleGroups:</span>
                                        <span className="font-semibold text-gray-900">{item.changeSummary.modifiedRuleGroups}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Modified Rules:</span>
                                        <span className="font-semibold text-gray-900">{item.changeSummary.modifiedRules}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Added Fields:</span>
                                        <span className="font-semibold text-green-600">+{item.changeSummary.addedFields}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Deleted Fields:</span>
                                        <span className="font-semibold text-red-600">-{item.changeSummary.deletedFields}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Output Schema Changed:</span>
                                        <span className={cn(
                                          "font-semibold px-2 py-0.5 rounded text-xs",
                                          item.changeSummary.outputSchemaChanged 
                                            ? "bg-red-100 text-red-700" 
                                            : "bg-green-100 text-green-700"
                                        )}>
                                          {item.changeSummary.outputSchemaChanged ? "YES" : "NO"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Reference Changed:</span>
                                        <span className={cn(
                                          "font-semibold px-2 py-0.5 rounded text-xs",
                                          item.changeSummary.referenceChanged 
                                            ? "bg-orange-100 text-orange-700" 
                                            : "bg-green-100 text-green-700"
                                        )}>
                                          {item.changeSummary.referenceChanged ? "YES" : "NO"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Impact Summary */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-[#5BBD72]" />
                                    Impact Summary
                                  </h4>
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                      <Database className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                      <div className="text-2xl font-bold text-blue-600">{item.impact.feeds}</div>
                                      <div className="text-xs text-blue-700">Feeds</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                      <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                      <div className="text-2xl font-bold text-purple-600">{item.impact.reports}</div>
                                      <div className="text-xs text-purple-700">Reports</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                      <BarChart3 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                      <div className="text-2xl font-bold text-green-600">{item.impact.dqRules}</div>
                                      <div className="text-xs text-green-700">DQ Rules</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                      <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                                      <div className="text-xs font-semibold text-orange-600 mt-2">
                                        {item.impact.requiresRebuild ? "REBUILD REQUIRED" : "No Rebuild"}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* SQL Diff Viewer */}
                                {item.sqlDiff && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-[#5BBD72]" />
                                        SQL Diff
                                      </h4>
                                      <button
                                        onClick={() => setShowSqlDiff(showSqlDiff === item.id ? null : item.id)}
                                        className="text-xs text-[#5BBD72] hover:text-[#4a9d5f] font-medium"
                                      >
                                        {showSqlDiff === item.id ? "Hide" : "Show"} Diff
                                      </button>
                                    </div>
                                    
                                    {showSqlDiff === item.id && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <div className="text-xs font-semibold text-red-600 mb-2">- OLD LOGIC</div>
                                          <pre className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-900 overflow-x-auto">
                                            {item.sqlDiff.oldLogic}
                                          </pre>
                                        </div>
                                        <div>
                                          <div className="text-xs font-semibold text-green-600 mb-2">+ NEW LOGIC</div>
                                          <pre className="bg-green-50 border border-green-200 rounded p-3 text-xs text-green-900 overflow-x-auto">
                                            {item.sqlDiff.newLogic}
                                          </pre>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Right Column - AI Analysis */}
                              <div className="col-span-4">
                                {item.aiSuggestion && (
                                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 h-full">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-purple-600" />
                                      AI Analysis
                                    </h4>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Summary</div>
                                        <p className="text-sm text-gray-800">{item.aiSuggestion.summary}</p>
                                      </div>

                                      {item.aiSuggestion.risks.length > 0 && (
                                        <div>
                                          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Risk Flagged Because:</div>
                                          <ul className="space-y-1">
                                            {item.aiSuggestion.risks.map((risk, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                <span>{risk}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {item.aiSuggestion.actions.length > 0 && (
                                        <div>
                                          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Suggested Actions:</div>
                                          <ul className="space-y-1">
                                            {item.aiSuggestion.actions.map((action, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                <span>{action}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      <div className="pt-3 border-t border-purple-200">
                                        <p className="text-xs text-gray-600 italic">
                                          AI provides suggestions only. Final approval requires human judgment.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5BBD72] focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-700">
                  {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <DoubleChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Approval Confirmation Modal */}
      {showApprovalConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirm Batch Approval</h3>
                <p className="text-sm text-gray-600">
                  You are about to approve {selectedItems.size} changeset{selectedItems.size > 1 ? 's' : ''}. 
                  Please confirm this action.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                ✓ All selected changesets are Low or Medium risk<br/>
                ✓ No high-risk items included in batch operation
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowApprovalConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApprovalConfirm(false);
                  setSelectedItems(new Set());
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#5BBD72] rounded-lg hover:bg-[#4a9d5f] transition-colors"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Tooltip - Global Layer */}
      {showCommentTooltip && filteredData.find(item => item.id === showCommentTooltip) && (() => {
        const item = filteredData.find(i => i.id === showCommentTooltip)!;
        return (
          <>
            <div 
              className="fixed inset-0 z-[100]" 
              onClick={() => setShowCommentTooltip(null)}
            />
            <div 
              className="fixed w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[101] p-4"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#5BBD72]" />
                  Comments ({item.comments})
                </h5>
                <button 
                  onClick={() => setShowCommentTooltip(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {item.commentList && item.commentList.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {item.commentList.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${sensitiveAvatarBlurClass}`}
                        style={{ backgroundColor: comment.userColor }}
                      >
                        {comment.user.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs text-gray-900"><SensitiveText>{comment.user}</SensitiveText></span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No comments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to add a comment</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-200">
                <button className="w-full px-3 py-2 text-xs font-medium text-white bg-[#5BBD72] rounded-lg hover:bg-[#4a9d5f] transition-colors">
                  Add Comment
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Edit Changeset Panel - Right Slide Out */}
      {editingItem && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setEditingItem(null)}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Modify Changeset</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DoubleChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Jira Ticket Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jira Ticket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.jiraTicket}
                    onChange={(e) => setEditForm({ ...editForm, jiraTicket: e.target.value })}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BBD72] focus:border-transparent text-sm ${sensitiveInputBlurClass}`}
                    placeholder="Enter Jira Ticket"
                  />
                </div>

                {/* Release Version Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Release Version
                  </label>
                  <input
                    type="text"
                    value={editForm.releaseVersion}
                    onChange={(e) => setEditForm({ ...editForm, releaseVersion: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BBD72] focus:border-transparent text-sm"
                    placeholder="Enter Release Version"
                  />
                </div>

                {/* Comments Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editForm.comments}
                    onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BBD72] focus:border-transparent text-sm resize-none"
                    placeholder="Enter comments..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-2.5 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic here
                    setEditingItem(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#5BBD72] rounded-lg hover:bg-[#4a9d5f] transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}