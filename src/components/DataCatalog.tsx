import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { extendedMockFields } from "./DataCatalogExtendedFields";
import { SensitiveText } from "./SensitiveText";
import { LineageDAGView } from "./LineageDAGView";
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
  X,
  Key,
  Edit2,
  ArrowRight,
  FileWarning,
  Users,
  Calendar,
  Network,
  Zap,
  Shield,
  Share2,
  Code2,
  Folder,
  FileCode
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
  businessDescription: string;
  sampleData: string;
  owner: string;
  steward: string;
  primaryKey: string;
  dataType: string;
  riskLevel: "low" | "medium" | "high";
  usedInRules: number;
  usedInDQ: number;
  usedInRefTables: number;
  usedInReports: number;
  nullRate: number;
  dqFailureRate: number;
  lastModified: string;
  changeCount7Days: number;
  releases: Release[];
  dependencies: Dependency[];
  lineage: LineageNode[];
  tags: string[];
}

interface Release {
  version: string;
  changeType: string;
  date: string;
  author: string;
  description: string;
}

interface Dependency {
  type: "rule" | "dq" | "reference" | "report";
  name: string;
  id: string;
  status: "active" | "inactive" | "deprecated";
}

interface LineageNode {
  stage: string;
  name: string;
  type: "source" | "transformation" | "catalog" | "dq" | "output" | "report";
  status: "healthy" | "warning" | "error";
}

// Mock data
const mockDomains: Domain[] = [
  {
    id: "tbsm",
    name: "TBSM Ready",
    riskLevel: "low",
    fieldCount: 2847,
    entities: []
  },
  {
    id: "model",
    name: "Model Ready",
    riskLevel: "medium",
    fieldCount: 1653,
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
    id: "lifeline",
    name: "LifeLine",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 7,
    dqRules: 5,
    lastModified: "2026-02-12",
    riskLevel: "low"
  },
  {
    id: "audit-date",
    name: "AuditDate",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 3,
    dqRules: 2,
    lastModified: "2026-02-08",
    riskLevel: "low"
  },
  {
    id: "mta-first-cap",
    name: "MtaFirstCap",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 4,
    dqRules: 3,
    lastModified: "2026-02-14",
    riskLevel: "medium"
  },
  {
    id: "mortgage",
    name: "MortgageInformation",
    domain: "TBSM Ready",
    fields: [],
    primaryKeys: 2,
    referencedInReports: 18,
    dqRules: 12,
    lastModified: "2026-02-19",
    riskLevel: "high"
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
  },
  {
    id: "collateral",
    name: "Collateral",
    domain: "Model Ready",
    fields: [],
    primaryKeys: 2,
    referencedInReports: 20,
    dqRules: 18,
    lastModified: "2026-02-20",
    riskLevel: "high"
  },
  {
    id: "loan-commitment",
    name: "LoanCommitment",
    domain: "Model Ready",
    fields: [],
    primaryKeys: 1,
    referencedInReports: 14,
    dqRules: 10,
    lastModified: "2026-02-13",
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
    businessDescription: "Dollar amount representing pending transaction payments for position reconciliation and settlement tracking",
    sampleData: "2564.51",
    owner: "IBM",
    steward: "John Smith",
    primaryKey: "N",
    dataType: "INT32",
    riskLevel: "low",
    usedInRules: 3,
    usedInDQ: 2,
    usedInRefTables: 1,
    usedInReports: 4,
    nullRate: 2.5,
    dqFailureRate: 0.8,
    lastModified: "2026-02-10",
    changeCount7Days: 2,
    releases: [
      { version: "v5.87", changeType: "Added to DQ Rule", date: "2026-02-10", author: "Yu", description: "Added DQ validation for payment amounts" },
      { version: "v5.86", changeType: "Description Updated", date: "2026-01-15", author: "kapan08", description: "Updated business description for clarity" },
      { version: "v5.85", changeType: "Type Modified", date: "2025-12-20", author: "ginnyzhi", description: "Changed from DECIMAL to INT32" }
    ],
    dependencies: [
      { type: "rule", name: "Payment Validation Rule", id: "r1", status: "active" },
      { type: "rule", name: "Transaction Processing", id: "r2", status: "active" },
      { type: "rule", name: "Settlement Check", id: "r3", status: "active" },
      { type: "dq", name: "Payment Amount Check", id: "dq1", status: "active" },
      { type: "dq", name: "Null Validation", id: "dq2", status: "active" },
      { type: "reference", name: "Payment Reference Table", id: "ref1", status: "active" },
      { type: "report", name: "Daily Position Report", id: "rep1", status: "active" },
      { type: "report", name: "Settlement Dashboard", id: "rep2", status: "active" },
      { type: "report", name: "Transaction Summary", id: "rep3", status: "active" },
      { type: "report", name: "Monthly Reconciliation", id: "rep4", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "PositionRaw.PendingPayment", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "InitialLoad Rule", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "PendingTxnPayment", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Payment Amount Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Position_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Daily Position Report", type: "report", status: "healthy" }
    ],
    tags: ["payment", "transaction", "settlement", "financial"]
  },
  {
    id: "f2",
    order: "ING-000721",
    entityId: "product",
    entityName: "Product",
    modelType: "TBSM Ready",
    fieldName: "ProductDescription",
    description: "Indicates the type of account or product",
    businessDescription: "Product type classification for lending and deposit accounts, used in risk segmentation and reporting",
    sampleData: "INSTALLMENT",
    owner: "IBM",
    steward: "Sarah Johnson",
    primaryKey: "N",
    dataType: "VARCHAR",
    riskLevel: "low",
    usedInRules: 5,
    usedInDQ: 1,
    usedInRefTables: 2,
    usedInReports: 6,
    nullRate: 0.5,
    dqFailureRate: 0.2,
    lastModified: "2026-02-15",
    changeCount7Days: 1,
    releases: [
      { version: "v5.86", changeType: "Description Updated", date: "2026-02-15", author: "Yu", description: "Enhanced business description" }
    ],
    dependencies: [
      { type: "rule", name: "Product Classification", id: "r3", status: "active" },
      { type: "dq", name: "Product Type Validation", id: "dq2", status: "active" },
      { type: "reference", name: "Product Code Table", id: "ref2", status: "active" },
      { type: "reference", name: "Product Hierarchy", id: "ref3", status: "active" },
      { type: "report", name: "Product Portfolio", id: "rep5", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "ProductMaster.ProdType", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Product Mapping Rule", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "ProductDescription", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Product Type Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Product_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Product Portfolio", type: "report", status: "healthy" }
    ],
    tags: ["product", "classification", "lending", "deposit"]
  },
  {
    id: "f3",
    order: "ING-001573",
    entityId: "borrower",
    entityName: "Borrower",
    modelType: "TBSM Ready",
    fieldName: "BorrowerRiskRatingGroup",
    description: "Bucketed risk profile of the borrower",
    businessDescription: "Risk rating classification for borrower creditworthiness assessment. Critical field for credit decision models and regulatory reporting. Used in CCAR/DFAST stress testing.",
    sampleData: "Extremely Low/Normal Risk",
    owner: "IBM",
    steward: "Michael Chen",
    primaryKey: "N",
    dataType: "STRING",
    riskLevel: "high",
    usedInRules: 8,
    usedInDQ: 4,
    usedInRefTables: 1,
    usedInReports: 12,
    nullRate: 5.2,
    dqFailureRate: 3.5,
    lastModified: "2026-02-18",
    changeCount7Days: 5,
    releases: [
      { version: "v5.87", changeType: "Added to DQ", date: "2026-02-18", author: "ginnyzhi", description: "Added comprehensive DQ validation suite" },
      { version: "v5.86", changeType: "Description Updated", date: "2026-02-15", author: "Yu", description: "Added regulatory context to description" },
      { version: "v5.84", changeType: "Type Changed", date: "2026-01-20", author: "kapan08", description: "Changed from INT to STRING for better granularity" }
    ],
    dependencies: [
      { type: "rule", name: "Risk Assessment Rule", id: "r4", status: "active" },
      { type: "rule", name: "Credit Scoring", id: "r5", status: "active" },
      { type: "rule", name: "CCAR Risk Bucketing", id: "r6", status: "active" },
      { type: "dq", name: "Risk Rating Validation", id: "dq3", status: "active" },
      { type: "dq", name: "Risk Rating Range Check", id: "dq4", status: "active" },
      { type: "dq", name: "Null Risk Rating Check", id: "dq5", status: "active" },
      { type: "dq", name: "Rating Consistency Check", id: "dq6", status: "active" },
      { type: "reference", name: "Risk Rating Reference", id: "ref4", status: "active" },
      { type: "report", name: "Risk Dashboard", id: "rep1", status: "active" },
      { type: "report", name: "Credit Risk Analytics", id: "rep6", status: "active" },
      { type: "report", name: "CCAR Stress Test Report", id: "rep7", status: "active" },
      { type: "report", name: "Borrower Risk Profile", id: "rep8", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "BorrowerData.RiskRating", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Risk Bucketing Rule", type: "transformation", status: "warning" },
      { stage: "Catalog Field", name: "BorrowerRiskRatingGroup", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Risk Rating Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Borrower_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Risk Dashboard", type: "report", status: "healthy" }
    ],
    tags: ["risk", "credit", "borrower", "regulatory", "ccar", "critical"]
  },
  {
    id: "f4",
    order: "ING-003505",
    entityId: "risk-metrics",
    entityName: "RiskMetrics",
    modelType: "Model Ready",
    fieldName: "M_CollateralId",
    description: "Agency underlying collateral identifier",
    businessDescription: "Unique identifier for agency-backed collateral (FNMA, FHLMC, GNMA). Primary key for collateral tracking and valuation in mortgage portfolios.",
    sampleData: "FNMA",
    owner: "UNMA",
    steward: "David Lee",
    primaryKey: "Y",
    dataType: "String",
    riskLevel: "high",
    usedInRules: 12,
    usedInDQ: 6,
    usedInRefTables: 3,
    usedInReports: 15,
    nullRate: 1.2,
    dqFailureRate: 2.8,
    lastModified: "2026-02-17",
    changeCount7Days: 3,
    releases: [
      { version: "v5.86", changeType: "Primary Key Added", date: "2026-02-17", author: "Yu", description: "Designated as primary key for collateral tracking" },
      { version: "v5.85", changeType: "Description Updated", date: "2026-02-10", author: "kapan08", description: "Added agency context" }
    ],
    dependencies: [
      { type: "rule", name: "Collateral Validation", id: "r6", status: "active" },
      { type: "dq", name: "Collateral ID Check", id: "dq4", status: "active" },
      { type: "reference", name: "Collateral Reference", id: "ref2", status: "active" },
      { type: "report", name: "Collateral Dashboard", id: "rep9", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "CollateralMaster.AgencyID", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Collateral ID Mapping", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "M_CollateralId", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Collateral ID Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "RiskMetrics_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Collateral Dashboard", type: "report", status: "healthy" }
    ],
    tags: ["collateral", "agency", "primary-key", "mortgage"]
  }
].concat(extendedMockFields as CatalogField[]);

type ViewMode = "table" | "entity" | "graph" | "risk";
type QuickFilter = "all" | "primary-keys" | "high-risk" | "recent" | "used-in-dq" | "unused";

export function DataCatalog() {
  const [viewMode, setViewMode] = useState<ViewMode>("entity");
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(["tbsm"]));
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(mockEntities[0]);
  const [selectedField, setSelectedField] = useState<CatalogField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [impactChangeType, setImpactChangeType] = useState<"type" | "delete" | "modify">("type");
  const [newDataType, setNewDataType] = useState("STRING");

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

  const getLineageStatusIcon = (status: "healthy" | "warning" | "error") => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const applyQuickFilter = (fields: CatalogField[]) => {
    switch (quickFilter) {
      case "primary-keys":
        return fields.filter(f => f.primaryKey === "Y");
      case "high-risk":
        return fields.filter(f => f.riskLevel === "high");
      case "recent":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return fields.filter(f => new Date(f.lastModified) >= sevenDaysAgo);
      case "used-in-dq":
        return fields.filter(f => f.usedInDQ > 0);
      case "unused":
        return fields.filter(f => f.usedInRules === 0 && f.usedInDQ === 0);
      default:
        return fields;
    }
  };

  const filteredFields = applyQuickFilter(
    mockFields.filter(field => {
      const matchesSearch = !searchQuery || 
        field.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.order.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = filterRisk === "all" || field.riskLevel === filterRisk;
      
      const matchesEntity = !selectedEntity || field.entityId === selectedEntity.id;
      
      return matchesSearch && matchesRisk && matchesEntity;
    })
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8faf9' }}>
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
                          <span className="text-sm flex-1"><SensitiveText>{entity.name}</SensitiveText></span>
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
                {selectedField ? (
                  <>Field: <SensitiveText>{selectedField.fieldName}</SensitiveText></>
                ) : selectedEntity ? (
                  <>Entity: <SensitiveText>{selectedEntity.name}</SensitiveText></>
                ) : (
                  "Data Catalog"
                )}
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
              ← Back to <SensitiveText>{selectedEntity?.name}</SensitiveText>
            </Button>

            {/* Section 1: Field Definition */}
            <Card className="bg-white shadow-sm border-0 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Field Definition
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <div className="text-sm font-medium text-foreground mt-1"><SensitiveText>{selectedField.fieldName}</SensitiveText></div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Type</label>
                  <div className="text-sm font-medium text-foreground mt-1 font-mono">{selectedField.dataType}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Owner</label>
                  <div className="text-sm text-foreground mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <SensitiveText>{selectedField.owner}</SensitiveText>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Steward</label>
                  <div className="text-sm text-foreground mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <SensitiveText>{selectedField.steward}</SensitiveText>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sample Value</label>
                  <div className="text-sm text-foreground mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                    <SensitiveText>{selectedField.sampleData}</SensitiveText>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Primary Key</label>
                  <div className="text-sm text-foreground mt-1">
                    {selectedField.primaryKey === "Y" ? (
                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                        <Key className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-muted-foreground">Technical Description</label>
                  <div className="text-sm text-foreground mt-1"><SensitiveText>{selectedField.description}</SensitiveText></div>
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-muted-foreground">Business Description</label>
                  <div className="text-sm text-foreground mt-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <SensitiveText>{selectedField.businessDescription}</SensitiveText>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-xs text-muted-foreground mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedField.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Section 2: Usage Section (Enhanced) */}
            <Card className="bg-white shadow-sm border-0 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Usage Section
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-900">Onboarding Rules</div>
                      <div className="text-xs text-blue-700">Active transformation rules</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-600 text-white border-0 text-base px-3 py-1">
                      {selectedField.usedInRules}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-purple-900">DQ Rules</div>
                      <div className="text-xs text-purple-700">Data quality validations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-600 text-white border-0 text-base px-3 py-1">
                      {selectedField.usedInDQ}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-emerald-900">Reference Tables</div>
                      <div className="text-xs text-emerald-700">Lookup and mapping tables</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-600 text-white border-0 text-base px-3 py-1">
                      {selectedField.usedInRefTables}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-orange-900">Reports</div>
                      <div className="text-xs text-orange-700">Analytical and regulatory reports</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-600 text-white border-0 text-base px-3 py-1">
                      {selectedField.usedInReports}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                  </div>
                </div>

                {/* Detailed Dependencies */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Detailed Dependencies</h4>
                  <div className="space-y-3">
                    {selectedField.dependencies.map((dep, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={
                              dep.type === "rule" ? "border-blue-200 text-blue-700 bg-blue-50" :
                              dep.type === "dq" ? "border-purple-200 text-purple-700 bg-purple-50" :
                              dep.type === "reference" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                              "border-orange-200 text-orange-700 bg-orange-50"
                            }
                          >
                            {dep.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium text-foreground"><SensitiveText>{dep.name}</SensitiveText></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              dep.status === "active" ? "border-green-200 text-green-700 bg-green-50" :
                              dep.status === "deprecated" ? "border-red-200 text-red-700 bg-red-50" :
                              "border-gray-200 text-gray-700 bg-gray-50"
                            }
                          >
                            {dep.status}
                          </Badge>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Lineage View (Enhanced) */}
            <Card className="bg-white shadow-sm border-0 overflow-visible">
              <div className="p-6 pb-4">
                <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Data Lineage Flow
                </h3>
              </div>
              <div className="px-6 pb-6 overflow-x-auto">
                <LineageDAGView lineage={selectedField.lineage} />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Section 4: Release History (Enhanced) */}
              <Card className="bg-white shadow-sm border-0 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Release History
                </h3>
                <div className="space-y-4">
                  {selectedField.releases.map((release, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-semibold text-foreground">{release.version}</div>
                          <Badge 
                            variant="outline" 
                            className={
                              release.changeType.includes("Type") || release.changeType.includes("Primary") ? "border-red-200 text-red-700 bg-red-50" :
                              release.changeType.includes("DQ") ? "border-purple-200 text-purple-700 bg-purple-50" :
                              "border-blue-200 text-blue-700 bg-blue-50"
                            }
                          >
                            {release.changeType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">{release.description}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {release.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <SensitiveText>{release.author}</SensitiveText>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Section 5: Field Health Metrics (Enhanced) */}
              <Card className="bg-white shadow-sm border-0 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Field Health Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Null %</span>
                      <span className="text-sm font-semibold text-foreground">{selectedField.nullRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={cn(
                          "h-2.5 rounded-full",
                          selectedField.nullRate < 5 ? "bg-green-500" :
                          selectedField.nullRate < 10 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${selectedField.nullRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">DQ Fail Rate</span>
                      <span className="text-sm font-semibold text-foreground">{selectedField.dqFailureRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={cn(
                          "h-2.5 rounded-full",
                          selectedField.dqFailureRate < 1 ? "bg-green-500" :
                          selectedField.dqFailureRate < 3 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${selectedField.dqFailureRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">7-Day Change Count</span>
                      <Badge variant="outline" className={cn(
                        selectedField.changeCount7Days > 3 ? "border-red-200 text-red-700 bg-red-50" :
                        selectedField.changeCount7Days > 1 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
                        "border-green-200 text-green-700 bg-green-50"
                      )}>
                        {selectedField.changeCount7Days} changes
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                      <Badge variant="outline" className={getRiskColor(selectedField.riskLevel)}>
                        {getRiskIcon(selectedField.riskLevel)}
                        <span className="ml-1 capitalize">{selectedField.riskLevel}</span>
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last Modified: {selectedField.lastModified}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setImpactChangeType("type");
                  setShowImpactModal(true);
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                Simulate Type Change Impact
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Lineage
              </Button>
              <Button variant="default" className="gap-2 bg-primary hover:bg-primary/90">
                <Eye className="w-4 h-4" />
                View Full Graph
              </Button>
            </div>
          </div>
        ) : (
          /* Entity Fields Table */
          <div className="flex-1 overflow-y-auto p-6">
            {/* Controls - Enhanced with Quick Filters */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Quick Filter:</label>
                <div className="flex gap-2">
                  <Button
                    variant={quickFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={quickFilter === "primary-keys" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("primary-keys")}
                    className="gap-1"
                  >
                    <Key className="w-3 h-3" />
                    Primary Keys
                  </Button>
                  <Button
                    variant={quickFilter === "high-risk" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("high-risk")}
                    className="gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    High Risk
                  </Button>
                  <Button
                    variant={quickFilter === "recent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("recent")}
                    className="gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    Recent
                  </Button>
                  <Button
                    variant={quickFilter === "used-in-dq" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("used-in-dq")}
                    className="gap-1"
                  >
                    <Activity className="w-3 h-3" />
                    Used in DQ
                  </Button>
                  <Button
                    variant={quickFilter === "unused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter("unused")}
                    className="gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    Unused
                  </Button>
                </div>
              </div>
            </div>

            {/* View Mode & Risk Filter */}
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
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Table View
                </Button>
                <Button
                  variant={viewMode === "entity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("entity")}
                  className="gap-2"
                >
                  <Box className="w-4 h-4" />
                  Entity View
                </Button>
                <Button
                  variant={viewMode === "graph" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("graph")}
                  className="gap-2"
                >
                  <Network className="w-4 h-4" />
                  Graph View
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
                        Rules
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        DQ
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        Reports
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        DQ Fail %
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-foreground">
                        7D Changes
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
                              <SensitiveText>{field.fieldName}</SensitiveText>
                            </span>
                            {field.primaryKey === "Y" && (
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                <Key className="w-3 h-3 mr-1" />
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
                          <Badge className="bg-orange-600 text-white border-0">{field.usedInReports}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "text-sm font-medium",
                            field.dqFailureRate < 1 ? "text-green-600" :
                            field.dqFailureRate < 3 ? "text-yellow-600" :
                            "text-red-600"
                          )}>
                            {field.dqFailureRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            field.changeCount7Days > 3 ? "border-red-200 text-red-700 bg-red-50" :
                            field.changeCount7Days > 1 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
                            "border-green-200 text-green-700 bg-green-50"
                          )}>
                            {field.changeCount7Days}
                          </Badge>
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

      {/* Impact Analysis Modal (Enhanced) */}
      {showImpactModal && selectedField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Impact Simulation</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing changes to <span className="font-mono text-foreground"><SensitiveText>{selectedField.fieldName}</SensitiveText></span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImpactModal(false)}
                className="hover:bg-gray-100 p-2 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Change Simulation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Proposed Change
                </h4>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">DataType Change:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{selectedField.dataType}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono bg-red-50 border-red-200 text-red-700">
                        STRING
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Impact */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                  <FileWarning className="w-4 h-4" />
                  This field is used in:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <span className="text-sm text-yellow-900">Onboarding Rules</span>
                    <Badge className="bg-blue-600 text-white">{selectedField.usedInRules}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <span className="text-sm text-yellow-900">DQ Validations</span>
                    <Badge className="bg-purple-600 text-white">{selectedField.usedInDQ}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <span className="text-sm text-yellow-900">Reference Tables</span>
                    <Badge className="bg-emerald-600 text-white">{selectedField.usedInRefTables}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <span className="text-sm text-yellow-900">Reports</span>
                    <Badge className="bg-orange-600 text-white">{selectedField.usedInReports}</Badge>
                  </div>
                </div>
              </div>

              {/* Breaking Changes */}
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Potential Breaking Changes
                </h4>
                <div className="space-y-3">
                  <div className="text-sm text-red-800 font-medium mb-2">
                    Changing type from {selectedField.dataType} → STRING may break:
                  </div>
                  <div className="space-y-2">
                    {selectedField.dependencies
                      .filter(d => d.type === "rule" || d.type === "dq")
                      .slice(0, 4)
                      .map((dep, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded border border-red-200">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-red-900">
                              {dep.type === "rule" ? "Rule" : "DQ"}: <SensitiveText>{dep.name}</SensitiveText>
                            </div>
                            <div className="text-xs text-red-700 mt-1">
                              Type mismatch in validation logic - requires update
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Impacted Downstream */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Downstream Impact Summary
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-xs text-muted-foreground mb-1">Total Dependencies</div>
                    <div className="text-2xl font-bold text-orange-900">{selectedField.dependencies.length}</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-xs text-muted-foreground mb-1">Critical Impact</div>
                    <div className="text-2xl font-bold text-red-600">
                      {selectedField.dependencies.filter(d => d.type === "rule" || d.type === "dq").length}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-xs text-muted-foreground mb-1">Reports Affected</div>
                    <div className="text-2xl font-bold text-orange-900">{selectedField.usedInReports}</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
                    <Badge className="bg-red-600 text-white text-sm px-3 py-1">HIGH</Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowImpactModal(false)} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <GitBranch className="w-4 h-4" />
                  View Full Dependency Graph
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4" />
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
