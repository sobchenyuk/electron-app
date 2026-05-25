import { Button } from "../components/ui/button";
import { toast } from "@/hooks/useToast";
import { Copy, Trash2 } from "lucide-react";
import { useConfigStore } from "@/store/useConfigStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
      variant: "success",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-xs text-green-400 uppercase font-semibold tracking-wider">{label}</p>
        <p className="text-base font-mono text-foreground mt-1 break-all">{value || "Not available"}</p>
      </div>
      <Button size="sm" variant="outline" onClick={handleCopy} disabled={!value}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Connection = () => {
  const { firebaseConfig, clearFirebaseConfig } = useConfigStore();

  const handleDeleteConfig = () => {
    clearFirebaseConfig();
    toast({
      title: "Configuration Deleted",
      description: "Firebase config has been removed.",
      variant: "default",
    });
  };

  const client = firebaseConfig?.client?.[0];
  const projectInfo = firebaseConfig?.project_info;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      {firebaseConfig ? (
        <>
          <div className="space-y-4">
            <InfoRow label="Project ID" value={projectInfo?.project_id} />
            <InfoRow label="API Key" value={client?.api_key?.[0]?.current_key} />
            <InfoRow label="App ID" value={client?.client_info?.mobilesdk_app_id} />
            <InfoRow label="Database URL" value={projectInfo?.firebase_url} />
            <InfoRow label="Storage Bucket" value={projectInfo?.storage_bucket} />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg" className="w-full">
                <Trash2 className="h-5 w-5 mr-2" />
                Reset Configuration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your loaded Firebase configuration. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={handleDeleteConfig}>
                  Reset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No Firebase configuration loaded.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Go to the Dashboard to upload your `google-services.json` file.
          </p>
        </div>
      )}
    </div>
  );
};

export default Connection;
