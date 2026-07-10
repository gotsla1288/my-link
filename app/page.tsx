import BigQueryDashboard from "@/components/bigquery-dashboard"

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <BigQueryDashboard />
      </div>
      
      {/* Footer shortcut tips */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center text-xs text-zinc-400 dark:text-zinc-500 font-mono">
        (Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">d</kbd> to toggle dark mode)
      </footer>
    </main>
  )
}

