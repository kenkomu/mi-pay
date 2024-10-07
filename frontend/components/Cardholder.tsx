'use client';

import React, { useState } from 'react';

const CardholderPage: React.FC = () => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch('/api/create-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardholderName }),
    });
  
    const data = await response.json();
    setCardDetails(data.virtualCard);
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Create a Virtual Card</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create Card
          </button>
        </form>

        {cardDetails && (
          <div className="mt-6">
            <h2 className="text-lg font-medium">Card Created!</h2>
            <p><strong>Card Number:</strong> {cardDetails.number}</p>
            <p><strong>Expiration Date:</strong> {cardDetails.exp_month}/{cardDetails.exp_year}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardholderPage;
