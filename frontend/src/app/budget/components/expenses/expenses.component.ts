import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from 'src/app/services/budget.service';
import { CategoryService } from 'src/app/services/category.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent implements OnInit {
  userInfo: any;
  expenseList: any;
  imagePath: string = '';
  categoryImagePath: string = '';
  queryParam: string = '';
  category!: number;
  categoryList: any;

  startDate: any;
  endDate: any;
  totalExpense: number = 0;


  page: number = 1; // Current page
  pageSize: number = 20; // Number of records per page
  totalRecords: number = 0; // Total records available
  loading: boolean = false; // To prevent multiple calls during scrolling

  constructor(
    private router: Router,
    private bugetService: BudgetService,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    if (this.userInfo) {
      this.getRecords();
      this.getCategories();
    }
  }

  loadMore() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
  
    // Ensure we do not load more data than available
    if (this.page < totalPages && !this.loading) {
      this.page++;
      this.getRecords();
    }
  }

  getRecords() {
    this.loading = true; // Set loading to true to prevent additional triggers
    this.bugetService
      .getList(
        2,
        this.queryParam,
        this.category,
        this.startDate,
        this.endDate,
        this.page,
        this.pageSize
      )
      .subscribe(
        (response) => {
          this.imagePath = response.imagePath;
          this.categoryImagePath = response.categoryImagePath;
  
          // Update total records from the response
          this.totalRecords = response.pagination?.total || 0;

          // Append new records to the expense list
          if (response.list && response.list.length > 0) {
            this.expenseList = this.expenseList ? [...this.expenseList, ...response.list] : [...response.list];
            response.list.forEach((expense: any) => {
              this.totalExpense += parseFloat(expense.amount);
            });
          }
  
          this.loading = false; // Reset loading
        },
        (error) => {
          console.error("Error fetching records:", error);
          this.loading = false; // Reset loading on error
        }
      );
  }

  resetTotalExpense() {
    this.expenseList = [];
    this.totalExpense = 0;
  }

  // getRecords() {
  //   this.resetTotalExpense();
  //   this.bugetService
  //     .getList(2, this.queryParam, this.category, this.startDate, this.endDate)
  //     .subscribe(
  //       (response) => {
  //         this.imagePath = response.imagePath;
  //         this.categoryImagePath = response.categoryImagePath;
  //         this.expenseList = response.list;
  //         if (this.expenseList) {
  //           this.expenseList.forEach((expense: any) => {
  //             this.totalExpense += parseFloat(expense.amount);
  //           });
  //         }
  //       },
  //       (error) => {},
  //     );
  // }

  openTransaction(expense: any, type: string) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     id_expense: expense.id_expense
    //   },
    // };
    // navigationExtras
    this.router.navigate(['/add', type, expense.id_expense]);
  }

  getCategories() {
    this.categoryService.categoryList('expense').subscribe(
      (response) => {
        this.categoryList = response.list;
      },
      (error) => {},
    );
  }

  trackByExpenses(index:number, expense : any) : number {
    return expense.id_expense;

  }
}
