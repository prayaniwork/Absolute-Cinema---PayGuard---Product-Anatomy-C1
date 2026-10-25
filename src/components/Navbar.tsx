import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  ShieldCheck,
  RotateCcw,
  FileText,
  UserCheck,
  ExternalLink,
  Receipt,
} from 'lucide-react';

interface NavbarProps {
  onOpenToS: () => void;
  onOpenReceipt: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenToS, onOpenReceipt }) => {
  const { role, setRole, project, resetToDemo, addToast } = useProject();

  const copyMagicLink = () => {
    const url = `${window.location.origin}?guestToken=${project.shareableClientToken}`;
    navigator.clipboard?.writeText(url);
    addToast(
      'Client Magic Link Copied! 🔗',
      'Zero portal fatigue: Client can open this link to preview, fund, and approve without creating a password.',
      'info'
    );
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand & Tagline */}
        <div className="brand-group">
          <div className="brand-badge">
            <ShieldCheck size={22} className="brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-title">PayGuard</span>
              <span className="brand-tag">TACTILE ESCROW</span>
            </div>
            <p className="brand-subtitle">
              Folder Milestones • Pinned Calendar • Thermal Receipt Invoices
            </p>
          </div>
        </div>

        {/* Persona Switcher & Actions */}
        <div className="nav-controls">
          {/* Persona Switcher */}
          <div className="role-switcher-container">
            <div className="role-switcher-label font-mono">PERSONA:</div>
            <div className="role-pill-group">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`role-tab ${role === 'freelancer' ? 'active-freelancer' : ''}`}
                title="Manage milestones, upload deliverables, view earnings"
              >
                <span className="role-indicator-dot dot-freelancer" />
                Freelancer View
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`role-tab ${role === 'client' ? 'active-client' : ''}`}
                title="Guest Magic Link experience: zero login needed, preview watermarked assets & release funds"
              >
                <span className="role-indicator-dot dot-client" />
                Client Link
                <span className="guest-badge font-mono">Guest</span>
              </button>
            </div>
          </div>

          {/* Quick Thermal Receipt View */}
          <button
            type="button"
            onClick={onOpenReceipt}
            className="btn-tactile btn-tactile-primary"
            title="Open PayGuard Machine Thermal Receipt"
          >
            <Receipt size={15} />
            <span>Thermal Invoice</span>
          </button>

          {/* Share Client Magic Link */}
          <button
            type="button"
            onClick={copyMagicLink}
            className="btn-tactile btn-tactile-secondary"
            title="Copy client magic link"
          >
            <ExternalLink size={14} />
            <span>Share Link</span>
          </button>

          {/* Terms */}
          <button
            type="button"
            onClick={onOpenToS}
            className="btn-icon-tactile"
            title="View Platform ToS"
          >
            <FileText size={16} />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetToDemo}
            className="btn-icon-tactile"
            title="Reset sandbox data"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Role Banner Notification */}
      <div className={`role-context-bar ${role === 'client' ? 'client-bar' : 'freelancer-bar'}`}>
        <div className="role-context-content">
          <UserCheck size={14} />
          {role === 'freelancer' ? (
            <span>
              <strong>Freelancer Workspace:</strong> You are viewing as <strong>{project.freelancerName}</strong> ({project.freelancerTitle}). Manage deliverables and track milestone escrow.
            </span>
          ) : (
            <span>
              <strong>Client Guest Workspace (Zero-Friction Link):</strong> You are viewing as <strong>{project.clientName}</strong> ({project.clientCompany}). Review watermarked deliverables and release funds securely.
            </span>
          )}
        </div>
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }
        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-badge {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(29, 78, 216, 0.25);
        }
        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-title {
          font-weight: 800;
          font-size: 20px;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .brand-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          letter-spacing: 0.05em;
        }
        .brand-subtitle {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .nav-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .role-switcher-container {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px 6px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }
        .role-switcher-label {
          font-size: 10px;
          color: #64748b;
          padding-left: 8px;
          font-weight: 700;
        }
        .role-pill-group {
          display: flex;
          gap: 4px;
        }
        .role-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          background: transparent;
          color: #64748b;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .role-tab:hover {
          color: #0f172a;
        }
        .active-freelancer {
          background: #ffffff;
          color: #1d4ed8;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .active-client {
          background: #ffffff;
          color: #059669;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .role-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .dot-freelancer { background: #1d4ed8; }
        .dot-client { background: #059669; }
        .guest-badge {
          font-size: 9px;
          background: #dcfce7;
          color: #15803d;
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .btn-icon-tactile {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-icon-tactile:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .role-context-bar {
          padding: 6px 24px;
          font-size: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: center;
        }
        .freelancer-bar {
          background: #eff6ff;
          color: #1e40af;
        }
        .client-bar {
          background: #f0fdf4;
          color: #166534;
        }
        .role-context-content {
          max-width: 1400px;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </header>
  );
};
