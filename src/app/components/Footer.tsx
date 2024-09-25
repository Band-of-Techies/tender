import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              VendEasy is a smart vending solution offering quick and convenient access to everyday essentials. With a user-friendly interface, it ensures seamless transactions anytime, anywhere.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-sm border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()}  Vending machine. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
