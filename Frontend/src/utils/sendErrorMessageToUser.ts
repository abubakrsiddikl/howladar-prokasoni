/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IErrorResponse } from "@/types";
import { toast } from "sonner";

export const sendErrorMessageToUser = (error: unknown) => {
  let err: IErrorResponse | undefined;
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as any).data === "object"
  ) {
    err = (error as { data: IErrorResponse }).data;
  }

  if (err?.message) {
    toast.error(err.message);
  }
};
