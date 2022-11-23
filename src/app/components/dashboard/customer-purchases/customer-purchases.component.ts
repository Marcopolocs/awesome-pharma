import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { PurchasedNumberPerCustomer } from 'src/app/shared/xlsx-data.interface';

@Component({
  selector: 'app-customer-purchases',
  templateUrl: './customer-purchases.component.html',
  styleUrls: ['./customer-purchases.component.css'],
})
export class CustomerPurchasesComponent implements OnInit {
  @Input() customerPurchaseList!: PurchasedNumberPerCustomer[];
  searchInput: FormControl<string> = new FormControl();

  searchTerms$: Observable<string> = this.searchInput.valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((input) => input !== '' && input !== null),
    map((result) => result)
  );

  searchResults$ = this.searchTerms$
    .pipe(
      map((data: string) => {
        return this.customerPurchaseList.filter(
          (customer: PurchasedNumberPerCustomer) =>
            customer.customerName.toLowerCase().startsWith(data)
        );
      })
    )
    .subscribe();

  constructor() {}

  ngOnInit(): void {}
}
