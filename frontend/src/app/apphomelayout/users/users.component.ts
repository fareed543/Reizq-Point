import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {


  queryParam : string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  conversionPrice: number = 1;
  userInfo: any;

  userList: any;
  imagePath: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    if (this.userInfo) {
      this.getUsers();
    }
  }

  refreshList(){
    this.getUsers();
  }

  getUsers(){
    this.authService.getUsers().subscribe(
      (response: any) => {
        this.imagePath = response.imagePath;
        this.userList = response.list;
      },
      (error: any) => {},
    );
  }

  openUser(user: any) {
    this.router.navigate(['/user', user.id]);
  }


  
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
  
  clearQuery() {
    this.queryParam = '';  // Clear the search parameter
  }

  trackByUser(index: number, user: any): number {
    return user.id; // Ensure 'id' is a unique identifier for each user
  }
}
