import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherVmsContComponent } from './vms/teacher-vms-cont.component';
import { TeacherAssignmentContComponent } from './assignments/teacher-assignment-cont.component';
import { CourseContComponent } from './course/course-cont.component';

const routes: Routes = [
    {path: 'courses/:courseName', 
        children: [
            {
            path: 'course',
            component: CourseContComponent
            },
            {
            path: 'vms',
            component: TeacherVmsContComponent
            },
            {
            path: 'assignments',
            component: TeacherAssignmentContComponent
            }
        ] 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }