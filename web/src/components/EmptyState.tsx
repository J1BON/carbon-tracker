import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const defaultIcon = (
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-emerald-600 dark:text-emerald-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  );

  return (
    <Card className={`border-gray-200 dark:border-gray-800 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {icon || defaultIcon}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {description}
        </p>
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <>
                {action.to ? (
                  <Link to={action.to}>
                    <Button className="min-w-[140px] min-h-[44px]">
                      {action.label}
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={action.onClick} className="min-w-[140px] min-h-[44px]">
                    {action.label}
                  </Button>
                )}
              </>
            )}
            {secondaryAction && (
              <>
                {secondaryAction.to ? (
                  <Link to={secondaryAction.to}>
                    <Button variant="outline" className="min-w-[140px] min-h-[44px]">
                      {secondaryAction.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    onClick={secondaryAction.onClick}
                    className="min-w-[140px] min-h-[44px]"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

