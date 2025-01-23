import { User } from "./user";

export interface Channel {
    name: string;
    description?: string;
    creator: number;
    members: User[];
    membersPk: number[];
}
