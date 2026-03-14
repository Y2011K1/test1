"use client";

import { useEffect, useState } from "react";
import { Settings, Globe, Database, Shield, Bell, Palette, Save, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "EduNova",
    platformUrl: "",
    maintenanceMode: false,
    emailNotifications: true,
    analyticsEnabled: true,
    debugMode: false,
  });

  useEffect(() => {
    // Load any previously saved settings from localStorage
    const s = localStorage.getItem("adminSettings");
    if (s) {
      try { setSettings(JSON.parse(s)); } catch {}
    }
    // Populate platform URL
    setSettings(prev => ({ ...prev, platformUrl: window.location.origin }));
  }, []);

  const handleSave = () => {
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      icon: Globe,
      title: "Platform Settings",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={e => setSettings(s => ({ ...s, platformName: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Platform URL</label>
            <input
              type="text"
              value={settings.platformUrl}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium outline-none text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      )
    },
    {
      icon: Bell,
      title: "Notifications",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      fields: (
        <div className="space-y-4">
          {[
            { key: "emailNotifications" as const, label: "Email Notifications", desc: "Get notified on new enrollments and activity" },
            { key: "analyticsEnabled" as const, label: "Analytics Tracking", desc: "Enable usage and performance analytics" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-all ${settings[item.key] ? "bg-blue-600" : "bg-white/10"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? "left-6" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Shield,
      title: "System",
      color: "text-red-400",
      bg: "bg-red-400/10",
      fields: (
        <div className="space-y-4">
          {[
            { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Take the platform offline for maintenance" },
            { key: "debugMode" as const, label: "Debug Mode", desc: "Enable verbose logging (development only)" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-all ${settings[item.key] ? "bg-red-500" : "bg-white/10"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? "left-6" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure platform preferences and system options</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/studio"
          target="_blank"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-all group"
        >
          <Database className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Sanity Studio</p>
            <p className="text-xs text-gray-500">Manage content schema</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-all group"
        >
          <Globe className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold">View Platform</p>
            <p className="text-xs text-gray-500">Go to the student-facing site</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Settings Sections */}
      {sections.map((section, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <div className={`w-8 h-8 ${section.bg} rounded-lg flex items-center justify-center`}>
              <section.icon className={`w-4 h-4 ${section.color}`} />
            </div>
            <h2 className="font-bold text-sm">{section.title}</h2>
          </div>
          <div className="px-6 py-5">
            {section.fields}
          </div>
        </div>
      ))}
    </div>
  );
}
