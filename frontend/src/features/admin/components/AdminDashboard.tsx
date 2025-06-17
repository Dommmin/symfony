import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export const AdminDashboard = () => {
  const stats = {
    totalIssues: 156,
    activeIssues: 42,
    resolvedIssues: 114,
    averageResponseTime: "2.5h",
    technicians: 8,
    criticalIssues: 3,
  };

  const recentActivity = [
    {
      id: 1,
      type: "issue_created",
      title: "Nowe zgłoszenie",
      description: "Problem z drukarką w biurze",
      time: "5 minut temu",
      status: "new",
    },
    {
      id: 2,
      type: "issue_resolved",
      title: "Zgłoszenie rozwiązane",
      description: "Awaria klimatyzacji",
      time: "1 godzina temu",
      status: "resolved",
    },
    {
      id: 3,
      type: "technician_assigned",
      title: "Przypisano technika",
      description: "Problem z siecią",
      time: "2 godziny temu",
      status: "in_progress",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Administratora</h1>
        <p className="text-muted-foreground mt-2">
          Zarządzaj zgłoszeniami, technikami i ustawieniami systemu
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkie zgłoszenia
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              +12% z ostatniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktywne zgłoszenia
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.activeIssues}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeIssues} wymaga uwagi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rozwiązane zgłoszenia
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolvedIssues}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.resolvedIssues / stats.totalIssues) * 100)}% skuteczności
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Średni czas odpowiedzi
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              -15% z ostatniego tygodnia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Technicy
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.technicians}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.activeIssues / stats.technicians)} zgłoszeń na technika
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Krytyczne zgłoszenia
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Wymagają natychmiastowej uwagi
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
          <CardDescription>
            Najnowsze zdarzenia w systemie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <Badge
                  variant={
                    activity.status === "new"
                      ? "default"
                      : activity.status === "resolved"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {activity.title}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 