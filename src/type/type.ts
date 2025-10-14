export type ApiResponse<T> = {
    code: number;
    message: string;
    token?: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}
