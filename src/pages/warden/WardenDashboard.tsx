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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";
import emailjs from "emailjs-com";

// FIREBASE CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const WardenDashboard = () => {

  const [wardenName, setWardenName] = useState(Cookies.get("wardenName"));
  const [wardenEmail, setWardenEmail] = useState(Cookies.get("wardenEmail"));

  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("BH1");
  const [roomRequests, setRoomRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState("");

  // NEW STATES
  const [allResidents, setAllResidents] = useState([]);
  const [paidResidents, setPaidResidents] = useState([]);
  const [unpaidResidents, setUnpaidResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  useEffect(() => {
    if (!wardenName) Cookies.set("wardenName", "Warden RGUKT RKV");
    if (!wardenEmail) Cookies.set("wardenEmail", "wardenrguktrkv@gmail.com");
    setWardenName(Cookies.get("wardenName"));
    setWardenEmail(Cookies.get("wardenEmail"));
  }, []);

  // 🔥 FETCH BLOCKS
  const fetchBlocks = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "rooms"));
    const blockSet = new Set();
    snap.docs.forEach((d) => blockSet.add(d.data().block));

    const blockArray = [...blockSet];
    setBlocks(blockArray);

    if (blockArray.includes("BH1")) {
      setSelectedBlock("BH1");
    } else {
      setSelectedBlock(blockArray[0] || "");
    }

    setLoading(false);
  };

  // 🔥 FETCH PENDING REQUESTS
  const fetchRoomRequests = async () => {
    if (!selectedBlock) return;
    setLoading(true);

    const snap = await getDocs(collection(db, "room_requests"));
    const list = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((req) => req.block === selectedBlock && req.status === "waiting");

    setRoomRequests(list);
    setLoading(false);
  };

  // 🔥 FETCH ALL RESIDENTS
  const fetchResidents = async () => {
    setLoadingResidents(true);

    const snap = await getDocs(collection(db, "room_requests"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const allotted = list.filter(r => r.status === "allotted");

    setAllResidents(allotted);
    setPaidResidents(allotted.filter(r => r.isPaid === true));
    setUnpaidResidents(allotted.filter(r => r.isPaid !== true));

    setLoadingResidents(false);
  };

  const sendEmailNotification = async (req, allocatedDate) => {
    const templateParams = {
      email: req.email,
      studentName: req.name,
      roomNumber: req.roomNumber,
      roomType: req.roomType,
      block: req.block,
      allocatedDate: allocatedDate,
    };

    return emailjs.send(
      "service_speakup",
      "template_mwhjpex",
      templateParams,
      "Bik0tSPgVFlJ14wiH"
    );
  };

  // 🔥 ACCEPT REQUEST
  const acceptRequest = async (studentId, roomNumber) => {
    setAccepting(studentId);

    const reqRef = doc(db, "room_requests", studentId);
    const roomRef = doc(db, "rooms", roomNumber);

    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data();

    const newVacancy = Math.max(parseInt(roomData.vacancies) - 1, 0);

    const request = roomRequests.find((r) => r.studentId === studentId);
    const allocatedDate = new Date().toLocaleString();

    await updateDoc(roomRef, { vacancies: String(newVacancy) });
    await updateDoc(reqRef, {
      status: "allotted",
      allocatedDate: new Date().toISOString(),
      wardenRemarks: "Room allocated by warden",
    });

    await sendEmailNotification(request, allocatedDate);

    setAccepting("");
    fetchRoomRequests();
    fetchResidents(); // Refresh resident list
  };

  useEffect(() => {
    fetchBlocks();
    fetchResidents();
  }, []);

  useEffect(() => {
    fetchRoomRequests();
  }, [selectedBlock]);

  return (
    <DashboardLayout role="warden">
      <div className="space-y-6">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-3xl font-bold">
            Hall – {selectedBlock || "Select Block"} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Warden: {wardenName} ({wardenEmail})
          </p>
        </div>

        {/* BLOCK SELECTOR */}
        <Card className="p-4">
          <CardTitle>Select Block</CardTitle>

          <Select onValueChange={setSelectedBlock} value={selectedBlock}>
            <SelectTrigger className="w-[250px] mt-3">
              <SelectValue placeholder="Choose Block" />
            </SelectTrigger>

            <SelectContent>
              {blocks.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* PENDING REQUESTS */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Room Requests ({selectedBlock})</CardTitle>
            <CardDescription>Approve new room requests</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : roomRequests.length === 0 ? (
              <p className="text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {roomRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {req.name} — {req.roomType} ({req.roomNumber})
                      </p>
                      <p className="text-sm text-muted-foreground">{req.email}</p>
                    </div>

                    <Button disabled={accepting === req.studentId}
                      onClick={() => acceptRequest(req.studentId, req.roomNumber)}
                    >
                      {accepting === req.studentId ? "Processing..." : "Accept"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* UNPAID RESIDENTS */}
<Card className="mt-6 border-0 shadow-lg bg-gradient-to-br from-red-50 via-red-100 to-red-50 
                hover:shadow-red-300/40 transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-red-700 font-bold text-xl flex items-center gap-2">
       Unpaid Residents
    </CardTitle>
    <CardDescription className="text-red-600">
      Students who have NOT paid room rent
    </CardDescription>
  </CardHeader>

  <CardContent>
    {loadingResidents ? (
      <p className="text-center text-red-600">Loading residents...</p>
    ) : unpaidResidents.length === 0 ? (
      <p>No unpaid residents </p>
    ) : (
      <div className="space-y-4">
        {unpaidResidents.map((r) => (
          <div
            key={r.studentId}
            className="flex justify-between items-center bg-white/70 p-4 rounded-xl 
                      shadow hover:scale-[1.02] transition-transform"
          >
            <div>
              <p className="font-semibold text-lg">
                {r.name} ({r.studentId})
              </p>
              <p className="text-sm ">
                Room {r.roomNumber} • {r.block} • {r.roomType}
              </p>
            </div>

            <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
              Unpaid
            </Badge>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


        {/* PAID RESIDENTS */}
<Card className="mt-6 mb-10 border-0 shadow-lg bg-gradient-to-br from-green-50 via-green-100 to-green-50 
                hover:shadow-green-300/40 transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-green-700 font-bold text-xl flex items-center gap-2">
      Paid Residents
    </CardTitle>
    <CardDescription className="text-green-600">
      Students who have paid room rent
    </CardDescription>
  </CardHeader>

  <CardContent>
    {loadingResidents ? (
      <p className="text-center text-green-600">Loading residents...</p>
    ) : paidResidents.length === 0 ? (
      <p>No paid residents.</p>
    ) : (
      <div className="space-y-4">
        {paidResidents.map((r) => (
          <div
            key={r.studentId}
            className="flex justify-between items-center bg-white/70 p-4 rounded-xl 
                      shadow hover:scale-[1.02] transition-transform"
          >
            <div>
              <p className="font-semibold  text-lg">
                {r.name} ({r.studentId})
              </p>
              <p className="text-sm">
                Room {r.roomNumber} • {r.block} • {r.roomType}
              </p>
            </div>

            <Badge className="bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
              Paid
            </Badge>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


      </div>
    </DashboardLayout>
  );
};

export default WardenDashboard;

