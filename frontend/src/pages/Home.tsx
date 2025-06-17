import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Clock, AlertCircle } from "lucide-react";

export default function Home() {
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState({
        activeIssues: 12,
        totalUsers: 156,
        responseTime: "2.5h",
        criticalIssues: 3
    });

    useEffect(() => {
        axios
            .get('/')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setMessage('Error fetching data');
            });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Witaj w panelu zarządzania zgłoszeniami
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aktywne zgłoszenia
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeIssues}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 z ostatnich 24h
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Użytkownicy
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% z ostatniego miesiąca
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
                        <div className="text-2xl font-bold">{stats.responseTime}</div>
                        <p className="text-xs text-muted-foreground">
                            -15% z ostatniego tygodnia
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
                    <CardTitle>Ostatnie aktualizacje</CardTitle>
                    <CardDescription>
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary">Nowe</Badge>
                            <span className="text-sm text-muted-foreground">
                                System został zaktualizowany do najnowszej wersji
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline">Ulepszenia</Badge>
                            <span className="text-sm text-muted-foreground">
                                Dodano nowe funkcje zarządzania zgłoszeniami
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
