export interface User {
    id_user: number;
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
