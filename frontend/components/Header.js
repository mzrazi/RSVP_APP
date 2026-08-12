"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../lib/auth";

export default function Header() {
  const router = useRouter();
  const user = getSession()?.user;

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" href="/meetups">Meetup Tracker</Link>
        <nav>
          <Link href="/meetups">Meetups</Link>
          <Link className="button button-small" href="/meetups/new">Create meetup</Link>
          {user && <span className="user-name">Hi, {user.name}</span>}
          <button className="text-button" onClick={logout}>Log out</button>
        </nav>
      </div>
    </header>
  );
}
