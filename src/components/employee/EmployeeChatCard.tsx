import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/ChatInterface";

export default function EmployeeChatCard() {
  return (
    <Card className="p-0 border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground">Chat</h3>
      </div>

      {/* Wrapper to keep the visual area tight and remove unwanted blur */}
      <div
        className="
          h-[520px] 
          bg-background
          [&_*]:backdrop-blur-0
          overflow-hidden
        "
      >
        {/* ChatInterface is embedded as-is; wrapper above reduces extra blurry area */}
        <ChatInterface />
      </div>
    </Card>
  );
}
