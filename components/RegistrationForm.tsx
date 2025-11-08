
import React, { useState } from 'react';
import { CarDetails } from '../types';
import { KeyIcon } from './icons/KeyIcon';

interface RegistrationFormProps {
  onRegister: (details: CarDetails) => void;
  isLoading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState<CarDetails>({
    make: '',
    model: '',
    licensePlate: '',
    mobileNumber: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(field => field.trim() === '')) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onRegister(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Register Your Vehicle</h2>
        <p className="text-gray-400 mt-1">Enter your details to get started.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="make"
          placeholder="Car Make (e.g., Toyota)"
          value={formData.make}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        />
        <input
          type="text"
          name="model"
          placeholder="Car Model (e.g., Camry)"
          value={formData.model}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        />
      </div>
      <input
        type="text"
        name="licensePlate"
        placeholder="License Plate"
        value={formData.licensePlate}
        onChange={handleChange}
        className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
      />
      <input
        type="tel"
        name="mobileNumber"
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        onChange={handleChange}
        className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
      />
      
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 transform active:scale-95"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <KeyIcon className="w-5 h-5 mr-2" />
            Register and Park
          </>
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;
