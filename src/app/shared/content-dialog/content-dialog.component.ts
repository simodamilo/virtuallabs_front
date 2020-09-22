import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolutionService, AssignmentService, ModelVmService, VmService } from 'src/app/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content-dialog',
  template: '<img class="images" [src]="imageSafeURL"/>',
  styles: ['img { height:auto; width: 100%; margin: 0;}'],
})
export class ContentDialogComponent implements OnInit {

  imageURL: string;
  imageSafeURL: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solutionService: SolutionService,
    private assignmentService: AssignmentService,
    private modelVmService: ModelVmService,
    private vmService: VmService,
    private sanitizer: DomSanitizer
  ) { }

  /**
   * Used to get the image of the passed parameter.
   * It could be an assignment, a solution, a VM model or a vm.
   */
  ngOnInit(): void {
    if (this.data.assignment != null) {
      this.assignmentService
        .getAssignmentContent(this.data.assignment)
        .subscribe(
          (result) => this.createURL(result),
          () => this.imageSafeURL = "../../assets/image_error.png");
    } else if (this.data.solution != null) {
      this.solutionService
        .getSolutionContent(this.data.solution)
        .subscribe(
          (result) => result.size == 0 ? this.imageSafeURL = "../../assets/not_solution.png" : this.createURL(result),
          () => this.imageSafeURL = "../../assets/image_error.png");
    } else if (this.data.modelVm != null) {
      this.modelVmService
        .getModelVmContent(this.data.modelVm)
        .subscribe(
          (result) => this.createURL(result),
          () => this.imageSafeURL = "../../assets/image_error.png");
    } else if (this.data.vm) {
      this.vmService
        .getContent(this.data.courseName)
        .subscribe(
          (result) => this.createURL(result),
          () => this.imageSafeURL = "../../assets/image_error.png");
    }
  }

  /**
   * Used to create the url and sanitize it.
   * 
   * @param blob of the image selected.
   */
  createURL(blob: Blob) {
    this.imageURL = URL.createObjectURL(blob);
    this.imageSafeURL = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
  }

}
