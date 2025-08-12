import { createContext } from 'react';
import { User, Gig, WalletLoadRequest, Transaction, Coupon, WithdrawalRequest } from '../types';

export type SignupData = {
    name: string;
    phone: string;
    email: string;
    block: string;
    profilePhotoUrl: string | File;
    collegeIdUrl: string | File;
}

export type NewGigData = Omit<Gig, '$id' | '$createdAt' | '$updatedAt' | 'postedAt' | 'requester' | 'status' | 'otp' | 'acceptanceSelfieUrl' | 'deliverer'>;

export type NewWalletLoadRequestData = Omit<WalletLoadRequest, '$id' | '$createdAt' | '$updatedAt' | 'status' | 'requestedAt' | 'userId' | 'userName'>;

export type NewCouponData = Omit<Coupon, '$id' | '$createdAt' | '$updatedAt'>;


export interface AppContextType {
    currentUser: User | null;
    isAuthLoading: boolean;
    users: User[];
    gigs: Gig[];
    walletLoadRequests: WalletLoadRequest[];
    withdrawalRequests: WithdrawalRequest[];
    transactions: Transaction[];
    platformFee: number;
    offerBarText: string;
    referrerReward: number;
    refereeBonusPercentage: number;
    coupons: Coupon[];
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    signup: (userData: SignupData, password: string, referredByCode?: string) => Promise<void>;
    addGig: (gig: NewGigData) => Promise<boolean>;
    updateGig: (gigId: string, updates: Partial<Gig>) => Promise<void>;
    deleteGig: (gigId: string) => Promise<void>;
    requestWalletLoad: (requestData: NewWalletLoadRequestData, couponCode?: string) => Promise<void>;
    approveWalletLoad: (requestId: string) => Promise<void>;
    rejectWalletLoad: (requestId: string) => Promise<void>;
    requestWithdrawal: (amount: number, upiId: string) => Promise<boolean>;
    approveWithdrawal: (requestId: string) => Promise<void>;
    rejectWithdrawal: (requestId: string) => Promise<void>;
    setPlatformFee: (fee: number) => Promise<void>;
    setOfferBarText: (text: string) => Promise<void>;
    setReferrerReward: (reward: number) => Promise<void>;
    setRefereeBonusPercentage: (percentage: number) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    manualCreditUser: (phone: string, amount: number, reason: string) => Promise<boolean>;
    addCoupon: (coupon: NewCouponData) => Promise<void>;
    updateCoupon: (couponId: string, updates: Partial<Coupon>) => Promise<void>;
    deleteCoupon: (couponId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);
