import { Student } from './student.model';

export interface Solution {
    id?: number;
    content?: any;
    state: state;
    grade?: string;
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