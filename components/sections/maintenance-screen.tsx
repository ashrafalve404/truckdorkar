"use client";

import React from "react";

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-xl mx-auto space-y-3">
        <h1 className="text-xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          This website is currently under maintenance.
        </h1>
        <p className="text-base md:text-xl text-slate-600 font-normal">
          ওয়েবসাইটটিতে বর্তমানে রক্ষণাবেক্ষণের কাজ চলছে।
        </p>
      </div>
    </div>
  );
}
