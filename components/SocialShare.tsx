import React from "react";
import { Button } from "./Button";

interface SocialShareProps {
  socialShare: {
    twitter: string;
    facebook: string;
    whatsapp: string;
    email: string;
  };
  shareableMessage?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  socialShare,
  shareableMessage,
}) => {
  const handleShare = (platform: string, url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareButtons = [
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      ),
      url: socialShare.twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: socialShare.facebook,
      color: "bg-[#4267B2] hover:bg-[#365899]",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      url: socialShare.whatsapp,
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
    },
    {
      name: "Email",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      url: socialShare.email,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Share Your Referral Link</h3>
        <p className="text-sm text-muted-foreground">
          Invite friends through your favorite platform
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shareButtons.map((button) => (
          <button
            key={button.name}
            onClick={() => handleShare(button.name, button.url)}
            className={`${button.color} text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors`}
          >
            {button.icon}
            <span className="text-sm font-medium">{button.name}</span>
          </button>
        ))}
      </div>

      {shareableMessage && (
        <div className="mt-4 p-4 bg-muted rounded-lg border">
          <p className="text-sm font-medium mb-2">Shareable Message:</p>
          <p className="text-sm text-muted-foreground italic">
            "{shareableMessage}"
          </p>
        </div>
      )}
    </div>
  );
};
