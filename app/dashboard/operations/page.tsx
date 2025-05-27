import { DashboardLayout } from "@/components/dashboard-layout"
import { EnhancedAIDashboard } from "@/components/enhanced-ai-dashboard"

export default function OperationsDashboardPage() {
  return (
    <DashboardLayout title="Operations Dashboard" subtitle="Real-time system monitoring">
      <EnhancedAIDashboard />
    </DashboardLayout>
  )
}
