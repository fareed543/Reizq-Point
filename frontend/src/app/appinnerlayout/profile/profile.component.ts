import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslationService } from 'src/app/services/translation.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { RamadanService } from 'src/app/ramadan/ramadan.service';
// import SwiperCore, {
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
// } from 'swiper/core';

// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public singlePicker = {
    singleDatePicker: true,
    autoUpdateInput: true,
    showDropdowns: true,
    autoApply: true,
    drops: 'down',
    locale: {
      format: 'DD MMM YYYY',
    },
    startDate: null,
  };

  userData: any;
  profileForm: FormGroup;
  selectedImage!: File;
  imagePath!: string;
  masjidList: any = [];

  showAds: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private translationService: TranslationService,
    private ramadanService : RamadanService
  ) {
    this.profileForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: [''],
        username: ['', Validators.pattern(/^\d{10}$/)], // Assuming a 10-digit username
        image: [''],
        otp: [''],
        phone: [''],
        address : [''],
        masjid : [''],
        landmark : [''],
        notes : [''],
        occupation: [''],
        college_name: [''],
        company_name : [''],
        email: [
          '',
          [
            Validators.pattern(
              /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\-]+$/),
          ],
        ],
        confirmpassword: [''],
        date_of_birth: [''],
        gender: [''],
        pincode : [''],
        designation : [''],
        accountDeactivation: [false],
        enableOfflineAccess: [false],
        emailNotification: [true],
        language: ['en'],
      },
      { validator: this.passwordMatchValidator() },
    );
  }
  greeting: string = '';
  isChecked: boolean = false;
  


  ngOnInit(): void {

    const adsEnabled = localStorage.getItem('showAds');
    this.showAds = adsEnabled === '1';

    const currentHour = new Date().getHours();
    switch (true) {
      case currentHour >= 5 && currentHour < 12:
        this.greeting = 'Good Morning';
        break;
      case currentHour >= 12 && currentHour < 18:
        this.greeting = 'Good Afternoon';
        break;
      case currentHour >= 18 && currentHour < 22:
        this.greeting = 'Good Evening';
        break;
      default:
        this.greeting = 'Good Night';
    }

    const a = { id: 1 };
    this._authService.getProfile(a).subscribe(
      (response) => {
        if (response) {
          this.userData = response.userData;
          this.imagePath = response.imagePath;

          this.profileForm.patchValue({
            firstname: this.userData.firstname,
            lastname: this.userData.lastname,
            username: this.userData.username,
            gender: this.userData.gender,
            phone: this.userData.phone,
            email: this.userData.email,
            address : this.userData.address ,
            masjid : this.userData.masjid ,
            landmark : this.userData.landmark ,
            notes : this.userData.notes ,
            occupation: this.userData.occupation,
            college_name: this.userData.college_name,
            company_name : this.userData.company_name ,
            designation : this.userData.designation ,
            pincode : this.userData.pincode ,
            date_of_birth: this.userData.date_of_birth
              ? moment(this.userData.date_of_birth).format('DD MMM YYYY')
              : null,

            accountDeactivation: this.userData.active === '1',
            enableOfflineAccess: this.userData.offline_access === '1',
            emailNotification: this.userData.email_notification === '1',
          });

          if(this.userData.pincode){
            this.getMasjidList(this.userData.pincode);
          }

          if (this.profileForm.controls['date_of_birth'].value) {
            this.singlePicker = {
              ...this.singlePicker,
            };
          }
        }
      },
      (error) => {},
    );
  }


  toogleAds(event: any) {
    this.showAds = event.target.checked;
    localStorage.setItem('showAds', this.showAds ? '1' : '0');
  }

  doCheck() {
    const html = document.getElementsByTagName('html')[0];
    this.isChecked = !this.isChecked;
    if (this.isChecked === true) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBase64: any;

  onFileChange(event: any) {
    this.imageChangedEvent = event;
  }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.blob;

  //   // If you want to convert the blob to base64 for display purposes
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     if (reader.result) {
  //       this.croppedImageBase64 = reader.result as string;
  //     }
  //   };
  //   // @ts-ignore
  //   reader.readAsDataURL(event.blob);
  // }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  onPincodeEntered() {
    const pincode = this.profileForm.get('pincode')?.value;
    if (pincode && pincode.length === 6) { 
      this.getMasjidList(pincode);
    }
  }

  getMasjidList(pincode : string){
    this.ramadanService.masjidListbyPincode(pincode).subscribe(
      (response) => {
        this.masjidList = response;
      },
      (error) => {},
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('firstname', this.profileForm.value.firstname);
      formData.append('lastname', this.profileForm.value.lastname);
      formData.append('address', this.profileForm.value.address);
      formData.append('landmark', this.profileForm.value.landmark);
      formData.append('masjid', this.profileForm.value.masjid);
      formData.append('company_name', this.profileForm.value.company_name);
      formData.append('college_name', this.profileForm.value.college_name);
      formData.append('occupation', this.profileForm.value.occupation);
      formData.append('designation', this.profileForm.value.designation);
      formData.append('pincode', this.profileForm.value.pincode);
      formData.append('notes', this.profileForm.value.notes);
  
      if (this.profileForm.value.date_of_birth) {
        formData.append(
          'date_of_birth',
          moment(this.profileForm.value.date_of_birth).format('YYYY-MM-DD'),
        );
      }
  
      formData.append('gender', this.profileForm.value.gender);
      formData.append('accountDeactivation', this.profileForm.value.accountDeactivation ? '1' : '0');
      formData.append('enableOfflineAccess', this.profileForm.value.enableOfflineAccess ? '1' : '0');
      formData.append('emailNotification', this.profileForm.value.emailNotification ? '1' : '0');
      formData.append('otp', this.profileForm.value.otp);
      formData.append('phone', this.profileForm.value.phone);
  
      if (this.croppedImage) {
        formData.append('image', this.croppedImage, 'profile-image.png');
      }
  
      this._authService.saveProfile(formData).subscribe(
        (response) => {
          this.localStorageService.setItem('userInfo', response);
          this.userData = response;
          this.imagePath = response.imagePath;
  
          // INFO: Reset Image Selection
          this.croppedImageBase64 = null;
          this.imageChangedEvent = null;
  
          Swal.fire({
            icon: 'success',
            title: 'Profile',
            text: 'Profile Updated',
            showConfirmButton: false,
            timer: 1500,
          });
  
          this.router.navigateByUrl('/profile');
        },
        (error) => {
          console.error('Profile update error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Profile',
            text: 'Profile Update Failed!',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      );
    }
  }
  

  changeAccountDeactivation(event: any) {
    if (event.target.value) {
      // Ask for confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'Want to Deactivate your Account',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deactivate',
      }).then((result) => {
        this.profileForm.patchValue({
          accountDeactivation: false,
        });
      });
    }
  }

  passwordMatchValidator(): any {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmpassword = formGroup.get('confirmpassword')?.value;

      if (password && confirmpassword && password !== confirmpassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  changeLanguage(event: any) {
    this.translationService.setLanguage(event.target.value);
  }


}
