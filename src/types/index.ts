export type UserRole = 'freelancer' | 'client';

export type MilestoneStatus =
  | 'DRAFT'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'CHANGES_REQUESTED'
  | 'RELEASED'
  | 'DISPUTED';

export interface Deliverable {
  id: string;
  title: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'figma' | 'code' | 'archive';
  fileUrl: string; // High-res master asset
  watermarkedUrl?: string; // Watermarked preview
  fileSize: string;
  uploadedAt: string;
  version: number;
  description?: string;
  dimensions?: string;
}

export interface Revision {
  id: string;
  milestoneId: string;
  versionNumber: number;
  requestedAt: string;
  author: 'client' | 'freelancer';
  feedback: string;
  changeCategory: 'layout' | 'typography' | 'colors' | 'copy' | 'scope_tweak';
  status: 'pending' | 'addressed';
  freelancerNotes?: string;
}

export interface PaymentRecord {
  transactionId: string;
  paymentDate: string;
  milestoneAmount: number;
  currency: 'INR' | 'USD';
  clientFeePercentage: number; // e.g. 5.5%
  clientFeeAmount: number;
  freelancerFeePercentage: number; // e.g. 3.5%
  freelancerFeeAmount: number;
  clientTotalPaid: number;
  freelancerNetPayout: number;
  paymentGateway: 'Simulated Escrow' | 'Razorpay Route' | 'Stripe Connect';
  paymentMethod: string;
  invoiceNumber: string;
  receiptNumber: string;
  ipAssignmentClauseAccepted: boolean;
  chargebackWaiverAccepted: boolean;
  releasedAt?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  scopeItems: string[];
  amount: number;
  currency: 'INR' | 'USD';
  dueDate: string;
  status: MilestoneStatus;
  revisionLimit: number;
  revisionsUsed: number;
  deliverables: Deliverable[];
  revisions: Revision[];
  payment?: PaymentRecord;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAvatar: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerEmail: string;
  freelancerAvatar: string;
  freelancerGstin?: string;
  clientGstin?: string;
  currency: 'INR' | 'USD';
  milestones: Milestone[];
  shareableClientToken: string;
  activeMilestoneId: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
