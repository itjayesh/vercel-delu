export interface Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

export type User = Document & {
  // $id from Document is the userId from Appwrite Auth
  name: string;
  phone: string;
  email: string;
  password?: string; // Added for mock auth
  block: string;
  profilePhotoUrl: string; // Will store Appwrite File ID, but resolved to URL in app state
  collegeIdUrl:string; // Will store Appwrite File ID, but resolved to URL in app state
  rating: number;
  deliveriesCompleted: number;
  walletBalance: number;
  isAdmin: boolean;
  referralCode: string;
  referredByCode?: string;
  firstRechargeCompleted: boolean;
  usedCouponCodes: string; // JSON string of the map
};

export enum GigStatus {
  OPEN = 'OPEN',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

// Storing a subset of user info to avoid large document reads
export interface GigUser {
    id: string;
    name: string;
    phone: string;
    email: string;
}

export type Gig = Document & {
  requester: string; // JSON string of GigUser
  deliverer?: string; // JSON string of GigUser
  parcelInfo: string;
  pickupBlock: string;
  destinationBlock: string;
  price: number;
  deliveryDeadline: string; // ISO Date string
  postedAt: string; // ISO Date string
  status: GigStatus;
  otp: string;
  acceptanceSelfieUrl?: string; // Appwrite File ID
  note?: string;
  size?: 'Small' | 'Medium' | 'Large';
  isUrgent?: boolean;
  // Feedback fields
  requesterRating?: number;
  requesterComments?: string;
  delivererRating?: number;
  delivererComments?: string;
};

export enum WalletRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type WalletLoadRequest = Document & {
    userId: string;
    userName: string;
    amount: number;
    utr: string;
    screenshotUrl: string; // Appwrite File ID
    status: WalletRequestStatus;
    requestedAt: string; // ISO Date string
    couponCode?: string;
};

export enum WithdrawalRequestStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  REJECTED = 'REJECTED',
}

export type WithdrawalRequest = Document & {
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  status: WithdrawalRequestStatus;
  requestedAt: string; // ISO Date string
};

export type TransactionType = 'CREDIT' | 'DEBIT' | 'TOPUP' | 'PAYOUT' | 'WITHDRAWAL';

export type Transaction = Document & {
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    timestamp: string; // ISO Date string
    relatedGigId?: string;
};

export type Coupon = Document & {
  code: string;
  bonusPercentage: number;
  isActive: boolean;
  maxUsesPerUser: number;
};
