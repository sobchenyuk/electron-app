import { Cloud, RefreshCcw } from "lucide-react";

const About = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-12 text-foreground">
      {/* Hero Block */}
      <div className="text-center space-y-4">
        <div className="inline-block relative p-4 bg-green-500/10 rounded-full">
          <Cloud className="h-16 w-16 text-green-400" />
          <RefreshCcw className="h-8 w-8 text-green-400 absolute bottom-2 right-2 transform translate-x-1/4 translate-y-1/4" />
        </div>
        <h1 className="text-5xl font-bold">ClipFlow Sync</h1>
        <p className="text-muted-foreground">Version 1.2.0 (Prototype)</p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-10">
        {/* Block 1 */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Current Prototype</h2>
          <p className="text-muted-foreground leading-relaxed">
            Currently, ClipFlow is a powerful prototype bridging Android and macOS. It allows you to connect an unlimited number of devices simultaneously. Every copy action on one device instantly updates the clipboard across your entire personal ecosystem without any artificial restrictions.
          </p>
        </div>

        {/* Block 2 */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Future Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are building more than just a tool; we are creating a unified digital space. Our roadmap includes native support for Windows and Linux, turning your diverse devices into a single, cohesive workstation with a shared pulse.
          </p>
        </div>

        {/* Block 3 */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Universal File Sync</h2>
          <p className="text-muted-foreground leading-relaxed">
            The next frontier is universal file synchronization. Imagine copying a high-res video or a complex project folder on one machine and having it immediately available on all others, regardless of format or size. All powered by the reliable Google Cloud infrastructure.
          </p>
        </div>

        {/* Block 4 */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Why ClipFlow?</h2>
          <p className="text-muted-foreground leading-relaxed">
            In a world of fragmented platforms, ClipFlow restores flow. It eliminates the 'send-to-self' friction, saving hours of manual file transfers and messaging. It's about making technology feel like a single, continuous experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
