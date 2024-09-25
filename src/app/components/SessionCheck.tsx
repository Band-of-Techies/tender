"use client"

import { isActive } from '@/helpers/isActive';
import React, { useEffect, useState } from 'react';
import { AiOutlineWarning } from 'react-icons/ai'; // Warning Icon

const SessionCheck: React.FC = () => {
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const active = await isActive();
      setSessionActive(active);
      if (active) {
        setShowAlert(true); // Show alert when the session is inactive
      }
    };

    checkSession();
  }, []);

  const closeAlert = () => {
    setShowAlert(false); 
    window.location.reload();
  };

  return (
    <div>
      {sessionActive && showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:max-w-lg lg:max-w-2xl p-6 transform transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AiOutlineWarning className="text-yellow-500 text-2xl mr-2" />
                <h3 className="text-xl font-bold text-gray-800">Session Inactive</h3>
              </div>
              <button
                onClick={closeAlert}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="mt-4 text-base text-gray-600">
              Your session has expired or is inactive. Please log in again to continue.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeAlert}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCheck;
