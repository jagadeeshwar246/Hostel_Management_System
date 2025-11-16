import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const WardenComplaints = () => {

  const studentId = "r210053"; // Only this student
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false); // ⬅ NEW LOADING STATE

  // -------------------------------------------------------
  // FETCH NON-RESOLVED COMPLAINTS
  // -------------------------------------------------------
  const fetchComplaints = async () => {
    const snap = await getDocs(collection(db, "complaints", studentId, "items"));

    const list = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((c) => c.status !== "Resolved"); // Hide resolved complaints

    setComplaints(list);
  };

  // -------------------------------------------------------
  // MARK AS COMPLETED (With Loader)
  // -------------------------------------------------------
  const markCompleted = async (complaintId) => {
    setLoading(true); // 🔥 SHOW LOADER

    await updateDoc(
      doc(db, "complaints", studentId, "items", complaintId),
      {
        status: "Resolved",
        atr: "Completed by Warden"
      }
    );

    await fetchComplaints();

    setLoading(false); // 🔥 HIDE LOADER
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <DashboardLayout role="warden">

      {/* FULL SCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Pending Complaints</CardTitle>
            <CardDescription>Manage unresolved complaints</CardDescription>
          </CardHeader>

          <CardContent>
            {complaints.length === 0 ? (
              <p className="text-muted-foreground">No pending complaints.</p>
            ) : (
              <div className="grid gap-4">
                {complaints.map((c) => (
                  <Card key={c.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{c.title}</CardTitle>
                          <CardDescription>
                            Complaint ID: {c.id} <br />
                            Submitted on {new Date(c.date).toLocaleDateString()}
                          </CardDescription>
                        </div>

                        <Badge className="bg-red-100 text-red-700">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">{c.description}</p>

                      {c.atr && (
                        <div className="bg-muted/50 p-3 rounded-md mt-3">
                          <p className="font-medium mb-1">Action Taken Report:</p>
                          <p className="text-sm">{c.atr}</p>
                        </div>
                      )}

                      <Button
                        className="mt-3"
                        onClick={() => markCompleted(c.id)}
                        disabled={loading}
                      >
                        Mark Completed
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
};

export default WardenComplaints;

