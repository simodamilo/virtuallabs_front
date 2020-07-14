import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styles: ['img { height:100%; width: 100%margin: 0;}']
})
export class PreviewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PreviewDialogComponent>) { }

  ngOnInit(): void {
  }

}
