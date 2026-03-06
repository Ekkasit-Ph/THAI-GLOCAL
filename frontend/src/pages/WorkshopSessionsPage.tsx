import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Plus, Pencil, Trash2, BookOpen, Clock, Users,
  Calendar, Save, X, ChevronRight, CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useMyCenterStore, { UserSession } from "../store/myCenterStore";

// ─── helpers ─────────────────────────────────────────────────────────────────

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

function formatDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${Number(day)} ${months[Number(m) - 1]} ${y}`;
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const STATUS_META: Record<UserSession["status"], { label: string; color: string; icon: React.ReactNode }> = {
  upcoming:  { label: "Upcoming",  color: "bg-blue-50 text-blue-700 border-blue-100",   icon: <Clock className="w-3 h-3" /> },
  full:      { label: "Full",      color: "bg-amber-50 text-amber-700 border-amber-100", icon: <Users className="w-3 h-3" /> },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-100", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-100",       icon: <XCircle className="w-3 h-3" /> },
};

// ─── Session form ─────────────────────────────────────────────────────────────

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const EMPTY_SESSION = {
  date: tomorrow(),
  startTime: "09:00",
  endTime: "12:00",
  maxParticipants: 10,
  notes: "",
  status: "upcoming" as UserSession["status"],
};

function SessionForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_SESSION>;
  onSave: (data: typeof EMPTY_SESSION) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_SESSION, ...initial });
  const set = <K extends keyof typeof EMPTY_SESSION>(k: K, v: (typeof EMPTY_SESSION)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Date *</label>
          <input
            type="date"
            required
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />Start time *</label>
          <input
            type="time"
            required
            className={inputCls}
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />End time *</label>
          <input
            type="time"
            required
            className={inputCls}
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Users className="w-3.5 h-3.5 inline mr-1" />Max participants *</label>
          <input
            type="number"
            min={1}
            required
            className={inputCls}
            value={form.maxParticipants}
            onChange={(e) => set("maxParticipants", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            className={inputCls}
            value={form.status}
            onChange={(e) => set("status", e.target.value as UserSession["status"])}
          >
            <option value="upcoming">Upcoming</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes (optional)</label>
        <textarea
          rows={2}
          className={inputCls + " resize-none"}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any special notes for this session…"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" /> Save Session
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session, onEdit, onDelete }: {
  session: UserSession;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = STATUS_META[session.status];
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-start gap-4">
      {/* Date badge */}
      <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 text-center">
        <span className="text-xs font-semibold text-amber-700 uppercase leading-none">
          {session.date ? new Date(session.date + "T00:00:00").toLocaleString("en", { month: "short" }) : "—"}
        </span>
        <span className="text-xl font-bold text-amber-800 leading-tight">
          {session.date ? new Date(session.date + "T00:00:00").getDate() : "—"}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-stone-800 text-sm">{formatDate(session.date)}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${meta.color}`}>
            {meta.icon}{meta.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-stone-500">
            <Users className="w-3 h-3" />Max {session.maxParticipants}
          </span>
          {session.notes && (
            <span className="text-xs text-stone-400 truncate max-w-xs">{session.notes}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Panel = "none" | "add" | "edit";

export function WorkshopSessionsPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const store = useMyCenterStore();

  const [panel, setPanel] = useState<Panel>("none");
  const [editingSession, setEditingSession] = useState<UserSession | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!user) return <Navigate to="/login" state={{ from: `/my-center/workshop/${workshopId}` }} replace />;

  const workshop = workshopId ? store.getWorkshopById(workshopId) : undefined;

  if (!workshop || workshop.ownerId !== user.id) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-stone-300" />
        <p className="text-stone-500 text-sm">Workshop not found.</p>
        <button
          onClick={() => navigate("/my-center")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Center
        </button>
      </div>
    );
  }

  const sessions = store.getSessionsByWorkshop(workshop.id);

  const saveSession = (data: typeof EMPTY_SESSION) => {
    if (editingSession) {
      store.updateSession(editingSession.id, data);
      setEditingSession(null);
    } else {
      store.createSession({
        ...data,
        workshopId: workshop.id,
        centerId: workshop.centerId,
        ownerId: user.id,
      });
    }
    setPanel("none");
  };

  const handleDelete = (id: string) => {
    store.deleteSession(id);
    setConfirmDeleteId(null);
  };

  // Group sessions: upcoming vs past
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sessions.filter((s) => s.date >= today && s.status !== "cancelled" && s.status !== "completed");
  const past = sessions.filter((s) => s.date < today || s.status === "cancelled" || s.status === "completed");

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      {/* Header */}
      <div
        className="py-8 px-4"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/my-center")}
            className="flex items-center gap-1.5 text-amber-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            My Center
          </button>

          <div className="flex items-start gap-4">
            {workshop.image ? (
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7 text-white/70" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white leading-tight">{workshop.title}</h1>
              {workshop.titleTh && <p className="text-amber-200 text-sm mt-0.5">{workshop.titleTh}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-amber-200">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workshop.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />Up to {workshop.maxParticipants}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full">{workshop.category}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full">{workshop.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total sessions", value: sessions.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Completed", value: sessions.filter((s) => s.status === "completed").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit panel */}
        {panel !== "none" ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              {panel === "edit" ? "Edit Session" : "Add New Session"}
            </h2>
            <SessionForm
              initial={editingSession ? {
                date: editingSession.date,
                startTime: editingSession.startTime,
                endTime: editingSession.endTime,
                maxParticipants: editingSession.maxParticipants,
                notes: editingSession.notes,
                status: editingSession.status,
              } : undefined}
              onSave={saveSession}
              onCancel={() => { setPanel("none"); setEditingSession(null); }}
            />
          </div>
        ) : (
          <button
            onClick={() => { setEditingSession(null); setPanel("add"); }}
            className="flex items-center gap-2 self-start px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Session
          </button>
        )}

        {/* Upcoming sessions */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center">
              <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">No upcoming sessions. Add one above.</p>
            </div>
          ) : (
            upcoming.map((s) => (
              <div key={s.id}>
                {confirmDeleteId === s.id ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-red-700">Delete session on <strong>{formatDate(s.date)}</strong>?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <SessionCard
                    session={s}
                    onEdit={() => { setEditingSession(s); setPanel("edit"); }}
                    onDelete={() => setConfirmDeleteId(s.id)}
                  />
                )}
              </div>
            ))
          )}
        </section>

        {/* Past / Completed / Cancelled sessions */}
        {past.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
              Past & Cancelled ({past.length})
            </h2>
            {past.map((s) => (
              <div key={s.id}>
                {confirmDeleteId === s.id ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-red-700">Delete session on <strong>{formatDate(s.date)}</strong>?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <SessionCard
                    session={s}
                    onEdit={() => { setEditingSession(s); setPanel("edit"); }}
                    onDelete={() => setConfirmDeleteId(s.id)}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Workshop details accordion */}
        <details className="bg-white rounded-2xl border border-stone-100 shadow-sm group">
          <summary className="px-6 py-4 cursor-pointer flex items-center justify-between text-sm font-semibold text-stone-700 select-none list-none">
            Workshop Details
            <ChevronRight className="w-4 h-4 text-stone-400 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="px-6 pb-5 flex flex-col gap-3 text-sm text-stone-600">
            <p>{workshop.description}</p>
            {workshop.instructor && (
              <p><span className="font-medium text-stone-700">Instructor:</span> {workshop.instructor}</p>
            )}
            {workshop.whatYouLearn.length > 0 && (
              <div>
                <p className="font-medium text-stone-700 mb-1">What guests will learn:</p>
                <ul className="flex flex-col gap-1">
                  {workshop.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {workshop.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {workshop.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs">{t}</span>
                ))}
              </div>
            )}
          </div>
        </details>

      </div>
    </div>
  );
}
