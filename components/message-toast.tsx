"use client";

import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function MessageToast() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }

    if (success) {
      toast({
        title: "Success",
        description: success,
      });
    }
  }, [searchParams, toast]);

  return null;
}
