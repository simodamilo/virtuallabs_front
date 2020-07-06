import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VmsContComponent } from './vm/vms-cont.component';
import { LoginComponent } from './auth/login.component';

const routes: Routes = [
  { path: 'home', component: LoginComponent},
  { path: 'teacher/course/applicazioni-internet/vms', component: VmsContComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
