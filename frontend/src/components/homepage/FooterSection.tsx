import React from "react";
import { useNavigate } from "react-router-dom";

const FooterSection: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/login');
  };

  return (
    <div className="flex flex-col items-center bg-[#3C315B] py-[80px] px-[136px]">
      <div className="flex flex-col items-center mb-[60px]">
        <span className="text-white text-[48px] font-bold text-center mb-4">
          Ready to Transform Your Academic Journey?
        </span>
        <span className="text-gray-300 text-xl text-center mb-8 max-w-[600px]">
          Join thousands of students who are already using AI-powered predictions to improve their academic performance.
        </span>
        <button
          className="flex items-center bg-[#AB9FF2] text-white py-4 px-8 rounded-[50px] border-0 hover:bg-[#9B8FF0] transition-colors"
          onClick={handleGetStarted}
        >
          <span className="text-xl font-bold">Get Started Now</span>
        </button>
      </div>
      
      <div className="flex justify-between w-full border-t border-gray-600 pt-8">
        <div className="flex flex-col">
          <span className="text-white text-[25px] font-bold mb-4">SCORE PREDICT</span>
          <span className="text-gray-400 text-sm">© 2025 Score Predict. All rights reserved.</span>
        </div>
        
        <div className="flex gap-[60px]">
          <div className="flex flex-col">
            <span className="text-white text-lg font-bold mb-4">Product</span>
            <span className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white">Features</span>
            <span className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white">How it Works</span>
            <span className="text-gray-400 text-sm cursor-pointer hover:text-white">Testimonials</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-white text-lg font-bold mb-4">Support</span>
            <span className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white">Help Center</span>
            <span className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white">Contact Us</span>
            <span className="text-gray-400 text-sm cursor-pointer hover:text-white">Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
