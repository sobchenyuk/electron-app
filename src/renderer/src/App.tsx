import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Connection from "./pages/Connection";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Contacts from "./pages/Contacts";
import { Button } from "./components/ui/button";
import { toast } from "@/hooks/useToast";
import { Copy, Power, Settings, Info, Heart, User, KeyRound, RefreshCw } from "lucide-react";
import { version } from "../../../package.json";
import { useEngineStore } from "@/store/useEngineStore";

const getRoute = (hash: string) => {
  if (!hash) return "#/dashboard";
  const normalized = hash.toLowerCase();
  const route = routes.find((item) => item.path === normalized);
  return route ? route.path : "#/dashboard";
};

const routes = [
  { title: "Dashboard", path: "#/dashboard", icon: <Settings />, component: () => <Dashboard /> },
  { title: "Connection", path: "#/connection", icon: <Power />, component: () => <Connection /> },
  { title: "About", path: "#/about", icon: <Info />, component: () => <About /> },
  { title: "Donate", path: "#/donate", icon: <Heart />, component: () => <Donate /> },
  { title: "Contacts", path: "#/contacts", icon: <User />, component: () => <Contacts /> },
];

const getClipboardPreview = (content: string) => {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Clipboard updated";
  }

  return normalized.length > 72 ? `${normalized.slice(0, 72)}...` : normalized;
};

function App() {
  const [currentRoute, setCurrentRoute] = useState(getRoute(window.location.hash));
  const [deviceId, setDeviceId] = useState<string>("");
  const { isEngineRunning, setEngineRunning } = useEngineStore();

  useEffect(() => {
    window.electronAPI.getDeviceId()
      .then((id) => setDeviceId(id))
      .catch(console.error);

    if (!window.location.hash) {
      window.location.hash = "#/dashboard";
    }

    const onHashChange = () => {
      setCurrentRoute(getRoute(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    const removeEngineStateListener = window.electronAPI.onEngineStateChanged(setEngineRunning);
    const removeRemoteClipboardListener = window.electronAPI.onClipboardUpdatedFromRemote((content) => {
      toast({
        title: (
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync
          </span>
        ),
        description: getClipboardPreview(content),
        variant: "success",
      });
    });
    const removeDecryptFailedListener = window.electronAPI.onRemoteClipboardDecryptFailed(() => {
      toast({
        title: (
          <span className="inline-flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Password mismatch
          </span>
        ),
        description: "Received Firebase data could not be decrypted. Check that all devices use the same password.",
        variant: "destructive",
      });
    });

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      removeEngineStateListener();
      removeRemoteClipboardListener();
      removeDecryptFailedListener();
    };
  }, []);

  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    toast({
      title: "Copied",
      description: `Device ID copied to clipboard`,
      variant: "success",
    });
  };

  const activePage = routes.find((item) => item.path === currentRoute) ?? routes[0];
  const ActiveComponent = activePage.component;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border bg-card flex flex-col p-4">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">ClipFlow</h1>
          <p className="text-sm text-muted-foreground">Desktop Sync</p>
        </div>

        <nav className="flex-1 px-2 space-y-2 mt-6">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={route.path === currentRoute ? "secondary" : "ghost"}
              size="lg"
              className={`w-full justify-start gap-3 text-base ${route.path === currentRoute ? "text-primary font-bold" : "text-muted-foreground"}`}
              onClick={() => {
                window.location.hash = route.path;
              }}
            >
              {React.cloneElement(route.icon, { className: "h-5 w-5" })}
              <span>{route.title}</span>
            </Button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2">
            <Power className={`h-4 w-4 ${isEngineRunning ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className={`text-sm font-bold ${isEngineRunning ? 'text-primary' : 'text-muted-foreground'}`}>
              {isEngineRunning ? "Sync Active" : "Engine Stopped"}
            </p>
          </div>
           <p className="text-xs text-muted-foreground">Version {version}</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-6 border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{activePage.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Device ID</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground truncate">{deviceId || "Loading..."}</span>
                <Button size="sm" variant="outline" onClick={handleCopyDeviceId} className="shrink-0" disabled={!deviceId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <ActiveComponent />
        </div>

        <footer className="text-center py-4 border-t border-border">
            <p className="text-xs text-muted-foreground opacity-50">
              © {new Date().getFullYear()} Andrii Sobcheniuk
            </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
