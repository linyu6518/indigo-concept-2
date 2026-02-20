import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DocumentDashboard } from "./DocumentDashboard";
import { Analytics } from "./Analytics";
import { Onboarding as OnboardingPage } from "./Onboarding";
import { DataCatalog as DataCatalogPage } from "./DataCatalog";
import { ReferenceTable as ReferenceTablePage } from "./ReferenceTable";
import { DataQualityAssessment as DataQualityPage } from "./DataQualityAssessment";
import { ChangesetPage } from "./ChangesetPage";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const PromotionManager = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Promotion Manager</h1>
    <p className="text-muted-foreground">Manage promotions...</p>
  </div>
);

const RuleValidator = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Rule Validator</h1>
    <p className="text-muted-foreground">Validate rules...</p>
  </div>
);

const QueryEngine = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Query Engine</h1>
    <p className="text-muted-foreground">Query data...</p>
  </div>
);

const ManageFeeds = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Manage Feeds</h1>
    <p className="text-muted-foreground">Feed management...</p>
  </div>
);

const ManageUsers = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Manage Users</h1>
    <p className="text-muted-foreground">User management...</p>
  </div>
);

const ReleaseVersion = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Release Version</h1>
    <p className="text-muted-foreground">Version control...</p>
  </div>
);

const ClearCache = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Clear Cache</h1>
    <p className="text-muted-foreground">Clear system cache...</p>
  </div>
);

const Backup = () => (
  <div className="p-6">
    <h1 className="text-3xl mb-4">Backup</h1>
    <p className="text-muted-foreground">System backup...</p>
  </div>
);

export function Layout() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DocumentDashboard />;
      case "reference-table":
        return <ReferenceTablePage />;
      case "data-catalog":
        return <DataCatalogPage />;
      case "onboarding":
        return <OnboardingPage />;
      case "data-quality":
        return <DataQualityPage />;
      case "promotion-manager":
        return <PromotionManager />;
      case "rule-validator":
        return <RuleValidator />;
      case "query-engine":
        return <QueryEngine />;
      case "manage-feeds":
        return <ManageFeeds />;
      case "manage-users":
        return <ManageUsers />;
      case "release-version":
        return <ReleaseVersion />;
      case "clear-cache":
        return <ClearCache />;
      case "import-export":
        return <ChangesetPage />;
      case "backup":
        return <Backup />;
      case "analytics":
        return <Analytics />;
      default:
        return <DocumentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-shrink-0">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}