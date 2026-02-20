import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  History
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
}

interface RuleGroupData {
  id: string;
  rulegroup: string;
  sequence: number;
  description: string;
  rules: number;
  outputViewFlag: boolean;
  outputViewName?: string;
}

interface SequenceRule {
  id: string;
  sequence: number;
  attributeName: string;
  type: "QUERY" | "EXPRESSION";
  value: string;
  description?: string;
  outputfile: boolean;
}

const feedsData: FeedData[] = [
  { feed: "Deriv_FXFWD", ruleGroups: 4, rules: 15, status: "active" },
  { feed: "Deriv_SWAP", ruleGroups: 1, rules: 3, status: "active" },
  { feed: "Deriv_AARO_ME", ruleGroups: 2, rules: 2, status: "pending" },
  { feed: "USInvestment_Monthly", ruleGroups: 2, rules: 5, lastUpdated: "7 months ago", status: "active" },
  { feed: "Deriv_ALL", ruleGroups: 5, rules: 10, status: "active" },
  { feed: "Deriv_GLBFX", ruleGroups: 1, rules: 2, status: "active" },
  { feed: "USInvestmentPledge", ruleGroups: 2, rules: 61, lastUpdated: "1 month ago", status: "active" },
  { feed: "USDepositsCollateralized", ruleGroups: 3, rules: 23, status: "active" },
  { feed: "USDepositsAmeritrade", ruleGroups: 6, rules: 32, status: "active" },
  { feed: "USLoansCustomCashflowShaw", ruleGroups: 2, rules: 14, status: "pending" },
  { feed: "USLoansCustomCashflowLoanID", ruleGroups: 1, rules: 13, status: "active" },
  { feed: "USCreditCardCorporate", ruleGroups: 3, rules: 60, lastUpdated: "1 month ago", status: "active" },
  { feed: "USCreditCardNordstrom", ruleGroups: 3, rules: 74, status: "active" },
  { feed: "USNonSystemDataForwardStartingLoans", ruleGroups: 1, rules: 2, status: "inactive" },
  { feed: "USNonSystemDataUSFHLBUtilizedCapacity", ruleGroups: 1, rules: 2, status: "active" },
];

const mockRuleGroups: RuleGroupData[] = [
  { id: "1", rulegroup: "InitialLoad", sequence: 10, description: "InitialLoad", rules: 1, outputViewFlag: true, outputViewName: "InitialLoad" },
  { id: "2", rulegroup: "ScaramoucheLoad", sequence: 20, description: "", rules: 1, outputViewFlag: false },
  { id: "3", rulegroup: "Onboarded", sequence: 40, description: "Adding Data and Fields", rules: 32, outputViewFlag: true, outputViewName: "Onboarded" },
  { id: "4", rulegroup: "TBSMReady", sequence: 50, description: "TBSMReady OutputFields", rules: 1, outputViewFlag: false },
];

const mockSequenceRules: SequenceRule[] = [
  { 
    id: "1", 
    sequence: 1, 
    attributeName: "", 
    type: "QUERY", 
    value: "SELECT convert_date(Control.AsOfDate) as AsOfDate, TRIM(Control.RecordCount) as RecordCount, TRIM(Control.ParValueNotionalSum) as ParValueNotionalSum",
    outputfile: false
  },
  { 
    id: "2", 
    sequence: 20, 
    attributeName: "OriginalNotional", 
    type: "EXPRESSION", 
    value: "COALESCE(castfltrim(OriginalFcci) as decimal(22,2)) ,0,0)",
    outputfile: true
  },
  { 
    id: "3", 
    sequence: 30, 
    attributeName: "OriginalPurchaseNotional", 
    type: "EXPRESSION", 
    value: "COALESCE(castfltrim(OriginalBal) as decimal(22,2)) ,0,0)",
    outputfile: true
  },
];

const recentlyVisited: FeedData[] = [
  { feed: "USCreditCardCorporate", ruleGroups: 3, rules: 60, lastUpdated: "2 hours ago", status: "active" },
  { feed: "USDepositsAmeritrade", ruleGroups: 6, rules: 32, lastUpdated: "5 hours ago", status: "active" },
  { feed: "Deriv_FXFWD", ruleGroups: 4, rules: 15, lastUpdated: "1 day ago", status: "active" },
  { feed: "USInvestmentPledge", ruleGroups: 2, rules: 61, lastUpdated: "2 days ago", status: "active" },
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

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // Feed List View (Level 1)
  if (!selectedFeed) {
    return (
      <div className="min-h-screen">
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

          {/* Recently Visited */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Recently Visited</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyVisited.map((feed) => (
                <Card
                  key={feed.feed}
                  className="p-4 bg-white hover:shadow-md transition-shadow cursor-pointer border-0 relative"
                  onClick={() => handleFeedClick(feed.feed)}
                >
                  <Badge variant="outline" className={`absolute top-3 right-3 ${getStatusColor(feed.status)}`}>
                    {feed.status}
                  </Badge>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate">{feed.feed}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Rule Groups:</span>
                      <span className="ml-1 font-medium text-foreground">{feed.ruleGroups}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rules:</span>
                      <span className="ml-1 font-medium text-foreground">{feed.rules}</span>
                    </div>
                  </div>
                  {feed.lastUpdated && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {feed.lastUpdated}
                    </div>
                  )}
                </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredFeeds.map((feed) => (
                  <Card
                    key={feed.feed}
                    className="p-4 bg-white hover:shadow-md transition-shadow cursor-pointer border-0 relative"
                    onClick={() => handleFeedClick(feed.feed)}
                  >
                    <Badge variant="outline" className={`absolute top-3 right-3 ${getStatusColor(feed.status)}`}>
                      {feed.status}
                    </Badge>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileCode className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">{feed.feed}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Rule Groups:</span>
                        <span className="ml-1 font-medium text-foreground">{feed.ruleGroups}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rules:</span>
                        <span className="ml-1 font-medium text-foreground">{feed.rules}</span>
                      </div>
                    </div>
                  </Card>
                ))}
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
                          Rule Groups
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rules
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileCode className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{feed.feed}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{feed.ruleGroups}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{feed.rules}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={getStatusColor(feed.status)}>
                              {feed.status}
                            </Badge>
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
      <div className="min-h-screen">
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
            <Button size="sm" className="gap-2 bg-[#5BBD72] hover:bg-[#4da862] text-white">
              <Plus className="w-4 h-4" />
              Add RuleGroup
            </Button>
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

          {/* RuleGroups Table */}
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
                          className="cursor-pointer hover:opacity-80"
                        >
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
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
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
    <div className="min-h-screen">
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
          <Button 
            onClick={() => setShowAddRowDialog(true)} 
            size="sm" 
            className="gap-2 bg-[#5BBD72] hover:bg-[#4da862] text-white"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
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
                  <option value="value">value</option>
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
            <div className="text-sm text-muted-foreground">1 - 1 of 1</div>
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

            {/* Rule Editor */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Rule</label>
                <select className="border border-gray-200 rounded-md px-3 py-1.5 text-xs">
                  <option>Text Mate</option>
                  <option>SQL</option>
                  <option>JSON</option>
                </select>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto">
                <textarea
                  value={editingRuleData.value}
                  onChange={(e) => setEditingRuleData({...editingRuleData, value: e.target.value})}
                  className="w-full bg-transparent border-none outline-none resize-none font-mono text-xs leading-relaxed"
                  rows={16}
                  style={{ minHeight: '300px' }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {editingRuleData.value.split('\n').length} Lines
              </div>
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
    </div>
  );
}