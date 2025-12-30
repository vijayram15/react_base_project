import React, { ReactNode, useState } from 'react';

// --- TYPES ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface WorkspaceShellProps {
  /** Page Title (used for document title or metadata) */
  title: string;
  /** Navigation trail displayed in the Top Bar */
  breadcrumbs: BreadcrumbItem[];
  /** The main workspace content (Search/Result panels) */
  children: ReactNode;
}

// --- PLACEHOLDER ICONS (Replace with your icon library like Lucide/FontAwesome) ---
const IconMenu = () => <span>☰</span>;
const IconAdd = () => <span>＋</span>;
const IconAudit = () => <span>📋</span>;
const IconPrint = () => <span>🖨️</span>;
const IconExport = () => <span>⬇️</span>;
const IconInfo = () => <span>ℹ️</span>;
const IconUser = () => <span>👤</span>;

/**
 * WorkspaceShell
 * LOCATION: src/components/layout/WorkspaceShell.tsx
 * PURPOSE: The global layout frame. Manages the Sidebar state and Top Bar actions.
 */
export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({ 
  title, 
  breadcrumbs, 
  children 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="workspace-shell">
      
      {/* 1. NAVIGATION DRAWER (Collapsible Sidebar) */}
      <aside className={`nav-drawer ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="nav-brand">
          <span className="brand-text">SSI Finance</span>
        </div>
        
        <nav className="nav-list">
          <a href="#" className="nav-item active">Dashboard</a>
          <a href="#" className="nav-item">User Management</a>
          <a href="#" className="nav-item">Audit Logs</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
      </aside>

      {/* 2. MAIN VIEWPORT (Right Side) */}
      <div className="main-viewport">
        
        {/* A. TOP BAR (Fixed Header) */}
        <header className="top-bar">
          
          {/* Left: Toggle & Breadcrumbs */}
          <div className="top-bar-left">
            <button 
              className="icon-btn toggle-btn" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              title="Toggle Menu"
            >
              <IconMenu />
            </button>

            <div className="breadcrumb-trail">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="breadcrumb-item">
                  {index > 0 && <span className="separator">/</span>}
                  <a 
                    href={crumb.href || '#'} 
                    className={crumb.isActive ? 'active' : ''}
                    onClick={(e) => !crumb.href && e.preventDefault()}
                  >
                    {crumb.label}
                  </a>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Global Command Toolbar */}
          <div className="top-bar-right">
            <button className="icon-btn" title="Create New"><IconAdd /></button>
            <button className="icon-btn" title="View Audit Log"><IconAudit /></button>
            <button className="icon-btn" title="Print View"><IconPrint /></button>
            <button className="icon-btn" title="Export Data"><IconExport /></button>
            
            <div className="divider"></div>
            
            <button className="icon-btn" title="Help Information"><IconInfo /></button>
            <div className="user-profile">
              <span className="user-avatar"><IconUser /></span>
              <span className="user-name">Vijay Kumar</span>
            </div>
          </div>
        </header>

        {/* B. CONTENT AREA (Scrollable Workspace) */}
        <main className="workspace-content">
          {children}
        </main>

      </div>
    </div>
  );
};
            
