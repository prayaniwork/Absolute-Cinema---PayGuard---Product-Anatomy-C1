import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Project,
  Milestone,
  Deliverable,
  UserRole,
  ToastMessage,
} from '../types';
import { INITIAL_PROJECT } from '../state/initialData';
import { calculateSplit, generateMockDeliverableArt } from '../utils/watermark';

const STORAGE_KEY = 'absolute_cinema_project_v1';

interface ProjectContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  project: Project;
  activeMilestone: Milestone | undefined;
  setActiveMilestoneId: (id: string) => void;
  fundMilestone: (
    milestoneId: string,
    paymentMethod: string,
    gateway: 'Simulated Escrow' | 'Razorpay Route' | 'Stripe Connect'
  ) => void;
  uploadDeliverable: (
    milestoneId: string,
    title: string,
    fileName: string,
    fileType: 'image' | 'pdf' | 'figma' | 'code' | 'archive',
    fileUrl?: string
  ) => void;
  submitMilestoneForApproval: (milestoneId: string) => void;
  requestChanges: (
    milestoneId: string,
    feedback: string,
    category: 'layout' | 'typography' | 'colors' | 'copy' | 'scope_tweak'
  ) => void;
  approveAndReleaseMilestone: (milestoneId: string) => void;
  createMilestone: (data: {
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    scopeItems: string[];
    revisionLimit: number;
  }) => void;
  resetToDemo: () => void;
  toasts: ToastMessage[];
  addToast: (
    title: string,
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error'
  ) => void;
  removeToast: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<UserRole>('freelancer');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [project, setProject] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECT;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [project]);

  const addToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeMilestone =
    project.milestones.find((m) => m.id === project.activeMilestoneId) ||
    project.milestones[0];

  const setActiveMilestoneId = (id: string) => {
    setProject((prev) => ({ ...prev, activeMilestoneId: id }));
  };

  /**
   * Action: Fund Milestone
   * Client deposits / authorizes funds into escrow choke-point
   */
  const fundMilestone = (
    milestoneId: string,
    paymentMethod: string,
    gateway: 'Simulated Escrow' | 'Razorpay Route' | 'Stripe Connect'
  ) => {
    setProject((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        const split = calculateSplit(m.amount);
        const randId = Math.floor(100000 + Math.random() * 900000);
        const invoiceNum = `INV-AC-${new Date().getFullYear()}-${randId.toString().slice(-4)}`;
        const receiptNum = `REC-AC-${new Date().getFullYear()}-${randId.toString().slice(-4)}`;

        return {
          ...m,
          status: 'FUNDED' as const,
          updatedAt: new Date().toISOString(),
          payment: {
            transactionId: `TXN_AC_${randId}`,
            paymentDate: new Date().toISOString(),
            milestoneAmount: m.amount,
            currency: m.currency,
            clientFeePercentage: split.clientFeePercentage,
            clientFeeAmount: split.clientFeeAmount,
            freelancerFeePercentage: split.freelancerFeePercentage,
            freelancerFeeAmount: split.freelancerFeeAmount,
            clientTotalPaid: split.clientTotalPaid,
            freelancerNetPayout: split.freelancerNetPayout,
            paymentGateway: gateway,
            paymentMethod,
            invoiceNumber: invoiceNum,
            receiptNumber: receiptNum,
            ipAssignmentClauseAccepted: true,
            chargebackWaiverAccepted: true,
          },
        };
      });

      return { ...prev, milestones: updated };
    });

    addToast(
      'Milestone Funded Successfully! 🛡️',
      'Funds are securely committed in escrow. Freelancer is authorized to begin work.',
      'success'
    );
  };

  /**
   * Action: Upload Deliverable
   * Freelancer uploads preview deliverable
   */
  const uploadDeliverable = (
    milestoneId: string,
    title: string,
    fileName: string,
    fileType: 'image' | 'pdf' | 'figma' | 'code' | 'archive',
    fileUrl?: string
  ) => {
    setProject((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        const newVersion = m.deliverables.length + 1;
        const fallbackArt =
          fileType === 'image'
            ? generateMockDeliverableArt(newVersion % 2 === 0 ? 'app' : 'brand')
            : generateMockDeliverableArt('brand');

        const newDel: Deliverable = {
          id: `del_${Date.now()}`,
          title: title || `Deliverable v${newVersion}`,
          fileName: fileName || `NexusCloud_Asset_v${newVersion}.png`,
          fileType,
          fileUrl: fileUrl || fallbackArt,
          fileSize: '5.4 MB',
          uploadedAt: new Date().toISOString(),
          version: newVersion,
          dimensions: '1440 x 960 px',
          description: `Version ${newVersion} deliverable prepared for client review. Protected by Absolute Cinema watermark.`,
        };

        return {
          ...m,
          status: 'IN_PROGRESS' as const,
          deliverables: [newDel, ...m.deliverables],
          updatedAt: new Date().toISOString(),
        };
      });

      return { ...prev, milestones: updated };
    });

    addToast(
      'Deliverable Staged 📁',
      'Watermarking engine has processed the asset. Ready to submit for client review.',
      'info'
    );
  };

  /**
   * Action: Submit for Approval
   * Freelancer formally submits milestone for client inspection
   */
  const submitMilestoneForApproval = (milestoneId: string) => {
    setProject((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          status: 'SUBMITTED' as const,
          updatedAt: new Date().toISOString(),
        };
      });
      return { ...prev, milestones: updated };
    });

    addToast(
      'Submitted for Approval 🚀',
      'Client notified with watermarked view-only link. Deliverable extraction locked until release.',
      'info'
    );
  };

  /**
   * Action: Request Changes
   * Client reviews watermarked work and requests revision
   */
  const requestChanges = (
    milestoneId: string,
    feedback: string,
    category: 'layout' | 'typography' | 'colors' | 'copy' | 'scope_tweak'
  ) => {
    setProject((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        const newRevisionCount = m.revisionsUsed + 1;
        const newRev = {
          id: `rev_${Date.now()}`,
          milestoneId,
          versionNumber: newRevisionCount,
          requestedAt: new Date().toISOString(),
          author: 'client' as const,
          changeCategory: category,
          feedback,
          status: 'pending' as const,
        };

        return {
          ...m,
          status: 'CHANGES_REQUESTED' as const,
          revisionsUsed: newRevisionCount,
          revisions: [newRev, ...m.revisions],
          updatedAt: new Date().toISOString(),
        };
      });
      return { ...prev, milestones: updated };
    });

    addToast(
      'Revision Request Submitted 🔄',
      'Freelancer notified with formal feedback. Revision counter updated.',
      'warning'
    );
  };

  /**
   * Action: Approve & Release Milestone
   * Client releases funds, unlock master asset download, generate invoice & receipt
   */
  const approveAndReleaseMilestone = (milestoneId: string) => {
    setProject((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        return {
          ...m,
          status: 'RELEASED' as const,
          updatedAt: new Date().toISOString(),
          payment: m.payment
            ? {
                ...m.payment,
                releasedAt: new Date().toISOString(),
              }
            : undefined,
        };
      });
      return { ...prev, milestones: updated };
    });

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#10B981', '#7C3AED', '#F59E0B'],
      });
    } catch {
      // Ignored
    }

    addToast(
      'Milestone Released & Approved! 🎉',
      'Master high-resolution assets are unlocked for client. Payout scheduled & Tax Invoice generated.',
      'success'
    );
  };

  /**
   * Action: Create New Milestone
   */
  const createMilestone = (data: {
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    scopeItems: string[];
    revisionLimit: number;
  }) => {
    const newId = `ms_${Date.now()}`;
    const newMilestone: Milestone = {
      id: newId,
      projectId: project.id,
      title: data.title,
      description: data.description,
      amount: data.amount,
      currency: project.currency,
      dueDate: data.dueDate,
      scopeItems: data.scopeItems.filter(Boolean),
      revisionLimit: data.revisionLimit || 2,
      revisionsUsed: 0,
      status: 'DRAFT',
      deliverables: [],
      revisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProject((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
      activeMilestoneId: newId,
    }));

    addToast(
      'Milestone Created 📋',
      'Milestone defined with scope, price, and revision limit. Ready for client funding.',
      'success'
    );
  };

  /**
   * Reset to initial state
   */
  const resetToDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProject(INITIAL_PROJECT);
    addToast(
      'Reset to Demo Sandbox 🔄',
      'All demo milestones, files, and escrow cycles restored to initial state.',
      'info'
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        role,
        setRole,
        project,
        activeMilestone,
        setActiveMilestoneId,
        fundMilestone,
        uploadDeliverable,
        submitMilestoneForApproval,
        requestChanges,
        approveAndReleaseMilestone,
        createMilestone,
        resetToDemo,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
