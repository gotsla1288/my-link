import { NextRequest, NextResponse } from "next/server"
import { bigqueryClient } from "@/lib/bigquery"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "general"

  let queryStr = ""
  
  // 타입에 따른 쿼리 템플릿 매핑
  switch (type) {
    case "users":
      queryStr = `
        SELECT date, active_users, page_views, conversion_rate 
        FROM \`your-project.your_dataset.daily_active_users\` 
        ORDER BY date ASC 
        LIMIT 30
      `
      break
    case "devices":
      queryStr = `
        SELECT device, share, trend 
        FROM \`your-project.your_dataset.device_distribution\`
      `
      break
    case "regions":
      queryStr = `
        SELECT region, users, revenue 
        FROM \`your-project.your_dataset.top_regions\` 
        ORDER BY revenue DESC
      `
      break
    default:
      queryStr = `
        SELECT id, metric_name, value, status 
        FROM \`your-project.your_dataset.system_metrics\`
      `
  }

  try {
    const [rows] = await bigqueryClient.query({ query: queryStr })
    return NextResponse.json({
      success: true,
      isMock: bigqueryClient.isMock,
      queryType: type,
      data: rows,
    })
  } catch (error: any) {
    console.error("BigQuery API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to query BigQuery",
        isMock: bigqueryClient.isMock,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required in request body" },
        { status: 400 }
      )
    }

    // 간단한 쿼리 화이트리스트 검사 또는 기본 제약 조건 설정 (예: SELECT만 허용)
    const trimmedQuery = query.trim().toUpperCase()
    if (!trimmedQuery.startsWith("SELECT")) {
      return NextResponse.json(
        { success: false, error: "Only SELECT queries are allowed for security reasons" },
        { status: 400 }
      )
    }

    const [rows] = await bigqueryClient.query({ query })
    return NextResponse.json({
      success: true,
      isMock: bigqueryClient.isMock,
      data: rows,
    })
  } catch (error: any) {
    console.error("BigQuery API Custom Query Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute custom query",
        isMock: bigqueryClient.isMock,
      },
      { status: 500 }
    )
  }
}
