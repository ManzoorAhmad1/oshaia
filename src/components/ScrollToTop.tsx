"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Images array for bottom slider
  const bottomImages = [
    "/images/bottom-slider/1.png",
    "/images/bottom-slider/2.png",
    "/images/bottom-slider/3.png",
    "/images/bottom-slider/4.png",
    "/images/bottom-slider/5.png",
    // Add more images as needed
  ];

  // Show button when page is scrolled upto given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Auto-change bottom image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bottomImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [bottomImages.length]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {/* Scroll to Top Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-[#112b38] text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 focus:outline-none"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
}