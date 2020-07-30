import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Student, Teacher } from 'src/app/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {

  allOptions: Student[] | Teacher[];
  filteredOptions: Student[] | Teacher[];
  selectedAddOption: Student | Teacher;
  _type: string;

  @Input('options')   
  set options(options: Student[] | Teacher[] ) {
    if (options != null) {
      this.allOptions = [...options];
      this.filteredOptions = [...options];
    }
  }

  @Input('type')   
  set type(type: string) {
    this._type = type;
  }

  @Output('selectedOption') optionEmitter = new EventEmitter<Student | Teacher>();

  constructor() {}

  displayFn(s: Student | Teacher): string {
    return `${s.name} ${s.surname} (${s.serial})`;
  }

  customFilter(value: string = '') {
    this.filteredOptions = this.allOptions.filter((s) =>
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
    if (this.selectedAddOption != null)
      this.optionEmitter.emit(this.selectedAddOption)
  }
}
