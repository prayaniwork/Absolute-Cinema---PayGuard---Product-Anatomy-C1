import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import type { Deliverable } from '../types';
import { applyWatermarkToImage } from '../utils/watermark';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Info,
  FileText,
} from 'lucide-react';
import { Buddy } from './buddy/Buddy';

interface WatermarkedViewerProps {
  onOpenPaymentModal: () => void;
  onOpenUploadModal: () => void;
}

export const WatermarkedViewer: React.FC<WatermarkedViewerProps> = ({
  onOpenPaymentModal,
  onOpenUploadModal,
}) => {
  const { activeMilestone, project, role, addToast } = useProject();
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [watermarkedSrc, setWatermarkedSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSecurityBreakdown, setShowSecurityBreakdown] = useState<boolean>(false);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Sync selected deliverable when active milestone changes
  useEffect(() => {
    if (activeMilestone?.deliverables && activeMilestone.deliverables.length > 0) {
      setSelectedDeliverable(activeMilestone.deliverables[0]);
    } else {
      setSelectedDeliverable(null);
      setWatermarkedSrc('');
    }
    setZoomLevel(1);
  }, [activeMilestone?.id]);

  // Generate watermarked preview when deliverable or status changes
  useEffect(() => {
    if (!selectedDeliverable || !activeMilestone) return;

    const isReleased = activeMilestone.status === 'RELEASED';

    if (isReleased) {
      setWatermarkedSrc(selectedDeliverable.fileUrl);
      return;
    }

    setIsProcessing(true);
    applyWatermarkToImage(selectedDeliverable.fileUrl, {
      clientName: project.clientName,
      freelancerName: project.freelancerName,
      milestoneTitle: activeMilestone.title,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isReleased: false,
    })
      .then((watermarkedData) => {
        setWatermarkedSrc(watermarkedData);
      })
      .catch(() => {
        setWatermarkedSrc(selectedDeliverable.fileUrl);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [selectedDeliverable, activeMilestone?.status, project.clientName]);

  // Handle right-click extraction protection
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeMilestone?.status !== 'RELEASED') {
      addToast(
        'Asset Extraction Blocked 🛡️',
        'Right-click save is disabled. Deliverable is protected by Absolute Cinema until milestone approval and release.',
        'warning'
      );
    }
  };

  // Handle download
  const handleDownload = () => {
    if (activeMilestone?.status !== 'RELEASED') {
      addToast(
        'Master File Locked 🔒',
        'This deliverable is a protected, view-only preview. Please release milestone payment to unlock master high-resolution assets.',
        'warning'
      );
      return;
    }

    if (!selectedDeliverable) return;

    // Trigger download of master file
    const link = document.createElement('a');
    link.href = selectedDeliverable.fileUrl;
    link.download = selectedDeliverable.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(
      'Download Started 📦',
      `Downloading master file: ${selectedDeliverable.fileName}`,
      'success'
    );
  };

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!activeMilestone) {
    return (
      <div className="viewer-placeholder glass-panel">
        <Info size={32} className="text-muted" />
        <p>Select a milestone from the list to view deliverables.</p>
      </div>
    );
  }

  const isReleased = activeMilestone.status === 'RELEASED';
  const hasDeliverables = activeMilestone.deliverables.length > 0;

  return (
    <div className="deliverable-viewer-wrapper glass-panel" ref={viewerContainerRef}>
      {/* Top Bar: Title, Version, Protection State */}
      <div className="viewer-top-bar">
        <div className="deliverable-title-meta">
          <div className="flex-center gap-2">
            <h3 className="deliverable-heading">
              {hasDeliverables
                ? selectedDeliverable?.title
                : 'Deliverable Workspace'}
            </h3>
            {hasDeliverables && (
              <span className="version-tag font-mono">
                v{selectedDeliverable?.version}
              </span>
            )}
          </div>
          <span className="deliverable-submeta">
            Milestone: <strong>{activeMilestone.title}</strong>
          </span>
        </div>

        {/* Protection Pill */}
        <div className="viewer-actions-row">
          {hasDeliverables && (
            <>
              {isReleased ? (
                <div className="security-status-pill pill-unlocked">
                  <ShieldCheck size={14} />
                  <span>MASTER UNLOCKED • COMMERCIAL RIGHTS TRANSFERRED</span>
                </div>
              ) : (
                <div
                  className="security-status-pill pill-locked cursor-pointer"
                  onClick={() => setShowSecurityBreakdown(!showSecurityBreakdown)}
                  title="Click to view security choke point details"
                >
                  <ShieldAlert size={14} />
                  <span>CHOKE POINT 2: WATERMARKED PREVIEW (DOWNLOAD LOCKED)</span>
                  <Info size={13} />
                </div>
              )}
            </>
          )}

          {/* Controls: Zoom, Fullscreen, Security */}
          <div className="viewer-btn-group">
            {hasDeliverables && (
              <>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  className="btn-icon"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="zoom-indicator font-mono">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                  className="btn-icon"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="btn-icon"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Security Breakdown Popover */}
      {showSecurityBreakdown && !isReleased && (
        <div className="security-breakdown-banner">
          <div className="breakdown-header">
            <div className="flex-center gap-2">
              <ShieldAlert size={16} className="text-amber" />
              <strong>Anti-Extraction &amp; IP Protection Protocol</strong>
            </div>
            <button
              type="button"
              onClick={() => setShowSecurityBreakdown(false)}
              className="btn-close-sm"
            >
              ×
            </button>
          </div>
          <div className="breakdown-body">
            <p>
              This deliverable is protected under <strong>Choke Point 2</strong>:
            </p>
            <ul>
              <li><strong>Dynamic Forensic Overlay:</strong> Client-stamped diagonal text watermarks discourage unauthorized use or screen-sharing.</li>
              <li><strong>Anti-Extraction Barrier:</strong> Right-click image saving, drag-and-drop extraction, and direct binary downloads are intercepted.</li>
              <li><strong>Conditional IP Assignment:</strong> Full commercial copyright only vests in the client upon final milestone approval and payment release.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Deliverable Canvas / Stage */}
      <div
        className="viewer-stage"
        onContextMenu={handleContextMenu}
        onDragStart={(e) => e.preventDefault()}
      >
        {isProcessing && (
          <div className="processing-overlay">
            <Buddy name="focused" height={64} tone="light" />
            <span>Engaging Tamper-Resistant Watermark Layer...</span>
          </div>
        )}

        {hasDeliverables && selectedDeliverable ? (
          <div className="image-viewport">
            <div
              className="image-transform-container"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={watermarkedSrc || selectedDeliverable.fileUrl}
                alt={selectedDeliverable.title}
                className={`deliverable-img ${!isReleased ? 'protected-media' : 'unlocked-media'}`}
                draggable={false}
              />

              {/* Extraction Protection Glass Shield */}
              {!isReleased && (
                <div
                  className="protection-glass-shield"
                  onContextMenu={handleContextMenu}
                  title="Deliverable is protected. Right-click save disabled."
                />
              )}
            </div>
          </div>
        ) : (
          /* Empty / Awaiting State */
          <div className="stage-empty-state">
            {activeMilestone.status === 'DRAFT' && (
              <div className="empty-card">
                <Buddy name="holding-shield" height={120} tone="light" pop />
                <h4>Milestone Not Yet Funded</h4>
                <p>
                  Work has not commenced. In Absolute Cinema, clients fund the milestone upfront to protect the freelancer before any labor is expended.
                </p>
                {role === 'client' ? (
                  <button
                    type="button"
                    onClick={onOpenPaymentModal}
                    className="btn btn-primary"
                  >
                    <Lock size={15} /> Fund Milestone ({activeMilestone.amount.toLocaleString()} INR)
                  </button>
                ) : (
                  <div className="tip-note">
                    Waiting for client ({project.clientName}) to deposit funds into escrow.
                  </div>
                )}
              </div>
            )}

            {activeMilestone.status === 'FUNDED' && (
              <div className="empty-card">
                <Buddy name={role === 'freelancer' ? 'excited' : 'thumbs-up'} height={120} tone="light" pop />
                <h4 className="text-cyan">Milestone Funded in Escrow!</h4>
                <p>
                  Funds are secured on payment rails. The freelancer ({project.freelancerName}) can now upload work deliverables.
                </p>
                {role === 'freelancer' ? (
                  <button
                    type="button"
                    onClick={onOpenUploadModal}
                    className="btn btn-primary"
                  >
                    <FileText size={15} /> Stage &amp; Upload Deliverable
                  </button>
                ) : (
                  <div className="tip-note">
                    Your deposit is held safely. The freelancer is preparing the deliverable.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Viewer Footer: Version Selector & Download Actions */}
      <div className="viewer-bottom-bar">
        {/* Version Switcher if multiple deliverables */}
        <div className="versions-row">
          {activeMilestone.deliverables.map((del) => (
            <button
              key={del.id}
              type="button"
              onClick={() => setSelectedDeliverable(del)}
              className={`version-chip ${
                selectedDeliverable?.id === del.id ? 'version-chip-active' : ''
              }`}
            >
              <span className="chip-ver">v{del.version}</span>
              <span className="chip-name">{del.fileName}</span>
            </button>
          ))}
        </div>

        {/* Action Button: Download Master or Locked Pill */}
        <div className="download-action-wrap">
          {hasDeliverables && (
            <>
              {isReleased ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-success"
                  title="Download production master asset"
                >
                  <Download size={16} /> Download Master Asset ({selectedDeliverable?.fileSize})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-secondary btn-locked"
                  title="Download locked until client approves and releases milestone"
                >
                  <Lock size={15} className="text-amber" />
                  <span>Download Locked (Release Pending)</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .deliverable-viewer-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 580px;
          position: relative;
          overflow: hidden;
        }
        .viewer-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(14, 19, 31, 0.7);
          flex-wrap: wrap;
          gap: 12px;
        }
        .deliverable-title-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .deliverable-heading {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .deliverable-submeta {
          font-size: 12px;
          color: var(--text-muted);
        }
        .version-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 4px;
          background: rgba(0, 242, 254, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 242, 254, 0.3);
        }
        .viewer-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .security-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-family: var(--font-mono);
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.03em;
        }
        .pill-locked {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .pill-locked:hover {
          background: rgba(245, 158, 11, 0.2);
        }
        .pill-unlocked {
          background: rgba(16, 185, 129, 0.14);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .viewer-btn-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-card);
        }
        .btn-icon {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        .zoom-indicator {
          font-size: 11px;
          color: var(--text-muted);
          padding: 0 4px;
          min-width: 38px;
          text-align: center;
        }
        .security-breakdown-banner {
          background: #111726;
          border-bottom: 1px solid rgba(245, 158, 11, 0.3);
          padding: 14px 20px;
          animation: slideUp 0.2s ease-out;
        }
        .breakdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 13px;
        }
        .btn-close-sm {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
        }
        .btn-close-sm:hover {
          color: var(--text-primary);
        }
        .breakdown-body {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .breakdown-body ul {
          margin-top: 6px;
          margin-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .breakdown-body strong {
          color: var(--text-primary);
        }
        .viewer-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, #0e1422 0%, #07090e 100%);
          position: relative;
          min-height: 440px;
          overflow: auto;
          user-select: none;
          -webkit-user-select: none;
        }
        .image-viewport {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .image-transform-container {
          position: relative;
          transition: transform 0.2s ease-out;
          display: inline-block;
          max-width: 100%;
        }
        .deliverable-img {
          display: block;
          max-width: 100%;
          max-height: 520px;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          pointer-events: none;
        }
        .protected-media {
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .unlocked-media {
          border: 1px solid rgba(16, 185, 129, 0.5);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.2);
        }
        .protection-glass-shield {
          position: absolute;
          inset: 0;
          background: transparent;
          cursor: not-allowed;
          z-index: 10;
        }
        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(7, 9, 14, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 13px;
          font-family: var(--font-mono);
          color: var(--accent-cyan);
          z-index: 30;
        }
        .stage-empty-state {
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-card {
          max-width: 440px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          background: rgba(14, 19, 31, 0.85);
          border: 1px dashed var(--border-card);
          padding: 32px 24px;
          border-radius: var(--radius-xl);
        }
        .empty-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-draft {
          background: rgba(148, 163, 184, 0.12);
          color: #94a3b8;
        }
        .icon-funded {
          background: rgba(0, 242, 254, 0.15);
          color: var(--accent-cyan);
        }
        .empty-card h4 {
          font-size: 18px;
          font-weight: 700;
        }
        .empty-card p {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .tip-note {
          font-size: 12px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
        }
        .viewer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: rgba(14, 19, 31, 0.8);
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 12px;
        }
        .versions-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }
        .version-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .version-chip:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        .version-chip-active {
          background: rgba(0, 242, 254, 0.12);
          border-color: rgba(0, 242, 254, 0.35);
          color: #ffffff;
        }
        .chip-ver {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--accent-cyan);
        }
        .btn-locked {
          cursor: not-allowed;
          opacity: 0.85;
        }
        .btn-locked:hover {
          border-color: rgba(245, 158, 11, 0.4);
        }
        .flex-center {
          display: flex;
          align-items: center;
        }
        .gap-2 { gap: 8px; }
      `}</style>
    </div>
  );
};
