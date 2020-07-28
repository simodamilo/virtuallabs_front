import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Student, Teacher } from 'src/app/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {

  allOptions$: Student[] | Teacher[];
  filteredOptions$: Student[] | Teacher[];
  selectedAddOption: Student | Teacher;

  @Input('options')   
  set options(options: Student[] | Teacher[] ) {
    if (options != null) {
      this.allOptions$ = [...options];
      this.filteredOptions$ = [...options];
    }
  }

  @Output('selectedOption') optionEmitter = new EventEmitter<Student | Teacher>();

  constructor() {}

  displayFn(s: Student): string {
    return `${s.name} ${s.surname} (${s.serial})`;
  }

  customFilter(value: string = '') {
    this.filteredOptions$ = this.allOptions$.filter((s) =>
      value === ''
        ? true
        : `${s.name} ${s.surname} (${s.serial})`
            .toLowerCase()
            .includes(value.toLowerCase())
    );
  }

  selectedOption(event: MatAutocompleteSelectedEvent) {
    this.selectedAddOption = event.option.value;
  }

  sendOption() {
    if (
      this.selectedAddOption != null /* &&
      this.enrolledStudents$.filter((s) => s.serial == this.selectedAddStudent.serial)
        .length == 0 */
    )
      this.optionEmitter.emit(this.selectedAddOption)
  }
}
