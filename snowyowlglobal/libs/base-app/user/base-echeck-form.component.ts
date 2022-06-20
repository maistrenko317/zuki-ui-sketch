import {
  ApplicationRef,
  ChangeDetectorRef,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { BankAccount, Echeck, SubscriberAddress } from '@snowl/base-app/model';
import { NgForm } from '@angular/forms';
import { states } from './states';
import { Country } from '@snowl/base-app/model/country';
import {merge, Subject} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  throttleTime
} from 'rxjs/operators';
import { BasePaymentService } from '@snowl/base-app/user/base-payment.service';
import { BasePlaceService, PlaceAutocomplete } from '@snowl/base-app/user/base-place.service';
import {AbstractVxItemComponent, AutocompleteFilterFunction} from 'vx-components-base';

@Injectable()
export class BaseEcheckFormComponent implements OnDestroy, OnInit {
  states = states;
  @ViewChild('form', {static: true}) form: NgForm;
  @Input() withdrawing: boolean;
  @Input() echeck: Echeck;
  @Input() bank: BankAccount;
  @Input() address: SubscriberAddress;
  @Input() countries: Country[];
  @Input() billingAddresses: SubscriberAddress[];
  @Input() bankAccounts: BankAccount[];
  @Output() addressChange = new EventEmitter<SubscriberAddress>();
  @Output() bankChange = new EventEmitter<BankAccount>();

  addressFilterFn = addressFilterFn;
  routingNumberChange = new Subject<string>();
  placeChange = new Subject<string>();
  onDestroy$ = new Subject();
  places: PlaceAutocomplete[] = [];

  private initialBank: BankAccount;
  private initialAddress: SubscriberAddress;

  constructor(
    public paymentService: BasePaymentService,
    protected cdr: ChangeDetectorRef,
    protected placeService: BasePlaceService
  ) {
    this.routingNumberChange
      .pipe(
        filter(routingNumber => `${routingNumber}`.length === 9),
        mergeMap(routingNumber => {
          return this.paymentService.queryRoutingNumber(routingNumber);
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((bankName?: string) => {
        if (bankName) {
          this.form.controls['bankName'].setValue(bankName);
          this.cdr.markForCheck();
        }
      });

    const placeChange = this.placeChange.pipe(
      filter(place => !!place && !!place.length),
      throttleTime(500, undefined, {leading: true, trailing: true}),
      distinctUntilChanged(),
      switchMap(place => {
        return this.placeService.placeAutocomplete(place);
      }),
      takeUntil(this.onDestroy$)
    )
    .subscribe(response => {
      this.places = response || [];
      this.cdr.detectChanges();
    });
  }

  private _useExistingAddress = false;

  get useExistingAddress(): boolean {
    return this._useExistingAddress;
  }

  set useExistingAddress(value: boolean) {
    this._useExistingAddress = value;
    if (!value) {
      this.address = this.initialAddress;
      this.addressChange.next(this.address);
    }
  }

  private _useExistingCheck = false;

  get useExistingCheck(): boolean {
    return this._useExistingCheck;
  }

  set useExistingCheck(value: boolean) {
    this._useExistingCheck = value;
    if (!value) {
      this.bank = this.initialBank;
      this.bankChange.next(this.bank);
    }
  }

  getPlace(place: string): void {
    if (!place) {
      return
      // this.address = undefined;
      // this.addressChange.emit(undefined);
    }

    this.placeService.getSubscriberAddressFromPlace(place).subscribe(address => {
      this.address = address;
      this.addressChange.next(this.address);
    });
  }

  ngOnInit(): void {
    this.initialAddress = this.address;
    this.initialBank = this.bank;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleAddressChange(address: SubscriberAddress) {
    this.address = address;
    this.addressChange.next(address);
  }

  handleAccountChange(bank: BankAccount) {
    this.bank = bank;
    this.bankChange.next(bank);
  }
}

const addressFilterFn: AutocompleteFilterFunction<string> =
  (items: AbstractVxItemComponent<string>[], searchText: string, selectedItems?: string[]) => {
    return items;
  };
