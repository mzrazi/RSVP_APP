"use client";

import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import MeetupForm from "../../../components/MeetupForm";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { api } from "../../../lib/api";
import { getSession } from "../../../lib/auth";

function NewMeetupContent() {
  const router = useRouter();
  async function create(form) { const data = await api("/api/meetups", { method: "POST", token: getSession()?.token, body: JSON.stringify(form) }); router.push(`/meetups/${data.meetup.id}`); }
  return <><Header /><main className="container narrow"><div className="page-heading"><div><p className="eyebrow">HOST</p><h1>Create a meetup</h1></div></div><MeetupForm onSubmit={create} submitLabel="Create meetup" /></main></>;
}
export default function NewMeetupPage() { return <ProtectedRoute><NewMeetupContent /></ProtectedRoute>; }
