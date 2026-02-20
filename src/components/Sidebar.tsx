import { useState } from "react";
import { cn } from "./ui/utils";
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
  Settings,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
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

  const configurationItems = [
    {
      id: "promotion-manager",
      name: "Promotion Manager",
      icon: Megaphone,
      description: "Manage promotions"
    },
    {
      id: "rule-validator",
      name: "Rule Validator",
      icon: Clock,
      description: "Validate rules"
    },
    {
      id: "query-engine",
      name: "Query Engine",
      icon: Search,
      description: "Query data"
    },
    {
      id: "manage-feeds",
      name: "Manage Feeds",
      icon: List,
      description: "Feed management"
    },
    {
      id: "manage-users",
      name: "Manage Users",
      icon: Users,
      description: "User management"
    },
    {
      id: "release-version",
      name: "Release Version",
      icon: Tag,
      description: "Version control"
    },
    {
      id: "clear-cache",
      name: "Clear Cache",
      icon: RefreshCw,
      description: "Clear system cache"
    },
    {
      id: "import-export",
      name: "Import/Export Changesets",
      icon: ArrowUpDown,
      description: "Import and export"
    },
    {
      id: "backup",
      name: "Backup",
      icon: Archive,
      description: "System backup"
    }
  ];

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
        {/* Header with Logo */}
        <div className={cn(
          "p-4 flex flex-row items-center justify-start relative",
          isExpanded && "gap-3"
        )}>
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 358" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_13001_2)">
                <path d="M0 357.728H400V-1.33514e-05H0V357.728Z" fill="#54B948"/>
                <mask id="mask0_13001_2" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="358">
                  <path d="M0 357.728H400V-1.33514e-05H0V357.728Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_13001_2)">
                  <path d="M262.603 280.342H169.435V112.502H216.231V250.611H261.238C292.308 250.611 305.358 229.088 305.358 173.66C305.358 117.901 290.532 101.697 258.993 101.697H156.345V280.342H110.005V101.697H42.0039V71.8994H273.428C329.247 71.8994 355.765 100.783 355.765 173.216C355.765 268.643 316.17 280.342 262.603 280.342Z" fill="white"/>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_13001_2">
                  <rect width="400" height="357.728" fill="white"/>
                </clipPath>
              </defs>
            </svg>
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
                      <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center">
                        <div className={cn(
                          "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                          isActive 
                            ? "text-sidebar-primary-foreground" 
                            : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                        )}>
                          {item.name}
                        </div>
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

          {/* Configuration Section */}
          <div className="mt-4">
            <button
              className={cn(
                "transition-all duration-300 flex items-center relative overflow-hidden",
                "hover:scale-110",
                isExpanded 
                  ? "w-full px-4 py-3 justify-start rounded-xl min-h-[2.75rem]" 
                  : "w-12 h-12 justify-center mx-auto rounded-full",
                isConfigExpanded
                  ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/30 scale-105"
                  : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
              )}
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            >
              <Settings className={cn(
                "transition-colors duration-300 flex-shrink-0",
                "w-5 h-5",
                isConfigExpanded
                  ? "text-sidebar-primary-foreground" 
                  : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
              )} />
              
              {isExpanded && (
                <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center">
                  <div className={cn(
                    "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                    isConfigExpanded
                      ? "text-sidebar-primary-foreground" 
                      : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                  )}>
                    Configuration
                  </div>
                </div>
              )}
              
              {/* Active indicator */}
              {isConfigExpanded && !isExpanded && (
                <>
                  <div className="absolute inset-0 rounded-full bg-sidebar-primary opacity-20 animate-pulse" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-l-full" />
                </>
              )}
              
              {/* Active indicator for expanded state */}
              {isConfigExpanded && isExpanded && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
              )}
            </button>

            {/* Configuration Items */}
            {isConfigExpanded && (
              <div className="mt-2 space-y-2">
                {configurationItems.map((item) => {
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
                          <div className="ml-3 overflow-hidden min-h-[2.25rem] flex flex-col justify-center">
                            <div className={cn(
                              "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                              isActive 
                                ? "text-sidebar-primary-foreground" 
                                : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                            )}>
                              {item.name}
                            </div>
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
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 flex justify-center">
          <div className="relative group">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-sidebar-primary-foreground font-semibold text-lg">YL</span>
            </div>
            
            {/* Profile tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                <div className="font-medium text-sm">Yu</div>
                <div className="text-xs opacity-75 mt-1">Admin</div>
                {/* Tooltip arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
              </div>
            )}
            
            {/* Profile info for expanded state */}
            {isExpanded && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-center">
                <div className="text-sidebar-foreground font-medium text-sm whitespace-nowrap">
                  Yu
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