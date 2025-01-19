"use client";

import { motion } from "framer-motion";

interface WelcomeProps {
  onDismiss: () => void;
}

export default function Welcome({ onDismiss }: WelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-6 border border-blue-100"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Welcome to TodoApp! 🎉
      </h3>
      <p className="text-gray-600 mt-2">
        We&apos;ve created your first todo item to help you get started. Check
        your todo list to begin!
      </p>
      <button
        onClick={onDismiss}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Got it!
      </button>
    </motion.div>
  );
}
