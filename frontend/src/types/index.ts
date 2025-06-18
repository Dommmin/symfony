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
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
    updatedAt: string;
    user: User;
    technician?: Technician;
};

export type CreateIssueDto = {
    title: string;
    description: string;
    priority: Issue['priority'];
};

export type UpdateIssueDto = Partial<CreateIssueDto> & {
    status?: Issue['status'];
    technicianId?: number;
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
