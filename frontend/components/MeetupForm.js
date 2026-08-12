"use client";

import { useState } from "react";

function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function MeetupForm({ initialMeetup, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: initialMeetup?.title || "",
    description: initialMeetup?.description || "",
    location: initialMeetup?.location || "",
    event_date: toInputDate(initialMeetup?.event_date),
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      {error && <p className="alert error" role="alert">{error}</p>}
      <label>Title<input required maxLength="150" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" /></label>
      <label>Location<input required maxLength="255" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
      <label>Date and time<input required type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></label>
      <button className="button" disabled={submitting}>{submitting ? "Saving…" : submitLabel}</button>
    </form>
  );
}
