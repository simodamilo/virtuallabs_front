import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styles: ['img { height:100%; width: 100%margin: 0;}']
})
export class ContentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ContentDialogComponent>) { }

  ngOnInit(): void {
  }

}
