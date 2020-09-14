import { Team } from './team.model';
import { Token } from './token.model';

export interface Student {
    serial: string;
    name: string;
    surname: string;
    email: string;
    image?: any;
    teamToken?: Token;
    team?: Team;
}