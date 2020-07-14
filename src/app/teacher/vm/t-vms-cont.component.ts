import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { VM, VmService } from 'src/app/core';

@Component({
  selector: 'app-vms-cont',
  templateUrl: './t-vms-cont.component.html',
  styleUrls: ['./t-vms-cont.component.css']
})
export class TVmsContComponent implements OnInit {

  vms$: Observable<VM[]>;
  courseName: string;

  constructor(private route: ActivatedRoute, private vmService: VmService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.getVms();  // qui devo prendere i team e non le vms
    });
  }

  getVms() {
    this.vms$ = this.vmService.getCourseVms(this.courseName);
  }

}