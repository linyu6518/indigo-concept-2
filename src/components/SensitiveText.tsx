import type { ElementType, ReactNode } from "react";
import { cn } from "./ui/utils";

export const sensitiveBlurClass = "sensitive-blur";
export const sensitiveBlurBlockClass = "sensitive-blur-block";
export const sensitiveInputBlurClass = "sensitive-blur-input";
export const sensitiveAvatarBlurClass = "sensitive-blur-avatar";

type SensitiveTextProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  block?: boolean;
};

export function SensitiveText({
  children,
  className,
  as: Tag = "span",
  block = false,
}: SensitiveTextProps) {
  return (
    <Tag className={cn(block ? sensitiveBlurBlockClass : sensitiveBlurClass, className)}>
      {children}
    </Tag>
  );
}
