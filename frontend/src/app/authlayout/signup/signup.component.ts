import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  showPassword: boolean = false;
  registrationCode : string = '';
  masjidList : any = [];

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ramadanService : RamadanService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [ Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      registrationCode : [''],
      masjid: [''],  
      address: [''], 
      landmark: [''],
      occupation: [''],
      college_name: [''],
      company_name: [''],
      gender: ['m'],
    });
  }


  ngOnInit(): void {

    // get Program Details
    // check is program is vaild or not
    // Get Masjids list accoated with programs
    // 2025Tauheed
    

    this.activatedRoute.queryParams.subscribe(params => {
      this.registrationCode = params['registrationCode'] || null;
      if(this.registrationCode){

        this.ramadanService.checkProgram(this.registrationCode).subscribe((response: any) => {
          if (response) {
            this.masjidList = response.halqa.masjids;
            this.registrationForm.patchValue({
              registrationCode: this.registrationCode
            });
          }
        });
      }
    });


    const tooltiptriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
  }


  onSubmit() {

    if (this.registrationForm.valid) {
      this._authService.signUp(this.registrationForm.value).subscribe(
        (response) => {
          Swal.fire({
            title: 'Registration successful!',
            text: 'Log in for Sehri subscription.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {

            if (this.registrationCode) {
              Swal.fire({
                title: 'Registrations Closed',
                text: 'You’re on the waiting list.',
                icon: 'error',
                footer: '<strong>We’ll inform you of any updates.</strong>',
                confirmButtonText: 'Understood'
              });
              return;
            }

            // Navigate to the sign-in page after the user confirms the success message
            this.router.navigateByUrl('/signin');
          });
        },
        (error) => {
          if (error.error.key) {
            const controlName = error.error.key;
            this.registrationForm
              .get(controlName)
              ?.setErrors({ invalid: true });

            const element = document.querySelector(
              `[formControlName="${controlName}"]`,
            ) as HTMLElement | null;
            if (element) {
              element.focus();
            }
          }
        },
      );
    } else {
      const firstInvalidControl = Object.keys(
        this.registrationForm.controls,
      ).find((controlName) => this.registrationForm.get(controlName)?.invalid);
      if (firstInvalidControl) {
        const element = document.querySelector(
          `[formControlName="${firstInvalidControl}"]`,
        ) as HTMLElement | null;
        if (element) {
          element.focus();
        }
      }
    }
  }

  validateNumber(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    inputElement.value = numericValue;
    const phoneControl = this.registrationForm.get('phone');
    if (phoneControl) {
      phoneControl.setValue(numericValue);
    }
  }
}
