"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import ProtectedRoute from "../../components/ProtectedRoute";
import { api } from "../../lib/api";

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function MeetupsContent() {
  const [meetups, setMeetups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api("/api/meetups")
      .then((data) => setMeetups(data.meetups))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Header />
      <main className="container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">DISCOVER</p>
            <h1>Upcoming meetups</h1>
            <p className="muted">
              Find a local gathering, see who is attending, and RSVP.
            </p>
          </div>
          <Link className="button" href="/meetups/new">
            Create meetup
          </Link>
        </div>
        {loading && <p className="page-state">Loading meetups…</p>}
        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && meetups.length === 0 && (
          <div className="empty-state">
            No meetups yet. Create the first one.
          </div>
        )}
        <section className="meetup-grid">
          {meetups.map((meetup) => (
            <article className="meetup-card" key={meetup.id}>
              <p className="date">{formatDate(meetup.event_date)}</p>
              <h2>
                <Link href={`/meetups/${meetup.id}`}>{meetup.title}</Link>
              </h2>
              <p className="muted clamp">
                {meetup.description || "No description provided."}
              </p>
              <div className="card-footer">
                <span>{meetup.location}</span>
                <span>by {meetup.owner_name}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
export default function MeetupsPage() {
  return (
    <ProtectedRoute>
      <MeetupsContent />
    </ProtectedRoute>
  );
}
