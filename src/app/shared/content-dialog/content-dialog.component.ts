import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolutionService, AssignmentService } from 'src/app/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styles: ['img { height:100%; width: 100%; margin: 0;}'],
})
export class ContentDialogComponent implements OnInit, OnDestroy {
  imageURL: string;
  imageSafeURL: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solutionService: SolutionService,
    private assignmentService: AssignmentService, 
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.data.assignment != null) {
      this.assignmentService
        .getContent(this.data.assignment)
        .subscribe((result) => this.createURL(result));
    } else if (this.data.solution != null) {
      this.solutionService
        .getContent(this.data.solution)
        .subscribe((result) => this.createURL(result));
    }
  }

  createURL(blob: Blob){
    this.imageURL = URL.createObjectURL(blob);
    this.imageSafeURL = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.imageURL)
  }
}
