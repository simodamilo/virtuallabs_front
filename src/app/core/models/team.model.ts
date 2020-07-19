import { Student } from '.';

export interface Team {
    id?: number;
    name: string;
    duration?: number;
    status?: number;
    vcpu?: number;
    disk?: number;
    ram?: number;
    activeInstance?: number;
    maxInstance?: number;
    members?: Student[];
}