import { 
  Database, 
  Zap, 
  Box, 
  Activity, 
  FileCode, 
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "./ui/utils";
import { SensitiveText } from "./SensitiveText";

interface LineageNode {
  stage: string;
  name: string;
  type: "source" | "transformation" | "catalog" | "dq" | "output" | "report";
  status: "healthy" | "warning" | "error";
}

interface LineageDAGViewProps {
  lineage: LineageNode[];
}

export function LineageDAGView({ lineage }: LineageDAGViewProps) {
  const getNodeIcon = (type: LineageNode["type"]) => {
    switch (type) {
      case "source":
        return <Database className="w-6 h-6 text-white" />;
      case "transformation":
        return <Zap className="w-6 h-6 text-white" />;
      case "catalog":
        return <Box className="w-6 h-6 text-white" />;
      case "dq":
        return <Activity className="w-6 h-6 text-white" />;
      case "output":
        return <FileCode className="w-6 h-6 text-white" />;
      case "report":
        return <BarChart3 className="w-6 h-6 text-white" />;
    }
  };

  const getNodeColor = (type: LineageNode["type"]) => {
    switch (type) {
      case "source":
        return {
          bg: "bg-blue-50",
          border: "border-blue-300",
          icon: "bg-blue-600",
          text: "text-blue-900"
        };
      case "transformation":
        return {
          bg: "bg-purple-50",
          border: "border-purple-300",
          icon: "bg-purple-600",
          text: "text-purple-900"
        };
      case "catalog":
        return {
          bg: "bg-primary/10",
          border: "border-primary",
          icon: "bg-primary",
          text: "text-primary"
        };
      case "dq":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-300",
          icon: "bg-emerald-600",
          text: "text-emerald-900"
        };
      case "output":
        return {
          bg: "bg-amber-50",
          border: "border-amber-300",
          icon: "bg-amber-600",
          text: "text-amber-900"
        };
      case "report":
        return {
          bg: "bg-orange-50",
          border: "border-orange-300",
          icon: "bg-orange-600",
          text: "text-orange-900"
        };
    }
  };

  const getStatusIcon = (status: LineageNode["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="relative">
      {/* DAG Container - Horizontal Layout */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex items-center gap-0 min-w-max py-8 px-4">
          {lineage.map((node, idx) => {
            const colors = getNodeColor(node.type);
            
            return (
              <div key={idx} className="flex items-center">
                {/* Node */}
                <div className="relative group">
                  <div 
                    className={cn(
                      "w-40 h-32 rounded-xl border-2 transition-all cursor-pointer",
                      "hover:shadow-xl hover:scale-105",
                      colors.bg,
                      colors.border
                    )}
                  >
                    {/* Status Badge */}
                    <div className="absolute -top-2 -right-2 z-10 bg-white rounded-full">
                      {getStatusIcon(node.status)}
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center pt-4 pb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shadow-md",
                        colors.icon
                      )}>
                        {getNodeIcon(node.type)}
                      </div>
                    </div>

                    {/* Stage Label */}
                    <div className="px-3 text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                        {node.stage}
                      </div>
                      <div className={cn(
                        "text-sm font-bold leading-tight line-clamp-2",
                        colors.text
                      )}>
                        <SensitiveText className={colors.text}>{node.name}</SensitiveText>
                      </div>
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <div className="font-semibold">{node.stage}</div>
                      <div className="text-gray-300 mt-1"><SensitiveText>{node.name}</SensitiveText></div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          node.status === "healthy" ? "bg-green-400" :
                          node.status === "warning" ? "bg-amber-400" :
                          "bg-red-400"
                        )}></div>
                        <span className="capitalize">{node.status}</span>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < lineage.length - 1 && (
                  <div className="flex items-center px-3">
                    <div className="flex items-center">
                      <div className="w-10 h-0.5 bg-gray-300"></div>
                      <ArrowRight className="w-5 h-5 text-gray-400 -ml-1" />
                      <div className="w-10 h-0.5 bg-gray-300 -ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-xs font-semibold text-muted-foreground">Lineage Stages:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-600"></div>
            <span className="text-xs text-foreground">Source</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-600"></div>
            <span className="text-xs text-foreground">Transform</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-xs text-foreground">Catalog</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-600"></div>
            <span className="text-xs text-foreground">DQ Validation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-600"></div>
            <span className="text-xs text-foreground">Output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-600"></div>
            <span className="text-xs text-foreground">Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}
