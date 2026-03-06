import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Phone, FileText, Save, LogOut, Camera } from "lucide-react";
import useAuthStore from "../store/authStore";

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-full bg-amber-500 flex items-center justify-center text-white font-bold select-none"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim(), phone: phone.trim(), bio: bio.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Hero card */}
        <div
          className="rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
        >
          <div className="relative">
            <Avatar name={user.name} size={88} />
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
              <Camera className="w-3.5 h-3.5 text-stone-500" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-amber-200 text-sm mt-0.5">{user.email}</p>
            {user.bio && <p className="text-amber-100/80 text-sm mt-2 max-w-sm">{user.bio}</p>}
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-6">Edit Profile</h2>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label htmlFor="p-name" className="block text-sm font-medium text-stone-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address <span className="text-stone-400 font-normal">(cannot change)</span>
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 text-sm cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="p-phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                Phone number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="p-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 081-234-5678"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="p-bio" className="block text-sm font-medium text-stone-700 mb-1.5">
                Short bio
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <textarea
                  id="p-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell us a little about yourself…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
