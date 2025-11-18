// Define o que você envia para a API (Request/Payload)
export interface LoginRequest {
    email: string;
    password: string; // ou password, dependendo da API
}

// Define o que a API te devolve (Response)
export interface LoginResponse {
    token: string;
    expires_in: number;
    user: {
        id: number;
        name: string;
        avatar_url: string;
    };
}