import { User, Gig, Coupon, Transaction, WalletLoadRequest, WithdrawalRequest, GigStatus, GigUser, TransactionType, WalletRequestStatus, WithdrawalRequestStatus } from './types';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

export const MOCK_USERS: User[] = [
    {
        $id: 'admin-user',
        name: 'Admin',
        email: 'admin@delu.live',
        password: 'password123',
        phone: '1111111111',
        block: 'Admin Block',
        profilePhotoUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF/png?text=A',
        collegeIdUrl: 'https://placehold.co/200x120/1F2937/FFFFFF/png?text=ADMIN+ID',
        rating: 5.0,
        deliveriesCompleted: 0,
        walletBalance: 9999,
        isAdmin: true,
        referralCode: 'ADMINPRO',
        firstRechargeCompleted: true,
        usedCouponCodes: '{}',
        $createdAt: yesterday.toISOString(),
        $updatedAt: yesterday.toISOString(),
    },
    {
        $id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@delu.live',
        password: 'password123',
        phone: '9876543210',
        block: 'A-101',
        profilePhotoUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=A',
        collegeIdUrl: 'https://placehold.co/200x120/1F2937/FFFFFF/png?text=ID-123',
        rating: 4.8,
        deliveriesCompleted: 15,
        walletBalance: 250.50,
        isAdmin: false,
        referralCode: 'ALICE4U',
        referredByCode: 'BOB25',
        firstRechargeCompleted: true,
        usedCouponCodes: '{"WELCOME10": 1}',
        $createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        $updatedAt: yesterday.toISOString(),
    },
     {
        $id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@delu.live',
        password: 'password123',
        phone: '8765432109',
        block: 'B-204',
        profilePhotoUrl: 'https://placehold.co/100x100/F59E0B/FFFFFF/png?text=B',
        collegeIdUrl: 'https://placehold.co/200x120/1F2937/FFFFFF/png?text=ID-456',
        rating: 4.9,
        deliveriesCompleted: 22,
        walletBalance: 75.00,
        isAdmin: false,
        referralCode: 'BOB25',
        firstRechargeCompleted: true,
        usedCouponCodes: '{}',
        $createdAt: yesterday.toISOString(),
        $updatedAt: yesterday.toISOString(),
    }
];

const gigUser1: GigUser = { id: 'user-1', name: 'Alice Johnson', phone: '9876543210', email: 'alice@delu.live' };
const gigUser2: GigUser = { id: 'user-2', name: 'Bob Smith', phone: '8765432109', email: 'bob@delu.live' };

export const MOCK_GIGS: Gig[] = [
    {
        $id: 'gig-1',
        requester: JSON.stringify(gigUser1),
        parcelInfo: 'Large Amazon Box',
        pickupBlock: 'Main Gate',
        destinationBlock: 'A-101',
        price: 50,
        deliveryDeadline: oneHourFromNow.toISOString(),
        postedAt: now.toISOString(),
        status: GigStatus.OPEN,
        otp: '123456',
        size: 'Large',
        isUrgent: true,
        note: "It's a bit heavy.",
        $createdAt: now.toISOString(),
        $updatedAt: now.toISOString(),
    },
    {
        $id: 'gig-2',
        requester: JSON.stringify(gigUser2),
        deliverer: JSON.stringify(gigUser1),
        parcelInfo: 'Swiggy Food Order',
        pickupBlock: 'Cafeteria',
        destinationBlock: 'B-204',
        price: 30,
        deliveryDeadline: tomorrow.toISOString(),
        postedAt: yesterday.toISOString(),
        status: GigStatus.ACCEPTED,
        otp: '654321',
        size: 'Small',
        isUrgent: false,
        acceptanceSelfieUrl: 'https://placehold.co/200x200/4F46E5/FFFFFF/png?text=Selfie',
        $createdAt: yesterday.toISOString(),
        $updatedAt: yesterday.toISOString(),
    },
    {
        $id: 'gig-3',
        requester: JSON.stringify(gigUser1),
        deliverer: JSON.stringify(gigUser2),
        parcelInfo: 'Library Book',
        pickupBlock: 'Library',
        destinationBlock: 'A-101',
        price: 25,
        deliveryDeadline: yesterday.toISOString(),
        postedAt: new Date(yesterday.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        status: GigStatus.COMPLETED,
        otp: '987654',
        size: 'Medium',
        requesterRating: 5,
        requesterComments: "Super fast delivery!",
        $createdAt: new Date(yesterday.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        $updatedAt: yesterday.toISOString(),
    },
    {
        $id: 'gig-4',
        requester: JSON.stringify(gigUser2),
        parcelInfo: 'Documents',
        pickupBlock: 'Admin Office',
        destinationBlock: 'B-204',
        price: 40,
        deliveryDeadline: yesterday.toISOString(),
        postedAt: new Date(yesterday.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        status: GigStatus.EXPIRED,
        otp: '112233',
        size: 'Small',
        $createdAt: new Date(yesterday.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        $updatedAt: yesterday.toISOString(),
    }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { $id: 't-1', userId: 'user-1', type: 'TOPUP', amount: 200, description: 'Wallet load approved', timestamp: yesterday.toISOString(), $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
    { $id: 't-2', userId: 'user-1', type: 'DEBIT', amount: 25, description: 'Gig created: Library Book', relatedGigId: 'gig-3', timestamp: yesterday.toISOString(), $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
    { $id: 't-3', userId: 'user-2', type: 'PAYOUT', amount: 20, description: 'Payout for gig: Library Book', relatedGigId: 'gig-3', timestamp: yesterday.toISOString(), $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
];

export const MOCK_WALLET_REQUESTS: WalletLoadRequest[] = [
    {
        $id: 'wr-1',
        userId: 'user-2',
        userName: 'Bob Smith',
        amount: 500,
        utr: '123456789012',
        screenshotUrl: 'https://placehold.co/400x600/1F2937/FFFFFF/png?text=Payment+Screenshot',
        status: WalletRequestStatus.PENDING,
        requestedAt: now.toISOString(),
        couponCode: 'FIRST50',
        $createdAt: now.toISOString(),
        $updatedAt: now.toISOString(),
    }
];

export const MOCK_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
    {
        $id: 'wir-1',
        userId: 'user-1',
        userName: 'Alice Johnson',
        amount: 150,
        upiId: 'alice@okbank',
        status: WithdrawalRequestStatus.PENDING,
        requestedAt: now.toISOString(),
        $createdAt: now.toISOString(),
        $updatedAt: now.toISOString(),
    }
];

export const MOCK_COUPONS: Coupon[] = [
    { $id: 'c-1', code: 'WELCOME10', bonusPercentage: 0.10, isActive: true, maxUsesPerUser: 1, $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
    { $id: 'c-2', code: 'GET20', bonusPercentage: 0.20, isActive: true, maxUsesPerUser: 5, $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
    { $id: 'c-3', code: 'OLDCODE', bonusPercentage: 0.05, isActive: false, maxUsesPerUser: 1, $createdAt: yesterday.toISOString(), $updatedAt: yesterday.toISOString() },
];

export const MOCK_PLATFORM_CONFIG = {
    fee: 0.2,
    offerBarText: 'Use code WELCOME10 for 10% bonus on your first wallet load! ;; Delivery fees starting from just ₹25!',
    referrerReward: 10,
    refereeBonusPercentage: 0.05
};
