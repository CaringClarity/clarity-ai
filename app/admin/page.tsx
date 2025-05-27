import { SidebarLayout } from "@/components/sidebar-layout"
import AdminDashboardPreview from "@/components/admin-dashboard-preview"

export default function AdminPage() {
  return (
    <SidebarLayout>
      <div className="p-6">
        <AdminDashboardPreview />
      </div>
    </SidebarLayout>
  )
}
