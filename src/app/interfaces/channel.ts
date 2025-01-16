import { Member } from "./member";

export interface Channel {
    name: string;
    description?: string;
    creator: string;
    members?: Member[];
}
