import { Token } from './teamToken.model';

export interface Student {
    serial: string;
    name: string;
    surname: string;
    email: string;
    image?: any;
    teamToken?: Token;
}