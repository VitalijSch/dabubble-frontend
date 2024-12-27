export interface CreateUser {
    username: string;
    email: string;
    password: string;
    isTermsAccepted: boolean;
    uploaded_avatar?: File;
    selected_avatar?: string;
}
