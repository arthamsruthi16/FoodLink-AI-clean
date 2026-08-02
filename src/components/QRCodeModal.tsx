import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

interface QRCodeModalProps {
  qrCodeData: string;
  title: string;
  subtitle?: string;
  onVerify?: () => void;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  qrCodeData,
  title,
  subtitle,
  onVerify,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(qrCodeData, { width: 240, margin: 2 }).then((url) => {
      setQrDataUrl(url);
    });
  }, [qrCodeData]);

  const handleSimulateScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      if (onVerify) onVerify();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-5">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-sm text-slate-900 dark:text-white">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Pickup Verification QR Code" className="w-48 h-48 rounded-xl shadow-inner" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
              Generating Code...
            </div>
          )}
          <code className="mt-3 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold">
            {qrCodeData}
          </code>
        </div>

        {/* Verification Trigger */}
        {verifiedSuccess ? (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <span>✅ Handover Verified & Completed!</span>
          </div>
        ) : (
          <button
            onClick={handleSimulateScan}
            disabled={isVerifying}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Security Token...</span>
              </>
            ) : (
              <span>📷 Simulate Courier Scanner Verification</span>
            )}
          </button>
        )}

      </div>
    </div>
  );
};
