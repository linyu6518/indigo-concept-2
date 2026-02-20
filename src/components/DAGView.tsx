import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  FileCode, 
  Clock, 
  AlertTriangle, 
  Target, 
  Shield, 
  Edit2, 
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface RuleGroupNode {
  id: string;
  rulegroup: string;
  sequence: number;
  description: string;
  rules: number;
  outputViewFlag: boolean;
  outputViewName?: string;
  highRiskRules?: number;
  lastModified?: string;
  impactedReports?: number;
  blockRiskScore?: number;
  ruleDensity?: number;
}

interface DAGViewProps {
  nodes: RuleGroupNode[];
  onNodeClick: (node: RuleGroupNode) => void;
  onEditNode: (node: RuleGroupNode) => void;
}

export function DAGView({ nodes, onNodeClick, onEditNode }: DAGViewProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Node drag: user can drag nodes to reposition
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const nodeDragRef = useRef<{
    nodeId: string;
    startClientX: number;
    startClientY: number;
    startNodeX: number;
    startNodeY: number;
  } | null>(null);
  const nodeDragMovedRef = useRef(false);

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan.x, pan.y]);

  const handlePanMove = useCallback((e: MouseEvent) => {
    const start = dragStartRef.current;
    setPan({
      x: start.panX + (e.clientX - start.x),
      y: start.panY + (e.clientY - start.y),
    });
  }, []);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handlePanMove);
    window.addEventListener("mouseup", handlePanEnd);
    return () => {
      window.removeEventListener("mousemove", handlePanMove);
      window.removeEventListener("mouseup", handlePanEnd);
    };
  }, [isDragging, handlePanMove, handlePanEnd]);

  // Default: horizontal layout (single row, left to right)
  const CARD_WIDTH = 280;
  const NODE_GAP = 80;
  const MARGIN = 100;

  const getNodePosition = (index: number, _total: number) => {
    return {
      x: index * (CARD_WIDTH + NODE_GAP) + MARGIN,
      y: MARGIN,
    };
  };

  // Generate connections between sequential nodes
  const getConnections = () => {
    const connections = [];
    const sortedNodes = [...nodes].sort((a, b) => a.sequence - b.sequence);
    
    for (let i = 0; i < sortedNodes.length - 1; i++) {
      connections.push({
        from: i,
        to: i + 1,
        fromNode: sortedNodes[i],
        toNode: sortedNodes[i + 1]
      });
    }
    
    return connections;
  };

  const sortedNodes = [...nodes].sort((a, b) => a.sequence - b.sequence);
  const connections = getConnections();
  const containerHeight = 500;

  const getEffectiveNodePosition = useCallback(
    (index: number, total: number) => {
      const node = sortedNodes[index];
      if (!node) return getNodePosition(index, total);
      const override = nodePositions[node.id];
      return override ?? getNodePosition(index, total);
    },
    [sortedNodes, nodePositions]
  );

  const handleNodeDragStart = useCallback(
    (e: React.MouseEvent, nodeId: string, index: number) => {
      if (e.button !== 0) return;
      // Don't start drag when clicking buttons (Edit, View Rules) so they remain clickable
      const target = e.target as HTMLElement;
      if (target.closest?.("button")) return;
      e.stopPropagation();
      const pos = getEffectiveNodePosition(index, sortedNodes.length);
      nodeDragRef.current = {
        nodeId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startNodeX: pos.x,
        startNodeY: pos.y,
      };
      nodeDragMovedRef.current = false;
      setDraggingNodeId(nodeId);
    },
    [getEffectiveNodePosition, sortedNodes.length]
  );

  const handleNodeDragMove = useCallback((e: MouseEvent) => {
    const ref = nodeDragRef.current;
    if (!ref) return;
    nodeDragMovedRef.current = true;
    setNodePositions((prev) => ({
      ...prev,
      [ref.nodeId]: {
        x: ref.startNodeX + (e.clientX - ref.startClientX) / zoom,
        y: ref.startNodeY + (e.clientY - ref.startClientY) / zoom,
      },
    }));
  }, [zoom]);

  const handleNodeDragEnd = useCallback(() => {
    nodeDragRef.current = null;
    setDraggingNodeId(null);
  }, []);

  useEffect(() => {
    if (!draggingNodeId) return;
    window.addEventListener("mousemove", handleNodeDragMove);
    window.addEventListener("mouseup", handleNodeDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleNodeDragMove);
      window.removeEventListener("mouseup", handleNodeDragEnd);
    };
  }, [draggingNodeId, handleNodeDragMove, handleNodeDragEnd]);

  return (
    <div
      className={`relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 overflow-auto ${isDragging ? "cursor-grabbing" : ""}`}
      style={{
        height: 'calc(100vh - 12rem)',
        minHeight: '400px',
      }}
    >
      {/* Grid Background Pattern - fills container, adapts to browser */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 rounded-lg"
        style={{
          backgroundImage: 'radial-gradient(circle, #5BBD72 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Zoom Controls - fixed at viewport bottom-right via inline style so ancestor transform doesn't override */}
      <div
        className="fixed bg-white border border-gray-200 rounded-lg shadow-md p-2 flex flex-col gap-2"
        style={{ right: 24, bottom: 24, zIndex: 9999 }}
      >
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
          className="px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <div className="text-[10px] text-center text-muted-foreground font-mono">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          className="px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/10 rounded transition-colors"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>

      <div
        className="relative transition-transform duration-300"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Pan layer: drag on empty area to move canvas */}
        <div
          className="absolute left-0 top-0 z-0 cursor-grab active:cursor-grabbing"
          style={{ width: "100%", height: containerHeight }}
          onMouseDown={handlePanStart}
          role="presentation"
          aria-hidden
        />
      <svg
        className="absolute top-0 left-0 z-[1] w-full h-full pointer-events-none"
        style={{ height: `${containerHeight}px` }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#5BBD72" />
          </marker>
        </defs>
        
        {/* Draw connections - use effective positions so lines follow dragged nodes */}
        {connections.map((conn, idx) => {
          const fromPos = getEffectiveNodePosition(conn.from, sortedNodes.length);
          const toPos = getEffectiveNodePosition(conn.to, sortedNodes.length);
          
          // Calculate connection points (from right edge of source to left edge of target)
          const x1 = fromPos.x + 280; // Right edge of card
          const y1 = fromPos.y + 180; // Middle of card height
          const x2 = toPos.x; // Left edge of card
          const y2 = toPos.y + 180;
          
          // Create smooth curved path with better control points
          const dx = x2 - x1;
          const dy = y2 - y1;
          const controlPointOffset = Math.min(Math.abs(dx) * 0.5, 150);
          
          const path = `M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${x2 - controlPointOffset} ${y2}, ${x2} ${y2}`;
          
          // Check if this is a high-risk connection
          const isHighRisk = conn.fromNode.highRiskRules && conn.fromNode.highRiskRules > 0;
          
          return (
            <g key={idx}>
              {/* Shadow for depth */}
              <path
                d={path}
                stroke="#000"
                strokeWidth="4"
                fill="none"
                opacity="0.05"
                transform="translate(2, 2)"
              />
              {/* Main path */}
              <path
                d={path}
                stroke={isHighRisk ? "#f59e0b" : "#5BBD72"}
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
                opacity="0.7"
                className="transition-all"
              />
              {/* Data flow label */}
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 12}
                className="text-[11px] fill-primary font-medium"
                textAnchor="middle"
              >
                seq {conn.fromNode.sequence} → {conn.toNode.sequence}
              </text>
              {isHighRisk && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 + 4}
                  className="text-[10px] fill-amber-600 font-semibold"
                  textAnchor="middle"
                >
                  ⚠ risk flow
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Render nodes - draggable */}
      <div className="relative z-10" style={{ height: `${containerHeight}px` }}>
        {sortedNodes.map((rg, index) => {
          const pos = getEffectiveNodePosition(index, sortedNodes.length);
          
          return (
            <Card
              key={rg.id}
              className={`absolute bg-white border-2 hover:shadow-xl transition-all ${
                draggingNodeId === rg.id ? 'cursor-grabbing shadow-2xl z-20' : 'cursor-grab'
              } ${
                hoveredNode === rg.id && !draggingNodeId
                  ? 'border-primary shadow-2xl scale-105 z-10' 
                  : rg.highRiskRules && rg.highRiskRules > 0
                  ? 'border-amber-300/50'
                  : 'border-primary/20'
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: '280px',
                transform: hoveredNode === rg.id && !draggingNodeId ? 'translateZ(0) scale(1.05)' : 'translateZ(0)',
                transition: draggingNodeId === rg.id ? 'none' : 'all 0.3s ease',
              }}
              onMouseDown={(e) => handleNodeDragStart(e, rg.id, index)}
              onClick={() => {
                if (nodeDragMovedRef.current) return;
                onNodeClick(rg);
              }}
              onMouseEnter={() => !draggingNodeId && setHoveredNode(rg.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="p-5">
                {/* High Risk Indicator */}
                {rg.highRiskRules !== undefined && rg.highRiskRules > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-20">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
                
                {/* Header with Sequence Badge */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground mb-1">{rg.rulegroup}</h3>
                    {rg.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{rg.description}</p>
                    )}
                  </div>
                  
                  {/* Sequence Badge - Right Top Corner */}
                  <div className="flex-shrink-0 px-2.5 py-1 bg-[#5BBD72]/10 rounded-md">
                    <span className="text-[#5BBD72] font-bold text-sm">#{rg.sequence}</span>
                  </div>
                </div>

                {/* Enhanced Metrics Grid */}
                <div className="space-y-3 mb-4">
                  {/* Row 1: Rules & High Risk */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                        <FileCode className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Rules</div>
                        <div className="text-sm font-semibold text-foreground">{rg.rules}</div>
                      </div>
                    </div>
                    {rg.highRiskRules !== undefined && rg.highRiskRules > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">High Risk</div>
                          <div className="text-sm font-semibold text-red-600 flex items-center gap-1">
                            {rg.highRiskRules}
                            <span className="text-red-600">🔴</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 2: Last Modified & Impacted Reports */}
                  <div className="grid grid-cols-2 gap-3">
                    {rg.lastModified && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Modified</div>
                          <div className="text-xs font-medium text-foreground">{rg.lastModified}</div>
                        </div>
                      </div>
                    )}
                    {rg.impactedReports !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-50 rounded flex items-center justify-center">
                          <Target className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Reports</div>
                          <div className="text-sm font-semibold text-foreground">{rg.impactedReports}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Block Risk Score & Rule Density */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    {rg.blockRiskScore !== undefined && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Block Risk Score</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${rg.blockRiskScore >= 50 ? 'bg-red-500' : rg.blockRiskScore >= 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${rg.blockRiskScore}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${rg.blockRiskScore >= 50 ? 'text-red-600' : rg.blockRiskScore >= 30 ? 'text-amber-600' : 'text-green-600'}`}>
                            {rg.blockRiskScore}
                          </span>
                        </div>
                      </div>
                    )}
                    {rg.ruleDensity !== undefined && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Rule Density</div>
                        <div className="flex items-center gap-1">
                          <Shield className={`w-4 h-4 ${rg.ruleDensity > 20 ? 'text-amber-600' : 'text-green-600'}`} />
                          <span className="text-xs font-bold text-foreground">{rg.ruleDensity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - clicks must not start node drag */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNode(rg);
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(rg);
                    }}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Rules
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      </div>
    </div>
  );
}
