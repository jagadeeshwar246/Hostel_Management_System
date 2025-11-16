import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentComplaints from "./pages/student/StudentComplaints";
import WardenDashboard from "./pages/warden/WardenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import WardenComplaints from "./pages/warden/WardenComplaints";
import WardenOccupancy from "./pages/warden/WardenOccupancy";
import StudentDues from "./pages/student/StudentDues";
import StudentPayments from "./pages/student/StudentPayment";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/complaints" element={<StudentComplaints />} />
          <Route path="/student/dues" element={<StudentDues />} />
          <Route path="/student/payments" element={<StudentPayments />} />
          <Route path="/warden" element={<WardenDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/warden/complaints" element={<WardenComplaints />} />
          <Route path="/warden/occupancy" element={<WardenOccupancy />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
