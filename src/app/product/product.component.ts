import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { SharedService } from '../service/shared.service';
import "rxjs/add/operator/map";
import { Location } from "../models/location.model";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {

  isLoading: boolean = false;
  formSearch: FormGroup;
  searchObject: Location = null;
  pocs: Array<any> = [];
  categories: Array<any> = [];
  deliveryType: String = null;
  paymentType: String = null;
  selectedCategory: String = null;
  products: Array<any> = [];
  isLoadingPocs: boolean = false;
  isLoadingCategories: boolean = false;
  isToLoadProducts: boolean = false;
  isSearchingProducts: boolean = false;
  isLoadingProducts: boolean = false;
  dataFound: boolean = false;
  formProducts: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService, private sharedService: SharedService) {  }

  ngOnInit() {    

    this.formProducts = this.formBuilder.group({
      'delivery' : [null, [ Validators.required] ],
      'payment' : [null, [ Validators.required] ]
    });

    this.loadLocation();

    if (this.searchObject.algorithm !== undefined) {  
      this.dataFound = true;
      this.isLoading = true;
      this.isToLoadProducts = false;
      this.isSearchingProducts = false;
      this.isLoadingProducts = false;
      this.loadPOC();
      this.loadCategories();
      this.checkLoading();
    }
    else {
      this.dataFound = false;
      // this.router.navigate(['/']);
    }
  }

  loadLocation(){
    this.sharedService.sharedAddress.subscribe(location => this.searchObject = location);
  }

  loadPOC() {
    this.isLoadingPocs = true;
    this.productService.loadPocSearchMethod(this.searchObject)
      .subscribe(data => {
          this.pocs = data;
          this.isLoadingPocs = false;
          this.checkLoading();
      });
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.productService.loadCategorySearchMethod()
      .subscribe(data => {
        this.categories = data;
        this.isLoadingCategories = false;
        this.checkLoading();
      });  
  }

  checkLoading(){
    if(!this.isLoadingCategories && !this.isLoadingPocs){
      this.isLoading = false;
    }
  }

  getProducts(formProducts:NgForm){
    this.isSearchingProducts = true;
    this.deliveryType = formProducts['delivery'];
    this.paymentType = formProducts['payment'];
    this.loadProducts();
  }

  loadProducts(category = null){
    this.isToLoadProducts = false;
    this.isSearchingProducts = false;
    this.isLoadingProducts = true;
    
    this.selectedCategory = null;
    if(category && category.target && category.target.value && category.target.value !== "null") {
      this.selectedCategory = category.target.value;
    }

    this.productService.loadProductSearchMethod(this.pocs[0].id, this.selectedCategory)
      .subscribe(data => {
        this.products = data.poc.products;
        setTimeout(() => {
          this.isLoadingProducts = false;
          this.isToLoadProducts = true;
        }, 1500);
      });  
  }
}
