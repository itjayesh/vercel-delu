import React, { useState, useRef, useCallback } from 'react';
import Modal from './Modal';
import Button from './Button';

// Moved from lib/appwrite.ts to make component self-contained
const dataURLtoFile = (dataurl: string, filename: string, mimeType: string): File => {
    const arr = dataurl.split(',');
    if (arr.length < 2) {
        throw new Error('Invalid data URL');
    }
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mimeType});
};

interface CameraCaptureProps {
    onCapture: (imageFile: File) => void;
    trigger: React.ReactNode;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const openModal = () => {
        setIsOpen(true);
        startCamera();
    };

    const closeModal = () => {
        setIsOpen(false);
        stopCamera();
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                const file = dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`, 'image/jpeg');
                onCapture(file);
                closeModal();
            } else {
                 setError("Could not process image.");
            }
        }
    };

    return (
        <>
            <div onClick={openModal}>{trigger}</div>
            <Modal isOpen={isOpen} onClose={closeModal} title="Take Photo">
                <div className="space-y-4">
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
                    <div className="bg-brand-dark rounded-lg overflow-hidden">
                       <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <Button onClick={handleCapture} disabled={!!error} fullWidth>
                        Capture
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CameraCapture;
