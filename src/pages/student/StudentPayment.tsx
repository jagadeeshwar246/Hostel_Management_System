import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PaymentHistory = () => {
  const paymentData = [
    {
      id: "P001",
      date: "2024-11-10",
      amount: 3500,
      method: "UPI",
      status: "Successful",
      txnId: "TXN9988123",
    },
    {
      id: "P002",
      date: "2024-10-05",
      amount: 3800,
      method: "Credit Card",
      status: "Successful",
      txnId: "TXN8823411",
    },
    {
      id: "P003",
      date: "2024-09-07",
      amount: 3400,
      method: "Net Banking",
      status: "Failed",
      txnId: "TXN7782234",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Successful":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Successful</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-600 border-red-300">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="text-muted-foreground">
              View all your previous payments and receipts
            </p>
          </div>
          <Button className="bg-[#001f3f] text-white hover:bg-[#001a35]">
            Download Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Past Payments</CardTitle>
            <CardDescription>Your previous transactions</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {paymentData.map((payment) => (
              <Card key={payment.id} className="bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>₹ {payment.amount}</CardTitle>
                      <CardDescription>
                        Payment ID: {payment.id} | {new Date(payment.date).toLocaleDateString()}
                      </CardDescription>
                    </div>

                    {getStatusBadge(payment.status)}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Payment Method: {payment.method}</p>
                    <p>Transaction ID: {payment.txnId}</p>
                    <p className="font-semibold text-black">
                      Status: {payment.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default PaymentHistory;
