import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio'; // Import this
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule  ,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule, 
    MatProgressBarModule ,
    MatRadioModule, 
    MatCardModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
