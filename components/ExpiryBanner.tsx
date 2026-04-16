"use client";

import { AlertTriangle, Clock } from "lucide-react";

interface ExpiryBannerProps {
  expiringCount: number;
  expiredCount: number;
}

export default function ExpiryBanner({ expiringCount, expiredCount }: ExpiryBannerProps) {
  return (
    <div className="animate-slide-down mt-3">
      {expiredCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl mb-2">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="text-sm text-red-700 font-medium">
            {expiredCount} item{expiredCount !== 1 ? "s" : ""} expired
          </p>
        </div>
      )}
      {expiringCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-sm text-amber-700 font-medium">
            {expiringCount} item{expiringCount !== 1 ? "s" : ""} expiring soon
          </p>
        </div>
      )}
    </div>
  );
}
