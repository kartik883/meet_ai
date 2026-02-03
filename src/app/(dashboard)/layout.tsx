import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboars-sidebar';
import React from 'react'
interface Props{
    children:React.ReactNode;
}

const Layout = ({children}:Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar/>
        <main>
          {children}
        </main>
        
    </SidebarProvider>
  
    
  )
}

export default Layout
