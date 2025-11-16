import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, TrendingUp, Wrench, UserCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HMC Admin Dashboard</h1>
          <p className="text-muted-foreground">Overall Hall Management Overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9,847</div>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +234 this semester
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Halls Managed</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">5,000 total rooms</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Occupancy</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <Progress value={94.2} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹6.8Cr</div>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hall-wise Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Hall-wise Occupancy & Performance</CardTitle>
            <CardDescription>Real-time status of all halls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Hall 1", occupancy: 98, rooms: 200, students: 392, complaints: 3 },
                { name: "Hall 2", occupancy: 96, rooms: 180, students: 345, complaints: 5 },
                { name: "Hall 3", occupancy: 95, rooms: 220, students: 418, complaints: 2 },
                { name: "Hall 4", occupancy: 93, rooms: 200, students: 372, complaints: 7 },
                { name: "Hall 5", occupancy: 92, rooms: 200, students: 368, complaints: 12 },
              ].map((hall) => (
                <div key={hall.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{hall.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {hall.students} students | {hall.rooms} rooms
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{hall.occupancy}%</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {hall.complaints} complaints
                      </div>
                    </div>
                  </div>
                  <Progress value={hall.occupancy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Room Rent</span>
                  <span className="font-medium">₹2.45 Cr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mess Charges</span>
                  <span className="font-medium">₹3.95 Cr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amenity Charges</span>
                  <span className="font-medium">₹40 L</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹6.80 Cr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
              <CardDescription>Total workforce across all halls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wardens</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hall Clerks</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attendants</span>
                  <span className="font-medium">120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gardeners</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-semibold">Total Staff</span>
                  <span className="font-semibold">195</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
