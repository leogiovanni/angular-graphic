import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {

  isLoading: boolean = false;
  formSearch: FormGroup;
  searchObject = null;
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
  formProducts: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private apollo: Apollo, private productService: ProductService) {  }

  ngOnInit() {    
    this.isLoading = true;
    this.isToLoadProducts = false;
    this.isSearchingProducts = false;
    this.isLoadingProducts = false;
    this.loadPOC();
    this.loadCategories();
    this.checkLoading();

    this.formProducts = this.formBuilder.group({
      'delivery' : [null, [ Validators.required] ],
      'payment' : [null, [ Validators.required] ]
    });
  }

  loadPOC() {
    this.isLoadingPocs = true;
    this.searchObject = {
      "algorithm": "NEAREST",
      "lat": "-23.632919",
      "long": "-46.699453",
      "now": "2017-08-01T20:00:00.000Z"
    };

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
