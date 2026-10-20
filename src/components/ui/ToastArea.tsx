"use client";

import React from "react";
import { useToast } from "./useToast";
import { ToastContainer } from "./Toast";

export function ToastArea() {
  const { toasts, dismiss } = useToast();
  return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
}
