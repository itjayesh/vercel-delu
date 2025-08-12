import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Coupon, User, Gig, GigStatus, WalletRequestStatus, GigUser, Transaction } from '../types';
import { BanknotesIcon, ChartBarIcon, Cog6ToothIcon, CreditCardIcon, DocumentDuplicateIcon, GiftIcon, ScaleIcon, TicketIcon, UserGroupIcon, SignalIcon, StarIcon, RupeeIcon } from '../components/icons';

type AdminView = 'analytics' | 'wallet_requests' | 'withdrawal_requests' | 'gigs_history' | 'live_gigs' | 'users' | 'balances' | 'referrals' | 'manual_credit' | 'coupons' | 'settings';

const Admin: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [view, setView] = useState<AdminView>('analytics');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'walletBalance', direction: 'ascending' | 'descending' }>({
        key: 'walletBalance',
        direction: 'descending'
    });

    if (!context) return <div className="bg-brand-dark text-white p-8">Loading context...</div>;

    const { 
        users, gigs, walletLoadRequests, withdrawalRequests, coupons, platformFee, offerBarText, transactions,
        referrerReward, refereeBonusPercentage,
        deleteUser, deleteGig, addCoupon, updateCoupon, deleteCoupon,
        approveWalletLoad, rejectWalletLoad, approveWithdrawal, rejectWithdrawal,
        manualCreditUser, setPlatformFee, setOfferBarText, setReferrerReward, setRefereeBonusPercentage,
        logout
    } = context;
    
    const handleLogout = () => {
        if(logout) {
            logout();
        }
        navigate('/live', { replace: true });
    };

    // -- PANELS START --

    const AnalyticsPanel = () => {
        const stats = useMemo(() => {
            const nonAdminUsers = users.filter(u => !u.isAdmin);
            const completedGigs = gigs.filter(g => g.status === GigStatus.COMPLETED);
            
            return {
                totalUsers: nonAdminUsers.length,
                totalGigs: gigs.length,
                gigsCompleted: completedGigs.length,
                gigsInProgress: gigs.filter(g => g.status === GigStatus.ACCEPTED).length,
                totalRevenue: completedGigs.reduce((acc, gig) => acc + (gig.price * platformFee), 0),
                totalValueTransacted: completedGigs.reduce((acc, gig) => acc + gig.price, 0),
                pendingWalletRequests: walletLoadRequests.filter(r => r.status === WalletRequestStatus.PENDING).length
            };
        }, [users, gigs, walletLoadRequests, platformFee]);

        const StatCard: React.FC<{title:string, value:string|number, isCurrency?:boolean}> = ({title, value, isCurrency}) => (
            <div className="bg-brand-dark-300 p-6 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                <p className="text-3xl font-bold text-white mt-2">{isCurrency && '₹'}{value}</p>
            </div>
        );

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Platform Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={stats.totalUsers} />
                    <StatCard title="Platform Revenue" value={stats.totalRevenue.toFixed(2)} isCurrency />
                    <StatCard title="Total Gigs" value={stats.totalGigs} />
                    <StatCard title="Gigs Completed" value={stats.gigsCompleted} />
                    <StatCard title="Gigs In Progress" value={stats.gigsInProgress} />
                    <StatCard title="Total Value Transacted" value={stats.totalValueTransacted.toFixed(2)} isCurrency />
                    <StatCard title="Pending Wallet Loads" value={stats.pendingWalletRequests} />
                </div>
            </div>
        );
    };

    const WalletRequestsPanel = () => {
        const pendingRequests = walletLoadRequests.filter(r => r.status === WalletRequestStatus.PENDING);
        return (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Pending Wallet Requests</h2>
                 <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">UTR</th>
                                <th scope="col" className="px-6 py-3">Coupon</th>
                                <th scope="col" className="px-6 py-3">Screenshot</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(req => (
                                <tr key={req.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{req.userName}</td>
                                    <td className="px-6 py-4">₹{req.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{req.utr}</td>
                                    <td className="px-6 py-4">{req.couponCode || 'N/A'}</td>
                                    <td className="px-6 py-4"><button onClick={() => setViewingImage(req.screenshotUrl)} className="text-brand-primary hover:underline">View</button></td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Button onClick={() => approveWalletLoad(req.$id)}>Approve</Button>
                                        <Button onClick={() => rejectWalletLoad(req.$id)} variant="secondary">Reject</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {pendingRequests.length === 0 && <p className="text-center p-6 text-gray-400">No pending requests.</p>}
                 </div>
            </div>
        )
    };
    
    const WithdrawalRequestsPanel = () => {
        const pendingRequests = useMemo(() => withdrawalRequests.filter(r => r.status === 'PENDING'), [withdrawalRequests]);
    
        return (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Pending Withdrawal Requests</h2>
                 <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">UPI ID</th>
                                <th scope="col" className="px-6 py-3">Requested At</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(req => (
                                <tr key={req.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{req.userName}</td>
                                    <td className="px-6 py-4">₹{req.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 font-mono">{req.upiId}</td>
                                    <td className="px-6 py-4">{new Date(req.requestedAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Button onClick={() => approveWithdrawal(req.$id)}>Approve</Button>
                                        <Button onClick={() => rejectWithdrawal(req.$id)} variant="secondary">Reject</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {pendingRequests.length === 0 && <p className="text-center p-6 text-gray-400">No pending withdrawal requests.</p>}
                 </div>
            </div>
        );
    };

    const GigsHistoryPanel = () => {
        const filteredGigs = useMemo(() => gigs.filter(g => {
            const requester: GigUser = JSON.parse(g.requester);
            const deliverer: GigUser | undefined = g.deliverer ? JSON.parse(g.deliverer) : undefined;
            const term = searchTerm.toLowerCase();
            return (
                g.parcelInfo.toLowerCase().includes(term) || 
                requester.name.toLowerCase().includes(term) ||
                (deliverer && deliverer.name.toLowerCase().includes(term))
            );
        }), [gigs, searchTerm]);

        return (
             <div className="space-y-4">
                <h2 className="text-2xl font-bold">Gigs History</h2>
                <input type="text" placeholder="Search by parcel, requester or deliverer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-brand-dark-300 p-3 rounded-lg" />
                <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th className="px-6 py-3">Parcel Info</th>
                                <th className="px-6 py-3">Requester</th>
                                <th className="px-6 py-3">Deliverer</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGigs.map(gig => {
                                const requester: GigUser = JSON.parse(gig.requester);
                                const deliverer: GigUser | undefined = gig.deliverer ? JSON.parse(gig.deliverer) : undefined;
                                return (
                                <tr key={gig.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{gig.parcelInfo}</td>
                                    <td className="px-6 py-4">{requester.name}</td>
                                    <td className="px-6 py-4">{deliverer?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">₹{gig.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">{gig.status}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {gig.delivererRating && <div>D: {gig.delivererRating}⭐</div>}
                                        {gig.requesterRating && <div>R: {gig.requesterRating}⭐</div>}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const LiveGigsPanel = () => {
        const [gigToDelete, setGigToDelete] = useState<Gig | null>(null);

        const liveGigs = useMemo(() => {
            return gigs
                .filter(g => g.status === GigStatus.OPEN || g.status === GigStatus.ACCEPTED)
                .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        }, [gigs]);

        const confirmDeleteGig = () => {
            if (gigToDelete) {
                deleteGig(gigToDelete.$id);
                setGigToDelete(null);
            }
        };

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Live & Accepted Gigs</h2>
                 <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th className="px-6 py-3">Parcel Info</th>
                                <th className="px-6 py-3">Requester</th>
                                <th className="px-6 py-3">Deliverer</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liveGigs.map(gig => {
                                const requester: GigUser = JSON.parse(gig.requester);
                                const deliverer: GigUser | undefined = gig.deliverer ? JSON.parse(gig.deliverer) : undefined;
                                return (
                                <tr key={gig.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{gig.parcelInfo}</td>
                                    <td className="px-6 py-4">{requester.name}</td>
                                    <td className="px-6 py-4">
                                        {deliverer ? (
                                            <div>
                                                <p className="font-medium text-white">{deliverer.name}</p>
                                                <p className="text-xs text-gray-400">{deliverer.email}</p>
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">₹{gig.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">{gig.status}</td>
                                    <td className="px-6 py-4">
                                        {gig.status === GigStatus.OPEN ? (
                                            <Button variant="secondary" onClick={() => setGigToDelete(gig)}>Delete</Button>
                                        ) : (
                                            <span className="text-gray-500 text-xs">In Progress</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                     {liveGigs.length === 0 && <p className="text-center p-6 text-gray-400">No live gigs at the moment.</p>}
                </div>
                {gigToDelete && (
                    <Modal isOpen={true} onClose={() => setGigToDelete(null)} title="Delete Gig?">
                        <div className="text-white space-y-4">
                            <p>Are you sure you want to delete this gig? The payment of ₹{gigToDelete.price.toFixed(2)} will be refunded to {JSON.parse(gigToDelete.requester).name}. This action cannot be undone.</p>
                            <div className="flex justify-end gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setGigToDelete(null)}>Cancel</Button>
                                <Button onClick={confirmDeleteGig}>Confirm Delete</Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        );
    };

    const UsersPanel = () => {
        const [userToDelete, setUserToDelete] = useState<User|null>(null);

        const confirmDeleteUser = () => {
            if (userToDelete) {
                deleteUser(userToDelete.$id);
                setUserToDelete(null);
            }
        };
        
        const filteredUsers = useMemo(() => users.filter(u => 
            !u.isAdmin && (
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.phone.includes(searchTerm)
            )
        ), [users, searchTerm]);

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-brand-dark-300 p-3 rounded-lg" />
                <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th className="px-6 py-3">Photo</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Block</th>
                                <th className="px-6 py-3">College ID</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr 
                                    key={user.$id} 
                                    className="border-b border-brand-dark-200 hover:bg-brand-dark-300/50 transition-colors cursor-pointer"
                                    onClick={() => setViewingUser(user)}
                                >
                                    <td className="px-6 py-4">
                                        <img 
                                            src={user.profilePhotoUrl} 
                                            alt="P" 
                                            className="w-12 h-12 rounded-full object-cover" 
                                            onClick={(e) => { e.stopPropagation(); setViewingImage(user.profilePhotoUrl); }} 
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4">{user.phone}</td>
                                    <td className="px-6 py-4">{user.block}</td>
                                    <td className="px-6 py-4">
                                        <img 
                                            src={user.collegeIdUrl} 
                                            alt="ID" 
                                            className="w-20 h-12 object-cover rounded-md" 
                                            onClick={(e) => { e.stopPropagation(); setViewingImage(user.collegeIdUrl); }}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setUserToDelete(user); }} 
                                            className="text-red-400 hover:text-red-300 font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {userToDelete && (
                    <Modal isOpen={true} onClose={() => setUserToDelete(null)} title={`Delete ${userToDelete.name}?`}>
                        <div className="text-white space-y-4">
                            <p>Are you sure you want to remove this user? This action cannot be undone.</p>
                            <div className="flex justify-end gap-4">
                                <Button variant="secondary" onClick={() => setUserToDelete(null)}>Cancel</Button>
                                <Button onClick={confirmDeleteUser}>Delete User</Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        );
    };

    const BalancesPanel = () => {
        const requestSort = (key: 'name' | 'walletBalance') => {
            let direction: 'ascending' | 'descending' = 'ascending';
            if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
            setSortConfig({ key, direction });
        };
        
        const sortedUsers = useMemo(() => {
            return [...users.filter(u => !u.isAdmin)].sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }, [users, sortConfig]);

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">User Balances</h2>
                <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th className="px-6 py-3"><button onClick={() => requestSort('name')} className="hover:text-white">User Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</button></th>
                                <th className="px-6 py-3">Phone Number</th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('walletBalance')} className="hover:text-white">Balance {sortConfig.key === 'walletBalance' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map(user => (
                                <tr key={user.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4">{user.phone}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-secondary">₹{user.walletBalance.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const ReferralsPanel = () => {
        const referrals = users.filter(u => u.referredByCode).map(referee => {
            const referrer = users.find(u => u.referralCode === referee.referredByCode);
            return { referee, referrer };
        });

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Referral Dashboard</h2>
                <div className="bg-brand-dark-300 rounded-xl overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200">
                            <tr>
                                <th className="px-6 py-3">Referee</th>
                                <th className="px-6 py-3">Referred By</th>
                                <th className="px-6 py-3">Reward Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map(({referee, referrer}) => (
                                <tr key={referee.$id} className="border-b border-brand-dark-200">
                                    <td className="px-6 py-4 font-medium text-white">{referee.name}</td>
                                    <td className="px-6 py-4">{referrer?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{referee.firstRechargeCompleted ? 'Rewarded' : 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {referrals.length === 0 && <p className="text-center p-6 text-gray-400">No referrals yet.</p>}
                </div>
            </div>
        )
    };
    
    const ManualCreditPanel = () => {
        const [phone, setPhone] = useState('');
        const [amount, setAmount] = useState<number | ''>('');
        const [reason, setReason] = useState('');
        const [foundUser, setFoundUser] = useState<User | null>(null);
        const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
        
        const handleFindUser = () => {
            const user = users.find(u => u.phone === phone);
            setFoundUser(user || null);
            if (!user) {
                setMessage({type: 'error', text: 'User not found.'});
            } else {
                setMessage(null);
            }
        };

        const handleCredit = async (e: React.FormEvent) => {
            e.preventDefault();
            setMessage(null);
            if (!foundUser || !amount || amount <= 0 || !reason) {
                setMessage({type: 'error', text: 'Please fill all fields and find a valid user.'});
                return;
            }
            const success = await manualCreditUser(phone, amount, reason);
            if (success) {
                setMessage({type: 'success', text: `Successfully credited ₹${amount} to ${foundUser.name}.`});
                setPhone('');
                setAmount('');
                setReason('');
                setFoundUser(null);
            } else {
                setMessage({type: 'error', text: 'Failed to credit user. Please try again.'});
            }
        };

        return (
            <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-bold">Manual User Credit</h2>
                <div className="bg-brand-dark-300 p-6 rounded-xl space-y-4">
                    {message && <div className={`p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{message.text}</div>}
                    <form onSubmit={handleCredit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">User Phone Number</label>
                            <div className="flex gap-2">
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="Enter 10-digit phone number" />
                                <Button type="button" variant="secondary" onClick={handleFindUser}>Find User</Button>
                            </div>
                        </div>

                        {foundUser && (
                            <div className="bg-brand-dark p-3 rounded-lg">
                                <p className="text-white">User: <span className="font-bold">{foundUser.name}</span></p>
                                <p className="text-sm text-gray-400">Current Balance: <span className="font-semibold text-brand-secondary">₹{foundUser.walletBalance.toFixed(2)}</span></p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Credit (₹)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="e.g., 50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Credit</label>
                            <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="e.g., Refund for issue, Bonus" />
                        </div>

                        <Button type="submit" fullWidth disabled={!foundUser || !amount || !reason}>Credit Account</Button>
                    </form>
                </div>
            </div>
        );
    };

    const CouponsPanel = () => {
        const [couponCode, setCouponCode] = useState('');
        const [bonus, setBonus] = useState<number|''>('');
        const [maxUses, setMaxUses] = useState<number|''>('');

        const handleAddCoupon = (e: React.FormEvent) => {
            e.preventDefault();
            if (couponCode.trim() && Number(bonus) > 0 && Number(maxUses) > 0) {
                addCoupon({ 
                    code: couponCode.trim().toUpperCase(), 
                    bonusPercentage: Number(bonus) / 100, 
                    isActive: true,
                    maxUsesPerUser: Number(maxUses)
                });
                setCouponCode(''); setBonus(''); setMaxUses('');
            }
        };

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Coupon Management</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <form onSubmit={handleAddCoupon} className="lg:col-span-1 bg-brand-dark-300 p-6 rounded-xl space-y-4 self-start">
                        <h3 className="font-bold text-lg text-white">Add New Coupon</h3>
                         <div>
                            <label className="text-sm text-gray-400">Coupon Code</label>
                            <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="WELCOME10" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Bonus %</label>
                            <input type="number" value={bonus} onChange={e => setBonus(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="10" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Uses per User</label>
                            <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="1" />
                        </div>
                        <Button type="submit" fullWidth>Add Coupon</Button>
                    </form>
                    <div className="lg:col-span-2 space-y-2">
                        <h3 className="font-bold text-lg text-white mb-2">Active Coupons</h3>
                        {coupons.map(coupon => (
                            <div key={coupon.$id} className="bg-brand-dark-300 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-white">{coupon.code}</p>
                                    <p className="text-sm text-brand-secondary">{coupon.bonusPercentage * 100}% Bonus ({coupon.maxUsesPerUser} use/user)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={coupon.isActive} onChange={e => updateCoupon(coupon.$id, { isActive: e.target.checked })} />
                                        <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                    <button onClick={() => deleteCoupon(coupon.$id)} className="text-red-500 hover:text-red-400 text-2xl font-bold">&times;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const SettingsPanel = () => {
        const [fee, setFee] = useState(platformFee * 100);
        const [barText, setBarText] = useState(offerBarText);
        const [refReward, setRefReward] = useState(referrerReward);
        const [refBonus, setRefBonus] = useState(refereeBonusPercentage * 100);

        const handleSave = () => {
            setPlatformFee(fee / 100);
            setOfferBarText(barText);
            setReferrerReward(refReward);
            setRefereeBonusPercentage(refBonus / 100);
            alert("Settings Saved!");
        }

        return (
             <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-bold">Platform Settings</h2>
                <div className="bg-brand-dark-300 p-6 rounded-xl space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Platform Fee (%)</label>
                        <input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Offer Bar Text</label>
                        <textarea value={barText} onChange={e => setBarText(e.target.value)} rows={4} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="Offer 1 ;; Offer 2"></textarea>
                        <p className="text-xs text-gray-400 mt-1">Use ';;' to separate multiple offers for the marquee.</p>
                    </div>
                    <div className="border-t border-brand-dark-300 my-4"></div>
                    <h3 className="text-lg font-bold text-white">Referral Settings</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Referrer Reward (Fixed amount in ₹)</label>
                        <input type="number" value={refReward} onChange={e => setRefReward(Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="10" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Referee Bonus on First Recharge (%)</label>
                        <input type="number" value={refBonus} onChange={e => setRefBonus(Number(e.target.value))} className="w-full bg-brand-dark mt-1 p-2 rounded-lg" placeholder="5" />
                    </div>
                    <Button onClick={handleSave}>Save Settings</Button>
                </div>
                <div className="bg-brand-dark-300 p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Account Actions</h3>
                    <p className="text-sm text-gray-400 mb-4">Logging out will end your current admin session.</p>
                    <Button onClick={handleLogout} variant="secondary" className="!bg-red-600 hover:!bg-red-500 focus:!ring-red-500">
                        Logout
                    </Button>
                </div>
            </div>
        )
    };

    // -- PANELS END --

    const renderView = () => {
        switch (view) {
            case 'analytics': return <AnalyticsPanel />;
            case 'wallet_requests': return <WalletRequestsPanel />;
            case 'withdrawal_requests': return <WithdrawalRequestsPanel />;
            case 'gigs_history': return <GigsHistoryPanel />;
            case 'live_gigs': return <LiveGigsPanel />;
            case 'users': return <UsersPanel />;
            case 'balances': return <BalancesPanel />;
            case 'referrals': return <ReferralsPanel />;
            case 'manual_credit': return <ManualCreditPanel />;
            case 'coupons': return <CouponsPanel />;
            case 'settings': return <SettingsPanel />;
            default: return <AnalyticsPanel />;
        }
    }
    
    const NavButton: React.FC<{ targetView: AdminView, label: string, icon: React.ReactNode }> = ({ targetView, label, icon }) => (
        <button
            onClick={() => { setView(targetView); setSearchTerm(''); }}
            className={`w-full flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${view === targetView ? 'bg-brand-primary text-white' : 'hover:bg-brand-dark-300'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <header className="bg-brand-dark-200 shadow-md sticky top-0 z-20">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div>
                        <span className="mr-4">Welcome, {context.currentUser?.name}</span>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">Logout</button>
                    </div>
                 </div>
            </header>
            <div className="flex flex-col md:flex-row gap-8 p-4 sm:p-6 lg:p-8">
                <aside className="md:w-64 flex-shrink-0 bg-brand-dark-200 p-4 rounded-xl self-start sticky top-24">
                    <nav className="space-y-2">
                        <NavButton targetView="analytics" label="Analytics" icon={<ChartBarIcon className="h-5 w-5"/>} />
                        <NavButton targetView="wallet_requests" label="Wallet Requests" icon={<CreditCardIcon className="h-5 w-5"/>} />
                        <NavButton targetView="withdrawal_requests" label="Withdrawals" icon={<BanknotesIcon className="h-5 w-5"/>} />
                        <NavButton targetView="gigs_history" label="Gigs History" icon={<DocumentDuplicateIcon className="h-5 w-5"/>} />
                        <NavButton targetView="live_gigs" label="Live Gigs" icon={<SignalIcon className="h-5 w-5"/>} />
                        <hr className="border-brand-dark-300 my-2" />
                        <NavButton targetView="users" label="Users" icon={<UserGroupIcon className="h-5 w-5"/>} />
                        <NavButton targetView="balances" label="Balances" icon={<ScaleIcon className="h-5 w-5"/>} />
                        <NavButton targetView="referrals" label="Referrals" icon={<GiftIcon className="h-5 w-5"/>} />
                        <NavButton targetView="manual_credit" label="Manual Credit" icon={<BanknotesIcon className="h-5 w-5"/>} />
                        <NavButton targetView="coupons" label="Coupons" icon={<TicketIcon className="h-5 w-5"/>} />
                        <hr className="border-brand-dark-300 my-2" />
                        <NavButton targetView="settings" label="Settings" icon={<Cog6ToothIcon className="h-5 w-5"/>} />
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderView()}
                </main>
            </div>
            {viewingImage && (
                <Modal isOpen={true} onClose={() => setViewingImage(null)} title="Image Preview">
                    <img src={viewingImage} alt="Preview" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
                </Modal>
            )}
            {viewingUser && (() => {
                const userTransactions = transactions.filter(t => t.userId === viewingUser.$id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                const usedCoupons = JSON.parse(viewingUser.usedCouponCodes || '{}');

                return (
                    <Modal isOpen={true} onClose={() => setViewingUser(null)} title={`Details for ${viewingUser.name}`}>
                        <div className="space-y-6 text-white max-h-[80vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="md:col-span-1 space-y-4">
                                    <img src={viewingUser.profilePhotoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-brand-primary" />
                                    <img src={viewingUser.collegeIdUrl} alt="College ID" className="w-full rounded-lg cursor-pointer" onClick={() => { setViewingUser(null); setViewingImage(viewingUser.collegeIdUrl); }} />
                                </div>

                                {/* Right Column */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold">{viewingUser.name}</h3>
                                        <p className="text-sm text-gray-400">{viewingUser.email}</p>
                                        <p className="text-sm text-gray-400">{viewingUser.phone}</p>
                                        <p className="text-sm text-gray-400">Block: {viewingUser.block}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 bg-brand-dark-300 p-4 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Balance</p>
                                            <p className="text-xl font-bold text-brand-secondary flex items-center justify-center gap-1"><RupeeIcon className="h-5 w-5" />{viewingUser.walletBalance.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Rating</p>
                                            <p className="text-xl font-bold flex items-center justify-center gap-1">{viewingUser.rating.toFixed(1)} <StarIcon className="h-5 w-5 text-yellow-400" /></p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Gigs Done</p>
                                            <p className="text-xl font-bold">{viewingUser.deliveriesCompleted}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Is Admin?</p>
                                            <p className="text-xl font-bold">{viewingUser.isAdmin ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-brand-dark-300 p-4 rounded-lg space-y-2">
                                        <h4 className="font-semibold">Referral Info</h4>
                                        <p className="text-sm">Referral Code: <span className="font-mono bg-brand-dark p-1 rounded">{viewingUser.referralCode}</span></p>
                                        <p className="text-sm">Referred By: <span className="font-mono bg-brand-dark p-1 rounded">{viewingUser.referredByCode || 'N/A'}</span></p>
                                        <p className="text-sm">First Recharge Bonus Claimed: {viewingUser.firstRechargeCompleted ? 'Yes' : 'No'}</p>
                                    </div>
                                    
                                    {Object.keys(usedCoupons).length > 0 && (
                                        <div className="bg-brand-dark-300 p-4 rounded-lg space-y-2">
                                            <h4 className="font-semibold">Used Coupons</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(usedCoupons).map(([code, count]: [string, unknown]) => (
                                                    <span key={code} className="font-mono text-xs bg-brand-dark px-2 py-1 rounded-full">{code} (x{count as number})</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transactions */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Transaction History</h3>
                                <div className="bg-brand-dark-300 rounded-lg max-h-64 overflow-y-auto">
                                    {userTransactions.length > 0 ? (
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-400 uppercase bg-brand-dark-200 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">Description</th>
                                                    <th className="px-4 py-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userTransactions.map(t => {
                                                    const isCredit = ['CREDIT', 'TOPUP', 'PAYOUT'].includes(t.type);
                                                    return (
                                                        <tr key={t.$id} className="border-t border-brand-dark-200">
                                                            <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{new Date(t.timestamp).toLocaleDateString()}</td>
                                                            <td className="px-4 py-2">{t.description}</td>
                                                            <td className={`px-4 py-2 text-right font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                                                                {isCredit ? '+' : '-'}₹{t.amount.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="p-4 text-center text-gray-400">No transactions found for this user.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            })()}
        </div>
    );
};

export default Admin;
