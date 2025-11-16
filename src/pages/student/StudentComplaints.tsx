import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { db } from "@/firebase";
import { collection, getDocs, doc, setDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const StudentComplaints = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [complaintType, setComplaintType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [complaints, setComplaints] = useState([]);

  const studentId = "r210053";

  // STORE COMPLAINT
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const itemsRef = collection(db, "complaints", studentId, "items");

    // Get all complaints (to find last ID)
    const snapshot = await getDocs(itemsRef);

    let lastNumber = -1;

    snapshot.docs.forEach((docSnap) => {
      const id = docSnap.id; // ex: r2100533
      const numPart = parseInt(id.replace(studentId, "")); // extract 3
      if (!isNaN(numPart)) lastNumber = Math.max(lastNumber, numPart);
    });

    const newComplaintId = `${studentId}${lastNumber + 1}`;

    // Upload complaint
    await setDoc(doc(db, "complaints", studentId, "items", newComplaintId), {
      id: newComplaintId,
      type: complaintType,
      title,
      description,
      status: "Pending",
      date: new Date().toISOString(),
      atr: "",
    });

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been registered successfully.",
      className: "bg-green-600 text-white",
    });

    setOpen(false);
    setComplaintType("");
    setTitle("");
    setDescription("");

    fetchComplaints();

  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to submit complaint",
      variant: "destructive",
    });
  }
};


  // FETCH COMPLAINTS (LATEST FIRST)
  const fetchComplaints = async () => {
    const q = query(
      collection(db, "complaints", studentId, "items"),
      orderBy("date", "desc") // 🔥 newest first
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // STATUS BADGE UI
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" /> Resolved
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Complaints</h1>
            <p className="text-muted-foreground">Track and manage your complaints</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Complaint
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Raise a Complaint</DialogTitle>
                <DialogDescription>
                  Submit your complaint and we'll address it as soon as possible
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* TYPE */}
                <div className="space-y-2">
                  <Label>Complaint Type</Label>
                  <Select onValueChange={setComplaintType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="Mess">Mess Related</SelectItem>
                      <SelectItem value="Staff">Staff Behavior</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TITLE */}
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Brief description"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Explain the issue"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Complaint</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* COMPLAINT LIST */}
        <div className="grid gap-4">
          {complaints.map((complaint: any) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{complaint.title}</CardTitle>
                      <Badge variant="secondary">{complaint.type}</Badge>
                    </div>
                    <CardDescription>
                      Complaint ID: {complaint.id} | Submitted on{" "}
                      {new Date(complaint.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{complaint.description}</p>

                  {complaint.atr && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Action Taken Report (ATR):</p>
                      <p className="text-sm text-muted-foreground">{complaint.atr}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentComplaints;

