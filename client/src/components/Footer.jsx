import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center p-4 mt-10">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Uniform Distribution System. All rights reserved.
      </p>
    </footer>
  );
}
