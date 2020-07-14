import { Student } from './student.model';

export interface Solution {
    id?: number;
    name:string;
    content?: any;
    state: state;
    deliveryTs: Date;
    modifiable: boolean;
    student?: Student;
}

enum state{
    NULL,
    READ,
    DELIVERED,
    REVIEWED
}