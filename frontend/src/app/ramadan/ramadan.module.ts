import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { AdminComponent } from './admin/admin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SubscribersListComponent } from './subscribers-list/subscribers-list.component';
import { RamadanComponent } from './ramadan.component';
import { RamadanDashboardComponent } from './ramadan-dashboard/ramadan-dashboard.component';
import { HalqaComponent } from './components/halqa/halqa/halqa.component';
import { HalqaDetailsComponent } from './components/halqa/halqa-details/halqa-details.component';
import { MasjidComponent } from './components/masjid/masjid/masjid.component';
import { MasjidDetailsComponent } from './components/masjid/masjid-details/masjid-details.component';
import { AssignPacketsComponent } from './assign-packets/assign-packets.component';
import { ProgramListComponent } from './components/program/program-list/program-list.component';
import { ProgramDetailsComponent } from './components/program/program-details/program-details.component';
import { AddProgramMemberComponent } from './components/program/add-program-member/add-program-member.component';


const dashboardRoutes: Routes = [
  {
    path: '',
    component: RamadanComponent,
    children: [
      { path: '', redirectTo: 'subscriber', pathMatch: 'full' }, // Default route
      { path: 'dashboard', component: RamadanDashboardComponent },
      { path: 'subscribers-list', component: SubscribersListComponent },
      { path: 'subscriber', component: SubscriberComponent },
      { path: 'volunteer', component: VolunteerComponent },
      { path: 'organizer', component: AdminComponent },
      { path: 'halqa', component: HalqaComponent },
      { path: 'halqa-details', component: HalqaDetailsComponent },
      { path: 'halqa-details/:id', component: HalqaDetailsComponent },
      { path: 'masjid', component: MasjidComponent },
      { path: 'masjid-details', component: MasjidDetailsComponent },
      { path: 'masjid-details/:id', component: MasjidDetailsComponent },

      { path: 'program', component: ProgramListComponent },
      { path: 'program-details', component: ProgramDetailsComponent },
      { path: 'program-details/:id', component: ProgramDetailsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SubscriberComponent,
    VolunteerComponent,
    AdminComponent,
    SubscribersListComponent,
    RamadanComponent,
    RamadanDashboardComponent,
    HalqaComponent,
    HalqaDetailsComponent,
    MasjidComponent,
    MasjidDetailsComponent,
    AssignPacketsComponent,
    ProgramListComponent,
    ProgramDetailsComponent,
    AddProgramMemberComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    TranslateModule.forChild(),
    NgxDaterangepickerBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
    
  ]
})
export class RamadanModule { }
