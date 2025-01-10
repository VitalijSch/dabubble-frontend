export interface User {
        id: number;
        username: string;
        email: string;
        selected_avatar: string | null;
        uploaded_avatar: string | null;
        is_online: boolean;
}
