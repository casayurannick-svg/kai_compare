import { SmartSplitResult, ResolvedBranch } from "@/lib/types";
import { X, Copy, Check, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SmartSplitResult;
  branches: ResolvedBranch[];
}

export default function ShoppingListModal({
  isOpen,
  onClose,
  result,
  branches,
}: ShoppingListModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

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

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const copyToClipboard = () => {
    const textLines = ["🛒 KaiSpy Shopping List\n"];

    result.splitPlan.forEach((step) => {
      textLines.push(`📍 ${step.branchDisplayName}`);
      step.items.forEach((item) => {
        textLines.push(`   [] ${item.quantity}x ${item.itemName} ($${item.lineTotal.toFixed(2)})`);
      });
      textLines.push(`   Subtotal: $${step.storeTotal.toFixed(2)}\n`);
    });

    textLines.push(`Grand Total: $${result.splitGrandTotal.toFixed(2)}`);

    if (result.savingsVsSingleCheapest > 0) {
      textLines.push(`Saved: $${result.savingsVsSingleCheapest.toFixed(2)}`);
    }

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="m-auto rounded-3xl shadow-2xl backdrop:bg-stone-900/40 backdrop:backdrop-blur-sm p-0 w-full max-w-md max-h-[85vh] open:animate-in open:fade-in open:zoom-in-95 border border-stone-200/80 overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[85vh] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70 sticky top-0 z-10">
          <div>
            <h2 className="font-black text-lg text-stone-900 tracking-tight">Shopping Route</h2>
            <p className="text-xs text-stone-500 font-medium">Smart Split stop-by-stop haul</p>
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
        <div className="p-6 overflow-y-auto overscroll-contain">
          {result.splitPlan.length === 0 ? (
            <p className="text-stone-500 text-center py-8">Your basket is empty.</p>
          ) : (
            <div className="space-y-6">
              {result.splitPlan.map((step) => {
                const branch = branches.find((b) => b.branchId === step.branchId)!;
                return (
                  <div key={step.branchId} className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center text-base shadow-2xs">
                        {branch.logoEmoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm leading-tight">
                          {branch.branchDisplayName}
                        </h3>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate max-w-[260px]">{branch.address}</span>
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-1.5">
                      {step.items.map((item) => (
                        <li
                          key={item.itemId}
                          className="flex justify-between items-center text-xs bg-stone-50/70 p-2.5 rounded-2xl border border-stone-200/50"
                        >
                          <span className="text-stone-700 font-medium flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-stone-200/70 text-stone-800 font-bold text-[10px]">
                              {item.quantity}x
                            </span>
                            <span>{item.itemName}</span>
                          </span>
                          <span className="text-stone-900 font-black ml-2">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Subtotal
                      </span>
                      <span className="text-sm font-black text-stone-900">
                        ${step.storeTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {result.splitPlan.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50/80 sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-stone-600 text-sm">Grand Total</span>
              <span className="text-2xl font-black text-stone-900 tracking-tight">
                ${result.splitGrandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-full shadow-md transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Shopping List</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
