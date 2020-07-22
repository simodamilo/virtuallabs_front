import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Student } from '../../core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent{
  _enrolledStudents: Student[];
  toRemove: Student[] = [];
  selectedAddStudent: Student;
  filteredOptions: Student[];
  private _allStudents: Student[];

  constructor() {
  }

  @Input('allStudents') set allStudents(student: Student[]) {
    this._allStudents = student;
    this.filteredOptions = student;
  }
  @Input('enrolledStudents') set enrolledStudents(students: Student[]) {
    if (students != null) {
      this._enrolledStudents = [...students];
    }
  }
  @Output('enrollStudent') addEmitter = new EventEmitter<Student[]>();
  @Output('removeStudent') removeEmitter = new EventEmitter<Student[]>();

  changeSelection(event: Student[]) {
    console.log(event)
    this.toRemove = [...event];
  }

  removeStudent() {
    this.removeEmitter.emit(this.toRemove);
  }

  displayFn(s: Student): string {
    return `${s.name} ${s.surname} (${s.serial})`;
  }

  customFilter(value: string = '') {
    this.filteredOptions = this._allStudents.filter((s) =>
      value === ''
        ? true
        : `${s.name} ${s.surname} (${s.serial})`
            .toLowerCase()
            .includes(value.toLowerCase())
    );
  }

  studentSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedAddStudent = event.option.value;
  }

  enrollStudent() {
    if (
      this.selectedAddStudent != null &&
      this._enrolledStudents.filter((s) => s.serial == this.selectedAddStudent.serial)
        .length == 0
    ) {
      this.addEmitter.emit([this.selectedAddStudent]);
    }
  }
}
