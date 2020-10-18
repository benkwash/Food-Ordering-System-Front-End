import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintableFooterComponent } from '../general/printable-footer/printable-footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PrintableFooterComponent
  ],
  exports: [
    CommonModule,
    PrintableFooterComponent
  ]
})
export class PrintableSharedModule { }
