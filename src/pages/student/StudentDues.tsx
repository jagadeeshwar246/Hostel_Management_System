import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, FileDown, CreditCard, Home } from "lucide-react";

// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// PDF
import jsPDF from "jspdf";

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

// ----------------------------
// STATIC VALUES
// ----------------------------
const studentId = "r210053";
const studentName = "Jagadeeshwar Mukkara";

// ----------------------------
// PDF GENERATOR
// ----------------------------
const generateRentPDF = (details: any) => {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("RGUKT RK Valley - Room Rent Receipt", 20, 20);

  pdf.setFontSize(12);
  pdf.text(`Student Name: ${studentName}`, 20, 40);
  pdf.text(`Student ID: ${studentId}`, 20, 50);
  pdf.text(`Block: ${details.block}`, 20, 60);
  pdf.text(`Room Number: ${details.roomNumber}`, 20, 70);
  pdf.text(`Room Type: ${details.roomType}`, 20, 80);
  pdf.text(`Rent Amount: ₹${details.rent}`, 20, 90);
  pdf.text(`Payment Date: ${details.paymentDate}`, 20, 100);
  pdf.text(`Payment ID: ${details.paymentId}`, 20, 110);

  pdf.save(`Rent_Receipt_${studentId}.pdf`);
};

const generateMessPDF = () => {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("RGUKT RK Valley - Mess Fee Receipt", 20, 20);

  pdf.setFontSize(12);
  pdf.text(`Student Name: ${studentName}`, 20, 40);
  pdf.text(`Student ID: ${studentId}`, 20, 50);
  pdf.text(`Mess Bill: ₹2100`, 20, 60);
  pdf.text(`Payment Date: ${new Date().toLocaleDateString()}`, 20, 70);

  pdf.save(`Mess_Receipt_${studentId}.pdf`);
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------
const DuesPage = () => {
  const [roomRequest, setRoomRequest] = useState<any>(null);
  const [roomRent, setRoomRent] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  const [messPaid, setMessPaid] = useState(false);

  // ----------------------------
  // FETCH ROOM REQUEST + RENT
  // ----------------------------
  const loadRoomData = async () => {
    setLoading(true);

    const reqRef = doc(db, "room_requests", studentId);
    const snap = await getDoc(reqRef);

    if (!snap.exists()) {
      setRoomRequest(null);
      setLoading(false);
      return;
    }

    const req = snap.data();
    setRoomRequest(req);

    // fetch rent from rooms collection
    const roomRef = doc(db, "rooms", req.roomNumber);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      setRoomRent(parseInt(roomSnap.data().rent));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRoomData();
  }, []);

  // ----------------------------
  // PAY RENT
  // ----------------------------
  const handleRentPay = async () => {
    if (!roomRequest) return;
    setPayLoading(true);

    const reqRef = doc(db, "room_requests", studentId);

    const paymentDate = new Date().toLocaleDateString();
    const paymentId = "PAY" + Math.floor(Math.random() * 999999);

    await updateDoc(reqRef, {
      isPaid: true,
      paymentDate,
      paymentId,
    });

    generateRentPDF({
      ...roomRequest,
      rent: roomRent,
      paymentDate,
      paymentId,
    });

    await loadRoomData();
    setPayLoading(false);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold">My Dues</h1>

        {/* ========== ROOM RENT CARD ========== */}
       <Card>
  <CardHeader>
    <CardTitle>Room Rent</CardTitle>
    <CardDescription>Based on your room allocation</CardDescription>
  </CardHeader>

  <CardContent>
    {loading ? (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    ) : !roomRequest ? (
      
      // No document for this student
      <p className="text-muted-foreground">You do not have any room allocated.</p>

    ) : roomRequest.status !== "allotted" ? (
      
      // Document exists but not allotted yet
      <p className="text-muted-foreground">Room not allotted yet — no rent due.</p>

    ) : (
      
      // Allotted → show rent details
      <div>
        <p><b>Room:</b> {roomRequest.roomNumber.toUpperCase()} ({roomRequest.block})</p>
        <p><b>Type:</b> {roomRequest.roomType}</p>
        <p><b>Rent:</b> ₹{roomRent}</p>

        <Separator className="my-4" />

        {roomRequest.isPaid ? (
          <div className="flex items-center justify-between">
            <Badge className="bg-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" /> Paid
            </Badge>

            <Button
              variant="outline"
              onClick={() =>
                generateRentPDF({
                  ...roomRequest,
                  rent: roomRent,
                  paymentDate: roomRequest.paymentDate,
                  paymentId: roomRequest.paymentId,
                })
              }
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        ) : (
          <Button onClick={handleRentPay} disabled={payLoading}>
            {payLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            Pay Rent
          </Button>
        )}
      </div>

    )}
  </CardContent>
</Card>


        {/* ========== MESS DUE CARD ========== */}
        <Card>
          <CardHeader>
            <CardTitle>Mess Dues</CardTitle>
            <CardDescription>Mess bill for this month</CardDescription>
          </CardHeader>

          <CardContent>
            <p><b>Mess Charges:</b> ₹2100</p>
            <Separator className="my-4" />

            {messPaid ? (
              <div className="flex items-center justify-between">
                <Badge className="bg-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" /> Paid
                </Badge>

                <Button variant="outline" onClick={generateMessPDF}>
                  <FileDown className="h-4 w-4 mr-2" /> Download Receipt
                </Button>
              </div>
            ) : (
              <Button onClick={() => setMessPaid(true)} className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Pay Mess Fee
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default DuesPage;

