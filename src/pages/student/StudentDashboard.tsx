import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { useToast } from "@/hooks/use-toast";

// Firestore CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  limit,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA12e1UZghB5u3qiQ2jEaht__0fo_Jye0U",
  authDomain: "hall-management-system-8f6fc.firebaseapp.com",
  projectId: "hall-management-system-8f6fc",
  storageBucket: "hall-management-system-8f6fc.firebasestorage.app",
  messagingSenderId: "22380786881",
  appId: "1:22380786881:web:3ef804b29bbe9a0f615040",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StudentDashboard = () => {
  const { toast } = useToast();
  const location = useLocation();
  const name = "Jagadeeshwar Mukkara";

  const { email } = location.state || {};
  const studentId = email ? email.split("@")[0] : "";

  useEffect(() => {
    if (studentId) Cookies.set("studentId", studentId);
  }, [studentId]);

  const cookieId = Cookies.get("studentId");

  // States
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomRequest, setRoomRequest] = useState(null);

  // Dialog
  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // Loaders
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState(false);

  // SMART LOADER OVERLAY
  const LoaderOverlay = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-12 w-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  // FETCH COMPLAINTS
  const fetchComplaints = async () => {
    setLoadingGeneral(true);
    const path = collection(db, "complaints", cookieId, "items");
    const q = query(path, orderBy("date", "desc"), limit(3));
    const snap = await getDocs(q);
    setComplaints(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoadingGeneral(false);
  };

  // FETCH ROOM REQUEST
  const fetchRoomRequest = async () => {
    const ref = doc(db, "room_requests", cookieId);
    const snap = await getDoc(ref);
    setRoomRequest(snap.exists() ? snap.data() : null);
  };

  // FETCH ROOMS
  const fetchRooms = async () => {
    const ref = collection(db, "rooms");
    const snap = await getDocs(ref);
    setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // INITIAL LOAD
  useEffect(() => {
    if (cookieId) {
      Promise.all([fetchComplaints(), fetchRoomRequest(), fetchRooms()])
        .then(() => setLoadingFetch(false));
    }
  }, [cookieId]);

  // SUBMIT ROOM REQUEST
  const handleRoomRequest = async (e) => {
    e.preventDefault();

    // 🔥 VALIDATION — 10 digit mobile number only
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoadingSubmit(true);

    const selectedRoom = rooms.find((r) => r.id === roomNumber);

    await setDoc(doc(db, "room_requests", "r210053"), {
      name,
      studentId: "r210053",
      email: "r210053@rguktrkv.ac.in",
      phone,
      gender,
      roomType,
      roomNumber,
      block: selectedRoom.block,
      status: "waiting",
      allocatedDate: "",
      wardenRemarks: "",
      requestedAt: new Date().toISOString(),
      isPaid: false,
    });

    toast({
      title: "Room Request Submitted",
      description: "Your room request has been successfully submitted.",
    });

    setLoadingSubmit(false);
    setOpenRoomDialog(false);

    fetchRoomRequest();
  };

  const filteredRooms = rooms.filter((r) => r.type === roomType);

  return (
    <DashboardLayout role="student">

      {(loadingFetch || loadingGeneral || loadingSubmit) && <LoaderOverlay />}

      <div className="space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold">Welcome, Jagadeeshwar</h1>
          <p className="text-muted-foreground">Student ID: {cookieId}</p>
        </div>

        {/* ROOM REQUEST SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Room Allocation</CardTitle>
            <CardDescription>Your current room request or allocation details.</CardDescription>
          </CardHeader>

          <CardContent>
            {!roomRequest && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">You have not requested any room yet.</p>
                <Button onClick={() => setOpenRoomDialog(true)}>Request Room</Button>
              </div>
            )}

            {roomRequest?.status === "waiting" && (
              <div className="space-y-3">
                <Badge className="bg-yellow-200 text-yellow-700">Waiting for Approval</Badge>
                <p>Your request for <b>{roomRequest.roomNumber}</b> is pending.</p>
              </div>
            )}

            {roomRequest?.status === "allotted" && (
              <div className="space-y-3">
                <Badge className="bg-green-200 text-green-700">Room Allotted</Badge>
                <p><b>Room:</b> {roomRequest.roomNumber}</p>
                <p><b>Type:</b> {roomRequest.roomType}</p>
                <p><b>Block:</b> {roomRequest.block}</p>
                <p><b>Allocated On:</b> {roomRequest.allocatedDate}</p>
                <p><b>Remarks:</b> {roomRequest.wardenRemarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROOM REQUEST FORM */}
        <Dialog open={openRoomDialog} onOpenChange={setOpenRoomDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Room Request Form</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleRoomRequest} className="space-y-4">

              <div>
                <Label>Name</Label>
                <Input value={name} readOnly />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={"r210053@rguktrkv.ac.in"} readOnly />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setPhone(e.target.value);
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  required
                />
              </div>

              <div>
                <Label>Gender</Label>
                <Select onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Room Type</Label>
                <Select onValueChange={setRoomType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {roomType && (
                <div>
                  <Label>Room Number</Label>
                  <Select onValueChange={setRoomNumber}>
                    <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                    <SelectContent>
                      {filteredRooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.id} (Block {r.block}, {r.vacancies} left)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit Room Request
              </Button>

            </form>
          </DialogContent>
        </Dialog>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Your recent complaint history</CardDescription>
          </CardHeader>

          <CardContent>
            {complaints.length === 0 && (
              <p className="text-muted-foreground">No complaints found.</p>
            )}

            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>

                  {c.status === "Pending" && (
                    <Badge className="bg-red-100 text-red-700">Pending</Badge>
                  )}
                  {c.status === "In Progress" && (
                    <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
                  )}
                  {c.status === "Resolved" && (
                    <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View All Complaints
            </Button>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

