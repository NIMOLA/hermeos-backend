import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

// Simplified Checkbox that doesn't rely on Radix primitives to keep it self-contained if needed,
// but behaves similarly.
const Checkbox = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-800 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900",
            checked ? "bg-slate-900 border-slate-900 dark:bg-slate-50 dark:border-slate-50" : "bg-transparent",
            className
        )}
        data-state={checked ? "checked" : "unchecked"}
        {...props}
    >
        {checked && (
            <span className="flex items-center justify-center text-current">
                <Check className="h-3 w-3" strokeWidth={3} />
            </span>
        )}
    </button>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
