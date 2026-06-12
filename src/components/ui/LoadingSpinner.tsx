/**
 * @file src/components/ui/LoadingSpinner.tsx
 * @description Simple loading spinner using lucide icon.
 */

import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);
