import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent {
conversionPrice: number = 1;
  userInfo: any;

  categoryList: any;
  imagePath: string = '';
  categoryImagePath: string = '';
  categoryTypesList: any = [];
  categoryForm!: FormGroup;

  currentYear: number = moment().year();
  yearList: number[] = [];
  monthList: { id: number; name: string }[] = [];  
  currentMonth: number = moment().month() + 1;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder
  ) {}

  
  ngOnInit(): void {
    this.userInfo = this.localStorageService.getItem('userInfo');
    if (this.userInfo) {
      this.generateMonthList();
      this.getCategoryTypes();
      this.generateYearList();
      this.getBudgetAllocations();
    }
  }

  generateYearList(): void {
    const startYear = 2023;
    const endYear = 2027;
    for (let year = startYear; year <= endYear; year++) {
      this.yearList.push(year);
    }
  }

  generateMonthList(): void {
    this.monthList = moment.months().map((month, index) => ({
      id: index + 1, 
      name: month,   
    }));  }

  getCategoryTypes() {
    this.categoryService.categoryTypes().subscribe(
      (response) => {
        this.categoryImagePath = response.categoryImagePath;
        this.categoryTypesList = response.list;
      },
      (error) => {
        console.error('Error fetching category types', error);
      }
    );
  }

  getBudgetAllocations() {
    this.categoryService.getBudgetAllocations(this.currentYear , this.currentMonth).subscribe(
      (response) => {
        this.categoryList = response.allocations;
        // if (this.categoryList) {
        //   const formControls: { [key: string]: any } = {};
        //   this.categoryList.forEach((category: any, index: number) => {
        //     formControls[`allocated_amount_${category.id_category}`] = [
        //       category.allocated_amount,
        //       [Validators.max(1000000)],
        //     ];
        //     formControls[`expense_amount_${category.id_category}`] = [
        //       category.expense_amount,
        //       [ Validators.max(1000000)],
        //     ];
        //   });
        //   this.categoryForm = this.fb.group(formControls);
        // }
      },
      (error) => {
        console.error('Error fetching category list', error);
      }
    );
  }

  openCategory(category: any) {
    this.router.navigate(['/add-category', category.id_category]);
  }
  
  onSubmit(){
    this.router.navigate(['/budget-planner/planner']);
  }


  
getTotalExpenseByType(id_type: number): number {
  if (!this.categoryList || this.categoryList.length === 0) {
    return 0;
  }

  return this.categoryList
    .filter((category: { id_type: number; expense_amount?: any }) => {
      const match = category.id_type == id_type;
      return match;
    })
    .reduce((sum: number, category: { expense_amount?: any }) => {
      const amount = parseFloat(category.expense_amount) || 0;
      return sum + amount;
    }, 0);
}

  getTotalAllocatedAmountByType(id_type: number): number {
    if (!this.categoryList || this.categoryList.length === 0) {
      return 0;
    }
  
    return this.categoryList
      .filter((category: { id_type: number; allocated_amount?: any }) => {
        const match = category.id_type == id_type;
        return match;
      })
      .reduce((sum: number, category: { allocated_amount?: any }) => {
        const amount = parseFloat(category.allocated_amount) || 0;
        return sum + amount;
      }, 0);
  }
}
