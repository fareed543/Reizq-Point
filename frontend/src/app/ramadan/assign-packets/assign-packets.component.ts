import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { RamadanService } from '../ramadan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-packets',
  templateUrl: './assign-packets.component.html',
  styleUrls: ['./assign-packets.component.scss']
})
export class AssignPacketsComponent implements OnInit {
  assignPacketForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private ramadanService: RamadanService, 
    private dialogRef: MatDialogRef<AssignPacketsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: any; selectedProgram: any } // Ensure selectedProgram is included
  ) {}

  ngOnInit(): void {
    const idCustomer = this.data.member?.id || '';
    const idProgram = this.data.selectedProgram || ''; // Correctly set id_program
    const todayDate = moment().format('YYYY-MM-DD');

    debugger;
    this.assignPacketForm = this.fb.group({
      token: [null], 
      id_customer: [idCustomer, Validators.required], 
      id_program: [idProgram, Validators.required],  // Corrected id_program assignment
      date: [todayDate, Validators.required], 
      packets: ['', [Validators.required, Validators.pattern('^[0-9]+$')]] 
    });

    // Call API to fetch existing assigned packets
    this.getAssignedPackets(idCustomer, todayDate, idProgram);
  } 

  getAssignedPackets(idCustomer: string, date: string, idProgram: string): void {
    this.ramadanService.getAssignedPackets({ id_customer: idCustomer, date, id_program: idProgram }).subscribe({
      next: (response: any) => {
        if (response) {
          this.assignPacketForm.patchValue({
            token: response.token || null,
            id_customer: response.id_customer || '',
            id_program: response.id_program || '',
            date: response.date || '',
            packets: response.packets || ''
          });
        }
      },
      error: (error) => {
        console.error('Error fetching assigned packets:', error);
      }
    });
  }
  

  submit(): void {
    if (this.assignPacketForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.assignPacketForm.value,
        packets: String(this.assignPacketForm.value.packets) // Ensure packets is a string
      };

      this.ramadanService.assignPackets(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Packet assigned successfully!',
            timer: 2000, 
            showConfirmButton: false
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to assign packets. Please try again.',
            timer: 2500,
            showConfirmButton: true
          });
          console.error('Error assigning packets:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
