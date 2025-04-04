import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RamadanService } from '../../../ramadan.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-masjid',
  templateUrl: './masjid.component.html',
  styleUrls: ['./masjid.component.scss']
})
export class MasjidComponent {
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
      this.ramadanService.userMasjidList().subscribe(
        (response) => {
          this.halqaList = response;
        },
        (error) => {},
      );
    }
  }

  openEvent(masjid: any) {
    this.router.navigate(['/ramadan/masjid-details', masjid.id]);
  }
}
