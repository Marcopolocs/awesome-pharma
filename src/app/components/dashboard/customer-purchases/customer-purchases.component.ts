import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
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
  isSearcResultWindowOpen: boolean = false;
  pickedCustomer: any = null;

  @ViewChild('searchInputElement')
  searchInputElement!: ElementRef;
  @HostListener('window:click', ['$event']) clickEvent(event: any) {
    if (event.target !== this.searchInputElement.nativeElement) {
      this.isSearcResultWindowOpen = false;
      this.searchInput.reset();
    }
  }

  searchTerms$: Observable<string> = this.searchInput.valueChanges.pipe(
    // side effect: close results window if user deleted all inputs
    tap((data) =>
      data === '' || data === null
        ? (this.isSearcResultWindowOpen = false)
        : data
    ),
    debounceTime(200),
    distinctUntilChanged(),
    filter((input) => input !== '' && input !== null),
    map((result) => result)
  );

  searchResults$: Observable<PurchasedNumberPerCustomer[]> =
    this.searchTerms$.pipe(
      map((data: string) => {
        this.isSearcResultWindowOpen = true;
        return this.customerPurchaseList.filter(
          (customer: PurchasedNumberPerCustomer) =>
            customer.customerName.toLowerCase().startsWith(data)
        );
      })
    );

  constructor() {}

  ngOnInit(): void {}

  setCustomerDetails(item: any) {
    this.pickedCustomer = item;
    this.isSearcResultWindowOpen = false;
    this.searchInput.reset();
  }

  preventPageReloadOnEnter(e: Event) {
    e.preventDefault();
  }
}
