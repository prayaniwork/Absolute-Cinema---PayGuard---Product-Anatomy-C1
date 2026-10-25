import React from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency, calculateSplit } from '../utils/watermark';
import {
  Lock,
  Eye,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building2,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ProjectHeader: React.FC = () => {
  const { project } = useProject();

  // Calculate project financial metrics
  const totalContract = project.milestones.reduce((acc, m) => acc + m.amount, 0);
  const releasedAmount = project.milestones
    .filter((m) => m.status === 'RELEASED')
    .reduce((acc, m) => acc + m.amount, 0);
  const escrowHeldAmount = project.milestones
    .filter((m) => ['FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'CHANGES_REQUESTED'].includes(m.status))
    .reduce((acc, m) => acc + m.amount, 0);
  const pendingFunding = project.milestones
    .filter((m) => m.status === 'DRAFT')
    .reduce((acc, m) => acc + m.amount, 0);

  // Freelancer Advantage savings vs 20% marketplace cut
  const totalSplit = calculateSplit(totalContract);

  return (
    <section className="project-header-section">
      <div className="project-header-container">
        {/* Top: Title & Participants Row */}
        <div className="title-participants-row">
          <div className="project-meta-col">
            <div className="contract-status-badge">
              <span className="pulse-dot" style={{ color: '#10B981' }} />
              ACTIVE ESCROW-MEDIATED CONTRACT
            </div>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-desc">{project.description}</p>
          </div>

          <div className="participants-card glass-panel">
            <div className="participant-item">
              <img
                src={project.freelancerAvatar}
                alt={project.freelancerName}
                className="avatar-img"
              />
              <div className="participant-info">
                <span className="participant-label">
                  <User size={12} /> FREELANCER (CREATOR)
                </span>
                <span className="participant-name">{project.freelancerName}</span>
                <span className="participant-sub">{project.freelancerTitle}</span>
              </div>
            </div>

            <div className="participant-divider" />

            <div className="participant-item">
              <img
                src={project.clientAvatar}
                alt={project.clientName}
                className="avatar-img"
              />
              <div className="participant-info">
                <span className="participant-label client-label">
                  <Building2 size={12} /> CLIENT (BUYER)
                </span>
                <span className="participant-name">{project.clientName}</span>
                <span className="participant-sub">{project.clientCompany}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: 3 Choke Points Trust Ribbon */}
        <div className="choke-points-ribbon">
          <div className="choke-ribbon-title">
            <ShieldCheck size={16} className="text-cyan" />
            <span>3 DELIBERATE CHOKE POINTS ENFORCING TRUST</span>
          </div>

          <div className="choke-grid">
            <div className="choke-step">
              <div className="choke-icon-wrap icon-cyan">
                <Lock size={15} />
              </div>
              <div className="choke-text">
                <strong>1. Pre-Funded Milestone:</strong> Funds locked before work starts. Freelancer is protected against non-payment.
              </div>
            </div>

            <div className="choke-arrow">→</div>

            <div className="choke-step">
              <div className="choke-icon-wrap icon-amber">
                <Eye size={15} />
              </div>
              <div className="choke-text">
                <strong>2. Watermarked Preview:</strong> Client reviews high-res view-only copy. Download locked until released.
              </div>
            </div>

            <div className="choke-arrow">→</div>

            <div className="choke-step">
              <div className="choke-icon-wrap icon-emerald">
                <CheckCircle2 size={15} />
              </div>
              <div className="choke-text">
                <strong>3. Sign-off &amp; Instant Release:</strong> Client approves; original assets unlock, tax invoice &amp; receipt issued.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Financial Escrow KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card glass-panel">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL CONTRACT VALUE</span>
              <DollarSign size={16} className="text-muted" />
            </div>
            <div className="kpi-value font-mono">
              {formatCurrency(totalContract, project.currency)}
            </div>
            <div className="kpi-subtext">
              {project.milestones.length} Milestones ({formatCurrency(pendingFunding, project.currency)} unfunded)
            </div>
          </div>

          <div className="kpi-card glass-panel border-cyan">
            <div className="kpi-header">
              <span className="kpi-title text-cyan">HELD IN ESCROW (FUNDED)</span>
              <Lock size={16} className="text-cyan" />
            </div>
            <div className="kpi-value font-mono text-cyan">
              {formatCurrency(escrowHeldAmount, project.currency)}
            </div>
            <div className="kpi-subtext">
              Committed by client on payment rails
            </div>
          </div>

          <div className="kpi-card glass-panel border-emerald">
            <div className="kpi-header">
              <span className="kpi-title text-emerald">SETTLED &amp; RELEASED</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <div className="kpi-value font-mono text-emerald">
              {formatCurrency(releasedAmount, project.currency)}
            </div>
            <div className="kpi-subtext">
              Assets unlocked &amp; tax invoices generated
            </div>
          </div>

          <div className="kpi-card glass-panel highlight-advantage">
            <div className="kpi-header">
              <span className="kpi-title text-emerald">
                <Zap size={14} className="inline-icon" /> 55/45 FREELANCER ADVANTAGE
              </span>
              <TrendingUp size={16} className="text-emerald" />
            </div>
            <div className="kpi-value font-mono text-emerald">
              +{formatCurrency(totalSplit.freelancerSavings, project.currency)}
            </div>
            <div className="kpi-subtext">
              Freelancer saves vs. standard 20% platform cut
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .project-header-section {
          padding: 28px 24px 16px 24px;
          border-bottom: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, rgba(14, 19, 31, 0.4) 0%, transparent 100%);
        }
        .project-header-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .title-participants-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }
        .project-meta-col {
          flex: 1;
          min-width: 320px;
        }
        .contract-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }
        .project-title {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .project-desc {
          font-size: 14px;
          color: var(--text-secondary);
          max-width: 720px;
          line-height: 1.5;
        }
        .participants-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 18px;
          background: rgba(14, 19, 31, 0.85);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
        }
        .participant-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.15);
        }
        .participant-info {
          display: flex;
          flex-direction: column;
        }
        .participant-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.05em;
        }
        .client-label {
          color: var(--accent-emerald);
        }
        .participant-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .participant-sub {
          font-size: 11px;
          color: var(--text-muted);
        }
        .participant-divider {
          width: 1px;
          height: 38px;
          background: rgba(255, 255, 255, 0.1);
        }
        .choke-points-ribbon {
          background: rgba(11, 15, 26, 0.7);
          border: 1px solid rgba(0, 242, 254, 0.18);
          border-radius: var(--radius-md);
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .choke-ribbon-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          white-space: nowrap;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding-right: 16px;
        }
        .choke-grid {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          flex-wrap: wrap;
        }
        .choke-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .choke-step strong {
          color: var(--text-primary);
        }
        .choke-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-cyan {
          background: rgba(0, 242, 254, 0.15);
          color: var(--accent-cyan);
        }
        .icon-amber {
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent-amber);
        }
        .icon-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald);
        }
        .choke-arrow {
          color: var(--text-muted);
          font-size: 13px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }
        .kpi-card {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .border-cyan {
          border-color: rgba(0, 242, 254, 0.25);
        }
        .border-emerald {
          border-color: rgba(16, 185, 129, 0.25);
        }
        .highlight-advantage {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 19, 31, 0.9) 100%);
          border-color: rgba(16, 185, 129, 0.35);
        }
        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kpi-title {
          font-size: 11px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .kpi-value {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .kpi-subtext {
          font-size: 12px;
          color: var(--text-muted);
        }
        .text-cyan { color: var(--accent-cyan); }
        .text-emerald { color: var(--accent-emerald); }
        .text-amber { color: var(--accent-amber); }
        .inline-icon { display: inline-block; vertical-align: middle; margin-right: 4px; }
      `}</style>
    </section>
  );
};
