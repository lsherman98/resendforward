import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRulesStats } from "@/lib/api/queries";

export function RulesStats() {
  const { data: stats } = useGetRulesStats();


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
      <Card>
        <CardHeader>
          <CardDescription>Total Rules</CardDescription>
          <CardTitle className="text-3xl">{stats?.total_rules}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Active Rules</CardDescription>
          <CardTitle className="text-3xl text-emerald-500">{stats?.active_rules}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
