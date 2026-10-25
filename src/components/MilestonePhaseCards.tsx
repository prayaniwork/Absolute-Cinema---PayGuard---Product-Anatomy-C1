import React from 'react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency } from '../utils/watermark';
import { Check, ShieldCheck, Lock } from 'lucide-react';

interface MilestonePhaseCardsProps {
  onSelectMilestone?: (milestoneId: string) => void;
}

export const MilestonePhaseCards: React.FC<MilestonePhaseCardsProps> = ({
  onSelectMilestone,
}) => {
  const { project, activeMilestone, setActiveMilestoneId } = useProject();

  const handleCardClick = (id: string) => {
    setActiveMilestoneId(id);
    onSelectMilestone?.(id);
  };

  return (
    <section className="milestone-phases-wrapper">
      <div className="phases-header-row">
        <div>
          <span className="font-mono text-xs phase-badge">
            PROJECT WORKFLOW • 4 STAGES
          </span>
          <h2 className="phases-heading">Project Milestones &amp; Trust Rails</h2>
          <p className="phases-subheading">
            Each phase carries clear scope, tactile stickers, and explicit escrow protection.
          </p>
        </div>

        <div className="hand-annotation annotation-top">
          <span>select a card to inspect scope</span>
          <span className="curved-arrow">⤵</span>
        </div>
      </div>

      <div className="phases-grid">
        {/* ===================== CARD 1: STEP 1 DISCOVERY ===================== */}
        <div
          onClick={() => handleCardClick(project.milestones[0]?.id || 'ms_01')}
          className={`phase-folder-card card-peach ${
            activeMilestone?.id === (project.milestones[0]?.id || 'ms_01')
              ? 'phase-card-active'
              : ''
          }`}
        >
          {/* Top Folder Tab */}
          <div className="folder-tab tab-peach">
            <span>Step 1</span>
          </div>

          <div className="card-inner">
            {/* Top Right Polaroid Sticker */}
            <div className="sticker-polaroid">
              <img
                src={project.clientAvatar}
                alt="Client"
                className="polaroid-img"
              />
              <div className="polaroid-badge">
                <Check size={11} strokeWidth={3} />
              </div>
            </div>

            <h3 className="card-phase-title">Step 1: Discovery</h3>

            <div className="card-scope-block">
              <span className="scope-label">Scope</span>
              <ul className="scope-list">
                <li>Modern clean sans-serif typography</li>
                <li>Socratic contractional channels</li>
                <li>Brand primitive designs</li>
                <li>Conceptual illustrations</li>
              </ul>
            </div>

            {/* Handwritten note pointing with arrow */}
            <div className="handwritten-callout callout-peach">
              <span className="doodle-arrow">↖</span>
              <span className="font-hand">acting rough for now</span>
            </div>

            <div className="card-footer-row">
              <span className="phase-amount font-mono">
                {formatCurrency(project.milestones[0]?.amount || 45000, project.currency)}
              </span>
              <span className="rubber-stamp stamp-released">
                <ShieldCheck size={12} /> COMPLETED
              </span>
            </div>
          </div>
        </div>

        {/* ===================== CARD 2: STEP 2 CONCEPTUALIZATION ===================== */}
        <div
          onClick={() => handleCardClick(project.milestones[1]?.id || 'ms_02')}
          className={`phase-folder-card card-sky ${
            activeMilestone?.id === (project.milestones[1]?.id || 'ms_02')
              ? 'phase-card-active'
              : ''
          }`}
        >
          {/* Top Folder Tab */}
          <div className="folder-tab tab-sky">
            <span>Step 2</span>
          </div>

          <div className="card-inner">
            {/* Top Right Sticky Notes Sticker */}
            <div className="sticker-postits">
              <div className="postit-under">
                <span>💭</span>
              </div>
              <div className="postit-top">
                <div className="postit-pin" />
                <span className="postit-icon">✏️</span>
              </div>
            </div>

            <h3 className="card-phase-title">Step 2: Conceptualization</h3>

            <div className="card-scope-block">
              <span className="scope-label">Scope</span>
              <ul className="checklist">
                <li className="checked">
                  <span className="check-box">✓</span> Scope checklist
                </li>
                <li className="checked">
                  <span className="check-box">✓</span> Wireframe layouts &amp; flow
                </li>
                <li className="checked">
                  <span className="check-box">✓</span> Conceptual analysis
                </li>
                <li className="unchecked">
                  <span className="check-box">○</span> Interactive prototypes
                </li>
              </ul>
            </div>

            <div className="stamp-wrapper">
              <div className="rubber-stamp stamp-funded">
                FUNDED IN ESCROW
              </div>
            </div>

            <div className="card-footer-row">
              <span className="phase-amount font-mono">
                {formatCurrency(project.milestones[1]?.amount || 65000, project.currency)}
              </span>
              <span className="due-pill font-mono">Due Oct 15</span>
            </div>
          </div>
        </div>

        {/* ===================== CARD 3: STEP 3 REFINEMENT ===================== */}
        <div
          onClick={() => handleCardClick(project.milestones[2]?.id || 'ms_03')}
          className={`phase-folder-card card-lavender ${
            activeMilestone?.id === (project.milestones[2]?.id || 'ms_03')
              ? 'phase-card-active'
              : ''
          }`}
        >
          {/* Top Folder Tab */}
          <div className="folder-tab tab-lavender">
            <span>Step 3</span>
          </div>

          <div className="card-inner">
            {/* Top Right App Icon Badges Sticker */}
            <div className="sticker-app-icons">
              <div className="icon-tile tile-radial" />
              <div className="icon-tile tile-layers">
                <span>⚡</span>
              </div>
            </div>

            <h3 className="card-phase-title">Step 3: Refinement</h3>

            <div className="card-scope-block">
              <span className="scope-label">Deliverable</span>
              <p className="deliverable-text">
                Smooth app icon badge stickers &amp; high-res responsive screen specs.
              </p>
            </div>

            <div className="tag-and-doodle-row">
              <span className="tag-viewonly">
                <Lock size={11} /> Viewonly deliverable tag
              </span>

              {/* Handwritten Note pointing to revisions */}
              <div className="handwritten-callout callout-lavender">
                <span className="font-hand">2 revisions left</span>
                <span className="doodle-arrow">↗</span>
              </div>
            </div>

            <div className="card-footer-row">
              <span className="phase-amount font-mono">
                {formatCurrency(project.milestones[2]?.amount || 55000, project.currency)}
              </span>
              <span className="rubber-stamp stamp-review">
                IN CLIENT REVIEW
              </span>
            </div>
          </div>
        </div>

        {/* ===================== CARD 4: STEP 4 DELIVERY ===================== */}
        <div
          onClick={() => handleCardClick(project.milestones[3]?.id || 'ms_04')}
          className={`phase-folder-card card-mint ${
            activeMilestone?.id === (project.milestones[3]?.id || 'ms_04')
              ? 'phase-card-active'
              : ''
          }`}
        >
          {/* Top Folder Tab */}
          <div className="folder-tab tab-mint">
            <span>Step 4</span>
          </div>

          <div className="card-inner">
            {/* Top Right Color Swatches Sticker */}
            <div className="sticker-swatches">
              <div className="swatch-strip">
                <span className="swatch-chip c1" />
                <span className="swatch-chip c2" />
                <span className="swatch-chip c3" />
                <span className="swatch-chip c4" />
              </div>
              <div className="swatch-labels font-mono">
                <span>#DD</span>
                <span>#7B</span>
                <span>#76</span>
                <span>#7B</span>
              </div>
            </div>

            <h3 className="card-phase-title">Step 4: Delivery</h3>

            <div className="card-scope-block">
              <span className="scope-label">Deliverable</span>
              <p className="deliverable-text">
                Design token color swatches, master React package &amp; final release.
              </p>
            </div>

            <div className="stamp-wrapper stamp-right">
              <span className="rubber-stamp stamp-released">
                RELEASED
              </span>
            </div>

            <div className="card-footer-row">
              <span className="price-tag-pill font-mono">
                Price: {formatCurrency(project.milestones[3]?.amount || 40000, project.currency)}
              </span>
              <span className="due-pill font-mono">Final Handoff</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .milestone-phases-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 28px;
        }
        .phases-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .phase-badge {
          color: var(--color-primary);
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .phases-heading {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-top: 2px;
        }
        .phases-subheading {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .annotation-top {
          font-size: 20px;
          color: #64748b;
        }
        .curved-arrow {
          font-size: 22px;
          color: var(--color-primary);
        }
        .phases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        /* Base Folder Card */
        .phase-folder-card {
          position: relative;
          background: #ffffff;
          border-radius: 0 18px 18px 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.07);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0, 0, 0, 0.06);
          margin-top: 14px;
        }
        .phase-folder-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.1);
        }
        .phase-card-active {
          box-shadow: 0 0 0 2.5px var(--color-primary), 0 16px 36px -6px rgba(29, 78, 216, 0.18);
          transform: translateY(-2px);
        }

        /* Folder Tabs */
        .folder-tab {
          position: absolute;
          top: -14px;
          left: -1px;
          height: 15px;
          padding: 2px 16px;
          border-radius: 8px 8px 0 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-bottom: none;
        }
        .tab-peach {
          background: var(--phase-peach-tab);
          color: var(--phase-peach-text);
        }
        .tab-sky {
          background: var(--phase-sky-tab);
          color: var(--phase-sky-text);
        }
        .tab-lavender {
          background: var(--phase-lavender-tab);
          color: var(--phase-lavender-text);
        }
        .tab-mint {
          background: var(--phase-mint-tab);
          color: var(--phase-mint-text);
        }

        /* Specific card background tints */
        .card-peach { background: var(--phase-peach-bg); border-color: var(--phase-peach-border); }
        .card-sky { background: var(--phase-sky-bg); border-color: var(--phase-sky-border); }
        .card-lavender { background: var(--phase-lavender-bg); border-color: var(--phase-lavender-border); }
        .card-mint { background: var(--phase-mint-bg); border-color: var(--phase-mint-border); }

        .card-inner {
          padding: 22px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 250px;
        }
        .card-phase-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
          max-width: 170px;
        }
        .card-scope-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .scope-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .scope-list {
          list-style-type: disc;
          padding-left: 16px;
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
        }
        .checked {
          color: var(--text-secondary);
        }
        .unchecked {
          color: var(--text-muted);
        }
        .check-box {
          font-weight: 800;
          margin-right: 4px;
          color: var(--color-primary);
        }
        .deliverable-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Stickers (Top Right) */
        .sticker-polaroid {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 58px;
          height: 64px;
          background: #ffffff;
          border-radius: 6px;
          padding: 4px 4px 10px 4px;
          box-shadow: var(--shadow-sticker);
          transform: rotate(5deg);
        }
        .polaroid-img {
          width: 100%;
          height: 48px;
          border-radius: 4px;
          object-fit: cover;
        }
        .polaroid-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #0284c7;
          border-radius: 50%;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sticker-postits {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 54px;
          height: 54px;
        }
        .postit-under {
          position: absolute;
          width: 44px;
          height: 44px;
          background: #fef08a;
          border-radius: 3px;
          box-shadow: var(--shadow-sticker);
          transform: rotate(-8deg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .postit-top {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 44px;
          height: 44px;
          background: #fef9c3;
          border-radius: 3px;
          box-shadow: var(--shadow-sticker);
          transform: rotate(6deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .postit-pin {
          position: absolute;
          top: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .postit-icon { font-size: 13px; }

        .sticker-app-icons {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          gap: 6px;
        }
        .icon-tile {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          box-shadow: var(--shadow-sticker);
        }
        .tile-radial {
          background: radial-gradient(circle, #f43f5e 0%, #a855f7 100%);
        }
        .tile-layers {
          background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 14px;
        }

        .sticker-swatches {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #ffffff;
          padding: 6px 8px;
          border-radius: 8px;
          box-shadow: var(--shadow-sticker);
          transform: rotate(-3deg);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .swatch-strip {
          display: flex;
          gap: 3px;
        }
        .swatch-chip {
          width: 14px;
          height: 18px;
          border-radius: 3px;
        }
        .c1 { background: #fed7aa; }
        .c2 { background: #fb923c; }
        .c3 { background: #10b981; }
        .c4 { background: #94a3b8; }
        .swatch-labels {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          color: var(--text-muted);
        }

        /* Handwritten Doodles */
        .handwritten-callout {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 17px;
          color: #475569;
          user-select: none;
        }
        .doodle-arrow {
          font-size: 20px;
          color: var(--color-primary);
        }
        .tag-and-doodle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .tag-viewonly {
          font-size: 10px;
          font-family: var(--font-mono);
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-secondary);
          padding: 2px 7px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .card-footer-row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px dashed rgba(0, 0, 0, 0.08);
        }
        .phase-amount {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-main);
        }
        .due-pill {
          font-size: 11px;
          color: var(--text-muted);
        }
        .price-tag-pill {
          font-size: 12px;
          background: rgba(22, 163, 74, 0.1);
          color: #15803d;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
        }
        .stamp-wrapper {
          display: flex;
        }
        .stamp-right {
          justify-content: flex-end;
        }
      `}</style>
    </section>
  );
};
