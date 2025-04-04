import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-staticfooter',
  templateUrl: './staticfooter.component.html',
  styleUrls: ['./staticfooter.component.scss'],
})
export class StaticfooterComponent {
  public isVisited = false;
  userInfo: any;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    this.userInfo = this.localStorageService.getItem('userInfo');

  }

  checkVisited() {
    this.isVisited = !this.isVisited;
  }

  LogTransaction(path: string) {
    this.router
      .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([path]);
      });
  }
}
