import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import {
  Plus, Pencil, Trash2, Building2, Layers, ChevronDown, ChevronUp,
  X, Save, MapPin, Tag, BookOpen, Clock, Users, DollarSign,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useMyCenterStore, { UserCenter, UserWorkshop } from "../store/myCenterStore";

// ─── helpers ────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add tag and press Enter"
          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm">
          Add
        </button>
      </div>
    </div>
  );
}

function BulletListInput({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v) onChange([...items, v]);
    setInput("");
  };
  return (
    <div>
      <ul className="mb-2 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 bg-stone-50 rounded-lg text-sm text-stone-700">
            <span>{item}</span>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="w-3.5 h-3.5 text-stone-400 hover:text-red-500" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm">
          Add
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

// ─── Center form ─────────────────────────────────────────────────────────────

const EMPTY_CENTER = { name: "", nameTh: "", location: "", province: "", description: "", image: "", tags: [] as string[] };

function CenterForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_CENTER>;
  onSave: (data: typeof EMPTY_CENTER) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_CENTER, ...initial });
  const set = (k: keyof typeof EMPTY_CENTER, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Center name (EN) *</label>
          <input required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="My Learning Center" />
        </div>
        <div>
          <label className={labelCls}>ชื่อภาษาไทย</label>
          <input className={inputCls} value={form.nameTh} onChange={(e) => set("nameTh", e.target.value)} placeholder="ศูนย์เรียนรู้ของฉัน" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Location / District *</label>
          <input required className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Mae Rim, Chiang Mai" />
        </div>
        <div>
          <label className={labelCls}>Province *</label>
          <input required className={inputCls} value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="Chiang Mai" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description *</label>
        <textarea required rows={3} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell guests about your center…" />
      </div>
      <div>
        <label className={labelCls}>Cover image URL</label>
        <input type="url" className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/…" />
      </div>
      <div>
        <label className={labelCls}><Tag className="w-3.5 h-3.5 inline mr-1" />Tags</label>
        <TagInput tags={form.tags} onChange={(v) => set("tags", v)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Save className="w-4 h-4" /> Save Center
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Workshop form ───────────────────────────────────────────────────────────

const EMPTY_ACT = {
  title: "", titleTh: "", category: "", description: "", image: "",
  duration: "", maxParticipants: 10, price: 0,
  difficulty: "Beginner" as UserWorkshop["difficulty"],
  instructor: "", whatYouLearn: [] as string[], tags: [] as string[],
};

function WorkshopForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_ACT>;
  onSave: (data: typeof EMPTY_ACT) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_ACT, ...initial });
  const set = <K extends keyof typeof EMPTY_ACT>(k: K, v: (typeof EMPTY_ACT)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Workshop title (EN) *</label>
          <input required className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Traditional Thai Cooking" />
        </div>
        <div>
          <label className={labelCls}>ชื่อภาษาไทย</label>
          <input className={inputCls} value={form.titleTh} onChange={(e) => set("titleTh", e.target.value)} placeholder="อาหารไทยดั้งเดิม" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><BookOpen className="w-3.5 h-3.5 inline mr-1" />Category *</label>
          <input required className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Cooking / Crafts / Music…" />
        </div>
        <div>
          <label className={labelCls}>Difficulty</label>
          <select className={inputCls} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as UserWorkshop["difficulty"])}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Description *</label>
        <textarea required rows={3} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What guests will experience…" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />Duration *</label>
          <input required className={inputCls} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="3 hours" />
        </div>
        <div>
          <label className={labelCls}><Users className="w-3.5 h-3.5 inline mr-1" />Max participants</label>
          <input type="number" min={1} className={inputCls} value={form.maxParticipants} onChange={(e) => set("maxParticipants", Number(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}><DollarSign className="w-3.5 h-3.5 inline mr-1" />Price (฿)</label>
          <input type="number" min={0} className={inputCls} value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Instructor name *</label>
        <input required className={inputCls} value={form.instructor} onChange={(e) => set("instructor", e.target.value)} placeholder="Your name or instructor's name" />
      </div>
      <div>
        <label className={labelCls}>Cover image URL</label>
        <input type="url" className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/…" />
      </div>
      <div>
        <label className={labelCls}>What guests will learn</label>
        <BulletListInput items={form.whatYouLearn} onChange={(v) => set("whatYouLearn", v)} placeholder="E.g. How to make Tom Yum…" />
      </div>
      <div>
        <label className={labelCls}><Tag className="w-3.5 h-3.5 inline mr-1" />Tags</label>
        <TagInput tags={form.tags} onChange={(v) => set("tags", v)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Save className="w-4 h-4" /> Save Workshop
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Workshop card ───────────────────────────────────────────────────────────

function WorkshopCard({ workshop, onEdit, onDelete, onManage }: {
  workshop: UserWorkshop;
  onEdit: () => void;
  onDelete: () => void;
  onManage: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
      {workshop.image ? (
        <img src={workshop.image} alt={workshop.title} className="w-full sm:w-36 h-32 sm:h-auto object-cover shrink-0" />
      ) : (
        <div className="w-full sm:w-36 h-32 sm:h-auto bg-amber-50 flex items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8 text-amber-300" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <button
                onClick={onManage}
                className="text-left w-full group"
              >
                <h3 className="font-semibold text-stone-800 text-sm group-hover:text-amber-600 transition-colors">{workshop.title}</h3>
                {workshop.titleTh && <p className="text-xs text-stone-400">{workshop.titleTh}</p>}
              </button>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{workshop.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workshop.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {workshop.maxParticipants}</span>
            <span className="flex items-center gap-1 font-medium text-amber-700">฿{workshop.price.toLocaleString()}</span>
            <span className="px-2 py-0.5 bg-stone-100 rounded-full">{workshop.difficulty}</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{workshop.category}</span>
          </div>
          <button
            onClick={onManage}
            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            Manage Sessions →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Drawer = "none" | "center" | "workshop" | "editWorkshop";

export function MyCenterPage() {
  const user = useAuthStore((s) => s.user);
  const store = useMyCenterStore();
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState<Drawer>("none");
  const [editingWorkshop, setEditingWorkshop] = useState<UserWorkshop | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<"workshops" | "info">("workshops");
  const [centerExpanded, setCenterExpanded] = useState(false);

  if (!user) return <Navigate to="/login" state={{ from: "/my-center" }} replace />;

  const center = store.getCenterByOwner(user.id);
  const workshops = center ? store.getWorkshopsByCenter(center.id) : [];

  const saveCenter = (data: { name: string; nameTh: string; location: string; province: string; description: string; image: string; tags: string[] }) => {
    if (center) {
      store.updateCenter(center.id, data);
    } else {
      store.createCenter({ ...data, ownerId: user.id });
    }
    setDrawer("none");
    setCenterExpanded(false);
  };

  const saveWorkshop = (data: { title: string; titleTh: string; category: string; description: string; image: string; duration: string; maxParticipants: number; price: number; difficulty: UserWorkshop["difficulty"]; instructor: string; whatYouLearn: string[]; tags: string[] }) => {
    if (!center) return;
    if (editingWorkshop) {
      store.updateWorkshop(editingWorkshop.id, data);
      setEditingWorkshop(null);
    } else {
      store.createWorkshop({ ...data, centerId: center.id, ownerId: user.id });
    }
    setDrawer("none");
  };

  const handleDeleteWorkshop = (id: string) => {
    store.deleteWorkshop(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      {/* Header */}
      <div
        className="py-10 px-4"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Center</h1>
              <p className="text-amber-200 text-sm">Manage your cultural learning center</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ── No center yet ─────────────────────────────────── */}
        {!center && drawer === "none" && (
          <div className="bg-white rounded-2xl border border-dashed border-amber-200 p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">You don't have a center yet</h2>
            <p className="text-stone-500 text-sm max-w-sm mb-6">
              Create your cultural learning center to start adding workshops for guests to book.
            </p>
            <button
              onClick={() => setDrawer("center")}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create My Center
            </button>
          </div>
        )}

        {/* ── Create center form ─────────────────────────────── */}
        {!center && drawer === "center" && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" /> Create Your Center
            </h2>
            <CenterForm onSave={saveCenter} onCancel={() => setDrawer("none")} />
          </div>
        )}

        {/* ── Center dashboard ───────────────────────────────── */}
        {center && (
          <div className="flex flex-col gap-6">
            {/* Center info summary card */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  {center.image ? (
                    <img src={center.image} alt={center.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-stone-800">{center.name}</h2>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <MapPin className="w-3 h-3" />{center.location}, {center.province}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDrawer("center"); setCenterExpanded(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setCenterExpanded(!centerExpanded)}
                    className="p-1.5 rounded-xl hover:bg-stone-50 text-stone-400 transition-colors"
                  >
                    {centerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {centerExpanded && drawer !== "center" && (
                <div className="px-6 py-4 text-sm text-stone-600">
                  <p className="mb-3">{center.description}</p>
                  {center.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {center.tags.map((t) => (
                        <span key={t} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawer === "center" && (
                <div className="px-6 py-5 border-t border-stone-50">
                  <h3 className="text-sm font-semibold text-stone-700 mb-4">Edit Center Info</h3>
                  <CenterForm
                    initial={{ name: center.name, nameTh: center.nameTh, location: center.location, province: center.province, description: center.description, image: center.image, tags: center.tags }}
                    onSave={saveCenter}
                    onCancel={() => setDrawer("none")}
                  />
                </div>
              )}
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
              {(["workshops", "info"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${t === tab ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"}`}
                >
                  {t === "workshops" ? <><Layers className="w-3.5 h-3.5 inline mr-1" />Workshops ({workshops.length})</> : "Center Info"}
                </button>
              ))}
            </div>

            {/* ── Workshops tab ───── */}
            {tab === "workshops" && (
              <div className="flex flex-col gap-4">
                {drawer === "workshop" || drawer === "editWorkshop" ? (
                  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      {editingWorkshop ? "Edit Workshop" : "Add New Workshop"}
                    </h3>
                    <WorkshopForm
                      initial={editingWorkshop ? {
                        title: editingWorkshop.title,
                        titleTh: editingWorkshop.titleTh,
                        category: editingWorkshop.category,
                        description: editingWorkshop.description,
                        image: editingWorkshop.image,
                        duration: editingWorkshop.duration,
                        maxParticipants: editingWorkshop.maxParticipants,
                        price: editingWorkshop.price,
                        difficulty: editingWorkshop.difficulty,
                        instructor: editingWorkshop.instructor,
                        whatYouLearn: editingWorkshop.whatYouLearn,
                        tags: editingWorkshop.tags,
                      } : undefined}
                      onSave={saveWorkshop}
                      onCancel={() => { setDrawer("none"); setEditingWorkshop(null); }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingWorkshop(null); setDrawer("workshop"); }}
                    className="flex items-center gap-2 self-start px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Workshop
                  </button>
                )}

                {workshops.length === 0 && drawer === "none" && (
                  <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-10 text-center">
                    <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">No workshops yet. Add your first workshop above.</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {workshops.map((ws) => (
                    <div key={ws.id}>
                      {confirmDeleteId === ws.id ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                          <p className="text-sm text-red-700">Delete <strong>{ws.title}</strong>?</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleDeleteWorkshop(ws.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium">Delete</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <WorkshopCard
                          workshop={ws}
                          onEdit={() => { setEditingWorkshop(ws); setDrawer("editWorkshop"); }}
                          onDelete={() => setConfirmDeleteId(ws.id)}
                          onManage={() => navigate(`/my-center/workshop/${ws.id}`)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Info tab ───── */}
            {tab === "info" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h3 className="text-base font-semibold text-stone-800 mb-5">Center Details</h3>
                <dl className="flex flex-col gap-4 text-sm">
                  <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Name (EN)</dt><dd className="text-stone-800">{center.name}</dd></div>
                  {center.nameTh && <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">ชื่อภาษาไทย</dt><dd className="text-stone-800">{center.nameTh}</dd></div>}
                  <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Location</dt><dd className="text-stone-800">{center.location}, {center.province}</dd></div>
                  <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Description</dt><dd className="text-stone-600 leading-relaxed">{center.description}</dd></div>
                  {center.tags.length > 0 && (
                    <div>
                      <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">Tags</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {center.tags.map((t) => <span key={t} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs">{t}</span>)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
