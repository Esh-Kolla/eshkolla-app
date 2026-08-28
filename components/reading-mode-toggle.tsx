"use client";

import { useState, useRef, useEffect } from "react";

export default function ReadingModeToggle() {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const bodyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    bodyRef.current = document.body;
  }, []);

  const toggleReadingMode = () => {
    const newMode = !isReadingMode;
    setIsReadingMode(newMode);

    if (!bodyRef.current) return;

    if (newMode) {
      // Activate reading mode
      bodyRef.current?.classList.add("reading-mode-active");
      document.documentElement.style.scrollBehavior = "auto";
    } else {
      // Deactivate reading mode
      bodyRef.current?.classList.remove("reading-mode-active");
      document.documentElement.style.scrollBehavior = "smooth";
    }

    // Save preference
    try {
      localStorage.setItem("reading-mode", newMode ? "enabled" : "disabled");
    } catch (e) {
      // Ignore storage errors
    }
  };

  // Load saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("reading-mode");
      if (saved === "enabled") {
        setIsReadingMode(true);
        document.body?.classList.add("reading-mode-active");
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  return (
    <button
      onClick={toggleReadingMode}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isReadingMode
          ? "bg-teal-700 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      title={isReadingMode ? "Exit reading mode" : "Enter reading mode"}
    >
      <span>{isReadingMode ? "📖" : "📄"}</span>
      <span>{isReadingMode ? "Reading Mode Active" : "Reading Mode"}</span>
    </button>
  );
}
