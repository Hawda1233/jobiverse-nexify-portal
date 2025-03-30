
import React from 'react';

const SimpleFallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Application...</h1>
        <p className="mb-4 text-gray-600">
          If this screen persists, please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default SimpleFallbackPage;
