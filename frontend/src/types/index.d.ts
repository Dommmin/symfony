export type User = {
    id: number;
    email: string;
    roles: string[];
};

export type Technician = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
};

export type Issue = {
    id: number;
    title: string;
    description: string;
    status: 'new' | 'in_progress' | 'done' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        email: string;
    };
    technician?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        specialization: string;
    };
};

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
};

export type PaginationParams = {
    page?: number;
    perPage?: number;
};

export type CreateIssueDto = {
    title: string;
    description: string;
    priority: Issue['priority'];
};

export type UpdateIssueDto = Partial<CreateIssueDto> & {
    status?: Issue['status'];
    technicianId?: number | null;
};

export type LoginDto = {
    email: string;
    password: string;
};

export type RegisterDto = {
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: User;
};

export type CreateTechnicianDto = {
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
};

export type UpdateTechnicianDto = Partial<CreateTechnicianDto>;
