import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
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

  searchResults$: Observable<PurchasedNumberPerCustomer[]> =
    this.searchTerms$.pipe(
      map((data: string) => {
        return this.customerPurchaseList.filter(
          (customer: PurchasedNumberPerCustomer) =>
            customer.customerName.toLowerCase().startsWith(data)
        );
      })
    );

  constructor() {}

  ngOnInit(): void {}

  preventPageReloadOnEnter(e: Event) {
    e.preventDefault();
  }
}
