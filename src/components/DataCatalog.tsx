import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Search, 
  List, 
  Grid3x3, 
  Database, 
  FileText, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  MoreVertical, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  GitBranch,
  Clock,
  AlertCircle,
  Target,
  Box,
  Layers,
  Link2,
  BarChart3,
  Eye,
  X
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

// Domain structure
interface Domain {
  id: string;
  name: string;
  entities: Entity[];
  riskLevel: "low" | "medium" | "high";
  fieldCount: number;
}

interface Entity {
  id: string;
  name: string;
  domain: string;
  fields: CatalogField[];
  primaryKeys: number;
  referencedInReports: number;
  dqRules: number;
  lastModified: string;
  riskLevel: "low" | "medium" | "high";
}

interface CatalogField {
  id: string;
  order: string;
  entityId: string;
  entityName: string;
  modelType: string;
  fieldName: string;
  description: string;
  sampleData: string;
  owner: string;
  primaryKey: string;
  dataType: string;
  riskLevel: "low" | "medium" | "high";
  usedInRules: number;
  usedInDQ: number;
  usedInRefTables: number;
  nullRate: number;
  dqFailureRate: number;
  lastModified: string;
  releases: Release[];
  dependencies: Dependency[];
}

interface Release {
  version: string;
  changeType: string;
  date: string;
}

interface Dependency {
  type: "rule" | "dq" | "reference" | "report";
  name: string;
  id: string;
}

// Mock data
const mockDomains: Domain[] = [
  {
    id: "tbsm",
    name: "TBSM Ready",
    riskLevel: "low",
    fieldCount: 1420,
    entities: []
  },
  {
    id: "model",
    name: "Model Ready",
    riskLevel: "medium",
    fieldCount: 580,
    entities: []
  }
];

const mockEntities: Entity[] = [
  {
    id: "position",
    name: "Position",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 2,
    referencedInReports: 8,
    dqRules: 15,
    lastModified: "2026-02-17",
    riskLevel: "low"
  },
  {
    id: "borrower",
    name: "Borrower",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 12,
    dqRules: 8,
    lastModified: "2026-02-15",
    riskLevel: "medium"
  },
  {
    id: "product",
    name: "Product",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 5,
    dqRules: 6,
    lastModified: "2026-02-10",
    riskLevel: "low"
  },
  {
    id: "risk-metrics",
    name: "RiskMetrics",
    domain: "Model Ready",
    fields: [],
    primaryKeys: 2,
    referencedInReports: 15,
    dqRules: 22,
    lastModified: "2026-02-18",
    riskLevel: "high"
  },
  {
    id: "capital",
    name: "Capital",
    domain: "Model Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 10,
    dqRules: 12,
    lastModified: "2026-02-16",
    riskLevel: "medium"
  }
];

const mockFields: CatalogField[] = [
  {
    id: "f1",
    order: "ING-001262",
    entityId: "position",
    entityName: "Position",
    modelType: "TBSM Ready",
    fieldName: "PendingTxnPayment",
    description: "Is a dollar amount representing pending transaction payments",
    sampleData: "2564.51",
    owner: "IBM",
    primaryKey: "N",
    dataType: "INT32",
    riskLevel: "low",
    usedInRules: 3,
    usedInDQ: 2,
    usedInRefTables: 1,
    nullRate: 2.5,
    dqFailureRate: 0.8,
    lastModified: "2026-02-10",
    releases: [
      { version: "v5.87", changeType: "Added to DQ Rule", date: "2026-02-10" },
      { version: "v5.86", changeType: "Description Modified", date: "2026-01-15" }
    ],
    dependencies: [
      { type: "rule", name: "Payment Validation Rule", id: "r1" },
      { type: "rule", name: "Transaction Processing", id: "r2" },
      { type: "dq", name: "Payment Amount Check", id: "dq1" },
      { type: "reference", name: "Payment Reference Table", id: "ref1" }
    ]
  },
  {
    id: "f2",
    order: "ING-000721",
    entityId: "product",
    entityName: "Product",
    modelType: "TBSM Ready",
    fieldName: "ProductDescription",
    description: "Indicates the type of account or product",
    sampleData: "INSTALLMENT",
    owner: "IBM",
    primaryKey: "N",
    dataType: "VARCHAR",
    riskLevel: "low",
    usedInRules: 5,
    usedInDQ: 1,
    usedInRefTables: 2,
    nullRate: 0.5,
    dqFailureRate: 0.2,
    lastModified: "2026-02-15",
    releases: [
      { version: "v5.86", changeType: "DataType Updated", date: "2026-02-15" }
    ],
    dependencies: [
      { type: "rule", name: "Product Classification", id: "r3" },
      { type: "dq", name: "Product Type Validation", id: "dq2" }
    ]
  },
  {
    id: "f3",
    order: "ING-001573",
    entityId: "borrower",
    entityName: "Borrower",
    modelType: "TBSM Ready",
    fieldName: "BorrowerRiskRatingGroup",
    description: "Bucketed risk profile of the borrower",
    sampleData: "Extremely Low/Normal Risk",
    owner: "IBM",
    primaryKey: "N",
    dataType: "STRING",
    riskLevel: "high",
    usedInRules: 8,
    usedInDQ: 4,
    usedInRefTables: 1,
    nullRate: 5.2,
    dqFailureRate: 3.5,
    lastModified: "2026-02-18",
    releases: [
      { version: "v5.87", changeType: "Added to DQ Rule", date: "2026-02-18" },
      { version: "v5.84", changeType: "DataType Updated", date: "2026-01-20" }
    ],
    dependencies: [
      { type: "rule", name: "Risk Assessment Rule", id: "r4" },
      { type: "rule", name: "Credit Scoring", id: "r5" },
      { type: "dq", name: "Risk Rating Validation", id: "dq3" },
      { type: "report", name: "Risk Dashboard", id: "rep1" }
    ]
  },
  {
    id: "f4",
    order: "ING-003505",
    entityId: "risk-metrics",
    entityName: "RiskMetrics",
    modelType: "Model Ready",
    fieldName: "M_CollateralId",
    description: "Agency underlying collateral identifier",
    sampleData: "FNMA",
    owner: "UNMA",
    primaryKey: "Y",
    dataType: "String",
    riskLevel: "high",
    usedInRules: 12,
    usedInDQ: 6,
    usedInRefTables: 3,
    nullRate: 1.2,
    dqFailureRate: 2.8,
    lastModified: "2026-02-17",
    releases: [
      { version: "v5.86", changeType: "Primary Key Added", date: "2026-02-17" }
    ],
    dependencies: [
      { type: "rule", name: "Collateral Validation", id: "r6" },
      { type: "dq", name: "Collateral ID Check", id: "dq4" },
      { type: "reference", name: "Collateral Reference", id: "ref2" }
    ]
  }
];

type ViewMode = "table" | "entity" | "graph" | "risk";

export function DataCatalog() {
  const [viewMode, setViewMode] = useState<ViewMode>("entity");
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(["tbsm"]));
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(mockEntities[0]);
  const [selectedField, setSelectedField] = useState<CatalogField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [showImpactModal, setShowImpactModal] = useState(false);

  const toggleDomain = (domainId: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getRiskIcon = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return <CheckCircle2 className="w-3 h-3" />;
      case "medium":
        return <AlertCircle className="w-3 h-3" />;
      case "high":
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const filteredFields = mockFields.filter(field => {
    const matchesSearch = !searchQuery || 
      field.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.order.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = filterRisk === "all" || field.riskLevel === filterRisk;
    
    const matchesEntity = !selectedEntity || field.entityId === selectedEntity.id;
    
    return matchesSearch && matchesRisk && matchesEntity;
  });

  return (
    <div className="min-h-screen flex">
      {/* Model Explorer Sidebar */}
      <div className="w-80 flex flex-col pt-6 border-r border-gray-200">
        <div className="px-4 pb-4 border-b border-gray-200">
          <h2 className="font-semibold text-foreground mb-3">Model Explorer</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search entities..."
              className="pl-10 bg-white border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {mockDomains.map((domain) => {
            const isExpanded = expandedDomains.has(domain.id);
            const domainEntities = mockEntities.filter(e => 
              e.domain === domain.name
            );

            return (
              <div key={domain.id} className="mb-2">
                <button
                  onClick={() => toggleDomain(domain.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <Layers className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm text-foreground flex-1">
                    {domain.name}
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {domain.fieldCount}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {domainEntities.map((entity) => {
                      const entityFields = mockFields.filter(f => f.entityId === entity.id);
                      const isSelected = selectedEntity?.id === entity.id;

                      return (
                        <button
                          key={entity.id}
                          onClick={() => {
                            setSelectedEntity(entity);
                            setSelectedField(null);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left",
                            isSelected 
                              ? "text-primary font-medium" 
                              : "hover:bg-gray-50 text-foreground"
                          )}
                        >
                          <Box className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-sm flex-1">{entity.name}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs px-1.5 py-0",
                              getRiskColor(entity.riskLevel)
                            )}
                          >
                            {getRiskIcon(entity.riskLevel)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {entityFields.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {selectedField ? `Field: ${selectedField.fieldName}` : `Entity: ${selectedEntity?.name || "Data Catalog"}`}
              </h1>
              {selectedEntity && !selectedField && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/90 text-white border-0">
                    {filteredFields.length} Fields
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
                    {selectedEntity.dqRules} DQ Rules
                  </Badge>
                  <Badge variant="outline" className={getRiskColor(selectedEntity.riskLevel)}>
                    {getRiskIcon(selectedEntity.riskLevel)}
                    <span className="ml-1 capitalize">{selectedEntity.riskLevel} Risk</span>
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Global Search */}
            <div className="relative w-80 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search fields..."
                className="pl-10 bg-white border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {selectedEntity && !selectedField && (
            <div className="text-sm text-muted-foreground">
              Primary Keys: {selectedEntity.primaryKeys} • Referenced in {selectedEntity.referencedInReports} Reports • Last Modified: {selectedEntity.lastModified}
            </div>
          )}
        </div>

        {/* Field Detail View */}
        {selectedField ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Back button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedField(null)}
              className="gap-2"
            >
              ← Back to {selectedEntity?.name}
            </Button>

            {/* Section 1: Definition */}
            <Card className="bg-white shadow-sm border-0 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Definition
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Field Name</label>
                  <div className="text-sm font-medium text-foreground mt-1">{selectedField.fieldName}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Data Type</label>
                  <div className="text-sm font-medium text-foreground mt-1">{selectedField.dataType}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Model Type</label>
                  <div className="text-sm text-foreground mt-1">{selectedField.modelType}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Primary Key</label>
                  <div className="text-sm text-foreground mt-1">{selectedField.primaryKey}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Owner</label>
                  <div className="text-sm text-foreground mt-1">{selectedField.owner}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Order</label>
                  <div className="text-sm text-foreground mt-1">{selectedField.order}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <div className="text-sm text-foreground mt-1">{selectedField.description}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sample Data</label>
                  <div className="text-sm text-foreground mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                    {selectedField.sampleData}
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Usage & Dependency */}
            <Card className="bg-white shadow-sm border-0 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Usage & Dependency
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Onboarding Rules</span>
                  </div>
                  <Badge className="bg-blue-600 text-white border-0">{selectedField.usedInRules}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Data Quality Rules</span>
                  </div>
                  <Badge className="bg-purple-600 text-white border-0">{selectedField.usedInDQ}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Reference Tables</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-0">{selectedField.usedInRefTables}</Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-foreground mb-2">Dependencies</h4>
                  <div className="space-y-2">
                    {selectedField.dependencies.map((dep, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground hover:text-primary cursor-pointer">
                        <ChevronRight className="w-3 h-3" />
                        <span className="capitalize">{dep.type}:</span>
                        <span className="font-medium">{dep.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Section 3: Release History */}
              <Card className="bg-white shadow-sm border-0 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Release History
                </h3>
                <div className="space-y-3">
                  {selectedField.releases.map((release, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{release.version}</div>
                        <div className="text-xs text-muted-foreground">{release.changeType}</div>
                        <div className="text-xs text-muted-foreground mt-1">{release.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Section 4: Field Health Metrics */}
              <Card className="bg-white shadow-sm border-0 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Field Health Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Null Rate</span>
                      <span className="text-sm font-medium text-foreground">{selectedField.nullRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${selectedField.nullRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">DQ Failure Rate</span>
                      <span className="text-sm font-medium text-foreground">{selectedField.dqFailureRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${selectedField.dqFailureRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <Badge variant="outline" className={getRiskColor(selectedField.riskLevel)}>
                        {getRiskIcon(selectedField.riskLevel)}
                        <span className="ml-1 capitalize">{selectedField.riskLevel}</span>
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last Modified: {selectedField.lastModified}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Section 5: Lineage View */}
            <Card className="bg-white shadow-sm border-0 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Data Lineage
              </h3>
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-lg bg-blue-100 border-2 border-blue-300 flex items-center justify-center mb-2">
                      <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium">Source Field</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-lg bg-purple-100 border-2 border-purple-300 flex items-center justify-center mb-2">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-xs font-medium">Transform Rule</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center mb-2">
                      <Box className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-xs font-medium">Catalog Field</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-lg bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mb-2">
                      <Activity className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="text-xs font-medium">DQ Rule</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-lg bg-orange-100 border-2 border-orange-300 flex items-center justify-center mb-2">
                      <BarChart3 className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-xs font-medium">Report</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Impact Simulation Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowImpactModal(true)}
              >
                <AlertTriangle className="w-4 h-4" />
                Simulate Impact
              </Button>
              <Button variant="default" className="gap-2">
                <Eye className="w-4 h-4" />
                View Full Lineage
              </Button>
            </div>
          </div>
        ) : (
          /* Entity Fields Table */
          <div className="flex-1 overflow-y-auto p-6">
            {/* Controls */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Risk Level:</label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Risks</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "entity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("entity")}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Entity View
                </Button>
                <Button
                  variant={viewMode === "risk" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("risk")}
                  className="gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Risk View
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Fields Table */}
            <Card className="bg-white shadow-sm border-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Field Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Data Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Risk
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Used in Rules
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Used in DQ
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        DQ Failure %
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Last Modified
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFields.map((field) => (
                      <tr
                        key={field.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedField(field)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {field.fieldName}
                            </span>
                            {field.primaryKey === "Y" && (
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                PK
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{field.dataType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getRiskColor(field.riskLevel)}>
                            {getRiskIcon(field.riskLevel)}
                            <span className="ml-1 capitalize">{field.riskLevel}</span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-600 text-white border-0">{field.usedInRules}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-purple-600 text-white border-0">{field.usedInDQ}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground">{field.dqFailureRate}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{field.lastModified}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField(field);
                            }}
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Impact Modal */}
      {showImpactModal && selectedField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Impact Detected</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing changes to {selectedField.fieldName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImpactModal(false)}
                className="hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">This field is used in:</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• {selectedField.usedInRules} Onboarding Rules</li>
                  <li>• {selectedField.usedInDQ} DQ Rules</li>
                  <li>• {selectedField.usedInRefTables} Reference Table</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Potential Breaking Changes:</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>• Changing DataType {selectedField.dataType} → STRING may break:</li>
                  <li className="ml-4">- Rule: Payment Validation Rule</li>
                  <li className="ml-4">- DQ Validation: Payment Amount Check</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowImpactModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="outline" className="flex-1">
                  Open Dependency View
                </Button>
                <Button variant="default" className="flex-1">
                  Continue with Risk
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}