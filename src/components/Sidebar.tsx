import { useState } from "react";
import { cn } from "./ui/utils";
import logoPlaceholder from "../assets/logo-placeholder.svg";
import { SensitiveText, sensitiveAvatarBlurClass } from "./SensitiveText";
import { 
  LayoutDashboard,
  Table,
  Database,
  UserCheck,
  FlaskConical,
  Megaphone,
  Clock,
  Search,
  List,
  Users,
  Tag,
  RefreshCw,
  ArrowUpDown,
  Archive,
  FolderKanban,
  ChevronDown,
  Wrench,
  Shield
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGovernanceExpanded, setIsGovernanceExpanded] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isAdministrationExpanded, setIsAdministrationExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleNavigationClick = (pageId: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Delay the page change to allow expansion animation
      setTimeout(() => onNavigate(pageId), 150);
    } else {
      onNavigate(pageId);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsExpanded(false);
  };
  
  const mainNavigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and statistics"
    },
    {
      id: "onboarding",
      name: "Onboarding",
      icon: UserCheck,
      description: "Maintain the feed Value Expressions for each Feed"
    },
    {
      id: "data-catalog",
      name: "Data Catalog", 
      icon: Database,
      description: "Maintain Data Catalog for all feeds"
    },
    {
      id: "reference-table",
      name: "Reference Table",
      icon: Table,
      description: "Manage reference tables"
    },
    {
      id: "data-quality",
      name: "Data Quality Assessment",
      icon: FlaskConical,
      description: "Maintain the feed Rule Expressions for defining Data..."
    }
  ];

  const governanceItems = [
    { id: "import-export", name: "Changesets", icon: ArrowUpDown, description: "Import and export" },
    { id: "promotion-manager", name: "Promotion Pipeline", icon: Megaphone, description: "Manage promotions" },
    { id: "release-version", name: "Release Management", icon: Tag, description: "Version control" }
  ];

  const toolsItems = [
    { id: "rule-validator", name: "Rule Validator", icon: Clock, description: "Validate rules" },
    { id: "query-engine", name: "Query Engine", icon: Search, description: "Query data" },
    { id: "manage-feeds", name: "Manage Feeds", icon: List, description: "Feed management" }
  ];

  const administrationItems = [
    { id: "manage-users", name: "Manage Users", icon: Users, description: "User management" },
    { id: "import-export", name: "Import / Export", icon: ArrowUpDown, description: "Import and export" },
    { id: "clear-cache", name: "Cache", icon: RefreshCw, description: "Clear system cache" },
    { id: "backup", name: "Backup", icon: Archive, description: "System backup" }
  ];

  const renderSection = (
    sectionId: string,
    sectionTitle: string,
    sectionDescription: string,
    SectionIcon: React.ComponentType<{ className?: string }>,
    isSectionExpanded: boolean,
    setSectionExpanded: (v: boolean) => void,
    items: Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }>; description: string }>
  ) => (
    <div key={sectionId} className="mt-4 first:mt-0">
      <div className="mb-3 flex-shrink-0 px-4" aria-hidden>
        <div className="w-full" style={{ height: 1, background: 'rgba(0,0,0,0.2)' }} />
      </div>
      <button
        className={cn(
          "transition-all duration-300 flex items-center relative overflow-hidden w-full",
          "hover:scale-110",
          isExpanded ? "w-full px-4 py-3 justify-start rounded-xl min-h-[2.75rem]" : "w-12 h-12 justify-center mx-auto rounded-full",
          isSectionExpanded
            ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/30 scale-105"
            : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
        )}
        onClick={() => setSectionExpanded(!isSectionExpanded)}
      >
        <SectionIcon className={cn(
          "transition-colors duration-300 flex-shrink-0 w-5 h-5",
          isSectionExpanded ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
        )} />
        {isExpanded && (
          <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center items-start text-left">
            <div className={cn(
              "font-medium text-sm whitespace-nowrap transition-colors duration-300",
              isSectionExpanded ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
            )}>
              {sectionTitle}
            </div>
            <div className={cn(
              "text-xs mt-0.5 whitespace-nowrap transition-colors duration-300",
              isSectionExpanded ? "text-sidebar-primary-foreground" : "text-white opacity-50 group-hover:text-sidebar-primary-foreground group-hover:opacity-100"
            )}>
              {sectionDescription}
            </div>
          </div>
        )}
        {isSectionExpanded && !isExpanded && (
          <>
            <div className="absolute inset-0 rounded-full bg-sidebar-primary opacity-20 animate-pulse" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-l-full" />
          </>
        )}
        {isSectionExpanded && isExpanded && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
        )}
      </button>
      {isSectionExpanded && (
        <div className="mt-2 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavigationClick(item.id)}
                  className={cn(
                    "transition-all duration-300 flex items-center relative overflow-hidden w-full",
                    "hover:scale-110",
                    isExpanded ? "w-full px-4 py-3 justify-start rounded-xl min-h-[2.75rem]" : "w-12 h-12 justify-center mx-auto rounded-full",
                    isActive
                      ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/30 scale-105"
                      : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
                  )}
                >
                  <Icon className={cn(
                    "transition-colors duration-300 flex-shrink-0 w-5 h-5",
                    isActive ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                  )} />
                  {isExpanded && (
                    <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center">
                      <div className={cn(
                        "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                        isActive ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                      )}>
                        {item.name}
                      </div>
                    </div>
                  )}
                  {isActive && !isExpanded && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-sidebar-primary opacity-20 animate-pulse" />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-l-full" />
                    </>
                  )}
                  {isActive && isExpanded && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
                  )}
                </button>
                {!isExpanded && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="ml-6 my-6">
      <div 
        className={cn(
          "flex flex-col h-[calc(100vh-3rem)] transition-all duration-300 ease-in-out rounded-3xl",
          "bg-gradient-to-b from-sidebar via-sidebar to-sidebar-accent shadow-2xl border border-sidebar-border/20 overflow-hidden",
          isExpanded ? "w-64" : "w-20"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header with placeholder logo */}
        <div className={cn(
          "p-4 flex flex-row items-center justify-start relative",
          isExpanded && "gap-3"
        )}>
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center shadow-lg overflow-hidden bg-white/10 border border-sidebar-border/30">
            <img
              src={logoPlaceholder}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          {isExpanded && (
            <div className="flex flex-col items-start min-w-0">
              <h2 className="text-sidebar-foreground font-semibold text-base whitespace-nowrap">
                TBSM Indigo
              </h2>
              <p className="text-sidebar-foreground/70 text-xs whitespace-nowrap mt-0.5">
                Document Management
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavigationClick(item.id)}
                    className={cn(
                      "transition-all duration-300 flex items-center relative overflow-hidden",
                      "hover:scale-110",
                      isExpanded 
                        ? "w-full px-4 py-3 justify-start rounded-xl min-h-[2.75rem]" 
                        : "w-12 h-12 justify-center mx-auto rounded-full",
                      isActive
                        ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/30 scale-105"
                        : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
                    )}
                  >
                    <Icon className={cn(
                      "transition-colors duration-300 flex-shrink-0",
                      "w-5 h-5",
                      isActive 
                        ? "text-sidebar-primary-foreground" 
                        : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                    )} />
                    
                    {isExpanded && (
                      <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center items-start text-left">
                        <div className={cn(
                          "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                          isActive 
                            ? "text-sidebar-primary-foreground" 
                            : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                        )}>
                          {item.name}
                        </div>
                        {item.id === "dashboard" && (
                          <div className={cn(
                            "text-xs mt-0.5 whitespace-nowrap transition-colors duration-300",
                            isActive ? "text-sidebar-primary-foreground" : "text-white opacity-50 group-hover:text-sidebar-primary-foreground group-hover:opacity-100"
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Active indicator */}
                    {isActive && !isExpanded && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-sidebar-primary opacity-20 animate-pulse" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-l-full" />
                      </>
                    )}
                    
                    {/* Active indicator for expanded state */}
                    {isActive && isExpanded && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                      <div className="font-medium text-sm">{item.name}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {renderSection(
            "governance",
            "Governance",
            "Changesets, promotion, release",
            FolderKanban,
            isGovernanceExpanded,
            setIsGovernanceExpanded,
            governanceItems
          )}
          {renderSection(
            "tools",
            "Tools",
            "Validator, query, feeds",
            Wrench,
            isToolsExpanded,
            setIsToolsExpanded,
            toolsItems
          )}
          {renderSection(
            "administration",
            "Administration",
            "Users, import, cache, backup",
            Shield,
            isAdministrationExpanded,
            setIsAdministrationExpanded,
            administrationItems
          )}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 flex justify-center">
          <div className="relative group">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className={`text-sidebar-primary-foreground font-semibold text-lg ${sensitiveAvatarBlurClass}`}>YL</span>
            </div>
            
            {/* Profile tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                <div className="font-medium text-sm"><SensitiveText>Yu</SensitiveText></div>
                <div className="text-xs opacity-75 mt-1">Admin</div>
                {/* Tooltip arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
              </div>
            )}
            
            {/* Profile info for expanded state */}
            {isExpanded && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-center">
                <div className="text-sidebar-foreground font-medium text-sm whitespace-nowrap">
                  <SensitiveText>Yu</SensitiveText>
                </div>
                <div className="text-sidebar-foreground/70 text-xs whitespace-nowrap">
                  Admin
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}