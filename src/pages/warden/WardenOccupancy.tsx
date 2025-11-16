import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
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

const WardenOccupancy = () => {
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);

  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [block, setBlock] = useState("BH1");
  const [vacancies, setVacancies] = useState("");
  const [rent, setRent] = useState(""); // NEW

  const fetchRooms = async () => {
    const snap = await getDocs(collection(db, "rooms"));
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setRooms(list);
  };

  const fetchRequests = async () => {
    const snap = await getDocs(collection(db, "room_requests"));
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setRequests(list);
  };

  useEffect(() => {
    fetchRooms();
    fetchRequests();
  }, []);

  const getOccupants = (roomId) => {
    return requests.filter((req) => req.roomNumber === roomId);
  };

  // ADD NEW ROOM
  const handleAddRoom = async (e) => {
    e.preventDefault();

    await setDoc(doc(db, "rooms", roomId.toLowerCase()), {
      type: roomType,
      block: block,
      vacancies: vacancies,
      rent: rent, // NEW
    });

    setOpenAddRoom(false);
    setRoomId("");
    setRoomType("");
    setVacancies("");
    setRent(""); // NEW

    fetchRooms();
  };

  return (
    <DashboardLayout role="warden">
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Room Occupancy</h1>
          <p className="text-muted-foreground">View room allocation & details</p>
        </div>

        {/* ROOMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                setSelectedRoom(room);
                setOpen(true);
              }}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{room.id.toUpperCase()}</span>
                  <Badge>{room.type}</Badge>
                </CardTitle>

                <CardDescription>
                  Block: {room.block} — Vacancies: {room.vacancies}
                  <br />
                  Rent: ₹{room.rent || "N/A"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* ADD ROOM BUTTON */}
        <div className="text-center">
          <Button onClick={() => setOpenAddRoom(true)}>+ Add Room</Button>
        </div>

        {/* ROOM DETAILS */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Room Details — {selectedRoom?.id?.toUpperCase()}</DialogTitle>
            </DialogHeader>

            {selectedRoom && (
              <div className="space-y-4">
                <p><b>Block:</b> {selectedRoom.block}</p>
                <p><b>Type:</b> {selectedRoom.type}</p>
                <p><b>Vacancies:</b> {selectedRoom.vacancies}</p>
                <p><b>Rent:</b> ₹{selectedRoom.rent || "N/A"}</p>

                <Separator />

                <h3 className="text-lg font-semibold">Occupants</h3>

                {getOccupants(selectedRoom.id).length === 0 ? (
                  <p className="text-muted-foreground">No students in this room.</p>
                ) : (
                  getOccupants(selectedRoom.id).map((occ) => (
                    <div key={occ.studentId} className="border p-3 rounded-md bg-muted/30">
                      <p className="font-medium">
                        {occ.name} ({occ.studentId})
                      </p>
                      <p className="text-sm text-muted-foreground">{occ.email}</p>
                      <p className="text-sm text-muted-foreground">Phone: {occ.phone}</p>
                      <p className="text-sm text-muted-foreground">Gender: {occ.gender}</p>

                      <Badge className={`mt-2 ${
                          occ.status === "waiting"
                            ? "bg-yellow-200 text-yellow-700"
                            : "bg-green-200 text-green-700"
                        }`}
                      >
                        {occ.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ADD ROOM DIALOG */}
        <Dialog open={openAddRoom} onOpenChange={setOpenAddRoom}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddRoom} className="space-y-4">

              <div>
                <Label>Room Number</Label>
                <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} required />
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

              <div>
                <Label>Block</Label>
                <Select onValueChange={setBlock} defaultValue="BH1">
                  <SelectTrigger><SelectValue placeholder="Select Block" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BH1">BH1</SelectItem>
                    <SelectItem value="BH2">BH2</SelectItem>
                    <SelectItem value="GH1">GH1</SelectItem>
                    <SelectItem value="GH2">GH2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vacancies</Label>
                <Input type="number" value={vacancies} onChange={(e) => setVacancies(e.target.value)} required />
              </div>

              <div>
                <Label>Rent (per month)</Label>
                <Input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  placeholder="Example: 2000"
                  required
                />
              </div>

              <Button type="submit" className="w-full">Add Room</Button>

            </form>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default WardenOccupancy;

