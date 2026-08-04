"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    graphics: "low" | "medium" | "high";
    sound: boolean;
    music: boolean;
    motion: boolean;
  };
  onSettingsChange: (settings: {
    graphics: "low" | "medium" | "high";
    sound: boolean;
    music: boolean;
    motion: boolean;
  }) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rahatverse-settings-title"
        className="w-full max-w-md rounded-3xl border border-white/20 bg-[#0f172a] p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 id="rahatverse-settings-title" className="text-2xl font-semibold">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="text-3xl text-white/50 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          {/* Graphics Quality */}
          <div>
            <div className="text-sm text-white/60 mb-3">Graphics Quality</div>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((level) => (
                <Button
                  key={level}
                  variant={settings.graphics === level ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, graphics: level })}
                  className="flex-1 capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Sound & Music */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Ambient Sound</span>
              <button
                onClick={() => onSettingsChange({ ...settings, sound: !settings.sound })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.sound ? "bg-[#22d3ee]" : "bg-white/20"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.sound ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Background Music</span>
              <button
                onClick={() => onSettingsChange({ ...settings, music: !settings.music })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.music ? "bg-[#22d3ee]" : "bg-white/20"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.music ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          {/* Motion Effects */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Motion Effects</span>
            <button
              onClick={() => onSettingsChange({ ...settings, motion: !settings.motion })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.motion ? "bg-[#22d3ee]" : "bg-white/20"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.motion ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-white/40">Changes apply immediately</div>
      </div>
    </div>
  );
}
