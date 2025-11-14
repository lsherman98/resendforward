import { AlertTriangle, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useGetForwardingStats } from "@/lib/api/queries";

export function ForwardingStats() {
  const { data: stats } = useGetForwardingStats();

  return (
    <>
      <Card className="py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total}</div>
        </CardContent>
      </Card>
      <Card className="py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.delivered}</div>
        </CardContent>
      </Card>
      <Card className="py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.failed}</div>
        </CardContent>
      </Card>
    </>
  );
}
