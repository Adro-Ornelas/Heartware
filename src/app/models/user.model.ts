export interface User {
    id_user: number;
    id_address: number | null;
    name: string;
    last_name: string;
    email: string;
    type: 'admin' | 'user';
}

export interface UpdateUserPayload {
    name: string;
    last_name: string;
    email: string;
    password?: string;
    type: 'admin' | 'user';
}
