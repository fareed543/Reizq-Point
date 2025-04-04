import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ZakatService } from 'src/app/services/zakat.service';

@Component({
  selector: 'app-zakat-calculator',
  templateUrl: './zakat-calculator.component.html',
  styleUrls: ['./zakat-calculator.component.scss'],
})
export class ZakatCalulatorComponent implements OnInit {
  zakatForm!: FormGroup;
  categoryList: any;
  cityList: any;
  stateList: any;
  countryList: any;
  pricesData: any;
  totalZakatAmount: number = 0;
  selectedCity : any;
  constructor(
    private zakatService: ZakatService,
    private fb: FormBuilder,
  ) {}

  preventText($event: any) {
    // Create a new variable and assign value to avoid no-param-reassign error
    const newValue = $event.target.value.replace(
      /[a-zA-Z%@*^$!`)(_+=#&\s]/g,
      '',
    );
    $event.target.value = newValue;
  }

  ngOnInit(): void {
    this.zakatForm = this.fb.group({});
    // this.getCountries();
    // this.getZakatCategories();
    this.getCities();
  }

  getCities() {
    this.zakatService.getCities().subscribe((response: any) => {
      this.cityList = response.list;
      this.selectedCity = this.cityList[0].id_city;
      this.getZakatCategories();
    });
  }
  setCity(){
    this.getZakatCategories();

  }


  getZakatCategories() {
    this.zakatService.getCategories().subscribe((response: any) => {
      this.categoryList = response.list;
  
      this.categoryList.forEach((category: any) => {
        const childCategories: any = [];
        this.categoryList.forEach((cat: any) => {
          if (category.id_category === cat.parent) {
            childCategories.push(cat);
          }
        });
  
        // Assign child categories
        category.child = childCategories;
  
        this.zakatForm.addControl(
          category.id_category.toString(),
          new FormControl('no'),
        );
        this.zakatForm.addControl(
          `${category.id_category.toString()}_quantity`,
          new FormControl(null),
        );
      });
  
      this.zakatService.getLocationPrices(this.selectedCity).subscribe((priceResponse: any) => {
        this.pricesData = priceResponse.list;
  
        this.categoryList.forEach((category: any) => {
          // Initialize price to 1
          category.price = 1;
  
          this.pricesData.forEach((pD: any) => {
            if (pD.id_category == category.id_category) { // Use `===` if types match
              category.price = pD.price ? pD.price : 1;
            }
          });
        });
  
        // console.log("Updated Category List:", this.categoryList);
      });
    });
  }
  

  getChildCategories(category: any) {
    // Function remains unchanged
  }

  checkZakatAmount() {
    //
  }

  checkCategoryZakatAmount(category: any) {
    const quantity = parseFloat(
      this.zakatForm.controls[`${category.id_category}_quantity`].value
    );
  
    // Directly modify the original category object in categoryList
    category.categoryAmount = (
      quantity * parseFloat(category.price)
    ).toFixed(2);
  
    if (quantity >= category.min) {
      if (category.categoryAmount && category.percentage) {
        category.zakatMessage = null;
        category.zakatAmount = (
          (parseFloat(category.categoryAmount) * parseFloat(category.percentage)) /
          100
        ).toFixed(2);
      }
    } else {
      category.zakatAmount = "0"; // Keep it as a string to prevent NaN issues
      category.zakatMessage = `No Zakat (Min Quantity ${category.min} ${category.units}.)`;
    }
  
    // Reset total before recalculating
    this.totalZakatAmount = 0;
  
    // Ensure total updates correctly
    this.categoryList.forEach((cat: any) => {
      if (cat.zakatAmount) {
        this.totalZakatAmount += parseFloat(cat.zakatAmount) || 0;
      }
    });
  
    console.log("Updated Total Zakat Amount:", this.totalZakatAmount);
  }
  
}
