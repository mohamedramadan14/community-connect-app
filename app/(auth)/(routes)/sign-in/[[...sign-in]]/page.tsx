"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <SignIn />;
}
