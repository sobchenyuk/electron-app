import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusCard } from "../components/StatusCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Lock,
  CloudUpload,
  Eye,
  EyeOff,
  Copy,
  Zap,
  CheckCircle2,
  Play,
  StopCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/useToast";
import { parseFirebaseConfig } from "@/utils/firebaseValidator";
import { useConfigStore } from "@/store/useConfigStore";
import { useEngineStore } from "@/store/useEngineStore";
import { useLoadingStore } from "@/store/useLoadingStore";

const Dashboard = () => {
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [savedPassword, setSavedPassword] = useState<string | null>(
    localStorage.getItem("clipflow_encryption_key")
  );
  const { firebaseConfig, setFirebaseConfig, clearFirebaseConfig } = useConfigStore();
  const { isEngineRunning } = useEngineStore();
  const { isEngineLoading, setEngineLoading } = useLoadingStore();
  const [loadingConfig, setLoadingConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firebaseConfig) {
      window.electronAPI.setFirebaseConfig(firebaseConfig);
    } else {
      window.electronAPI.setFirebaseConfig(null);
    }
  }, [firebaseConfig]);

  useEffect(() => {
    if (savedPassword) {
      window.electronAPI.setEncryptionKey(savedPassword);
    } else {
      window.electronAPI.setEncryptionKey(""); // Clear key in main process if not set
    }
  }, [savedPassword]);

  const APP_IDENTIFIER = "com.clipflow.desktop";

  const handleCopyAppId = () => {
    navigator.clipboard.writeText(APP_IDENTIFIER);
    toast({
      title: "Copied",
      description: `App identifier copied to clipboard: ${APP_IDENTIFIER}`,
      variant: "success",
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingConfig(true);

    try {
      const result = await parseFirebaseConfig(file);

      if (result.valid && result.config) {
        const projectId = result.config.project_info?.project_id || result.config.project_id || "";
        const databaseUrl = result.config.project_info?.firebase_url || "";

        if (!projectId || !databaseUrl) {
           toast({
            title: "Error",
            description: "Missing project_id or firebase_url in config.",
            variant: "destructive",
          });
          return;
        }

        setFirebaseConfig(result.config);

        toast({
          title: "Success",
          description: "Firebase configuration loaded.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Invalid Firebase configuration file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration file",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetConfig = () => {
    clearFirebaseConfig();
    toast({
      title: "Configuration Reset",
      description: "Firebase configuration has been cleared.",
      variant: "default",
    });
  };

  const handleSavePassword = async () => {
    const trimmedPassword = passwordInput.trim();

    if (trimmedPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long after removing spaces.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("clipflow_encryption_key", trimmedPassword);
    setSavedPassword(trimmedPassword);
    setEditingPassword(false);

    toast({
      title: "Success",
      description: "Encryption key updated.",
      variant: "success",
    });

    setPasswordInput("");
  };

  const handleStartEngine = async () => {
    setEngineLoading(true);
    try {
      await window.electronAPI.startEngine();
      toast({
        title: "Engine Started",
        description: "Background sync is now active.",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setEngineLoading(false);
    }
  };

  const handleStopEngine = async () => {
    setEngineLoading(true);
    try {
      await window.electronAPI.stopEngine();
      toast({
        title: "Engine Stopped",
        description: "Background sync has been deactivated.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to stop the engine.",
        variant: "destructive",
      });
    } finally {
      setEngineLoading(false);
    }
  };

  const openPasswordDialog = () => {
    setPasswordInput(savedPassword || "");
    setEditingPassword(true);
  };

  return (
    <div className="w-full max-w-2xl space-y-6 p-6">
      {/* App Identifier */}
      <StatusCard badge="" icon={<Copy className="h-6 w-6" />} title="App Identifier" status={false}>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-black/20 rounded-lg px-4 py-3 font-mono text-base text-muted-foreground">{APP_IDENTIFIER}</div>
          <Button size="sm" variant="outline" onClick={handleCopyAppId} className="shrink-0"><Copy className="h-4 w-4" /></Button>
        </div>
        <p className="text-sm text-muted-foreground pt-2">Use this identifier when creating your Firebase App.</p>
      </StatusCard>

      {/* Encryption Key */}
      <StatusCard badge="ENCRYPTION KEY" badgeColor={savedPassword ? "green" : "gray"} icon={<Lock className="h-6 w-6" />} title={savedPassword ? "Password Accepted" : "Password Required"} description="This password is used to encrypt your messages end-to-end." status={!!savedPassword}>
        <div className="flex items-center justify-between">
          {savedPassword ? (
            <div className="bg-black/20 rounded-lg px-4 py-3 font-mono text-base text-muted-foreground flex-1 mr-4">
              ••••••••
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <Button variant="outline" size="sm" onClick={openPasswordDialog}>{savedPassword ? "EDIT" : "SET PASSWORD"}</Button>
        </div>
      </StatusCard>

      {/* Firebase Infrastructure */}
      <StatusCard
        badge="CORE CONFIG"
        badgeColor={firebaseConfig ? "green" : "gray"}
        icon={<CloudUpload className="h-6 w-6" />}
        title="Firebase Infrastructure"
        description="Import your google-services.json to establish a secure cloud bridge."
        status={!!firebaseConfig}
      >
        <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleFileSelect} style={{ display: "none" }} />
        {firebaseConfig ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-primary/10 rounded-lg px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span className="text-base font-mono text-primary truncate">{firebaseConfig.project_info?.project_id || firebaseConfig.project_id}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUploadClick} disabled={loadingConfig || !savedPassword}>{loadingConfig ? "Loading..." : "Upload New"}</Button>
              <Button variant="destructive" size="sm" onClick={handleResetConfig}><Trash2 className="h-4 w-4 mr-2" /> Reset</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="default"
            onClick={handleUploadClick}
            disabled={loadingConfig || !savedPassword}
            className="w-full"
          >
            {loadingConfig ? "Loading..." : "Upload Configuration"}
          </Button>
        )}
        {!savedPassword && (
           <p className="text-sm text-destructive pt-2">Please set your encryption password first.</p>
        )}
      </StatusCard>

      {/* Engine - Background Sync */}
      <StatusCard badge="ENGINE" badgeColor={isEngineRunning ? "green" : "gray"} icon={<Zap className="h-6 w-6" />} title="Background Sync Pulse" description="Activate the core service to listen for remote clipboard updates." status={isEngineRunning}>
        <div className="flex gap-3">
          <Button variant="default" size="lg" className="w-full" onClick={handleStartEngine} disabled={isEngineLoading || isEngineRunning || !savedPassword || !firebaseConfig}>
            {isEngineLoading && !isEngineRunning ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
            Start Engine
          </Button>
          <Button variant="destructive" size="lg" className="w-full" onClick={handleStopEngine} disabled={isEngineLoading || !isEngineRunning}>
            {isEngineLoading && isEngineRunning ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <StopCircle className="h-5 w-5 mr-2" />}
            Stop Engine
          </Button>
        </div>
      </StatusCard>

      {/* Edit Password Modal */}
      <Dialog open={editingPassword} onOpenChange={setEditingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Encryption Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-2">Enter E2E Password (min 8 symbols)</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="pr-10 h-12 text-lg" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingPassword(false); setPasswordInput(""); }}>CANCEL</Button>
            <Button onClick={handleSavePassword}>SAVE PASSWORD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
