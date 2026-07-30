"use client" /* Sidebar Navigation */ /* Main Layout Area */ /* Top Header */ /* Page Content */ /* Ambient AI Assistant Drawer */
import React, { useState } from "react"
import { SidebarNav } from "@/components/dashboard/SidebarNav"
import { TopHeader } from "@/components/dashboard/TopHeader"
import { CareerAssistantDrawer } from "@/components/ai/CareerAssistantDrawer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex">
      {}
      <SidebarNav
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {}
        <TopHeader
          onToggleAI={() => setIsAIDrawerOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>

      {}
      <CareerAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />
    </div>
  )
}
