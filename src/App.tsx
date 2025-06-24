
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Workspace from "./pages/Workspace";
import WorkspaceNew from "./pages/WorkspaceNew";
import NotionInterface from "./pages/NotionInterface";
import ChatInterface from "./components/ChatInterface";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Index />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/workspace-new" element={<WorkspaceNew />} />
          <Route path="/notion" element={<NotionInterface />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
