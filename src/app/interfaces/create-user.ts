export interface CreateUser {
    name: string;
    email: string;
    password: string;
    isTermsAccepted: boolean;
    selectedAvatar: string | ArrayBuffer;
}
