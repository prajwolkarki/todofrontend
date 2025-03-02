// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Home Page
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-xl">
        This is your React Vite application built with Tailwind CSS. Explore the
        features and enjoy your stay!
      </p>
    </div>
  );
};

export default Home;
