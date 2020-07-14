import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { VM } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-teacher-vms',
  templateUrl: './teacher-vms.component.html',
  styleUrls: ['./teacher-vms.component.css']
})
export class TeacherVmsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'students', 'actions'];
  dataSource: MatTableDataSource<VM> = new MatTableDataSource<VM>();

  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  @Input()
  set vms(vms: VM[]){
    if(vms != null) {
      console.log("Vms: " + vms[0].name);
      this.dataSource.data = [...vms];
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
