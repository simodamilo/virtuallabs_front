import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from '../test.component';
import { StudentVmsContComponent } from './vms/student-vms-cont.component';
import { StudentAssignmentContComponent } from './assignments/student-assignment-cont.component';
import { StudentTeamsContComponent } from './teams/student-teams-cont.component';

const routes: Routes = [
    {path: 'courses/:courseName', 
        children: [
            {
            path: 'teams',
            component: StudentTeamsContComponent
            },
            {
            path: 'vms',
            component: StudentVmsContComponent
            },
            {
            path: 'assignments',
            component: StudentAssignmentContComponent
            }
        ] 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }