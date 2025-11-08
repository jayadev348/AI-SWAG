
import React from 'react';
import { CarDetails, DriverDetails, RetrievalStatus } from '../types';
import { CarIcon } from './icons/CarIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ClockIcon } from './icons/ClockIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import CarTrackingMap from './CarTrackingMap';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface CustomerViewProps {
  carDetails: CarDetails;
  driverDetails: DriverDetails;
  retrievalStatus: RetrievalStatus;
  eta: string;
  statusMessage: string;
  onRequestCar: () => void;
  isLoading: boolean;
}

const CustomerView: React.FC<CustomerViewProps> = ({
  carDetails,
  driverDetails,
  retrievalStatus,
  eta,
  statusMessage,
  onRequestCar,
  isLoading
}) => {
  const renderActionArea = () => {
    switch (retrievalStatus) {
      case RetrievalStatus.NONE:
        return (
          <button
            onClick={onRequestCar}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-300 transform active:scale-95"
          >
            <CarIcon className="w-5 h-5 mr-2" />
            Request My Car
          </button>
        );
      case RetrievalStatus.REQUESTED:
        return (
          <div className="text-center text-gray-300 p-4 rounded-lg bg-gray-700">
            <p>Waiting for valet to provide ETA...</p>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-3 overflow-hidden">
              <div className="bg-blue-500 h-2.5 rounded-full w-full animate-pulse-horizontal"></div>
            </div>
          </div>
        );
      case RetrievalStatus.IN_TRANSIT:
        return (
          <div className="space-y-4">
            <CarTrackingMap etaMinutes={parseInt(eta, 10) || 1} />
            <div className="text-center bg-blue-500/20 border border-blue-400 text-blue-200 p-4 rounded-lg">
                <div className="flex justify-center items-center text-2xl font-bold">
                    <ClockIcon className="w-7 h-7 mr-2 animate-pulse" />
                    <span>~{eta} minutes</span>
                </div>
                <p className="text-sm mt-1">Estimated Retrieval Time</p>
            </div>
          </div>
        );
        case RetrievalStatus.READY:
            return (
                <div className="text-center bg-green-500/20 border border-green-400 text-green-200 p-6 rounded-lg">
                    <div className="flex justify-center items-center text-2xl font-bold">
                        <CheckCircleIcon className="w-8 h-8 mr-3" />
                        <span>Ready for Pickup!</span>
                    </div>
                    <p className="text-sm mt-2">Your vehicle is waiting for you.</p>
                </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3 text-blue-300">
              <SparklesIcon className="w-6 h-6 flex-shrink-0"/>
              <p className="text-sm italic">{isLoading ? "Generating personalized message..." : statusMessage}</p>
          </div>
      </div>
      
      {/* Action Area comes before details if car is in transit or ready */}
      {retrievalStatus !== RetrievalStatus.NONE && (
         <div className="mt-6">{renderActionArea()}</div>
      )}

      {/* Car Details Card */}
      <div className="bg-gray-700/50 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><CarIcon className="w-5 h-5 mr-2" /> Your Vehicle</h3>
        <div className="space-y-2 text-gray-300">
          <p><strong>Make:</strong> {carDetails.make}</p>
          <p><strong>Model:</strong> {carDetails.model}</p>
          <p><strong>License Plate:</strong> {carDetails.licensePlate}</p>
        </div>
      </div>

      {/* Driver Details Card */}
      <div className="bg-gray-700/50 rounded-lg p-5 flex items-center space-x-4">
        <img src={driverDetails.avatarUrl} alt={driverDetails.name} className="w-16 h-16 rounded-full border-2 border-blue-400"/>
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center"><UserIcon className="w-5 h-5 mr-2"/> Your Driver</h3>
          <p className="text-gray-300">{driverDetails.name}</p>
          <p className="text-sm text-gray-400 flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5"/>{driverDetails.mobileNumber}</p>
        </div>
      </div>
      
      {/* Action Area is at the bottom if car has not been requested */}
      {retrievalStatus === RetrievalStatus.NONE && (
         <div className="mt-6">{renderActionArea()}</div>
      )}
    </div>
  );
};

export default CustomerView;
