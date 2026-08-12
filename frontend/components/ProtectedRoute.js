"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!getSession()) router.replace("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return <main className="page-state">Checking your session…</main>;
  return children;
}
