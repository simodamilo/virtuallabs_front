import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  template: `<div class="container">
              <h1>{{role=='student' 
                ? 'You are not enrolled in any courses, wait to be added by a teacher' 
                : 'You do not own any courses, you can add a new one from the side'}}</h1>
            </div>`,
  styles: ['.container { margin: 20px; padding-top: 100px; text-align: center;}']
})
export class StartComponent implements OnInit {

  role: string;

  constructor() { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }

}
