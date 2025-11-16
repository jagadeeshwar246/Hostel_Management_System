import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, Shield, Wifi, Users, BedDouble, Utensils, DoorClosed } from "lucide-react";
import { signInWithGoogle } from "../backend/firebaseConfig";
import { Globe, Mail, Linkedin } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");

  const getRoleFromEmail = (email: string) => {
    const userName = email.split("@")[0];

    if (/^r\d{6}$/i.test(userName)) return "student";
    if (email.toLowerCase().includes("warden")) return "warden";
    if (email.toLowerCase().includes("rguktrkva")) return "admin";

    return "unknown";
  };

  const handleLogin = (role: string, userData: any) => {
    localStorage.setItem("userRole", role);

    switch (role) {
      case "student":
        navigate("/student", { state: userData });
        break;
      case "warden":
        navigate("/warden", { state: userData });
        break;
      case "admin":
        navigate("/admin", { state: userData });
        break;
      default:
        navigate("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, error } = await signInWithGoogle();
      if (!user) return;

      const name = user.displayName || "User";
      const email = user.email || "";
      const uid = user.uid;
      const role = getRoleFromEmail(email);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userUID", uid);

      handleLogin(role, { name, email, uid });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ------------------- NAVBAR ------------------- */}
      <header className="fixed top-0 w-full backdrop-blur-md bg-background/50 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold">RGUKT HMS</h1>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#facilities" className="hover:text-primary">Facilities</a>
            <a href="#why" className="hover:text-primary">Why us</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </header>

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* Left text */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Hall Management <span className="text-primary">System</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A complete digital hostel management solution for students, wardens, and administration.
            </p>

            <div className="grid grid-cols-3 mt-8 gap-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary">10K+</h2>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-accent">24/7</h2>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-success">10+</h2>
                <p className="text-sm text-muted-foreground">Hostels</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Please verify your mail to access your dashboard</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button className="w-full text-lg py-6" onClick={handleGoogleLogin}>
                Verify Through Mail
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------- ABOUT HMC ------------------- */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold">About RGUKT Hall Management</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Our Hall Management Center ensures a safe, comfortable, and disciplined residential experience for all students.
            The hostel system is supported with modern amenities, digital management, and dedicated wardens.
          </p>
        </div>
      </section>

      {/* ------------------- FACILITIES SECTION ------------------- */}
      <section id="facilities" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Facilities</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Campus-wide fast and stable internet access." },
              { icon: Utensils, title: "Mess & Dining", desc: "Healthy and hygienic food with veg & non-veg options." },
              { icon: BedDouble, title: "Comfortable Rooms", desc: "Well-maintained single and shared rooms." },
              { icon: Shield, title: "24/7 Security", desc: "CCTV surveillance & hostel wardens on duty." },
              { icon: Users, title: "Study Rooms", desc: "Quiet study halls for academic preparation." },
              { icon: DoorClosed, title: "Visitor Management", desc: "Safe entry-exit logging and digital monitoring." },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition shadow-sm">
                <item.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

            {/* ------------------- WHY CHOOSE US SECTION ------------------- */}
      <section id="why" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Why Choose RGUKT Hall Management?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Residential System",
                desc: "24/7 monitored entry and digital verification for safe hostel living.",
              },
              {
                icon: Building2,
                title: "Automated Room Allocation",
                desc: "Smart, fair, and transparent room allotment system.",
              },
              {
                icon: Users,
                title: "Student-Centric Design",
                desc: "Every feature is built to improve student convenience and comfort.",
              },
              {
                icon: GraduationCap,
                title: "Academic-Friendly Environment",
                desc: "Dedicated study halls and silent zones for exam preparation.",
              },
              {
                icon: Wifi,
                title: "Unified Digital Platform",
                desc: "Payments, complaints, room requests — all from one dashboard.",
              },
              {
                icon: DoorClosed,
                title: "Verified Entry/Exit Logs",
                desc: "Daily logs tracked and stored securely for student safety.",
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 hover:shadow-xl transition shadow-sm">
                <item.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- CONTACT SECTION ------------------- */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <img
            src="https://rgukt.in/assets/media/logos/rgukt.png"
            alt="RGUKT Logo"
            className="mx-auto h-20 w-20"
          />

          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            Reach out to RGUKT Hall Management System for queries and support.
          </p>

          <div className="flex justify-center gap-10 pt-8">

            {/* Website */}
            <a
              href="https://www.rguktrkv.ac.in/"
              target="_blank"
              className="flex flex-col items-center hover:text-primary transition"
            >
              <Globe className="h-8 w-8 mb-2" />
              <span>University Website</span>
            </a>

            {/* Email */}
            <a
              href="mailto:admin@rguktrkv.ac.in"
              className="flex flex-col items-center hover:text-primary transition"
            >
              <Mail className="h-8 w-8 mb-2" />
              <span>admin@rguktrkv.ac.in</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              className="flex flex-col items-center hover:text-primary transition"
            >
              <Linkedin className="h-8 w-8 mb-2" />
              <span>RGUKT RKV</span>
            </a>

          </div>
        </div>
      </section>

      {/* ------------------- FOOTER ------------------- */}
      <footer id="footer" className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <p className="font-semibold text-lg">RGUKT Hall Management System</p>
          <p className="text-sm opacity-90">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;

