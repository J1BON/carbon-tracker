import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-eco-green text-white shadow hover:bg-green-700 active:bg-green-800",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
        outline: "border border-eco-green text-eco-green hover:bg-eco-green hover:text-white active:bg-eco-green/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
        destructive: "bg-red-600 text-white shadow hover:bg-red-700 active:bg-red-800",
      },
      size: {
        default: "h-9 min-h-[44px] px-4 py-2",
        sm: "h-8 min-h-[44px] rounded-md px-3 text-xs",
        lg: "h-10 min-h-[44px] rounded-md px-8",
        icon: "h-9 w-9 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

