
import React, { useState, useCallback } from 'react';
import { CarDetails, DriverDetails, AppState, ViewMode, RetrievalStatus } from './types';
import { MOCK_DRIVER } from './constants';
import RegistrationForm from './components/RegistrationForm';
import CustomerView from './components/CustomerView';
import ValetView from './components/ValetView';
import { generateStatusMessage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.REGISTRATION);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CUSTOMER);
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [driverDetails] = useState<DriverDetails>(MOCK_DRIVER);
  const [retrievalStatus, setRetrievalStatus] = useState<RetrievalStatus>(RetrievalStatus.NONE);
  const [eta, setEta] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = useCallback(async (details: CarDetails) => {
    setIsLoading(true);
    setCarDetails(details);
    try {
      const message = await generateStatusMessage('registration', { car: details, driver: driverDetails });
      setStatusMessage(message);
    } catch (error) {
      console.error("Gemini API error:", error);
      setStatusMessage(`Welcome! Your ${details.make} ${details.model} is registered. Our driver, ${driverDetails.name}, will take good care of it.`);
    } finally {
      setIsLoading(false);
      setAppState(AppState.TRACKING);
    }
  }, [driverDetails]);

  const handleRequestCar = useCallback(() => {
    setRetrievalStatus(RetrievalStatus.REQUESTED);
    setStatusMessage('Your request has been sent. Waiting for the valet to respond.');
  }, []);

  const handleBringCar = useCallback(async (newEta: string) => {
    setIsLoading(true);
    setEta(newEta);
    setRetrievalStatus(RetrievalStatus.IN_TRANSIT);
    if (carDetails) {
      try {
        const message = await generateStatusMessage('in_transit', { car: carDetails, driver: driverDetails, eta: newEta });
        setStatusMessage(message);
      } catch (error) {
        console.error("Gemini API error:", error);
        setStatusMessage(`Great news! ${driverDetails.name} is bringing your ${carDetails.make} ${carDetails.model}. It will be ready in about ${newEta} minutes.`);
      }
    }
    setIsLoading(false);
  }, [carDetails, driverDetails]);

  const handleCarReady = useCallback(async () => {
    setIsLoading(true);
    setRetrievalStatus(RetrievalStatus.READY);
    if (carDetails) {
      try {
        const message = await generateStatusMessage('ready', { car: carDetails, driver: driverDetails });
        setStatusMessage(message);
      } catch (error) {
        console.error("Gemini API error:", error);
        setStatusMessage(`Your ${carDetails.make} ${carDetails.model} is now ready for pickup!`);
      }
    }
    setIsLoading(false);
  }, [carDetails, driverDetails]);


  const handleReset = () => {
    setAppState(AppState.REGISTRATION);
    setCarDetails(null);
    setRetrievalStatus(RetrievalStatus.NONE);
    setEta('');
    setStatusMessage('');
    setViewMode(ViewMode.CUSTOMER);
  };

  const renderContent = () => {
    if (appState === AppState.REGISTRATION) {
      return <RegistrationForm onRegister={handleRegister} isLoading={isLoading} />;
    }

    if (viewMode === ViewMode.CUSTOMER && carDetails) {
      return (
        <CustomerView
          carDetails={carDetails}
          driverDetails={driverDetails}
          retrievalStatus={retrievalStatus}
          eta={eta}
          statusMessage={statusMessage}
          onRequestCar={handleRequestCar}
          isLoading={isLoading}
        />
      );
    }

    if (viewMode === ViewMode.VALET && carDetails) {
      return (
        <ValetView
          carDetails={carDetails}
          retrievalStatus={retrievalStatus}
          onBringCar={handleBringCar}
          onCarReady={handleCarReady}
          isLoading={isLoading}
        />
      );
    }
    return null;
  };
  
  const isTrackingState = appState === AppState.TRACKING;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">Valet<span className="text-blue-400">Pro</span></h1>
          <p className="text-gray-400 mt-2">Seamless Parking Experience</p>
        </header>

        {isTrackingState && (
          <div className="mb-4 flex justify-center bg-gray-800 p-1 rounded-full">
            <button
              onClick={() => setViewMode(ViewMode.CUSTOMER)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${viewMode === ViewMode.CUSTOMER ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              Customer View
            </button>
            <button
              onClick={() => setViewMode(ViewMode.VALET)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${viewMode === ViewMode.VALET ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              Valet View
            </button>
          </div>
        )}

        <main className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
          {renderContent()}
        </main>
        
        {isTrackingState && (
           <div className="mt-6 text-center">
             <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm transition-colors">
               Register a New Vehicle
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
