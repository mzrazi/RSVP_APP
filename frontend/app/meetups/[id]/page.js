"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import MeetupForm from "../../../components/MeetupForm";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { api } from "../../../lib/api";
import { getSession } from "../../../lib/auth";

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function MeetupDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [meetup, setMeetup] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [currentUserRsvp, setCurrentUserRsvp] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [editing, setEditing] = useState(false);
  const session = getSession();

  useEffect(() => {
    async function load() {
      try {
        const [meetupData, attendeeData] = await Promise.all([
          api(`/api/meetups/${id}`),
          api(`/api/rsvps/${id}/attendees`, { token: getSession()?.token }),
        ]);
        setMeetup(meetupData.meetup);
        setAttendees(attendeeData.attendees);
        setCurrentUserRsvp(
          attendeeData.attendees.find((attendee) => attendee.id === getSession()?.user?.id) || null,
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function rsvp(status) {
    setError("");
    setActionLoading(status);
    try {
      await api(`/api/rsvps/${id}`, {
        method: currentUserRsvp ? "PUT" : "POST",
        token: session?.token,
        body: JSON.stringify({ status }),
      });
      const data = await api(`/api/rsvps/${id}/attendees`, {
        token: session?.token,
      });
      setAttendees(data.attendees);
      setCurrentUserRsvp(
        data.attendees.find((attendee) => attendee.id === session?.user?.id) || null,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  }

  async function update(form) {
    const data = await api(`/api/meetups/${id}`, {
      method: "PUT",
      token: session?.token,
      body: JSON.stringify(form),
    });
    setMeetup(data.meetup);
    setEditing(false);
  }

  async function remove() {
    if (!window.confirm("Delete this meetup? This cannot be undone.")) return;
    setActionLoading("delete");
    setError("");
    try {
      await api(`/api/meetups/${id}`, {
        method: "DELETE",
        token: session?.token,
      });
      router.push("/meetups");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  }

  if (loading)
    return (
      <>
        <Header />
        <main className="page-state">Loading meetup…</main>
      </>
    );
  if (error && !meetup)
    return (
      <>
        <Header />
        <main className="container">
          <p className="alert error" role="alert">
            {error}
          </p>
          <Link href="/meetups">Back to meetups</Link>
        </main>
      </>
    );
  const isOwner = meetup.owner_id === session?.user?.id;

  return (
    <>
      <Header />
      <main className="container narrow">
        <Link className="back-link" href="/meetups">
          ← All meetups
        </Link>
        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}
        {editing ? (
          <>
            <div className="page-heading">
              <h1>Edit meetup</h1>
              <button className="text-button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
            <MeetupForm
              initialMeetup={meetup}
              onSubmit={update}
              submitLabel="Save changes"
            />
          </>
        ) : (
          <>
            <article className="detail-card">
              <p className="date">{formatDate(meetup.event_date)}</p>
              <h1>{meetup.title}</h1>
              <p className="location">📍 {meetup.location}</p>
              <p className="description">
                {meetup.description || "No description provided."}
              </p>
              <p className="muted">Hosted by {meetup.owner_name}</p>
              {isOwner && (
                <div className="owner-actions">
                  <button
                    className="button secondary"
                    onClick={() => setEditing(true)}
                  >
                    Edit meetup
                  </button>
                  <button
                    className="danger-button"
                    disabled={actionLoading === "delete"}
                    onClick={remove}
                  >
                    {actionLoading === "delete" ? "Deleting…" : "Delete meetup"}
                  </button>
                </div>
              )}
            </article>
            <section className="rsvp-panel">
              <h2>Will you be there?</h2>
              <div className="rsvp-buttons">
                {["GOING", "MAYBE", "DECLINED"].map((status) => (
                  <button
                    className={`rsvp ${status.toLowerCase()}`}
                    key={status}
                    disabled={Boolean(actionLoading)}
                    onClick={() => rsvp(status)}
                  >
                    {actionLoading === status
                      ? "Saving…"
                      : status[0] + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </section>
            <section className="attendee-section">
              <h2>
                Attendees <span>({attendees.length})</span>
              </h2>
              {attendees.length === 0 ? (
                <p className="muted">No one has RSVPed yet.</p>
              ) : (
                <ul className="attendee-list">
                  {attendees.map((attendee) => (
                    <li key={attendee.id}>
                      <div>
                        <strong>{attendee.name}</strong>
                        <span>{attendee.email}</span>
                      </div>
                      <span
                        className={`status ${attendee.status.toLowerCase()}`}
                      >
                        {attendee.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default function MeetupDetailPage() {
  return (
    <ProtectedRoute>
      <MeetupDetailContent />
    </ProtectedRoute>
  );
}
