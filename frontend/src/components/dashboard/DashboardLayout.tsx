import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/dashboard/AppSidebar";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function DashboardLayout() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // 🔥 Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);

        // ✅ Generate notifications
        const skills = data.skills;

        const list = [];

        if (skills.dsa < 50)
          list.push("⚠️ Improve DSA basics (Arrays, Strings)");

        if (skills.problemSolving < 60)
          list.push("🔥 Practice problem solving daily");

        if (skills.systemDesign < 40)
          list.push("📘 Start System Design basics");

        if (skills.projects < 50)
          list.push("💡 Build at least 1 strong project");

        if (skills.communication < 50)
          list.push("🗣️ Improve communication skills");

        setNotifications(list);
      }
    };

    fetchData();
  }, []);

  // 🔥 SEARCH NAVIGATION
  const handleSearch = (value: string) => {
    setQuery(value);

    const v = value.toLowerCase();

    if (v.includes("dashboard")) navigate("/dashboard");
    else if (v.includes("skill")) navigate("/dashboard/skills");
    else if (v.includes("peer")) navigate("/dashboard/peers");
    else if (v.includes("rank")) navigate("/dashboard/ranking");
    else if (v.includes("roadmap")) navigate("/dashboard/roadmap");
    else if (v.includes("profile")) navigate("/dashboard/profile");
    else if (v.includes("setting")) navigate("/dashboard/settings");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        {/* 🔥 TOP BAR */}
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 relative">

          {/* SEARCH */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search dashboard..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 🔔 NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {/* DROPDOWN */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-3 space-y-2 z-50">
                <p className="text-sm font-semibold">Suggestions</p>

                {notifications.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    You're doing great 🚀
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      {n}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 🌙 THEME */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* 👤 PROFILE CLICK → SETTINGS */}
          <div
            onClick={() => navigate("/dashboard/settings")}
            className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 cursor-pointer"
          >
            <img
              src={auth.currentUser?.photoURL || "/placeholder.png"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}