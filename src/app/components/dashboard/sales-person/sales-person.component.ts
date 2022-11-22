import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SalesPerson } from 'src/app/shared/xlsx-data.interface';

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css'],
})
export class SalesPersonComponent implements OnInit {
  @Input() salesPersonsDetails!: SalesPerson[];
  @Output() sortByCondition = new EventEmitter<string>();

  sortByRevenue: boolean = true;
  sortForm: FormGroup<any> = new FormGroup<any>({
    sortCondition: new FormControl<string>('revenue'),
  });

  constructor() {}

  ngOnInit(): void {}

  onChangeSortCondition() {
    this.sortByRevenue = !this.sortByRevenue;
    this.sortByCondition.emit(this.sortForm.controls['sortCondition'].value);
  }
}