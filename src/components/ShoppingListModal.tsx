import { SmartSplitResult, ResolvedBranch } from "@/lib/types";
import { X, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SmartSplitResult;
  branches: ResolvedBranch[];
}

export default function ShoppingListModal({ isOpen, onClose, result, branches }: ShoppingListModalProps) {
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
    const textLines = ["🛒 KaiCompare Shopping List\n"];
    
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
      className="m-auto rounded-3xl shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm p-0 w-full max-w-md max-h-[85vh] open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="flex flex-col h-full max-h-[85vh] bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <h2 className="font-bold text-lg text-slate-900">Your Route</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm border border-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto overscroll-contain">
          {result.splitPlan.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Your basket is empty.</p>
          ) : (
            <div className="space-y-6">
              {result.splitPlan.map((step) => {
                const branch = branches.find((b) => b.branchId === step.branchId)!;
                return (
                  <div key={step.branchId}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{branch.logoEmoji}</span>
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">{branch.branchDisplayName}</h3>
                        <p className="text-xs text-slate-500">{branch.address}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {step.items.map((item) => (
                        <li key={item.itemId} className="flex justify-between items-start text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-700 font-medium">
                            <span className="text-slate-400 font-bold mr-2">{item.quantity}x</span>
                            {item.itemName}
                          </span>
                          <span className="text-slate-900 font-bold ml-4">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subtotal</span>
                      <span className="text-sm font-black text-slate-900">${step.storeTotal.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {result.splitPlan.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-700">Grand Total</span>
              <span className="text-2xl font-black text-slate-900">
                ${result.splitGrandTotal.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>
        )}
        
      </div>
    </dialog>
  );
}
