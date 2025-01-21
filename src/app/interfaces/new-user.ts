export interface NewUser {
    username: string;
    email: string;
    password: string;
    isTermsAccepted: boolean;
    uploaded_avatar: File | string;
    selected_avatar: string;
}
