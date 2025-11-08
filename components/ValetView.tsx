
import React, { useState } from 'react';
import { CarDetails, RetrievalStatus } from '../types';
import { CarIcon } from './icons/CarIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ValetViewProps {
  carDetails: CarDetails;
  retrievalStatus: RetrievalStatus;
  onBringCar: (eta: string) => void;
  onCarReady: () => void;
  isLoading: boolean;
}

const ValetView: React.FC<ValetViewProps> = ({ carDetails, retrievalStatus, onBringCar, onCarReady, isLoading }) => {
  const [etaInput, setEtaInput] = useState('');
  const [error, setError] = useState('');

  const handleBringCar = () => {
    if (etaInput.trim() && parseInt(etaInput, 10) > 0) {
      setError('');
      onBringCar(etaInput);
    } else {
      setError('Please enter a valid ETA in minutes.');
    }
  };
  
  const renderStatusArea = () => {
    switch (retrievalStatus) {
      case RetrievalStatus.NONE:
        return (
          <div className="text-center bg-gray-700 text-gray-400 p-4 rounded-lg">
            <p>No active requests. Awaiting customer.</p>
          </div>
        );
      case RetrievalStatus.REQUESTED:
        return (
          <div className="bg-yellow-500/10 border border-yellow-400 text-yellow-200 p-5 rounded-lg space-y-4">
            <h3 className="text-xl font-bold text-center animate-pulse">CAR REQUESTED!</h3>
            <div className="flex items-start space-x-3">
              <div className="flex-grow">
                <input
                  type="number"
                  value={etaInput}
                  onChange={(e) => setEtaInput(e.target.value)}
                  placeholder="ETA in minutes"
                  className="w-full bg-gray-900/50 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-shadow"
                />
                {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
              </div>
              <button
                onClick={handleBringCar}
                disabled={isLoading}
                className="bg-yellow-500 text-gray-900 font-bold py-3 px-5 rounded-lg hover:bg-yellow-400 disabled:bg-yellow-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors transform active:scale-95 h-[50px]"
              >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : <CarIcon className="w-6 h-6"/>}
              </button>
            </div>
          </div>
        );
      case RetrievalStatus.IN_TRANSIT:
        return (
          <div className="bg-blue-500/10 border border-blue-400 text-blue-200 p-5 rounded-lg space-y-4 text-center">
            <h3 className="text-xl font-bold">Car is In Transit</h3>
            <p>Customer is tracking the vehicle.</p>
            <button
              onClick={onCarReady}
              disabled={isLoading}
              className="w-full mt-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 flex items-center justify-center transition-colors"
            >
               {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : <CheckCircleIcon className="w-5 h-5 mr-2" />}
              Mark as Ready for Pickup
            </button>
          </div>
        );
      case RetrievalStatus.READY:
         return (
          <div className="text-center bg-green-500/20 border border-green-400 text-green-200 p-5 rounded-lg">
             <h3 className="text-xl font-bold flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                Job Complete
             </h3>
             <p className="mt-1">Car is with the customer.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-center text-white">Valet Dashboard</h2>

      {/* Car Details Card */}
      <div className="bg-gray-700/50 rounded-lg p-5 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><CarIcon className="w-5 h-5 mr-2" /> Parked Vehicle</h3>
        <div className="space-y-2 text-gray-300">
          <p><strong>Make/Model:</strong> {carDetails.make} {carDetails.model}</p>
          <p><strong>License Plate:</strong> <span className="font-mono bg-gray-900 px-2 py-1 rounded">{carDetails.licensePlate}</span></p>
          <p className="flex items-center">
            <PhoneIcon className="w-4 h-4 mr-2"/>
            <strong>Customer Contact:</strong> {carDetails.mobileNumber}
          </p>
        </div>
      </div>
      
      {/* Request Status */}
      {renderStatusArea()}
    </div>
  );
};

export default ValetView;
