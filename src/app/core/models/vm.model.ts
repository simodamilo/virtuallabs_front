export interface VM {
    id?: number;
    vcpu: number;
    disk: number;
    ram: number;
    active?: boolean;
}