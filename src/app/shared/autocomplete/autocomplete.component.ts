import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Student, Teacher } from 'src/app/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-autocomplete',
  template: `<mat-form-field>
              <input matInput #search type="search" [placeholder]="_type" [matAutocomplete]="auto"
                (keyup)="customFilter(search.value)" />
              <mat-autocomplete #auto [displayWith]="displayFn" (optionSelected)="selectedOption($event)">
                <mat-option *ngFor="let option of filteredOptions" [value]="option">
                 {{ option.name }} {{ option.surname }} ({{ option.serial }})
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <button mat-stroked-button (click)="sendOption(); search.value = ''">Add {{_type}}</button>`,
  styles: ['mat-form-field{width: 30%; margin-right: 12px;}']
})
export class AutocompleteComponent {

  allOptions: Student[] | Teacher[];
  filteredOptions: Student[] | Teacher[];
  selectedAddOption: Student | Teacher;
  _type: string;

  @Input('options')
  set options(options: Student[] | Teacher[]) {
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

  constructor() { }

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
