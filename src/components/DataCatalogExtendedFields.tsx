// Extended Mock Fields for Data Catalog
// This file contains additional field definitions to make the catalog more realistic

export const extendedMockFields = [
  // Position Entity - Additional Fields
  {
    id: "f5",
    order: "ING-001263",
    entityId: "position",
    entityName: "Position",
    modelType: "TBSM Ready",
    fieldName: "CurrentNotionalAdjustment",
    description: "Converts the notional to negative if sold",
    businessDescription: "Adjustment factor for position notional values based on buy/sell direction. Critical for accurate position valuation and P&L calculation.",
    sampleData: "-554903.72",
    owner: "IBM",
    steward: "John Smith",
    primaryKey: "N",
    dataType: "DECIMAL",
    riskLevel: "medium",
    usedInRules: 4,
    usedInDQ: 3,
    usedInRefTables: 1,
    usedInReports: 6,
    nullRate: 1.2,
    dqFailureRate: 1.5,
    lastModified: "2026-02-16",
    changeCount7Days: 1,
    releases: [
      { version: "v5.87", changeType: "Description Updated", date: "2026-02-16", author: "kapan08", description: "Enhanced business context" }
    ],
    dependencies: [
      { type: "rule", name: "Notional Adjustment Rule", id: "r7", status: "active" },
      { type: "dq", name: "Notional Range Check", id: "dq7", status: "active" },
      { type: "report", name: "Position Valuation", id: "rep10", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "Position.NotionalAdj", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Notional Calculation", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "CurrentNotionalAdjustment", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Range Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Position_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Position Valuation", type: "report", status: "healthy" }
    ],
    tags: ["notional", "valuation", "p&l", "trading"]
  },

  // Borrower Entity - Additional Fields
  {
    id: "f6",
    order: "ING-001574",
    entityId: "borrower",
    entityName: "Borrower",
    modelType: "TBSM Ready",
    fieldName: "S-CustomerId",
    description: "Name of the customer, with a space at the beginning",
    businessDescription: "Primary customer identifier with legacy formatting. Used across all customer-facing systems and regulatory reporting. Requires special handling for leading space.",
    sampleData: " TD-12345",
    owner: "IBM",
    steward: "Michael Chen",
    primaryKey: "Y",
    dataType: "STRING",
    riskLevel: "high",
    usedInRules: 15,
    usedInDQ: 8,
    usedInRefTables: 5,
    usedInReports: 25,
    nullRate: 0.1,
    dqFailureRate: 0.5,
    lastModified: "2026-02-19",
    changeCount7Days: 8,
    releases: [
      { version: "v5.88", changeType: "Primary Key Added", date: "2026-02-19", author: "Yu", description: "Designated as primary key for customer entity" },
      { version: "v5.87", changeType: "DQ Enhanced", date: "2026-02-15", author: "ginnyzhi", description: "Added leading space validation" },
      { version: "v5.85", changeType: "Type Changed", date: "2026-01-10", author: "kapan08", description: "Changed from VARCHAR to STRING for consistency" }
    ],
    dependencies: [
      { type: "rule", name: "Customer ID Formatting", id: "r8", status: "active" },
      { type: "rule", name: "Customer Master Join", id: "r9", status: "active" },
      { type: "dq", name: "Customer ID Format Check", id: "dq8", status: "active" },
      { type: "dq", name: "Leading Space Validation", id: "dq9", status: "active" },
      { type: "reference", name: "Customer Reference", id: "ref5", status: "active" },
      { type: "report", name: "Customer Portfolio", id: "rep11", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "CustomerMaster.CustID", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Customer ID Formatting", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "S-CustomerId", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Format Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Borrower_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Customer Reports", type: "report", status: "healthy" }
    ],
    tags: ["customer", "primary-key", "identifier", "critical", "legacy"]
  },

  // LifeLine Entity Fields
  {
    id: "f7",
    order: "ING-002127",
    entityId: "lifeline",
    entityName: "LifeLine",
    modelType: "TBSM Ready",
    fieldName: "SOPLifeIssue",
    description: "Y/N flag to denote if a product is SOP qualified",
    businessDescription: "Standard Operating Procedure (SOP) qualification indicator for loan products. Determines eligibility for streamlined processing and automated underwriting.",
    sampleData: "Y",
    owner: "IBM",
    steward: "Emily Rodriguez",
    primaryKey: "N",
    dataType: "STRING",
    riskLevel: "low",
    usedInRules: 6,
    usedInDQ: 2,
    usedInRefTables: 1,
    usedInReports: 4,
    nullRate: 0.3,
    dqFailureRate: 0.1,
    lastModified: "2026-02-11",
    changeCount7Days: 0,
    releases: [
      { version: "v5.86", changeType: "Description Updated", date: "2026-02-11", author: "Yu", description: "Added SOP qualification context" }
    ],
    dependencies: [
      { type: "rule", name: "SOP Qualification Rule", id: "r10", status: "active" },
      { type: "dq", name: "Y/N Validation", id: "dq10", status: "active" },
      { type: "report", name: "SOP Product Report", id: "rep12", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "ProductSetup.SOPFlag", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "SOP Flag Mapping", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "SOPLifeIssue", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Flag Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "LifeLine_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "SOP Reports", type: "report", status: "healthy" }
    ],
    tags: ["sop", "qualification", "loan", "flag"]
  },

  // AuditDate Entity Fields
  {
    id: "f8",
    order: "ING-002531",
    entityId: "audit-date",
    entityName: "AuditDate",
    modelType: "TBSM Ready",
    fieldName: "AuditDate",
    description: "Use TRUNCSystem Date (RTL)",
    businessDescription: "System audit timestamp for regulatory compliance and data lineage tracking. Truncated to date only for consistency across batch processes.",
    sampleData: "01/01/2020",
    owner: "IBM",
    steward: "David Park",
    primaryKey: "N",
    dataType: "DATE",
    riskLevel: "low",
    usedInRules: 3,
    usedInDQ: 1,
    usedInRefTables: 0,
    usedInReports: 8,
    nullRate: 0.0,
    dqFailureRate: 0.0,
    lastModified: "2026-02-08",
    changeCount7Days: 0,
    releases: [
      { version: "v5.85", changeType: "Type Changed", date: "2026-02-08", author: "kapan08", description: "Changed from DATETIME to DATE" }
    ],
    dependencies: [
      { type: "rule", name: "Date Truncation Rule", id: "r11", status: "active" },
      { type: "dq", name: "Date Format Check", id: "dq11", status: "active" },
      { type: "report", name: "Audit Trail Report", id: "rep13", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "System.CurrentDate", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Date Truncation", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "AuditDate", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Date Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "AuditDate_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Audit Reports", type: "report", status: "healthy" }
    ],
    tags: ["audit", "compliance", "timestamp", "system"]
  },

  // MtaFirstCap Entity Fields
  {
    id: "f9",
    order: "ING-003218",
    entityId: "mta-first-cap",
    entityName: "MtaFirstCap",
    modelType: "TBSM Ready",
    fieldName: "MinimumFirstCap",
    description: "The maximum amount generated per transaction",
    businessDescription: "Maximum transaction amount cap for initial payment processing. Used in payment validation and fraud detection systems.",
    sampleData: "5",
    owner: "IBM",
    steward: "Lisa Wang",
    primaryKey: "N",
    dataType: "decimal",
    riskLevel: "medium",
    usedInRules: 5,
    usedInDQ: 3,
    usedInRefTables: 2,
    usedInReports: 3,
    nullRate: 1.5,
    dqFailureRate: 0.8,
    lastModified: "2026-02-14",
    changeCount7Days: 2,
    releases: [
      { version: "v5.87", changeType: "Description Updated", date: "2026-02-14", author: "Yu", description: "Clarified usage in fraud detection" },
      { version: "v5.86", changeType: "DQ Added", date: "2026-02-10", author: "ginnyzhi", description: "Added range validation" }
    ],
    dependencies: [
      { type: "rule", name: "Transaction Cap Rule", id: "r12", status: "active" },
      { type: "dq", name: "Cap Range Validation", id: "dq12", status: "active" },
      { type: "reference", name: "Transaction Limits", id: "ref6", status: "active" },
      { type: "report", name: "Transaction Monitoring", id: "rep14", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "TransactionRules.FirstCap", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Cap Calculation", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "MinimumFirstCap", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Range Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "MtaFirstCap_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Transaction Reports", type: "report", status: "healthy" }
    ],
    tags: ["transaction", "cap", "limit", "fraud-detection"]
  },

  // Mortgage Entity Fields
  {
    id: "f10",
    order: "ING-003306",
    entityId: "mortgage",
    entityName: "MortgageInformation",
    modelType: "TBSM Ready",
    fieldName: "MortgageRegionFromNumber",
    description: "Is a unique number assigned to each mortgage property",
    businessDescription: "Geographic region identifier derived from mortgage property number. Used for regional risk analysis, portfolio segmentation, and regulatory reporting by jurisdiction.",
    sampleData: "1234",
    owner: "IBM",
    steward: "Robert Martinez",
    primaryKey: "N",
    dataType: "INT64",
    riskLevel: "high",
    usedInRules: 10,
    usedInDQ: 5,
    usedInRefTables: 3,
    usedInReports: 15,
    nullRate: 2.1,
    dqFailureRate: 1.8,
    lastModified: "2026-02-19",
    changeCount7Days: 4,
    releases: [
      { version: "v5.88", changeType: "DQ Enhanced", date: "2026-02-19", author: "ginnyzhi", description: "Added region code validation" },
      { version: "v5.87", changeType: "Description Updated", date: "2026-02-15", author: "Yu", description: "Added regulatory context" }
    ],
    dependencies: [
      { type: "rule", name: "Region Extraction Rule", id: "r13", status: "active" },
      { type: "rule", name: "Geographic Mapping", id: "r14", status: "active" },
      { type: "dq", name: "Region Code Validation", id: "dq13", status: "active" },
      { type: "dq", name: "Null Check", id: "dq14", status: "active" },
      { type: "reference", name: "Region Reference", id: "ref7", status: "active" },
      { type: "report", name: "Regional Risk Report", id: "rep15", status: "active" },
      { type: "report", name: "Mortgage Portfolio", id: "rep16", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "MortgageData.PropertyNum", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Region Extraction", type: "transformation", status: "warning" },
      { stage: "Catalog Field", name: "MortgageRegionFromNumber", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Region Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Mortgage_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Regional Reports", type: "report", status: "healthy" }
    ],
    tags: ["mortgage", "region", "geographic", "regulatory", "critical"]
  },

  // Collateral Entity Fields (Model Ready)
  {
    id: "f11",
    order: "ING-003507",
    entityId: "collateral",
    entityName: "Collateral",
    modelType: "Model Ready",
    fieldName: "M_CollateralId",
    description: "Agency underlying collateral identifier",
    businessDescription: "Unique identifier for agency-backed collateral (FNMA, FHLMC, GNMA). Primary key for collateral tracking and valuation in mortgage portfolios. Critical for MBS pricing and risk models.",
    sampleData: "FNMA",
    owner: "UNMA",
    steward: "Jennifer Liu",
    primaryKey: "Y",
    dataType: "String",
    riskLevel: "high",
    usedInRules: 12,
    usedInDQ: 6,
    usedInRefTables: 3,
    usedInReports: 18,
    nullRate: 0.5,
    dqFailureRate: 1.2,
    lastModified: "2026-02-20",
    changeCount7Days: 6,
    releases: [
      { version: "v5.88", changeType: "Primary Key Added", date: "2026-02-20", author: "Yu", description: "Designated as primary key" },
      { version: "v5.87", changeType: "DQ Enhanced", date: "2026-02-18", author: "ginnyzhi", description: "Added agency code validation" }
    ],
    dependencies: [
      { type: "rule", name: "Collateral ID Validation", id: "r15", status: "active" },
      { type: "rule", name: "Agency Code Mapping", id: "r16", status: "active" },
      { type: "dq", name: "Agency Code Check", id: "dq15", status: "active" },
      { type: "dq", name: "Uniqueness Check", id: "dq16", status: "active" },
      { type: "reference", name: "Agency Reference", id: "ref8", status: "active" },
      { type: "report", name: "Collateral Valuation", id: "rep17", status: "active" },
      { type: "report", name: "MBS Portfolio", id: "rep18", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "CollateralMaster.AgencyID", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Agency Code Transform", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "M_CollateralId", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Agency Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Collateral_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Collateral Reports", type: "report", status: "healthy" }
    ],
    tags: ["collateral", "agency", "primary-key", "mbs", "critical"]
  },

  // Loan Commitment Entity Fields
  {
    id: "f12",
    order: "ING-003444",
    entityId: "loan-commitment",
    entityName: "LoanCommitment",
    modelType: "Model Ready",
    fieldName: "LoanCommitmentNotional",
    description: "The notional amount on notional on outstanding undrawn commitments",
    businessDescription: "Total notional value of unfunded loan commitments. Key metric for liquidity planning, credit risk assessment, and regulatory capital calculations under Basel III.",
    sampleData: "5000000000.0000000-0000000",
    owner: "UNMA",
    steward: "Thomas Anderson",
    primaryKey: "N",
    dataType: "DECIMAL",
    riskLevel: "high",
    usedInRules: 15,
    usedInDQ: 8,
    usedInRefTables: 2,
    usedInReports: 22,
    nullRate: 0.8,
    dqFailureRate: 2.5,
    lastModified: "2026-02-13",
    changeCount7Days: 7,
    releases: [
      { version: "v5.87", changeType: "DQ Enhanced", date: "2026-02-13", author: "ginnyzhi", description: "Added Basel III validation rules" },
      { version: "v5.86", changeType: "Description Updated", date: "2026-02-10", author: "Yu", description: "Added regulatory context" },
      { version: "v5.85", changeType: "Type Modified", date: "2026-02-01", author: "kapan08", description: "Increased precision for large amounts" }
    ],
    dependencies: [
      { type: "rule", name: "Commitment Aggregation", id: "r17", status: "active" },
      { type: "rule", name: "Liquidity Calculation", id: "r18", status: "active" },
      { type: "rule", name: "Basel III Calc", id: "r19", status: "active" },
      { type: "dq", name: "Amount Range Check", id: "dq17", status: "active" },
      { type: "dq", name: "Precision Validation", id: "dq18", status: "active" },
      { type: "dq", name: "Null Check", id: "dq19", status: "active" },
      { type: "reference", name: "Commitment Reference", id: "ref9", status: "active" },
      { type: "report", name: "Liquidity Report", id: "rep19", status: "active" },
      { type: "report", name: "Basel III Report", id: "rep20", status: "active" },
      { type: "report", name: "Credit Risk Dashboard", id: "rep21", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "LoanData.CommitmentAmt", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Commitment Aggregation", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "LoanCommitmentNotional", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Amount Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "LoanCommitment_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Regulatory Reports", type: "report", status: "healthy" }
    ],
    tags: ["loan", "commitment", "notional", "basel3", "regulatory", "critical"]
  },

  // Additional Position Fields
  {
    id: "f13",
    order: "ING-002778",
    entityId: "position",
    entityName: "Position",
    modelType: "TBSM Ready",
    fieldName: "LockedInBusinessDays",
    description: "The number of business days a position is locked",
    businessDescription: "Duration in business days that a trading position is locked and cannot be modified. Used for settlement timing, operational risk management, and trade lifecycle tracking.",
    sampleData: "5",
    owner: "IBM",
    steward: "John Smith",
    primaryKey: "N",
    dataType: "Varchar",
    riskLevel: "low",
    usedInRules: 3,
    usedInDQ: 1,
    usedInRefTables: 1,
    usedInReports: 4,
    nullRate: 3.2,
    dqFailureRate: 0.5,
    lastModified: "2026-02-17",
    changeCount7Days: 1,
    releases: [
      { version: "v5.87", changeType: "Description Updated", date: "2026-02-17", author: "Yu", description: "Added operational risk context" }
    ],
    dependencies: [
      { type: "rule", name: "Lock Duration Rule", id: "r20", status: "active" },
      { type: "dq", name: "Business Day Check", id: "dq20", status: "active" },
      { type: "report", name: "Trade Lifecycle Report", id: "rep22", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "TradeData.LockDays", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Business Day Calc", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "LockedInBusinessDays", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Day Count Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Position_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Trade Reports", type: "report", status: "healthy" }
    ],
    tags: ["trading", "settlement", "lock", "operational"]
  },

  // Capital Entity Fields
  {
    id: "f14",
    order: "ING-005",
    entityId: "capital",
    entityName: "Capital",
    modelType: "Model Ready",
    fieldName: "M_CollateralID",
    description: "Agency underlying collateral identifier",
    businessDescription: "Cross-reference to collateral entity for capital adequacy calculations. Links capital requirements to underlying collateral quality and agency backing for regulatory capital modeling.",
    sampleData: "FHLMC",
    owner: "UNMA",
    steward: "Patricia Wong",
    primaryKey: "N",
    dataType: "String",
    riskLevel: "high",
    usedInRules: 18,
    usedInDQ: 10,
    usedInRefTables: 4,
    usedInReports: 20,
    nullRate: 1.1,
    dqFailureRate: 2.2,
    lastModified: "2026-02-16",
    changeCount7Days: 5,
    releases: [
      { version: "v5.87", changeType: "DQ Enhanced", date: "2026-02-16", author: "ginnyzhi", description: "Added cross-reference validation" },
      { version: "v5.86", changeType: "Description Updated", date: "2026-02-12", author: "Yu", description: "Added capital modeling context" }
    ],
    dependencies: [
      { type: "rule", name: "Capital Allocation Rule", id: "r21", status: "active" },
      { type: "rule", name: "Collateral Quality Check", id: "r22", status: "active" },
      { type: "rule", name: "Agency Risk Weight", id: "r23", status: "active" },
      { type: "dq", name: "Collateral ID Lookup", id: "dq21", status: "active" },
      { type: "dq", name: "Agency Code Validation", id: "dq22", status: "active" },
      { type: "reference", name: "Collateral Master", id: "ref10", status: "active" },
      { type: "reference", name: "Agency Risk Weights", id: "ref11", status: "active" },
      { type: "report", name: "Capital Adequacy Report", id: "rep23", status: "active" },
      { type: "report", name: "Risk-Weighted Assets", id: "rep24", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "CapitalData.CollateralRef", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Collateral Lookup", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "M_CollateralID", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Reference Check", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Capital_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Capital Reports", type: "report", status: "healthy" }
    ],
    tags: ["capital", "collateral", "regulatory", "risk-weight", "critical"]
  },

  // Product Entity Additional Fields
  {
    id: "f15",
    order: "ING-001173",
    entityId: "product",
    entityName: "Product",
    modelType: "TBSM Ready",
    fieldName: "LifeRate",
    description: "The minimum rate to be charged",
    businessDescription: "Minimum interest rate floor for life of loan products. Critical for pricing models, margin analysis, and interest rate risk management in the loan portfolio.",
    sampleData: "0",
    owner: "IBM",
    steward: "Sarah Johnson",
    primaryKey: "N",
    dataType: "Numeric 16,3",
    riskLevel: "medium",
    usedInRules: 8,
    usedInDQ: 4,
    usedInRefTables: 2,
    usedInReports: 10,
    nullRate: 1.8,
    dqFailureRate: 1.0,
    lastModified: "2026-02-10",
    changeCount7Days: 2,
    releases: [
      { version: "v5.86", changeType: "Type Modified", date: "2026-02-10", author: "kapan08", description: "Adjusted precision for rate calculations" },
      { version: "v5.85", changeType: "Description Updated", date: "2026-01-25", author: "Yu", description: "Added pricing context" }
    ],
    dependencies: [
      { type: "rule", name: "Rate Floor Rule", id: "r24", status: "active" },
      { type: "rule", name: "Pricing Calculation", id: "r25", status: "active" },
      { type: "dq", name: "Rate Range Check", id: "dq23", status: "active" },
      { type: "dq", name: "Precision Validation", id: "dq24", status: "active" },
      { type: "reference", name: "Rate Reference", id: "ref12", status: "active" },
      { type: "report", name: "Pricing Report", id: "rep25", status: "active" },
      { type: "report", name: "Interest Rate Risk", id: "rep26", status: "active" }
    ],
    lineage: [
      { stage: "Source Database", name: "ProductSetup.MinRate", type: "source", status: "healthy" },
      { stage: "Onboarding Transform", name: "Rate Conversion", type: "transformation", status: "healthy" },
      { stage: "Catalog Field", name: "LifeRate", type: "catalog", status: "healthy" },
      { stage: "DQ Validation", name: "Rate Validation", type: "dq", status: "healthy" },
      { stage: "Output Table", name: "Product_Final", type: "output", status: "healthy" },
      { stage: "Report Layer", name: "Pricing Reports", type: "report", status: "healthy" }
    ],
    tags: ["rate", "pricing", "interest", "floor", "risk-management"]
  }
];

export default extendedMockFields;
