import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Clock,
  Users,
  MapPin,
  Star,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  MessageSquare,
  X,
  PartyPopper,
} from "lucide-react";
import { activities, centers, Session } from "../data/mockData";
import useBookingStore from "../store/bookingStore";
import { toast } from "sonner";

function BookingModal({
  session,
  activityId,
  activityTitle,
  pricePerPerson,
  onClose,
  onSuccess,
}: {
  session: Session;
  activityId: string;
  activityTitle: string;
  pricePerPerson: number;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}) {
  const addBooking = useBookingStore((s) => s.addBooking);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    participants: 1,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const totalPrice = form.participants * pricePerPerson;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.participants < 1) e.participants = "At least 1 participant";
    if (form.participants > session.availableSpots)
      e.participants = `Only ${session.availableSpots} spots available`;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const bookingId = `BK${Date.now().toString().slice(-6)}`;
    addBooking({
      id: bookingId,
      activityId,
      sessionId: session.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      participants: form.participants,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      notes: form.notes,
    });

    setLoading(false);
    onSuccess(bookingId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="text-stone-900" style={{ fontSize: "1.1rem", fontWeight: 600 }}>Book Activity</h2>
            <p className="text-stone-500" style={{ fontSize: "0.8rem" }}>
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · {session.time}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Summary */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="text-amber-800 font-medium mb-1" style={{ fontSize: "0.875rem" }}>{activityTitle}</h3>
            <div className="flex items-center justify-between">
              <span className="text-stone-600" style={{ fontSize: "0.8rem" }}>
                ฿{pricePerPerson.toLocaleString()} × {form.participants} person{form.participants > 1 ? "s" : ""}
              </span>
              <span className="text-amber-700 font-bold" style={{ fontSize: "1rem" }}>
                ฿{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              Number of Participants
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, participants: Math.max(1, f.participants - 1) }))}
                className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold text-stone-900" style={{ fontSize: "1.1rem" }}>
                {form.participants}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, participants: Math.min(session.availableSpots, f.participants + 1) }))
                }
                className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                +
              </button>
              <span className="text-stone-400" style={{ fontSize: "0.75rem" }}>
                (max {session.availableSpots})
              </span>
            </div>
            {errors.participants && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.participants}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <User className="w-3.5 h-3.5 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.name ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.name && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.email ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.email && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <Phone className="w-3.5 h-3.5 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+66 81 234 5678"
              className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 outline-none transition-colors focus:border-amber-400 ${
                errors.phone ? "border-red-300" : "border-stone-200"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {errors.phone && <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>{errors.phone}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="text-stone-700 mb-1.5 block" style={{ fontSize: "0.875rem" }}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
              Special Requests{" "}
              <span className="text-stone-400 font-normal" style={{ fontSize: "0.75rem" }}>
                (optional)
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Dietary requirements, accessibility needs, etc."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none transition-colors focus:border-amber-400 resize-none"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              <>Confirm Booking · ฿{totalPrice.toLocaleString()}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingSuccessModal({
  bookingId,
  activityTitle,
  session,
  onClose,
}: {
  bookingId: string;
  activityTitle: string;
  session: Session;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-stone-900 mb-2" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          Booking Confirmed! 🎉
        </h2>
        <p className="text-stone-500 mb-1" style={{ fontSize: "0.875rem" }}>
          Booking ID: <span className="font-mono font-medium text-stone-700">{bookingId}</span>
        </p>
        <p className="text-stone-500 mb-6" style={{ fontSize: "0.875rem" }}>
          {activityTitle} ·{" "}
          {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
          at {session.time}
        </p>
        <p className="text-stone-400 mb-6" style={{ fontSize: "0.8rem" }}>
          A confirmation will be sent to your email. We look forward to seeing you!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { navigate("/my-bookings"); onClose(); }}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium"
            style={{ fontSize: "0.875rem" }}
          >
            View My Bookings
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const activity = activities.find((a) => a.id === id);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [bookingSession, setBookingSession] = useState<Session | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [successSession, setSuccessSession] = useState<Session | null>(null);

  if (!activity) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-stone-900 mb-2">Activity not found</h2>
          <Link to="/workshops" className="text-amber-600 hover:underline">
            Browse all activities
          </Link>
        </div>
      </div>
    );
  }

  const center = centers.find((c) => c.id === activity.centerId);

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced: "bg-rose-100 text-rose-700",
  };

  const spotsColor = (available: number, total: number) => {
    const ratio = available / total;
    if (available === 0) return "text-red-500";
    if (ratio <= 0.3) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          to="/workshops"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-600 transition-colors"
          style={{ fontSize: "0.875rem" }}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Activities
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden" style={{ height: "340px" }}>
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[activity.difficulty]}`}>
                {activity.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                {activity.category}
              </span>
              {activity.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-600">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-stone-900 mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
              {activity.title}
            </h1>
            <p className="text-stone-400 mb-4" style={{ fontSize: "0.85rem" }}>{activity.titleTh}</p>
            <div className="flex flex-wrap items-center gap-4 text-stone-500" style={{ fontSize: "0.875rem" }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                {activity.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                Max {activity.maxParticipants} participants
              </span>
              {center && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {center.name}, {center.location}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-stone-900 mb-3" style={{ fontWeight: 600 }}>About This Activity</h2>
            <p className="text-stone-600" style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
              {activity.description}
            </p>
          </div>

          {/* What you'll learn */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-stone-900 mb-4" style={{ fontWeight: 600 }}>What You'll Learn</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activity.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600" style={{ fontSize: "0.875rem" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to bring */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-stone-900 mb-4" style={{ fontWeight: 600 }}>What to Bring</h2>
            <ul className="flex flex-col gap-2">
              {activity.whatToBring.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600" style={{ fontSize: "0.875rem" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructor */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-stone-900 mb-4" style={{ fontWeight: 600 }}>Your Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-stone-900 font-medium" style={{ fontSize: "0.95rem" }}>
                  {activity.instructor}
                </p>
                <p className="text-stone-500 mt-1" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {activity.instructorBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-lg overflow-hidden">
              {/* Price header */}
              <div
                className="p-5 text-white"
                style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}
              >
                <p className="text-amber-200 mb-1" style={{ fontSize: "0.75rem" }}>Starting from</p>
                <p className="font-bold" style={{ fontSize: "1.8rem" }}>
                  ฿{activity.price.toLocaleString()}
                </p>
                <p className="text-amber-200" style={{ fontSize: "0.8rem" }}>per person</p>
              </div>

              <div className="p-5">
                <h3 className="text-stone-900 mb-4 font-medium">Available Sessions</h3>
                <div className="flex flex-col gap-2 mb-5">
                  {activity.sessions.map((session) => {
                    const isSelected = selectedSession?.id === session.id;
                    const isFull = session.availableSpots === 0;
                    return (
                      <button
                        key={session.id}
                        disabled={isFull}
                        onClick={() => setSelectedSession(isSelected ? null : session)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          isFull
                            ? "bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "border-amber-400 bg-amber-50"
                            : "border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-stone-800 font-medium" style={{ fontSize: "0.875rem" }}>
                              {new Date(session.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-stone-500" style={{ fontSize: "0.75rem" }}>
                              {session.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${spotsColor(session.availableSpots, session.totalSpots)}`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {isFull ? "Full" : `${session.availableSpots} left`}
                            </p>
                            <p className="text-stone-400" style={{ fontSize: "0.7rem" }}>
                              / {session.totalSpots}
                            </p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFull
                                ? "bg-red-300"
                                : session.availableSpots / session.totalSpots <= 0.3
                                ? "bg-orange-400"
                                : "bg-green-400"
                            }`}
                            style={{
                              width: `${((session.totalSpots - session.availableSpots) / session.totalSpots) * 100}%`,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (!selectedSession) {
                      toast.error("Please select a session first");
                      return;
                    }
                    setBookingSession(selectedSession);
                  }}
                  disabled={!selectedSession}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl transition-colors font-medium"
                >
                  {selectedSession ? "Book This Session" : "Select a Session"}
                </button>

                {center && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={center.image}
                        alt={center.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-stone-800 font-medium" style={{ fontSize: "0.75rem" }}>
                          {center.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-stone-500" style={{ fontSize: "0.7rem" }}>
                            {center.rating} · {center.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingSession && (
        <BookingModal
          session={bookingSession}
          activityId={activity.id}
          activityTitle={activity.title}
          pricePerPerson={activity.price}
          onClose={() => setBookingSession(null)}
          onSuccess={(id) => {
            setSuccessBookingId(id);
            setSuccessSession(bookingSession);
            setBookingSession(null);
            toast.success("Booking confirmed!");
          }}
        />
      )}

      {/* Success Modal */}
      {successBookingId && successSession && (
        <BookingSuccessModal
          bookingId={successBookingId}
          activityTitle={activity.title}
          session={successSession}
          onClose={() => {
            setSuccessBookingId(null);
            setSuccessSession(null);
          }}
        />
      )}
    </div>
  );
}
