import { useState } from "react";
import { 
  LayoutGrid, 
  List, 
  Search,
  Save,
  History,
  Filter,
  Columns,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  FileText,
  GitBranch,
  AlertCircle,
  Database,
  Trash2,
  Copy,
  ArrowUpDown
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ReferenceTableData {
  id: string;
  name: string;
  columns: number;
  rows: number;
  usedIn: {
    onboardingRules: number;
    dqRules: number;
    reports: number;
  };
  pendingChanges: number;
  riskLevel: "Low" | "Medium" | "High";
  lastModified: string;
}

interface TableRow {
  id: string;
  BandingKey: string;
  Sequence: number;
  StartValue: number;
  EndValue: number;
  Label: string;
  IsIncludeStartValue: string;
  IsIncludeEndValue: string;
}

interface ValidationIssue {
  type: "overlap" | "gap" | "duplicate" | "invalid";
  severity: "error" | "warning";
  rowId: string;
  message: string;
  affectedRows?: string[];
}

interface UsageInfo {
  onboardingRules: Array<{ ruleGroup: string; rule: string }>;
  dataQuality: string[];
  catalogFields: string[];
}

interface ImpactAnalysis {
  affectedRules: number;
  affectedValidations: number;
  affectedReports: number;
  details: string[];
}

interface ReleaseHistoryItem {
  version: string;
  date: string;
  changes: string;
  author: string;
}

const mockReferenceTables: ReferenceTableData[] = [
  { 
    id: "1", 
    name: "BandingMapReferenceData", 
    columns: 7, 
    rows: 75,
    usedIn: { onboardingRules: 3, dqRules: 2, reports: 1 },
    pendingChanges: 1,
    riskLevel: "Medium",
    lastModified: "2 days ago"
  },
  { 
    id: "2", 
    name: "BankCodeLegalEntityMapping", 
    columns: 7, 
    rows: 45,
    usedIn: { onboardingRules: 5, dqRules: 3, reports: 2 },
    pendingChanges: 0,
    riskLevel: "Low",
    lastModified: "1 week ago"
  },
  { 
    id: "3", 
    name: "BenchmarkData", 
    columns: 4, 
    rows: 120,
    usedIn: { onboardingRules: 2, dqRules: 1, reports: 3 },
    pendingChanges: 3,
    riskLevel: "High",
    lastModified: "3 months ago"
  },
  { 
    id: "4", 
    name: "BetaAssumption", 
    columns: 9, 
    rows: 88,
    usedIn: { onboardingRules: 1, dqRules: 1, reports: 1 },
    pendingChanges: 0,
    riskLevel: "Low",
    lastModified: "2 weeks ago"
  },
  { 
    id: "5", 
    name: "BncmIndexReferenceData", 
    columns: 9, 
    rows: 150,
    usedIn: { onboardingRules: 4, dqRules: 2, reports: 2 },
    pendingChanges: 2,
    riskLevel: "Medium",
    lastModified: "1 year ago"
  },
  { 
    id: "6", 
    name: "BorrowerRiskRatingGroup", 
    columns: 2, 
    rows: 32,
    usedIn: { onboardingRules: 6, dqRules: 4, reports: 3 },
    pendingChanges: 0,
    riskLevel: "High",
    lastModified: "5 days ago"
  },
  {
    id: "7",
    name: "CounterpartyMapping",
    columns: 5,
    rows: 210,
    usedIn: { onboardingRules: 4, dqRules: 2, reports: 5 },
    pendingChanges: 2,
    riskLevel: "Medium",
    lastModified: "1 day ago"
  },
  {
    id: "8",
    name: "CurrencyConversionRates",
    columns: 4,
    rows: 180,
    usedIn: { onboardingRules: 8, dqRules: 1, reports: 4 },
    pendingChanges: 0,
    riskLevel: "Low",
    lastModified: "3 hours ago"
  },
  {
    id: "9",
    name: "RegulatoryJurisdictionCodes",
    columns: 6,
    rows: 95,
    usedIn: { onboardingRules: 2, dqRules: 3, reports: 6 },
    pendingChanges: 1,
    riskLevel: "High",
    lastModified: "4 days ago"
  },
];

const mockTableData: TableRow[] = [
  { id: "1", BandingKey: "Term", Sequence: 8, StartValue: 18, EndValue: 24, Label: "<=1Y & <=2Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "2", BandingKey: "Term", Sequence: 9, StartValue: 24, EndValue: 36, Label: ">=2Y & <=3Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "3", BandingKey: "Term", Sequence: 10, StartValue: 36, EndValue: 48, Label: ">=3Y & <=4Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "4", BandingKey: "Term", Sequence: 4, StartValue: 3, EndValue: 6, Label: ">=3M & <=6M", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "5", BandingKey: "Term", Sequence: 11, StartValue: 48, EndValue: 60, Label: ">=4Y & <=5Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "6", BandingKey: "Term", Sequence: 12, StartValue: 60, EndValue: 72, Label: ">=5Y & <=6Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "7", BandingKey: "Term", Sequence: 13, StartValue: 72, EndValue: 84, Label: ">=6Y & <=7Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "8", BandingKey: "Term", Sequence: 14, StartValue: 84, EndValue: 96, Label: ">=7Y & <=8Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "9", BandingKey: "Term", Sequence: 15, StartValue: 96, EndValue: 108, Label: ">=8Y & <=9Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
  { id: "10", BandingKey: "Term", Sequence: 16, StartValue: 108, EndValue: 120, Label: ">=9Y & <=10Y", IsIncludeStartValue: "false", IsIncludeEndValue: "true" },
];

const mockUsageInfo: UsageInfo = {
  onboardingRules: [
    { ruleGroup: "TermMapping", rule: "AssignTermBucket" },
    { ruleGroup: "RiskBanding", rule: "CalculateRiskBand" },
    { ruleGroup: "MaturityAnalysis", rule: "DetermineMaturityGroup" }
  ],
  dataQuality: ["TermRangeValidation", "BandingConsistencyCheck"],
  catalogFields: ["BorrowerTermBucket", "LoanMaturityBand"]
};

const mockReleaseHistory: ReleaseHistoryItem[] = [
  { version: "v5.87", date: "2024-02-15", changes: "Adjusted 15Y–20Y range", author: "Yu" },
  { version: "v5.85", date: "2024-01-10", changes: "Added new Term band", author: "John Smith" },
  { version: "v5.80", date: "2023-12-05", changes: "Updated sequence values", author: "Sarah Chen" },
  { version: "v5.75", date: "2023-11-20", changes: "Fixed label inconsistencies", author: "Yu" }
];

export function ReferenceTable() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"data" | "usage" | "impact" | "history">("data");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [editFormData, setEditFormData] = useState<Partial<TableRow>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [showImpactSimulation, setShowImpactSimulation] = useState(false);

  const recentlyVisited = mockReferenceTables.slice(0, 9);
  const allTables = mockReferenceTables;

  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
    setActiveTab("data");
    // Simulate validation
    detectValidationIssues();
  };

  const handleBackToList = () => {
    setSelectedTable(null);
    setEditingRow(null);
    setIsAddingNew(false);
    setActiveTab("data");
  };

  const handleEditRow = (row: TableRow) => {
    setEditingRow(row);
    setEditFormData({ ...row });
    setShowImpactSimulation(true);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditFormData({
      BandingKey: "Term",
      Sequence: 0,
      StartValue: 0,
      EndValue: 0,
      Label: "",
      IsIncludeStartValue: "false",
      IsIncludeEndValue: "true"
    });
  };

  const handleSubmitEdit = () => {
    console.log("Submitting:", editFormData);
    setEditingRow(null);
    setIsAddingNew(false);
    setShowImpactSimulation(false);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setIsAddingNew(false);
    setEditFormData({});
    setShowImpactSimulation(false);
  };

  const detectValidationIssues = () => {
    // Simulate validation detection
    const issues: ValidationIssue[] = [
      {
        type: "overlap",
        severity: "error",
        rowId: "2",
        message: "Overlapping Range Detected: Row 2 (24-36) overlaps with next range starting at 35",
        affectedRows: ["2", "3"]
      },
      {
        type: "gap",
        severity: "warning",
        rowId: "4",
        message: "Gap Detected: Missing range between 6 and 18",
        affectedRows: ["4", "1"]
      },
      {
        type: "duplicate",
        severity: "error",
        rowId: "4",
        message: "Duplicate Sequence: Sequence 4 appears multiple times",
      }
    ];
    setValidationIssues(issues);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const totalPages = Math.ceil(mockTableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockTableData.slice(startIndex, endIndex);

  // Main list view - Landing Page
  if (!selectedTable) {
    return (
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Reference Intelligence Dashboard</h1>
            <p className="text-sm text-muted-foreground">Business Semantic Control Layer</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search reference tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white border-gray-200"
              />
            </div>
            
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" 
                    ? "bg-gray-100 text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "card" 
                    ? "bg-gray-100 text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recently visited - horizontal scroll, ~3.5 cards visible, width adaptive */}
        <div className="mb-8 w-full min-w-0" style={{ containerType: "inline-size" }}>
          <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recently visited
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 w-full">
            {recentlyVisited.map((table) => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table.id)}
                className="flex-shrink-0 min-w-[200px] bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#5BBD72] hover:shadow-md transition-all"
                style={{ width: "calc((100cqw - 3 * 1rem) / 3.5)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{table.name}</h3>
                  {table.pendingChanges > 0 && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {table.pendingChanges} Pending
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="ml-1 font-medium text-foreground">{table.columns}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rows:</span>
                    <span className="ml-1 font-medium text-foreground">{table.rows}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2">Used In:</div>
                  <div className="flex flex-wrap gap-2">
                    {table.usedIn.onboardingRules > 0 && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.onboardingRules} Onboarding
                      </span>
                    )}
                    {table.usedIn.dqRules > 0 && (
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.dqRules} DQ Rules
                      </span>
                    )}
                    {table.usedIn.reports > 0 && (
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.reports} Reports
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(table.riskLevel)}`}>
                    {table.riskLevel} Risk
                  </div>
                  <div className="text-xs text-muted-foreground">{table.lastModified}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All tables */}
        <div className="mb-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            All Reference Tables ({allTables.length})
          </h2>
        </div>

        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table.id)}
                className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#5BBD72] hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{table.name}</h3>
                  {table.pendingChanges > 0 && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {table.pendingChanges} Pending
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="ml-1 font-medium text-foreground">{table.columns}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rows:</span>
                    <span className="ml-1 font-medium text-foreground">{table.rows}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2">Used In:</div>
                  <div className="flex flex-wrap gap-2">
                    {table.usedIn.onboardingRules > 0 && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.onboardingRules} Onboarding
                      </span>
                    )}
                    {table.usedIn.dqRules > 0 && (
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.dqRules} DQ Rules
                      </span>
                    )}
                    {table.usedIn.reports > 0 && (
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {table.usedIn.reports} Reports
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(table.riskLevel)}`}>
                    {table.riskLevel} Risk
                  </div>
                  <div className="text-xs text-muted-foreground">{table.lastModified}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Columns
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Rows
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Used In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Last Modified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allTables.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTableClick(table.id)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{table.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{table.columns}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{table.rows}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {table.usedIn.onboardingRules}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">
                          {table.usedIn.dqRules}
                        </span>
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                          {table.usedIn.reports}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {table.pendingChanges > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                          {table.pendingChanges}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(table.riskLevel)}`}>
                        {table.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{table.lastModified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Detail view with tabs
  const selectedTableData = allTables.find(t => t.id === selectedTable);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Reference &gt; {selectedTableData?.name}
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {selectedTableData?.name}
            </h1>
          </div>

          <Button
            onClick={handleBackToList}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("data")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "data"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Data
            {validationIssues.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                {validationIssues.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "usage"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Usage
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "impact"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Impact Simulation
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "history"
                ? "border-[#5BBD72] text-[#5BBD72]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Release History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {/* Tab 1 - Data */}
        {activeTab === "data" && (
          <div className="p-6">
            {/* Validation Issues */}
            {validationIssues.length > 0 && (
              <div className="mb-6 space-y-3">
                {validationIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      issue.severity === "error"
                        ? "bg-red-50 border-red-500"
                        : "bg-orange-50 border-orange-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                        issue.severity === "error" ? "text-red-600" : "text-orange-600"
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          issue.severity === "error" ? "text-red-900" : "text-orange-900"
                        }`}>
                          {issue.type === "overlap" && "⚠ Overlapping Range Detected"}
                          {issue.type === "gap" && "⚠ Gap Detected"}
                          {issue.type === "duplicate" && "⚠ Duplicate Sequence"}
                        </div>
                        <div className={`text-sm mt-1 ${
                          issue.severity === "error" ? "text-red-700" : "text-orange-700"
                        }`}>
                          {issue.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Auto-Fix Sequence
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
              <Button
                onClick={handleAddNew}
                className="gap-2 bg-[#5BBD72] hover:bg-[#4AA962] text-white"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      BandingKey
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Sequence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      StartValue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      EndValue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Label
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      IsIncludeStartValue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      IsIncludeEndValue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((row) => {
                    const hasIssue = validationIssues.some(issue => issue.rowId === row.id);
                    return (
                      <tr key={row.id} className={`hover:bg-gray-50 ${hasIssue ? "bg-red-50/30" : ""}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.BandingKey}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.Sequence}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.StartValue}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.EndValue}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.Label}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.IsIncludeStartValue}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{row.IsIncludeEndValue}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditRow(row)}
                              className="text-muted-foreground hover:text-[#5BBD72] transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-muted-foreground hover:text-blue-600 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              className="text-muted-foreground hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-4">
                  {startIndex + 1}-{Math.min(endIndex, mockTableData.length)} of {mockTableData.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 - Usage */}
        {activeTab === "usage" && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Usage Information</h2>
            
            <div className="space-y-6">
              {/* Onboarding Rules */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Onboarding Rules</h3>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {mockUsageInfo.onboardingRules.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {mockUsageInfo.onboardingRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{rule.rule}</div>
                        <div className="text-xs text-muted-foreground">RuleGroup: {rule.ruleGroup}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Data Quality</h3>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {mockUsageInfo.dataQuality.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {mockUsageInfo.dataQuality.map((dq, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 text-sm font-medium text-foreground">{dq}</div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Catalog Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Catalog Fields</h3>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {mockUsageInfo.catalogFields.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {mockUsageInfo.catalogFields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 text-sm font-medium text-foreground">{field}</div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependency Graph */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Dependency Graph</h3>
                </div>
                <div className="pl-4 border-l-2 border-gray-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5BBD72] rounded-full"></div>
                    <div className="text-sm font-medium text-foreground">BandingMapReferenceData</div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm text-foreground">Onboarding Rule: TermMapping</div>
                  </div>
                  <div className="flex items-center gap-3 ml-8">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm text-foreground">Catalog Field: BorrowerTermBucket</div>
                  </div>
                  <div className="flex items-center gap-3 ml-12">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm text-foreground">DQ Rule: TermRangeValidation</div>
                  </div>
                  <div className="flex items-center gap-3 ml-16">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="text-sm text-foreground">Report: Term Distribution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 - Impact Simulation */}
        {activeTab === "impact" && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Impact Simulation</h2>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Simulate Changes Before Applying
                  </h3>
                  <p className="text-sm text-orange-800 mb-4">
                    Select a row and edit to see the potential impact across your system.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-xs text-muted-foreground">Affected Rules</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">1</div>
                      <div className="text-xs text-muted-foreground">Affected Validations</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">1</div>
                      <div className="text-xs text-muted-foreground">Affected Reports</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Change Risk Matrix</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">Value change in widely used table</span>
                  </div>
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded">High Risk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">Delete row</span>
                  </div>
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded">High Risk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">Add new row</span>
                  </div>
                  <span className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded">Medium Risk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">Label change only</span>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Detailed Impact */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-4">Detailed Impact Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">If Label Changes:</div>
                  <div className="pl-4 border-l-2 border-orange-300 space-y-2">
                    <div className="text-sm text-muted-foreground">→ May affect reporting output</div>
                    <div className="text-sm text-muted-foreground">→ Update documentation required</div>
                    <div className="text-sm text-muted-foreground">→ Notify report consumers</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">If Range Changes:</div>
                  <div className="pl-4 border-l-2 border-red-300 space-y-2">
                    <div className="text-sm text-muted-foreground">→ Revalidate all dependent rules</div>
                    <div className="text-sm text-muted-foreground">→ Historical data may be affected</div>
                    <div className="text-sm text-muted-foreground">→ Require regression testing</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">If Sequence Changes:</div>
                  <div className="pl-4 border-l-2 border-yellow-300 space-y-2">
                    <div className="text-sm text-muted-foreground">→ May affect rule execution order</div>
                    <div className="text-sm text-muted-foreground">→ Check dependent calculations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4 - Release History */}
        {activeTab === "history" && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Release History</h2>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {mockReleaseHistory.map((release, idx) => (
                  <div key={idx} className="relative pl-14">
                    <div className="absolute left-0 w-12 h-12 bg-[#5BBD72] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {release.version.replace('v', '')}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{release.version}</h3>
                          <p className="text-sm text-muted-foreground">{release.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#5BBD72] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            YL
                          </div>
                          <span className="text-sm text-muted-foreground">{release.author}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{release.changes}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs text-[#5BBD72] hover:underline">View Details</button>
                        <span className="text-xs text-muted-foreground">•</span>
                        <button className="text-xs text-[#5BBD72] hover:underline">Compare</button>
                        <span className="text-xs text-muted-foreground">•</span>
                        <button className="text-xs text-[#5BBD72] hover:underline">Rollback</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editingRow || isAddingNew) && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
          <div className="bg-white w-full max-w-2xl h-full shadow-xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {isAddingNew ? "Add New Row" : "Edit Row"}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Impact Warning */}
            {showImpactSimulation && !isAddingNew && (
              <div className="p-6 bg-orange-50 border-b border-orange-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-orange-900 mb-2">This change will affect:</div>
                    <div className="space-y-1 text-sm text-orange-800">
                      <div>• 3 Onboarding Rules</div>
                      <div>• 1 DQ Validation</div>
                      <div>• 1 Report</div>
                    </div>
                    <div className="mt-3 text-sm text-orange-800">
                      <strong>If Label changes:</strong> → May affect reporting output
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    BandingKey
                  </label>
                  <Input
                    value={editFormData.BandingKey || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, BandingKey: e.target.value })}
                    placeholder="Term"
                    className="border border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Sequence
                    </label>
                    <Input
                      type="number"
                      value={editFormData.Sequence || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, Sequence: Number(e.target.value) })}
                      placeholder="8"
                      className="border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      StartValue
                    </label>
                    <Input
                      type="number"
                      value={editFormData.StartValue || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, StartValue: Number(e.target.value) })}
                      placeholder="18"
                      className="border border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      EndValue
                    </label>
                    <Input
                      type="number"
                      value={editFormData.EndValue || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, EndValue: Number(e.target.value) })}
                      placeholder="24"
                      className="border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Label
                    </label>
                    <Input
                      value={editFormData.Label || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, Label: e.target.value })}
                      placeholder="<=1Y & <=2Y"
                      className="border border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      IsIncludeStartValue
                    </label>
                    <select
                      value={editFormData.IsIncludeStartValue || "false"}
                      onChange={(e) => setEditFormData({ ...editFormData, IsIncludeStartValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      IsIncludeEndValue
                    </label>
                    <select
                      value={editFormData.IsIncludeEndValue || "true"}
                      onChange={(e) => setEditFormData({ ...editFormData, IsIncludeEndValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </div>
                </div>

                {/* Inline Validation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Validation Checks</div>
                      <div className="space-y-1">
                        <div>✓ No duplicate sequence detected</div>
                        <div>✓ Range values are valid</div>
                        <div>✓ No overlapping ranges</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setEditFormData({ ...editingRow })}
                variant="outline"
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmitEdit}
                className="bg-[#5BBD72] hover:bg-[#4AA962] text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
