import { Student } from '.';

export interface VM {
    id?: number;
    name: string;
    vcpu: number;
    disk: number;
    ram: number;
    active?: boolean;
    owners?: Student[];
}