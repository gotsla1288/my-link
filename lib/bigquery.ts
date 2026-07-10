import { BigQuery } from "@google-cloud/bigquery"

// BigQuery 클라이언트 또는 Mock 클라이언트 인터페이스
export interface BigQueryClient {
  query(options: { query: string; params?: any }): Promise<[any[]]>
  isMock: boolean
}

let bigqueryClient: BigQueryClient

// 실제 자격 증명이 있는지 확인
const hasCredentials =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  (process.env.BIGQUERY_PROJECT_ID && process.env.BIGQUERY_PRIVATE_KEY && process.env.BIGQUERY_CLIENT_EMAIL)

if (hasCredentials) {
  try {
    const config: any = {}
    if (process.env.BIGQUERY_PROJECT_ID) {
      config.projectId = process.env.BIGQUERY_PROJECT_ID
    }
    if (process.env.BIGQUERY_CLIENT_EMAIL && process.env.BIGQUERY_PRIVATE_KEY) {
      config.credentials = {
        client_email: process.env.BIGQUERY_CLIENT_EMAIL,
        private_key: process.env.BIGQUERY_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }
    }

    const bq = new BigQuery(config)
    bigqueryClient = {
      query: async (options) => {
        const [rows] = await bq.query(options)
        return [rows]
      },
      isMock: false,
    }
    console.log("BigQuery Client initialized with real GCP credentials.")
  } catch (error) {
    console.error("Failed to initialize BigQuery client, falling back to mock mode:", error)
    bigqueryClient = createMockClient()
  }
} else {
  console.log("No GCP credentials found. BigQuery client initialized in MOCK mode.")
  bigqueryClient = createMockClient()
}

function createMockClient(): BigQueryClient {
  return {
    isMock: true,
    query: async (options) => {
      const q = options.query.toLowerCase().trim()
      
      // 약간의 지연 시간을 주어 실제 API 호출 느낌을 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 간단한 Mock 쿼리 파싱 및 응답
      if (q.includes("daily_active_users") || q.includes("visitors")) {
        return [
          [
            { date: "2026-07-04", active_users: 1200, page_views: 4500, conversion_rate: 2.1 },
            { date: "2026-07-05", active_users: 1450, page_views: 5200, conversion_rate: 2.4 },
            { date: "2026-07-06", active_users: 1300, page_views: 4900, conversion_rate: 2.2 },
            { date: "2026-07-07", active_users: 1680, page_views: 6100, conversion_rate: 2.8 },
            { date: "2026-07-08", active_users: 1850, page_views: 7300, conversion_rate: 3.1 },
            { date: "2026-07-09", active_users: 2100, page_views: 8400, conversion_rate: 3.5 },
            { date: "2026-07-10", active_users: 2400, page_views: 9600, conversion_rate: 3.8 },
          ]
        ]
      }

      if (q.includes("device_distribution") || q.includes("device")) {
        return [
          [
            { device: "Mobile", share: 55, trend: "+4%" },
            { device: "Desktop", share: 35, trend: "-2%" },
            { device: "Tablet", share: 10, trend: "+0.5%" },
          ]
        ]
      }

      if (q.includes("top_regions") || q.includes("region")) {
        return [
          [
            { region: "Seoul", users: 8500, revenue: 124000 },
            { region: "Busan", users: 3200, revenue: 45000 },
            { region: "Gyeonggi", users: 5400, revenue: 78000 },
            { region: "Incheon", users: 2100, revenue: 29000 },
            { region: "Daegu", users: 1800, revenue: 24000 },
          ]
        ]
      }

      // 기본 모의 테이블 응답
      return [
        [
          { id: 1, metric_name: "Mock Metric A", value: 87.4, status: "Healthy" },
          { id: 2, metric_name: "Mock Metric B", value: 1204, status: "Warning" },
          { id: 3, metric_name: "Mock Metric C", value: 9.2, status: "Healthy" },
          { id: 4, metric_name: "Mock Metric D", value: 341, status: "Critical" },
        ]
      ]
    }
  }
}

export { bigqueryClient }
