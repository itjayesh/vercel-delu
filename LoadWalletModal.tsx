import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import Button from './Button';
import { RupeeIcon } from './icons';

interface LoadWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoadWalletModal: React.FC<LoadWalletModalProps> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);

    const [amount, setAmount] = useState<number | ''>('');
    const [utr, setUtr] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!screenshotFile) return;
        const url = URL.createObjectURL(screenshotFile);
        setScreenshotPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [screenshotFile]);

    const resetForm = useCallback(() => {
        setAmount('');
        setUtr('');
        setCouponCode('');
        setScreenshotFile(null);
        setScreenshotPreview(null);
        setError('');
        setSuccess(false);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                handleClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, handleClose]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG, etc.).');
            return;
        }
        setScreenshotFile(file);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amount || amount <= 0 || !utr.trim() || !screenshotFile) {
            setError('Please fill out amount, UTR, and upload a payment screenshot.');
            return;
        }

        if (context) {
            try {
                await context.requestWalletLoad(
                    { amount: Number(amount), utr: utr.trim(), screenshotUrl: screenshotFile as any },
                    couponCode.trim()
                );
                setSuccess(true);
            } catch (err) {
                 setError('An error occurred while submitting the request.');
            }
        } else {
            setError('Context is not available. Please try again later.');
        }
    };

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="Request Submitted">
                <div className="text-center p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-green-400">Request Submitted!</h3>
                    <p className="text-gray-300">Your wallet load request has been submitted for review. It will be processed shortly.</p>
                    <Button onClick={handleClose}>Close</Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Load Money into Wallet">
            <div className="space-y-6">
                <div className="text-center bg-white p-4 rounded-lg">
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=delu@live&pn=DeluLive"
                        alt="UPI QR Code"
                        className="mx-auto w-40 h-40 object-contain rounded-md"
                    />
                    <p className="mt-2 text-sm text-brand-dark font-semibold">
                        Scan to pay using any UPI app
                    </p>
                    <p className="mt-1 text-xs text-brand-dark-300">
                        UPI ID: <span className="font-mono font-bold">delu@live</span>
                    </p>
                </div>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount (INR)</label>
                        <div className="relative">
                           <RupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                           <input
                                id="amount"
                                type="number"
                                placeholder="e.g., 200"
                                value={amount}
                                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                required
                           />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="utr" className="block text-sm font-medium text-gray-300 mb-2">UTR / Transaction ID</label>
                        <input
                            id="utr"
                            type="text"
                            placeholder="Enter the 12-digit UTR from your app"
                            value={utr}
                            onChange={e => setUtr(e.target.value)}
                            className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="screenshot" className="block text-sm font-medium text-gray-300 mb-2">Payment Screenshot</label>
                        <label className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary flex items-center justify-center cursor-pointer hover:bg-brand-dark-300/80">
                            <span>{screenshotFile?.name || 'Click to upload screenshot'}</span>
                            <input
                                id="screenshot"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {screenshotPreview && <img src={screenshotPreview} alt="Screenshot preview" className="mt-2 rounded-lg max-h-40 mx-auto" />}
                    </div>
                    
                    <div>
                        <label htmlFor="coupon" className="block text-sm font-medium text-gray-300 mb-2">Coupon Code (Optional)</label>
                        <input
                            id="coupon"
                            type="text"
                            placeholder="e.g., WELCOME10"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                            className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    
                    <Button type="submit" fullWidth>
                        Submit Request
                    </Button>
                </form>
            </div>
        </Modal>
    );
};

export default LoadWalletModal;
