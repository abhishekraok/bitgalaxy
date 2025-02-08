export interface GameConfig {
    id: number;
    title: string;
    configuration: Record<string, any>;
    state: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    email: string;
    username: string;
}