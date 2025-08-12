import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import CameraCapture from './CameraCapture';
import Button from './Button';
import { UserIcon, PhoneIcon, HomeIcon, IdIcon, CameraIcon, LockClosedIcon, GiftIcon, EnvelopeIcon } from './icons';
import Modal from './Modal';

const LoginView: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (!context) {
            setError("Application context not available.");
            setLoading(false);
            return;
        }

        try {
            const user = await context.login(email, password);
            context.closeAuthModal();
            if (user.isAdmin) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/my-gigs', { replace: true });
            }
        } catch (err: any) {
            setError(err.message || "Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Log In</h1>
                <p className="text-gray-400 mt-2">Welcome back to delu.live.</p>
                 <div className="text-xs text-gray-500 mt-4 bg-brand-dark-300 p-2 rounded-lg">
                    <p>Log in or create an account to continue.</p>
                </div>
            </div>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center mt-4">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-6 mt-6">
                 <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                        autoComplete="email"
                        required
                    />
                </div>
                <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                        autoComplete="current-password"
                        required
                    />
                </div>
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </form>
            <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={onSwitch} className="font-medium text-brand-primary hover:underline focus:outline-none">
                    Sign Up
                </button>
            </p>
        </>
    );
};

const SignupView: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const context = useContext(AppContext);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [block, setBlock] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [collegeId, setCollegeId] = useState<File | null>(null);
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [collegeIdPreview, setCollegeIdPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!profilePhoto) return;
        const url = URL.createObjectURL(profilePhoto);
        setProfilePhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profilePhoto]);

    useEffect(() => {
        if (!collegeId) return;
        const url = URL.createObjectURL(collegeId);
        setCollegeIdPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [collegeId]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !password || !block || !profilePhoto || !collegeId || !email) {
            setError('All fields, including email, password and photos, are required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await context?.signup({
                name, phone, email, block,
                profilePhotoUrl: profilePhoto as any, // Pass file to context
                collegeIdUrl: collegeId as any,
            }, password, referralCode);
            context?.closeAuthModal();
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup.');
        } finally {
            setLoading(false);
        }
    }, [name, phone, password, block, profilePhoto, collegeId, email, referralCode, context]);

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Join delu.live</h1>
                <p className="text-gray-400 mt-2">Let's get you set up to send and receive parcels.</p>
            </div>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                    </div>
                     <div className="relative">
                        <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" placeholder="Hostel Block" value={block} onChange={e => setBlock(e.target.value)} className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                    </div>
                </div>
                <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" autoComplete="email" required />
                </div>
                <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="password" 
                        placeholder="Password (min. 8 characters)" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                        autoComplete="new-password"
                        required
                    />
                </div>
                <div className="relative">
                    <GiftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Referral Code (Optional)" 
                        value={referralCode} 
                        onChange={e => setReferralCode(e.target.value)} 
                        className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                         <h3 className="font-semibold text-gray-300">Profile Photo</h3>
                        <CameraCapture onCapture={setProfilePhoto} trigger={
                            <button type="button" className="w-32 h-32 rounded-full bg-brand-dark-300 flex items-center justify-center text-gray-400 hover:bg-brand-dark-300/80 transition-colors">
                                {profilePhotoPreview ? <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" /> : <CameraIcon className="h-12 w-12" />}
                            </button>
                        }/>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="font-semibold text-gray-300">College ID</h3>
                        <CameraCapture onCapture={setCollegeId} trigger={
                            <button type="button" className="w-48 h-32 rounded-lg bg-brand-dark-300 flex items-center justify-center text-gray-400 hover:bg-brand-dark-300/80 transition-colors">
                                {collegeIdPreview ? <img src={collegeIdPreview} alt="ID Preview" className="w-full h-full rounded-lg object-cover" /> : <IdIcon className="h-12 w-12" />}
                            </button>
                        }/>
                    </div>
                </div>
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>
             <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitch} className="font-medium text-brand-primary hover:underline focus:outline-none">
                    Log In
                </button>
            </p>
        </>
    );
};

const AuthModal: React.FC = () => {
    const context = useContext(AppContext);
    const [isLoginView, setIsLoginView] = useState(true);
    
    if (!context) return null;

    const { isAuthModalOpen, closeAuthModal } = context;

    const handleClose = () => {
        setIsLoginView(true); // Reset to login view on close
        closeAuthModal();
    }

    return (
        <Modal 
            isOpen={isAuthModalOpen} 
            onClose={handleClose} 
            title={""} // Title is now set inside views
        >
            <div className="space-y-6">
                {isLoginView ? 
                    <LoginView onSwitch={() => setIsLoginView(false)} /> : 
                    <SignupView onSwitch={() => setIsLoginView(true)} />
                }
            </div>
        </Modal>
    );
};

export default AuthModal;
