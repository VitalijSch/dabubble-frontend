import { User } from "./user";

export interface Channel {
    id: number;
    name: string;
    description?: string;
    creator: number;
    members: User[];
    membersPk: number[];
}
