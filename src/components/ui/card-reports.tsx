// components/ui/card.tsx

import { FC } from "react";

export const Card: FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>{children}</div>
);
