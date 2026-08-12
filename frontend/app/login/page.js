"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { getSession, saveSession } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/meetups");
    setSessionExpired(new URLSearchParams(window.location.search).get("reason") === "session-expired");
  }, [router]);

  async function login(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession({ token: data.token, user: data.user });
      router.push("/meetups");
    } catch (err) {
      setError(err.message);
      
    }finally {
    setLoading(false);
  }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">LOCAL COMMUNITY</p>
        <h1>Meetup Tracker</h1>
        <p className="muted">
          Sign in with one of the seeded accounts to manage local events and
          RSVPs.
        </p>
        {sessionExpired && (
          <p className="alert error" role="alert">
            Your session has expired. Please sign in again.
          </p>
        )}
        <form onSubmit={login}>
          {error && (
            <p className="alert error" role="alert">
              {error}
            </p>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="button full-width" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="hint">Demo: raju@example.com / password123</p>
      </section>
    </main>
  );
}
