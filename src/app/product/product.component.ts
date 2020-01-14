import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {  FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataService } from '../service/data.service';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

const pocSearchMethod = gql`
  query pocSearchMethod($now: DateTime!, $algorithm: String!, $lat: String!, $long: String!) {
    pocSearch(now: $now, algorithm: $algorithm, lat: $lat, long: $long) {
      __typename
      id
      status
      tradingName
      officialName
      deliveryTypes {
        __typename
        pocDeliveryTypeId
        deliveryTypeId
        price
        title
        subtitle
        active
      }
      paymentMethods {
        __typename
        pocPaymentMethodId
        paymentMethodId
        active
        title
        subtitle
      }
      pocWorkDay {
        __typename
        weekDay
        active
        workingInterval {
          __typename
          openingTime
          closingTime
        }
      }
      address {
        __typename
        address1
        address2
        number
        city
        province
        zip
        coordinates
      }
      phone {
        __typename
        phoneNumber
      }
    }
  }
`;

const categorySearchMethod = gql`
  query allCategoriesSearch {
    allCategory{
      title
      id
    }
  }
`;

const productSearchMethod = gql`
  query poc($id: ID!, $categoryId: Int, $search: String){
    poc(id: $id) {
      id
      products(categoryId: $categoryId, search: $search) {
        id
        title
        rgb
        images {
          url
        }
        productVariants {
          availableDate
          productVariantId
          price
          inventoryItemId
          shortDescription
          title
          published
          volume
          volumeUnit
          description
          subtitle
          components {
            id
            productVariantId
            productVariant {
              id
              title
              description
              shortDescription
            }
          }
        }
      }
    }
  }
`;

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
  selectedCategory: String = null;
  products: Array<any> = [];
  isLoadingPocs: boolean = false;
  isLoadingCategories: boolean = false;
  isToLoadProducts: boolean = false;
  isSearchingProducts: boolean = false;
  isLoadingProducts: boolean = false;
  formProducts: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private apollo: Apollo) {  }

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

    this.apollo
      .watchQuery({
        query: pocSearchMethod,
        variables: {
          "now": this.searchObject.now, 
          "algorithm": this.searchObject.algorithm, 
          "lat": this.searchObject.lat, 
          "long": this.searchObject.long
        },
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.pocSearch)
      .subscribe(data => {
        this.pocs = data;
        this.isLoadingPocs = false;
        this.checkLoading();
      });  
  }

  loadCategories() {
    this.isLoadingCategories = true;

    this.apollo
      .watchQuery({
        query: categorySearchMethod,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.allCategory)
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
    this.loadProducts();
  }

  loadProducts(category = null){
    this.isToLoadProducts = false;
    this.isSearchingProducts = false;
    this.isLoadingProducts = true;
    
    this.selectedCategory = null;
    if(category && category.target && category.target.value) {
      this.selectedCategory = category.target.value ;
    }

    this.apollo
      .watchQuery({
        query: productSearchMethod,
        variables: {
          "id": this.pocs[0].id,
          "search": "",
          "categoryId": this.selectedCategory
        },
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data)
      .subscribe(data => {
        this.products = data.poc.products;
        setTimeout(() => {
          this.isLoadingProducts = false;
          this.isToLoadProducts = true;
        }, 1500);
      });  
  }
}
