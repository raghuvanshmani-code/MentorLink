
import React from 'react';
import { ClipboardIcon, WhatsAppIcon, XIcon } from './icons';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  waLink: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, waLink }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(waLink);
    // Add a small visual feedback if desired
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <WhatsAppIcon className="h-10 w-10 text-green-600" />
            </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Booking</h2>
          <p className="text-gray-600 mb-6">
            Tap the button below to open WhatsApp and send the pre-filled message to your mentor. Payments will be handled directly with them.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-200 text-lg transform hover:scale-105"
          >
            <WhatsAppIcon className="h-6 w-6" />
            Open WhatsApp
          </a>
          <div className="mt-4 text-sm text-gray-500">
            Link not working? <button onClick={copyToClipboard} className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1">Copy Link <ClipboardIcon className="h-4 w-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
