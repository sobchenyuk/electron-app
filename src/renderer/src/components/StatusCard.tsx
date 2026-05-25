import { Card, CardContent } from "./ui/card";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface StatusCardProps {
  badge: string;
  badgeColor?: "green" | "gray";
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  status?: boolean;
}

export const StatusCard = ({
  badge,
  badgeColor = "green",
  icon,
  title,
  description,
  children,
  status = true,
}: StatusCardProps) => {
  const badgeBg = badgeColor === "green"
    ? "bg-primary/20 text-primary"
    : "bg-muted/50 text-muted-foreground";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Badge and Status */}
          <div className="flex justify-between items-start">
            {badge && (
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeBg} uppercase tracking-wider`}>
                {badge}
              </span>
            )}
            {status && (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Title with Icon */}
          <div className="flex items-center gap-3">
            <div className="text-primary">{icon}</div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {/* Children (buttons, inputs, etc) */}
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
