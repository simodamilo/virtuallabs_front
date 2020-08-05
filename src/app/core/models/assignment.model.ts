export interface Assignment {
    id?: number;
    name: string;
    releaseDate: Date;
    deadline: Date;
    content?: File;
}