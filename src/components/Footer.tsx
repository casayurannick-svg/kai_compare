import { MessageSquare, FileText, Heart } from "lucide-react";

interface FooterProps {
  onOpenFeedback: () => void;
  onOpenTerms: () => void;
}

export default function Footer({ onOpenFeedback, onOpenTerms }: FooterProps) {
  const donationUrl =
    process.env.NEXT_PUBLIC_DONATION_URL || "https://revolut.me/ncasayuran";

  return (
    <footer className="mt-20 border-t border-stone-200/70 bg-stone-100/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* Utility buttons & donation link */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Buy Me a Coffee / Revolut pill (KC-GROWTH-02) */}
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-200/80 shadow-2xs transition-all active:scale-95"
            aria-label="Buy Me a Coffee"
          >
            <span className="text-base leading-none" aria-hidden="true">☕</span>
            <span>Buy Me a Coffee</span>
          </a>

          {/* Feedback & Bug Report trigger */}
          <button
            onClick={onOpenFeedback}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 shadow-2xs transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-stone-500" />
            <span>Feedback &amp; Bug Report</span>
          </button>

          {/* Terms & Disclaimer trigger */}
          <button
            onClick={onOpenTerms}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 shadow-2xs transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-stone-500" />
            <span>Terms &amp; Disclaimer</span>
          </button>
        </div>

        {/* Brand & copyright notice */}
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs sm:text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
            KaiCompare Auckland &bull; Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Kiwi shoppers
          </p>
          <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
            Independent community tool. Not affiliated with, endorsed by, or sponsored by Foodstuffs (PAK&apos;nSAVE, New World), Woolworths New Zealand, or The Warehouse Group.
          </p>
          <p className="text-[11px] text-stone-400">
            &copy; {new Date().getFullYear()} KaiCompare. All grocery trademarks remain the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
