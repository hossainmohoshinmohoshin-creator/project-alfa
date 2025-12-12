"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function saveAuth(token: string, username: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

export function getToken() {
  return typeof window === "undefined" ? null : localStorage.getItem("token");
}

export function getUsername() {
  return typeof window === "undefined" ? null : localStorage.getItem("username");
}

// Use this in any dashboard page to force login
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/");
    }
  }, [router]);
}
