import { Injectable } from '@angular/core';
import gql from "graphql-tag";
import { Apollo } from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apollo: Apollo) { }

  pocSearchMethod = gql`
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

  categorySearchMethod = gql`
    query allCategoriesSearch {
      allCategory{
        title
        id
      }
    }
  `;

  productSearchMethod = gql`
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

  loadPocSearchMethod(searchObject) {
    return this.apollo
      .watchQuery({
        query: this.pocSearchMethod,
        variables: {
          "now": searchObject.now, 
          "algorithm": searchObject.algorithm, 
          "lat": searchObject.lat, 
          "long": searchObject.long
        },
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.pocSearch);  
  }

  loadCategorySearchMethod(){
    return this.apollo
      .watchQuery({
        query: this.categorySearchMethod,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.allCategory); 
  }

  loadProductSearchMethod(id, selectedCategory){
    return this.apollo
      .watchQuery({
        query: this.productSearchMethod,
        variables: {
          "id": id,
          "search": "",
          "categoryId": selectedCategory
        },
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data)
  }
}
