"use client";

import { useEffect, useRef } from "react";
import { X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle native dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="m-auto rounded-3xl shadow-2xl backdrop:bg-stone-900/40 backdrop:backdrop-blur-sm p-0 w-full max-w-lg max-h-[90vh] open:animate-in open:fade-in open:zoom-in-95 border border-stone-200/80 overflow-hidden"
    >
      <div className="flex flex-col max-h-[90vh] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-black text-lg text-stone-900 tracking-tight">
                Terms &amp; Disclaimer
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Independent pricing information notice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 bg-white rounded-full shadow-2xs border border-stone-200/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto overscroll-contain space-y-5 text-stone-700 text-sm leading-relaxed">
          {/* 1. Independent Service */}
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
            <h3 className="font-black text-stone-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              1. Independent Service
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              KaiSpy is an independent, community-driven consumer service. We are{" "}
              <strong>not affiliated with, endorsed by, or sponsored by</strong> Foodstuffs New
              Zealand (operators of PAK&apos;nSAVE and New World), Woolworths New Zealand Limited, or
              The Warehouse Group. All registered trademarks, logos, and supermarket brand names
              remain the sole property of their respective owners.
            </p>
          </div>

          {/* 2. Price Disclaimer */}
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
            <h3 className="font-black text-stone-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              2. Price Disclaimer
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Prices displayed represent scraped, indexed, or benchmark price estimates compiled for
              standard grocery basket comparison purposes across the Auckland region. Actual prices,
              stock availability, multi-buys, and special discounts may vary by physical store branch,
              in-store promotions, local manager specials, or member-only clubcard pricing.
            </p>
          </div>

          {/* 3. Limitation of Liability */}
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
            <h3 className="font-black text-stone-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" />
              3. Limitation of Liability
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              KaiSpy is provided free of charge on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis for informational purposes only. We make no warranties regarding
              uninterrupted service or absolute real-time accuracy. Users are encouraged to verify
              pricing directly at checkout before making purchasing decisions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 bg-stone-50/70 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-full shadow-md transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>I Understand</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
