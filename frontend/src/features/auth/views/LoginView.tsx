import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Link } from 'react-router-dom';

export const LoginView = () => {
    return (
        <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                        FixMate
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">System zarządzania zgłoszeniami</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">Zaloguj się</CardTitle>
                        <CardDescription className="text-center">Wprowadź swoje dane logowania</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">lub</span>
                            </div>
                        </div>
                        <div className="text-center text-sm">
                            Nie masz jeszcze konta?{' '}
                            <Link to="/register">
                                <Button variant="link" className="px-0">
                                    Zarejestruj się
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
