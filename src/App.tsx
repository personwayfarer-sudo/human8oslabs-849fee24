import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Subsistance from "./pages/Subsistance";
import Roles from "./pages/Roles";
import Mediation from "./pages/Mediation";
import Savoirs from "./pages/Savoirs";
import Parametres from "./pages/Parametres";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subsistance" element={<Subsistance />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/mediation" element={<Mediation />} />
          <Route path="/savoirs" element={<Savoirs />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
