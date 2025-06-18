import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Bell, FileText, Home, LogOut, Menu, Settings, Shield, Users } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Zgłoszenia', href: '/admin/issues', icon: FileText },
    { name: 'Technicy', href: '/admin/technicians', icon: Users },
    { name: 'Ustawienia', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                        <div className="flex h-full flex-col">
                            <div className="p-6">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-6 w-6 text-indigo-600" />
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                                        FixMate Admin
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <nav className="flex-1 space-y-2 p-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                            location.pathname === item.href ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                            <Separator />
                            <div className="space-y-2 p-4">
                                <Link to="/">
                                    <Button variant="outline" className="w-full justify-start space-x-3">
                                        <Home className="h-5 w-5" />
                                        <span>Panel użytkownika</span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Wyloguj</span>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
                <div className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
                    <div className="flex h-full flex-col">
                        <div className="p-6">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-6 w-6 text-indigo-600" />
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                                    FixMate Admin
                                </span>
                            </div>
                        </div>
                        <Separator />
                        <nav className="flex-1 space-y-2 p-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                        location.pathname === item.href ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                        <Separator />
                        <div className="space-y-2 p-4">
                            <Link to="/">
                                <Button variant="outline" className="w-full justify-start space-x-3">
                                    <Home className="h-5 w-5" />
                                    <span>Panel użytkownika</span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => logout()}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Wyloguj</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                                Panel Administratora
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="py-8">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
