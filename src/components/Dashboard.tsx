import { Card } from "./ui/card";
import { SensitiveText } from "./SensitiveText";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  GitBranch,
  Shield
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export function Dashboard() {
  // Release Velocity Data (last 6 months)
  const velocityData = [
    { month: "Sep", releases: 12 },
    { month: "Oct", releases: 15 },
    { month: "Nov", releases: 18 },
    { month: "Dec", releases: 14 },
    { month: "Jan", releases: 20 },
    { month: "Feb", releases: 17 },
  ];

  // Trend Data (Pending/Approved/Rejected)
  const trendData = [
    { week: "W1", pending: 45, approved: 120, rejected: 8 },
    { week: "W2", pending: 52, approved: 135, rejected: 12 },
    { week: "W3", pending: 48, approved: 145, rejected: 10 },
    { week: "W4", pending: 65, approved: 160, rejected: 15 },
  ];

  // DQ Failure Rate Data
  const dqData = [
    { day: "Mon", rate: 2.1 },
    { day: "Tue", rate: 1.8 },
    { day: "Wed", rate: 2.5 },
    { day: "Thu", rate: 1.9 },
    { day: "Fri", rate: 2.3 },
    { day: "Sat", rate: 1.5 },
    { day: "Sun", rate: 1.7 },
  ];

  // Impact Radar Data (Last 7 Days)
  const impactRadarData = [
    { category: "Fields Modified", value: 85, fullMark: 100 },
    { category: "References Impact", value: 62, fullMark: 100 },
    { category: "Risk Level", value: 45, fullMark: 100 },
    { category: "Change Frequency", value: 78, fullMark: 100 },
    { category: "Complexity", value: 53, fullMark: 100 },
  ];

  // Most Modified Fields
  const modifiedFields = [
    { field: "BorrowerRiskRatingGroup", changes: 23 },
    { field: "CollateralValueDate", changes: 18 },
    { field: "LoanMaturityDate", changes: 15 },
    { field: "InterestRateType", changes: 12 },
  ];

  // Most Impacted References
  const impactedReferences = [
    { reference: "USInvestmentPledge", impact: 34 },
    { reference: "Deriv_FXFWD", impact: 28 },
    { reference: "USDepositsCollateralized", impact: 21 },
    { reference: "USCreditCardCorporate", impact: 16 },
  ];

  // DQ Pass Rate Trend
  const dqPassRateData = [
    { day: "Mon", passRate: 97.2 },
    { day: "Tue", passRate: 96.8 },
    { day: "Wed", passRate: 97.5 },
    { day: "Thu", passRate: 98.1 },
    { day: "Fri", passRate: 97.9 },
    { day: "Sat", passRate: 98.3 },
    { day: "Sun", passRate: 98.5 },
  ];

  // Recent Critical Activities
  const criticalActivities = [
    {
      title: "BorrowerRiskRatingGroup Modified",
      description: "Field definition updated with new validation rules",
      time: "2 hours ago",
      type: "modification",
      severity: "high"
    },
    {
      title: "Release 5.87 Published",
      description: "Production release deployed successfully",
      time: "5 hours ago",
      type: "release",
      severity: "normal"
    },
    {
      title: "High Risk Changeset Approved",
      description: "Critical changes approved for USInvestmentPledge feed",
      time: "1 day ago",
      type: "approval",
      severity: "high"
    },
    {
      title: "Data Quality Check Completed",
      description: "All feeds passed validation with 98.5% success rate",
      time: "1 day ago",
      type: "check",
      severity: "normal"
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Hi <SensitiveText>Yu</SensitiveText>, welcome to <SensitiveText>Document Store</SensitiveText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your governance and data quality metrics
          </p>
        </div>

        {/* Main Stats - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending */}
          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Pending</p>
                <h2 className="text-4xl font-bold text-foreground">183</h2>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 text-xs">
                    Needs Review
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Approved */}
          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Approved</p>
                <h2 className="text-4xl font-bold text-foreground">29,345</h2>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12% this week
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Rejected */}
          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Rejected</p>
                <h2 className="text-4xl font-bold text-foreground">1,404</h2>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 text-xs">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    -3% this week
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Onboarding Rules */}
          <Card className="p-6 bg-white shadow-sm border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Onboarding Rules</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Last Updated: 2 days ago</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  65
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">High Risk</span>
                <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                  4
                </Badge>
              </div>
            </div>
          </Card>

          {/* Data Catalog */}
          <Card className="p-6 bg-white shadow-sm border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Data Catalog</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Changes this week: 12</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  1
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Total Entries</span>
                <span className="text-sm font-semibold text-foreground">847</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Impact Radar Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Impact Radar</h2>
          <p className="text-sm text-muted-foreground mb-4">Last 7 days activity overview</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Chart */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Risk Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={impactRadarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#666', fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#666', fontSize: 10 }} />
                  <Radar name="Impact" dataKey="value" stroke="#54B948" fill="#54B948" fillOpacity={0.5} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Most Modified Fields */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-foreground">Most Modified Fields</h3>
              </div>
              <div className="space-y-3">
                {modifiedFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{field.field}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 ml-2">
                      {field.changes}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-muted-foreground text-center">Total modifications: 68</p>
              </div>
            </Card>

            {/* Most Impacted References */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-foreground">Most Impacted References</h3>
              </div>
              <div className="space-y-3">
                {impactedReferences.map((ref, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{ref.reference}</p>
                    </div>
                    <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 ml-2">
                      {ref.impact}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-muted-foreground text-center">Total impacted: 99 references</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Data Quality Health Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Data Quality Health</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* DQ Pass Rate */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">DQ Pass Rate</h3>
                </div>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  Excellent
                </Badge>
              </div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-primary mb-2">98.5%</div>
                <p className="text-sm text-muted-foreground">Current pass rate</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">5,847</p>
                  <p className="text-xs text-muted-foreground mt-1">Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">89</p>
                  <p className="text-xs text-muted-foreground mt-1">Failed</p>
                </div>
              </div>
            </Card>

            {/* Failed Rules */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-foreground">Failed Rules</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">Null Value Check</p>
                    <Badge variant="outline" className="border-red-200 text-red-700 bg-red-100 text-xs">
                      23
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">CollateralValueDate field</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">Format Validation</p>
                    <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-100 text-xs">
                      18
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">InterestRateType field</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">Range Validation</p>
                    <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-100 text-xs">
                      12
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">LoanMaturityDate field</p>
                </div>
              </div>
            </Card>

            {/* Trend Line */}
            <Card className="p-6 bg-white shadow-sm border-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Pass Rate Trend</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dqPassRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} domain={[95, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                    formatter={(value) => [`${value}%`, 'Pass Rate']}
                  />
                  <Line type="monotone" dataKey="passRate" stroke="#54B948" strokeWidth={2} dot={{ fill: '#54B948', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Recent Critical Activities Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Critical Activities</h2>
          
          <Card className="p-6 bg-white shadow-sm border-0">
            <div className="space-y-4">
              {criticalActivities.map((activity, index) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case "modification":
                      return <Activity className="w-5 h-5 text-blue-600" />;
                    case "release":
                      return <GitBranch className="w-5 h-5 text-green-600" />;
                    case "approval":
                      return <CheckCircle2 className="w-5 h-5 text-orange-600" />;
                    case "check":
                      return <Shield className="w-5 h-5 text-purple-600" />;
                    default:
                      return <Activity className="w-5 h-5 text-gray-600" />;
                  }
                };

                const getSeverityColor = () => {
                  return activity.severity === "high" 
                    ? "border-red-200 bg-red-50" 
                    : "border-gray-200 bg-gray-50";
                };

                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${getSeverityColor()} border-2 flex items-center justify-center`} >
                        {getIcon()}
                      </div>
                      {index < criticalActivities.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{activity.title}</h4>
                        {activity.severity === "high" && (
                          <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}