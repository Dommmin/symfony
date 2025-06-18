import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z
    .object({
        email: z.string().email('Nieprawidłowy adres email'),
        password: z.string().min(6, 'Hasło musi mieć minimum 6 znaków'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Hasła nie są identyczne',
        path: ['confirmPassword'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const { register: registerUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        await registerUser(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="twoj@email.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejestracja...
                    </>
                ) : (
                    'Zarejestruj się'
                )}
            </Button>
        </form>
    );
};
