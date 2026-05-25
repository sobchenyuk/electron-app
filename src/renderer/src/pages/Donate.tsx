import { HandHeart } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "@/hooks/useToast";

const BTC_ADDRESS = "1D3A2QLdMx8XWPrVUufGvw7fb7opRgTPoY";

const Donate = () => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS);
    toast({
      title: "Copied Successfully",
      description: "BTC Address copied to clipboard.",
      variant: "success",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center space-y-10 text-foreground">
      {/* Hero Block */}
      <div className="pt-12 space-y-4">
        <div className="inline-block p-6 bg-pink-500/10 rounded-full">
          <HandHeart className="h-20 w-20 text-pink-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-bold">Support the Project</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          If you find ClipFlow useful, consider supporting the developer. Your contribution helps sustain development and accelerate future updates.
        </p>
      </div>

      {/* Donation Card */}
      <div className="bg-card border rounded-2xl p-8 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-green-400">BITCOIN (BTC) ADDRESS</p>
          <p className="text-lg font-mono text-foreground break-all">
            {BTC_ADDRESS}
          </p>
        </div>
        <Button
          size="lg"
          className="w-full bg-green-400 text-black hover:bg-green-500"
          onClick={handleCopyAddress}
        >
          COPY BTC ADDRESS
        </Button>
      </div>
    </div>
  );
};

export default Donate;
