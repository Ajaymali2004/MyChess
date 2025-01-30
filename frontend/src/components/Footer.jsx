import React from "react";
import { FaChessPawn } from "react-icons/fa";
import { CiLinkedin, CiInstagram, CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="text-white py-2 mt-8 sticky bottom-0 backdrop-blur-lg">
      <div className="container mx-auto text-center">
        <h3 className="text-sm font-semibold mb-2">Connect with me</h3>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <a
            href="https://www.chess.com/member/rock_bishop"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 mb-2"
          >
            <FaChessPawn className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 hover:opacity-80" />
          </a>
          <a
            href="https://www.linkedin.com/in/ajay-mali22?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 mb-2"
          >
            <CiLinkedin className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 hover:text-blue-500 hover:bg-transparent transition-all duration-200" />
          </a>
          <a
            href="mailto:ajays95372@gmail.com"
            className="hover:text-orange-400 mb-2"
          >
            <CiMail className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 hover:opacity-80" />
          </a>
          <a
            href="https://www.instagram.com/ajayyy.solanki?igsh=MTI3ejNhZzBrMnp2bw=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 mb-2"
          >
            <CiInstagram className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 hover:text-pink-500 hover:bg-transparent transition-all duration-200" />
          </a>
        </div>
        <p className="mt-2 text-xs">&copy; 2025, All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
