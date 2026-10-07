"use client";

import { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, MessageSquare, Send, Mail } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  suburbName?: string;
}

const CATEGORIES = [
  "Price discrepancy",
  "Bug report",
  "Feature idea",
  "General",
] as const;

export default function FeedbackModal({
  isOpen,
  onClose,
  suburbName = "",
}: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState<string>("Price discrepancy");
  const [customSuburb, setCustomSuburb] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("" );
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const effectiveSuburb =
    customSuburb !== null ? customSuburb : (suburbName || "Auckland Region (All)");

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

  const handleClose = () => {
    setSubmitted(false);
    setCustomSuburb(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) handleClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Set mock success state
    setSubmitted(true);

    // Auto-close after 2.5s
    setTimeout(() => {
      setMessage("");
      setEmail("");
      setCustomSuburb(null);
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const mailtoUrl = `mailto:feedback@kaispy.co.nz?subject=${encodeURIComponent(
    `KaiSpy Auckland: ${category} (${effectiveSuburb})`
  )}&body=${encodeURIComponent(
    `Category: ${category}\nSuburb: ${effectiveSuburb}\n\nMessage:\n${message}\n\nFrom: ${email || "Anonymous"}`
  )}`;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={handleClose}
      className="m-auto rounded-3xl shadow-2xl backdrop:bg-stone-900/40 backdrop:backdrop-blur-sm p-0 w-full max-w-md max-h-[90vh] open:animate-in open:fade-in open:zoom-in-95 border border-stone-200/80 overflow-hidden"
    >
      <div className="flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs shrink-0">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-black text-lg text-stone-900 tracking-tight">
                Feedback &amp; Bug Report
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Help us keep Auckland grocery pricing accurate
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 bg-white rounded-full shadow-2xs border border-stone-200/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Feedback Received!</h3>
              <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
                Thank you! Your feedback helps keep Auckland staples data accurate.
              </p>
              <div className="pt-2">
                <span className="text-xs text-stone-400 font-medium">Closing in a moment...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category dropdown */}
              <div>
                <label
                  htmlFor="feedback-category"
                  className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                >
                  Category
                </label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Suburb (auto-populated) */}
              <div>
                <label
                  htmlFor="feedback-suburb"
                  className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                >
                  Auckland Suburb / Store Location
                </label>
                <input
                  id="feedback-suburb"
                  type="text"
                  value={effectiveSuburb}
                  onChange={(e) => setCustomSuburb(e.target.value)}
                  placeholder="e.g. Royal Oak, Ponsonby, Albany"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-stone-400 font-medium"
                />
              </div>

              {/* Message textarea */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                >
                  Message / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What item price differed, or what bug did you notice?"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-stone-400 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Optional Email */}
              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                >
                  Email <span className="text-stone-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.co.nz"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-stone-400 font-medium"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-full shadow-md transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send Feedback</span>
                </button>

                {/* Mailto fallback */}
                <div className="text-center">
                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Or open in your email client</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
