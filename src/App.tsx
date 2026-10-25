import React, { useState } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { MilestonePhaseCards } from './components/MilestonePhaseCards';
import { TactileCalendar } from './components/TactileCalendar';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { WatermarkedViewer } from './components/WatermarkedViewer';
import { ReviewApprovalBar } from './components/ReviewApprovalBar';
import { PaymentModal } from './components/PaymentModal';
import { UploadDeliverableModal } from './components/UploadDeliverableModal';
import { RevisionDrawer } from './components/RevisionDrawer';
import { CreateMilestoneModal } from './components/CreateMilestoneModal';
import { ToSModal } from './components/ToSModal';
import { ToastContainer } from './components/ToastContainer';
import { Calendar, CheckCircle2, ShieldCheck, Receipt } from 'lucide-react';
import { formatCurrency } from './utils/watermark';
import { Buddy } from './components/buddy/Buddy';

const WorkspaceContent: React.FC = () => {
  const { activeMilestone, project } = useProject();

  // Modal Visibility States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [isToSOpen, setIsToSOpen] = useState(false);

  const totalContract = project.milestones.reduce((acc, m) => acc + m.amount, 0);

  return (
    <div className="workspace-root">
      {/* Top Navigation */}
      <Navbar
        onOpenToS={() => setIsToSOpen(true)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
      />

      {/* Main Workspace */}
      <main className="workspace-main-container">
        {/* Project Header Banner */}
        <div className="tactile-project-banner">
          <Buddy name="main" height={116} className="banner-buddy" />
          <div className="banner-left">
            <div className="project-client-chip font-mono">
              <ShieldCheck size={14} className="text-primary" />
              <span>ACTIVE ESCROW PROJECT • {project.clientCompany}</span>
            </div>
            <h1 className="project-headline">{project.title}</h1>
            <p className="project-subtext">{project.description}</p>
          </div>

          <div className="banner-right">
            <div className="quick-stats-pill">
              <span className="stats-label font-mono">TOTAL ESCROW VALUE</span>
              <span className="stats-value font-mono font-bold">
                {formatCurrency(totalContract, project.currency)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsReceiptOpen(true)}
              className="btn-tactile btn-tactile-primary"
            >
              <Receipt size={16} /> View Thermal Receipt
            </button>
          </div>
        </div>

        {/* STEP 1: THE 4 MILESTONE PHASE FOLDER CARDS */}
        <MilestonePhaseCards />

        {/* ACTIVE DELIVERABLE INSPECTION & CHOKE POINT REVIEW */}
        <section className="active-deliverable-section">
          {activeMilestone && (
            <>
              {/* Active Milestone Scope Card */}
              <div className="active-scope-card">
                <div className="scope-header">
                  <div>
                    <span className="font-mono text-xs text-primary font-bold">
                      INSPECTING MILESTONE
                    </span>
                    <h3 className="scope-heading">{activeMilestone.title}</h3>
                    <p className="scope-summary">{activeMilestone.description}</p>
                  </div>

                  <div className="scope-date-pill font-mono">
                    <Calendar size={13} />
                    <span>Target: {activeMilestone.dueDate}</span>
                  </div>
                </div>

                {activeMilestone.scopeItems.length > 0 && (
                  <div className="scope-tags-wrapper">
                    <span className="scope-tag-title font-mono">AGREED CRITERIA:</span>
                    <div className="scope-tags-list">
                      {activeMilestone.scopeItems.map((item, idx) => (
                        <span key={idx} className="scope-criteria-tag">
                          <CheckCircle2 size={12} className="check-icon" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Watermarked Deliverable Preview */}
              <WatermarkedViewer
                onOpenPaymentModal={() => setIsPaymentOpen(true)}
                onOpenUploadModal={() => setIsUploadOpen(true)}
              />

              {/* Formal Review & Approval Action Bar */}
              <ReviewApprovalBar
                onOpenPaymentModal={() => setIsPaymentOpen(true)}
                onOpenUploadModal={() => setIsUploadOpen(true)}
                onOpenRevisionDrawer={() => setIsRevisionOpen(true)}
                onOpenInvoiceModal={() => setIsReceiptOpen(true)}
              />
            </>
          )}
        </section>

        {/* STEP 2: THE CALENDAR & DELIVERY SCHEDULE */}
        <TactileCalendar />
      </main>

      {/* STEP 3: THE THERMAL PRINTED RECEIPT MODAL (EMERGING FROM MACHINE OVER MEADOW) */}
      <ThermalReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Workflow Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <UploadDeliverableModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <RevisionDrawer
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
      />

      <CreateMilestoneModal
        isOpen={isCreateMilestoneOpen}
        onClose={() => setIsCreateMilestoneOpen(false)}
      />

      <ToSModal isOpen={isToSOpen} onClose={() => setIsToSOpen(false)} />

      <style>{`
        .workspace-root {
          min-height: 100vh;
          background: #f6f7f9;
        }
        .workspace-main-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .tactile-project-banner {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px 28px;
          border: 1px solid rgba(0, 0, 0, 0.07);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .banner-left {
          flex: 1;
          min-width: 320px;
        }
        .banner-buddy {
          margin: -8px 4px -8px -4px;
        }
        @media (max-width: 720px) {
          .banner-buddy { display: none; }
        }
        .project-client-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #1d4ed8;
          background: #eff6ff;
          padding: 3px 10px;
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
          margin-bottom: 8px;
        }
        .project-headline {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .project-subtext {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
          max-width: 720px;
        }
        .banner-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .quick-stats-pill {
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 12px;
          text-align: right;
        }
        .stats-label {
          font-size: 9px;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }
        .stats-value {
          font-size: 18px;
          color: #0f172a;
        }
        .text-primary {
          color: #1d4ed8;
        }

        .active-deliverable-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 12px;
        }
        .active-scope-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 18px 24px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .scope-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }
        .scope-heading {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
        }
        .scope-summary {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
        }
        .scope-date-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 8px;
        }
        .scope-tags-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 6px;
          border-top: 1px dashed #f1f5f9;
        }
        .scope-tag-title {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
        }
        .scope-tags-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .scope-criteria-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .check-icon {
          color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <WorkspaceContent />
    </ProjectProvider>
  );
}
