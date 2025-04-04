import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RamadanService } from '../../../ramadan.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent {
conversionPrice: number = 1;
  userInfo: any;

  programList: any;
  imagePath: string = '';
  categoryImagePath: string = '';

  constructor(
    private router: Router,
    private ramadanService: RamadanService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    if (this.userInfo) {
      this.ramadanService.programList().subscribe(
        (response) => {
          this.programList = response;
        },
        (error) => {},
      );
    }
  }

  openEvent(event: any) {
    this.router.navigate(['/ramadan/program-details', event.id]);
  }
}
