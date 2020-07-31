import { Student } from './student.model';
import { State } from './state';

export interface Solution {
    id?: number;
    content?: any;
    state: State;
    grade?: string;
    deliveryTs: Date;
    modifiable: boolean;
    student?: Student;
}

