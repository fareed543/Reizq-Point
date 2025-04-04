import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RamadanService } from '../../../ramadan.service';

@Component({
  selector: 'app-halqa',
  templateUrl: './halqa.component.html',
  styleUrls: ['./halqa.component.scss']
})
export class HalqaComponent {
conversionPrice: number = 1;
  userInfo: any;

  halqaList: any;
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
      this.ramadanService.halqaList().subscribe(
        (response) => {
          this.halqaList = response.halqas;
        },
        (error) => {},
      );
    }
  }

  openEvent(event: any) {
    this.router.navigate(['/ramadan/halqa-details', event.id]);
  }
}
