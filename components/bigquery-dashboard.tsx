"use client"

import { useState, useEffect } from "react"
import { 
  BarChart3, 
  Database, 
  Terminal, 
  Laptop, 
  MapPin, 
  Users, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sparkles
} from "lucide-react"

// Types
interface UserMetric {
  date: string
  active_users: number
  page_views: number
  conversion_rate: number
}

interface DeviceMetric {
  device: string
  share: number
  trend: string
}

interface RegionMetric {
  region: string
  users: number
  revenue: number
}

interface GeneralMetric {
  id: number
  metric_name: string
  value: number
  status: string
}

export default function BigQueryDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "devices" | "regions" | "query">("overview")
  const [loading, setLoading] = useState(false)
  const [isMock, setIsMock] = useState(true)
  
  // Data States
  const [generalData, setGeneralData] = useState<GeneralMetric[]>([])
  const [usersData, setUsersData] = useState<UserMetric[]>([])
  const [devicesData, setDevicesData] = useState<DeviceMetric[]>([])
  const [regionsData, setRegionsData] = useState<RegionMetric[]>([])
  
  // Custom Query State
  const [customQuery, setCustomQuery] = useState(
    "SELECT date, active_users, page_views, conversion_rate \nFROM `your-project.your_dataset.daily_active_users` \nLIMIT 7"
  )
  const [queryResult, setQueryResult] = useState<any[] | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [queryExecuting, setQueryExecuting] = useState(false)

  // Chart interaction states
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Fetch initial data
  const fetchData = async (type: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bigquery?type=${type}`)
      const json = await res.json()
      if (json.success) {
        setIsMock(json.isMock)
        if (type === "general") setGeneralData(json.data)
        if (type === "users") setUsersData(json.data)
        if (type === "devices") setDevicesData(json.data)
        if (type === "regions") setRegionsData(json.data)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData("general")
    fetchData("users")
    fetchData("devices")
    fetchData("regions")
  }, [])

  // Execute custom query
  const handleExecuteQuery = async () => {
    if (!customQuery.trim()) return
    setQueryExecuting(true)
    setQueryError(null)
    setQueryResult(null)
    
    try {
      const res = await fetch("/api/bigquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: customQuery }),
      })
      const json = await res.json()
      if (json.success) {
        setQueryResult(json.data)
        setIsMock(json.isMock)
      } else {
        setQueryError(json.error || "Query execution failed")
      }
    } catch (err: any) {
      setQueryError(err.message || "Network error occurred")
    } finally {
      setQueryExecuting(false)
    }
  }

  // SVG Chart Dimensions & Helpers
  const width = 600
  const height = 240
  const padding = 40

  // Line Chart computations for User metrics (Active Users)
  const maxActiveUsers = usersData.length > 0 ? Math.max(...usersData.map((d) => d.active_users)) * 1.1 : 1
  const minActiveUsers = usersData.length > 0 ? Math.min(...usersData.map((d) => d.active_users)) * 0.9 : 0
  const getLineCoordinates = () => {
    if (usersData.length === 0) return ""
    const xStep = (width - padding * 2) / (usersData.length - 1)
    return usersData
      .map((d, i) => {
        const x = padding + i * xStep
        const y = height - padding - ((d.active_users - minActiveUsers) / (maxActiveUsers - minActiveUsers)) * (height - padding * 2)
        return `${i === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")
  }

  const getAreaCoordinates = () => {
    if (usersData.length === 0) return ""
    const xStep = (width - padding * 2) / (usersData.length - 1)
    const points = usersData
      .map((d, i) => {
        const x = padding + i * xStep
        const y = height - padding - ((d.active_users - minActiveUsers) / (maxActiveUsers - minActiveUsers)) * (height - padding * 2)
        return `${x} ${y}`
      })
      .join(" L ")
    
    const startX = padding
    const endX = padding + (usersData.length - 1) * xStep
    const bottomY = height - padding
    return `M ${startX} ${bottomY} L ${points} L ${endX} ${bottomY} Z`
  }

  // Render Functions
  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>BigQuery Data Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            GCP BigQuery 연동 현황 및 실시간 데이터 시각화 리포트
          </p>
        </div>

        {/* Connection Status Badge */}
        <div className="flex items-center gap-3">
          {isMock ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Mock Sandbox Mode (로컬 데모 실행 중)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>GCP Connected (실제 BigQuery 연결됨)</span>
            </div>
          )}
          <button 
            onClick={() => {
              fetchData("general")
              fetchData("users")
              fetchData("devices")
              fetchData("regions")
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all active:scale-95"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mock Sandbox Guide banner */}
      {isMock && (
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm md:text-base">
            <Database className="w-5 h-5 text-indigo-500" />
            실제 Google Cloud BigQuery 연동 방법
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm mt-1.5 max-w-3xl leading-relaxed">
            실제 GCP BigQuery에 접속하여 쿼리를 수행하려면, 로컬 환경 변수에 GCP 서비스 계정 자격 증명 정보를 설정하십시오.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono bg-black/5 dark:bg-black/30 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-300">
            <div>BIGQUERY_PROJECT_ID=&quot;your-gcp-project-id&quot;</div>
            <div className="text-zinc-400">|</div>
            <div>GOOGLE_APPLICATION_CREDENTIALS=&quot;/path/to/key.json&quot;</div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px shrink-0 ${
            activeTab === "overview"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          개요 대시보드
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px shrink-0 ${
            activeTab === "users"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Users className="w-4 h-4" />
          사용자 트래픽 (Line Chart)
        </button>
        <button
          onClick={() => setActiveTab("devices")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px shrink-0 ${
            activeTab === "devices"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Laptop className="w-4 h-4" />
          디바이스 분석 (Donut Chart)
        </button>
        <button
          onClick={() => setActiveTab("regions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px shrink-0 ${
            activeTab === "regions"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <MapPin className="w-4 h-4" />
          지역별 매출 (Bar Chart)
        </button>
        <button
          onClick={() => setActiveTab("query")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px shrink-0 ${
            activeTab === "query"
              ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Terminal className="w-4 h-4" />
          BigQuery Console SQL
        </button>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Grid Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Daily Active Users</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {usersData.length > 0 ? usersData[usersData.length - 1].active_users.toLocaleString() : "..."}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.3% vs 전일</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Page Views</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {usersData.length > 0 ? usersData[usersData.length - 1].page_views.toLocaleString() : "..."}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+17.8% vs 전일</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {usersData.length > 0 ? `${usersData[usersData.length - 1].conversion_rate}%` : "..."}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+8.5% vs 전일</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Top Revenue Region</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {regionsData.length > 0 ? regionsData[0].region : "..."}
                </div>
                <div className="text-[11px] text-zinc-400 mt-2">
                  최대 매출: {regionsData.length > 0 ? `$${regionsData[0].revenue.toLocaleString()}` : "..."}
                </div>
              </div>
            </div>

            {/* General metrics table */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                빅쿼리 수집 시스템 리소스 메트릭
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">메트릭 명칭</th>
                      <th className="pb-3 font-semibold text-right">수치</th>
                      <th className="pb-3 font-semibold text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {generalData.map((row) => (
                      <tr key={row.id} className="text-zinc-700 dark:text-zinc-300">
                        <td className="py-3.5 font-mono text-xs">{row.id}</td>
                        <td className="py-3.5 font-medium">{row.metric_name}</td>
                        <td className="py-3.5 text-right font-semibold">{row.value}</td>
                        <td className="py-3.5 text-center">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              row.status === "Healthy"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : row.status === "Warning"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LINE CHART */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                일별 활성 사용자 트렌드 (DAU)
              </h2>
              <p className="text-zinc-400 text-xs mb-6">마우스 오버 시 각 시점의 상세 통계를 확인할 수 있습니다.</p>
              
              <div className="relative w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = padding + ratio * (height - padding * 2)
                    return (
                      <line
                        key={index}
                        x1={padding}
                        y1={y}
                        x2={width - padding}
                        y2={y}
                        stroke="#e4e4e7"
                        className="dark:stroke-zinc-800"
                        strokeDasharray="4"
                      />
                    )
                  })}

                  {/* Area fill */}
                  {usersData.length > 0 && (
                    <path d={getAreaCoordinates()} fill="url(#gradient-area)" />
                  )}

                  {/* Line path */}
                  {usersData.length > 0 && (
                    <path
                      d={getLineCoordinates()}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data Points */}
                  {usersData.map((d, i) => {
                    const xStep = (width - padding * 2) / (usersData.length - 1)
                    const x = padding + i * xStep
                    const y = height - padding - ((d.active_users - minActiveUsers) / (maxActiveUsers - minActiveUsers)) * (height - padding * 2)
                    const isHovered = hoveredIndex === i
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 7 : 4}
                          fill={isHovered ? "#6366f1" : "#4f46e5"}
                          stroke="white"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="dark:stroke-zinc-900 transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {/* Custom Axis Text */}
                        {i % 2 === 0 && (
                          <text
                            x={x}
                            y={height - padding + 18}
                            textAnchor="middle"
                            fill="#888888"
                            className="text-[10px] font-medium"
                          >
                            {d.date.substring(5)}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* SVG Live Tooltip */}
                {hoveredIndex !== null && usersData[hoveredIndex] && (
                  <div 
                    className="absolute p-3 bg-zinc-950 text-white rounded-xl shadow-xl border border-zinc-800 text-xs space-y-1 z-20 pointer-events-none"
                    style={{
                      left: `${(hoveredIndex / (usersData.length - 1)) * 82 + 9}%`,
                      top: "20px"
                    }}
                  >
                    <div className="font-bold text-zinc-400">{usersData[hoveredIndex].date}</div>
                    <div className="flex justify-between gap-6">
                      <span>활성 사용자:</span>
                      <span className="font-semibold text-indigo-400">
                        {usersData[hoveredIndex].active_users.toLocaleString()}명
                      </span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>페이지뷰:</span>
                      <span className="font-semibold text-purple-400">
                        {usersData[hoveredIndex].page_views.toLocaleString()}회
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">사용자 분석 인사이트</h3>
              <div className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  주간 데이터를 분석한 결과, <strong>목요일(07-09)</strong>과 <strong>금요일(07-10)</strong>에 눈에 띄는 트래픽 상승세가 관측되었습니다.
                </p>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-300 text-xs uppercase mb-1">DAU Peak Value</div>
                  <div className="text-xl font-bold text-indigo-500">2,400 Active Users</div>
                </div>
                <p>
                  마케팅 캠페인의 성공적인 전환율 증가(3.8%)로 인해 페이지뷰 수치 또한 전주 대비 평균 15.2% 성장했습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DONUT CHART */}
        {activeTab === "devices" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm flex flex-col items-center">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 w-full text-left">
                디바이스 점유율 분석
              </h2>
              
              {/* Custom SVG Donut Chart */}
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Outer Mobile: 55%, Offset 0 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="10"
                    strokeDasharray={`${55} ${100 - 55}`}
                    strokeDashoffset="0"
                    className="hover:stroke-[12] transition-all cursor-pointer"
                  />
                  {/* Desktop: 35%, Offset 55 (since 55 was mobile) -> offset is -55 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="10"
                    strokeDasharray={`${35} ${100 - 35}`}
                    strokeDashoffset="-55"
                    className="hover:stroke-[12] transition-all cursor-pointer"
                  />
                  {/* Tablet: 10%, Offset 55+35=90 -> offset is -90 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray={`${10} ${100 - 10}`}
                    strokeDashoffset="-90"
                    className="hover:stroke-[12] transition-all cursor-pointer"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-zinc-400 text-xs font-medium">유입 디바이스</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">Mobile</span>
                  <span className="text-emerald-500 font-bold text-xs mt-0.5">55% Share</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">디바이스 상세 점유율</h3>
              <div className="space-y-4">
                {devicesData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-3.5 h-3.5 rounded-full" 
                        style={{
                          backgroundColor: d.device === "Mobile" ? "#6366f1" : d.device === "Desktop" ? "#14b8a6" : "#f59e0b"
                        }}
                      />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{d.device}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">{d.share}%</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        d.trend.startsWith("+") 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        {d.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BAR CHART */}
        {activeTab === "regions" && (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
              지역별 매출 및 사용자 분석
            </h2>
            
            <div className="space-y-5">
              {regionsData.map((r, idx) => {
                const maxRevenue = Math.max(...regionsData.map((item) => item.revenue)) || 1
                const percent = (r.revenue / maxRevenue) * 100
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        {r.region}
                      </span>
                      <div className="space-x-3 text-xs">
                        <span className="text-zinc-400">{r.users.toLocaleString()} Users</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">${r.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Bar progress */}
                    <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SQL QUERY INTERACTIVE CONSOLE */}
        {activeTab === "query" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    BigQuery SQL Console
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    임의의 SQL SELECT 쿼리를 작성하여 GCP BigQuery 데이터를 직접 조회해보세요.
                  </p>
                </div>
                <button
                  onClick={handleExecuteQuery}
                  disabled={queryExecuting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {queryExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                  <span>쿼리 실행</span>
                </button>
              </div>

              {/* Code IDE Textarea */}
              <div className="relative font-mono text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-inner bg-zinc-950">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
                  <span>SQL Query Editor</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800/50 border border-zinc-700 text-[10px]">
                    SQLX
                  </span>
                </div>
                <textarea
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full h-40 p-4 bg-transparent text-zinc-100 outline-none resize-none font-mono tracking-wide leading-relaxed"
                  placeholder="SELECT * FROM `your-project.your_dataset.your_table` LIMIT 10"
                />
              </div>
            </div>

            {/* Error Message */}
            {queryError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Query Execution Failed</div>
                  <div className="mt-1 font-mono">{queryError}</div>
                </div>
              </div>
            )}

            {/* Query Results Table */}
            {queryResult && queryResult.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Query Results</h4>
                  <span className="text-xs text-zinc-400 font-mono">
                    {queryResult.length} Rows returned
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-xs">
                        {Object.keys(queryResult[0]).map((key) => (
                          <th key={key} className="pb-3 font-semibold px-4">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-xs">
                      {queryResult.map((row, idx) => (
                        <tr key={idx} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          {Object.values(row).map((val: any, cellIdx) => (
                            <td key={cellIdx} className="py-3 px-4 truncate max-w-[200px]" title={String(val)}>
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
