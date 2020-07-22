import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styles: ['img { height:100%; width: 100%margin: 0;}']
})
export class ContentDialogComponent implements OnInit {

  content: File;

  constructor(public dialogRef: MatDialogRef<ContentDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.content = data.content;
      console.log("Prova: " + this.content)
  }

  ngOnInit(): void {
  }

}
