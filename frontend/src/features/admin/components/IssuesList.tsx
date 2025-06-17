import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { issuesApi } from "@/services/api";
import type { Issue, UpdateIssueDto } from "@/types";
import { toast } from "react-hot-toast";

const statusColors = {
  new: "bg-blue-500",
  in_progress: "bg-yellow-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export const IssuesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Issue["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Issue["priority"] | "all">("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: issuesApi.getIssues,
  });

  const updateIssueMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIssueDto }) =>
      issuesApi.updateIssue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Zgłoszenie zaktualizowane");
    },
    onError: () => {
      toast.error("Wystąpił błąd podczas aktualizacji zgłoszenia");
    },
  });

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (issueId: number, newStatus: Issue["status"]) => {
    updateIssueMutation.mutate({ id: issueId, data: { status: newStatus } });
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Zgłoszenia</h2>
        <Button onClick={() => navigate("/admin/issues/new")}>
          Nowe zgłoszenie
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj zgłoszeń..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Wszystkie
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("new")}>
              Nowe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
              W trakcie
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
              Rozwiązane
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("closed")}>
              Zamknięte
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Priorytet
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
              Wszystkie
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
              Niski
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
              Średni
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
              Wysoki
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("critical")}>
              Krytyczny
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tytuł</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priorytet</TableHead>
              <TableHead>Data utworzenia</TableHead>
              <TableHead>Przypisany do</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">#{issue.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {issue.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusColors[issue.status]} text-white`}
                  >
                    {issue.status === "new" && "Nowe"}
                    {issue.status === "in_progress" && "W trakcie"}
                    {issue.status === "resolved" && "Rozwiązane"}
                    {issue.status === "closed" && "Zamknięte"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${priorityColors[issue.priority]} text-white`}
                  >
                    {issue.priority === "low" && "Niski"}
                    {issue.priority === "medium" && "Średni"}
                    {issue.priority === "high" && "Wysoki"}
                    {issue.priority === "critical" && "Krytyczny"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                <TableCell>{issue.technician ? `${issue.technician.firstName} ${issue.technician.lastName}` : "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                      <DropdownMenuItem>Zobacz szczegóły</DropdownMenuItem>
                      <DropdownMenuItem>Edytuj</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(issue.id, "in_progress")}
                        disabled={issue.status === "in_progress"}
                      >
                        Oznacz jako w trakcie
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(issue.id, "resolved")}
                        disabled={issue.status === "resolved"}
                      >
                        Oznacz jako rozwiązane
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(issue.id, "closed")}
                        disabled={issue.status === "closed"}
                      >
                        Zamknij zgłoszenie
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 