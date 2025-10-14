export type ApiResponse<T> = {
    code: number;
    message: string;
    token?: string;
    data?: T;
}
