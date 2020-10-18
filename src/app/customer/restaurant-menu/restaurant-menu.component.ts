import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


//services
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { AuthenticationService } from "../../services/other/authentication.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { CustomerUnsignedService } from '../services/http/customer-unsigned.service';
import { CustomerService } from '../services/http/customer.service'
import { ServerDomainService } from 'src/app/services/http/server-domain.service';


@Component({
    selector: 'app-restaurant-menu-dialog',
    templateUrl: 'restaurant-menu-dialog.component.html',
    styleUrls: ['restaurant-menu-dialog.component.css']
})
export class RestaurantMenuDialogComponent {

    public selectedMenu: any;
    public menuToCart: any = {
        menuID: "",
        name: "",
        ingredients: [
            // {// name: "", // quantity: ""// }
        ],
        selectedOption: "",
        quantity: 1,
        price: 0
    };

    public selectedMenuOption: any = {}

    public selectedOptionPrice = 0;


    dialogType = "";
    constructor(
        public dialogRef: MatDialogRef<RestaurantMenuDialogComponent>, public http: CustomerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.dialogType = data.dialogType;
        this.selectedMenu = Object.create(data.menuInfo);

    }

    //increase or decrease ingredient quantity
    ingredientNumber(opt, index) {
        let ingredient = this.selectedMenu.ingredients[index];
        let numb = ingredient.quantity;

        if (opt == 'increase') {
            let maxIncrement = ingredient.maximum;
            if (numb < maxIncrement) {
                this.selectedMenu.ingredients[index].quantity++;
                this.selectedMenu.price += ingredient.pricePerIncrement;
            }
        } else {
            if (numb > 1) {
                this.selectedMenu.ingredients[index].quantity--;
                this.selectedMenu.price -= ingredient.pricePerIncrement;

            }
        }
    }

    selectedOption(index) {
        let option = this.selectedMenu.options[index];
        this.menuToCart.selectedOption = option.name
        if (this.selectedOptionPrice != 0) {
            let subtract = this.selectedOptionPrice;
            this.selectedMenu.price -= subtract;

            this.selectedMenu.price += option.price
        } else {
            this.selectedMenu.price += option.price
        }

        this.selectedOptionPrice = option.price;
    }

    changeOrderQty(opt) {
        let costOfOne = (this.selectedMenu.price / this.selectedMenu.qty)//cost of one order
        if (opt == "increase") {
            this.selectedMenu.qty++;
            this.selectedMenu.price += costOfOne;
        } else {
            if (this.selectedMenu.qty > 1) {
                this.selectedMenu.qty--;
                this.selectedMenu.price -= costOfOne;
            }
        }
    }

    addToCart() {
        this.menuToCart.menuID = this.selectedMenu._id;
        this.menuToCart.name = this.selectedMenu.name
        this.menuToCart.quantity = this.selectedMenu.qty;
        this.menuToCart.price = this.selectedMenu.price;
        //push name and quantity of ingredients into menutocart ingredients options
        if (this.selectedMenu.ingredients && this.selectedMenu.ingredients.length != 0) {
            this.selectedMenu.ingredients.forEach((doc, index) => {
                this.menuToCart.ingredients.push({ name: doc.name, quantity: doc.quantity })
            });
        }

        this.dialogRef.close(this.menuToCart);


    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}



@Component({
    selector: 'app-restaurant-menu',
    templateUrl: './restaurant-menu.component.html',
    styleUrls: ['./restaurant-menu.component.css']
})
export class RestaurantMenuComponent implements OnInit {
    @ViewChild('form') form: NgForm;


    showSidePane = false;

    public order = {
        region: "",
        city: ""
    }

    public sessionKey = "comeCho";
    public sessionData: any;
    public menus = []

    public restaurantName = "";
    public restaurantPicture=""
    public deliveryCost = null;
    public deliveryCity = null;
    public tableOptions = {
        costPerTable: 0,
        maximumChairPertable: 0,
        totalTables: 0,
        totalChairs: 0
    }

    public orderCart: any = {
        orders: [],
        deliveryFee: 0,
        mode: "", //delivery,pickup,table reservation
        // table: table, //if reserved table,time the user will use the table.. u bab?
        pickup: null, //if pickup, pickup time
        deliveryLocation: {
            address: "",
            number: ""
        },
        subtotal: 0,
        total: 0,
        table: {
            tables: 1,
            chairs: 1,
            cost: 0,
            time: null
        },
        restaurantID: null,

    }

    hasDelivery = false;
    hasReservation = false;
    hasPickup = false;

    logoAssestDir = "";


    constructor(
        private http: CustomerUnsignedService, private https: CustomerService, private serverDomain: ServerDomainService,
        private router: Router, private route: ActivatedRoute,
        private notify: PushNotificationService, public dialog: MatDialog, private auth: AuthenticationService,
    ) {
        this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
    }

    onMenuClick(index): void {
        let selectedMenu = this.menus[index]
        selectedMenu['qty'] = 1;

        selectedMenu.ingredients.forEach(element => {
            element['quantity'] = 1;
        })
        console.log(selectedMenu)
        const dialogRef = this.dialog.open(RestaurantMenuDialogComponent, {
            width: '500px',
            data: { dialogType: "menu", menuInfo: selectedMenu }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let menu = result;

                this.orderCart.orders.push(menu);
                console.log(menu)

                this.calculateCartCost(); ///calculate cost

            }

        });
    }


    //chnage menu order quantity in cart
    changeCartOrderQty(opt, index) {
        let order = this.orderCart.orders[index];
        let costPerOne = (order.price / order.quantity)

        if (opt == 'increase') {
            this.orderCart.orders[index].quantity++;
            this.orderCart.orders[index].price += costPerOne;


        } else {
            if (this.orderCart.orders[index].quantity > 1) {
                this.orderCart.orders[index].quantity--;
                this.orderCart.orders[index].price -= costPerOne;

            }
        }

        this.calculateCartCost(); //recalculate cost after increasing order quatity
    }

    //when reserving a table and the customer changes the number of reservation tables
    changeTableNo(mode) {
        if (mode == "decrease") {
            if (this.orderCart.table.tables > 1) this.orderCart.table.tables--;
        } else if (mode == "increase") {
            if (this.orderCart.table.tables < this.tableOptions.totalTables) {
                this.orderCart.table.tables++;
                this.calculateCartCost();
                return true
            } else {
                this.calculateCartCost();
                return false
            }
        }
        this.calculateCartCost();
    }

    //when reserving a table and the customer changes the number of reservation chairs
    changeChairNo(mode) {
        if (mode == "decrease") {
            if (this.orderCart.table.chairs > 1) this.orderCart.table.chairs--;
        } else if (mode == "increase") {
            if (this.orderCart.table.chairs < (this.tableOptions.maximumChairPertable * this.orderCart.table.tables)) {
                this.orderCart.table.chairs++
            } else if (this.changeTableNo('increase')) {
                this.orderCart.table.chairs++

            }
        }
    }

    calculateCartCost() {
        let orders = this.orderCart.orders;

        let delivery = (this.orderCart.mode == "delivery") ? this.orderCart.deliveryFee : 0;
        let reservationCost = (this.orderCart.mode == "table") ? (this.tableOptions.costPerTable * this.orderCart.table.tables) : 0;

        let subtotal = 0;
        // delivery+reservationCost; //one should automatically be 0 when the other is selected

        this.orderCart.table.cost = reservationCost;

        orders.forEach((doc, index) => {
            subtotal += doc.price;

        })

        this.orderCart.subtotal = subtotal;
        this.orderCart.total = subtotal + delivery + reservationCost;

    }


    checkoutOrder() {
        console.log(this.orderCart);
        if (this.auth.isAuthenticated()) {
            this.https.saveOrderCart(this.orderCart)
                .subscribe((response: any) => {
                    console.log(response)
                    if (response.response == 'okay') {
                        this.notify.setSuccessNotification("heyoooo......Order placed sucessfully")
                        this.router.navigate(['/customer/myorders']);
                    }
                })
        } else {
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.orderCart))
            this.router.navigate(['/signupcustomer'], {
                queryParams: {
                    restaurantID: this.orderCart.restaurantID,
                    city: this.deliveryCity
                }
            })
        }

    }


    ngOnInit() {
        this.sessionData = JSON.parse(sessionStorage.getItem(this.sessionKey))
        let params = this.route.snapshot.queryParams;
        let resID = params.restaurantID;
        let city = params.city
        this.orderCart.mode = params.orderOption;
        this.orderCart.restaurantID = resID;


        if ((!resID && !city) || (resID == "" && city == "")) {
            this.router.navigate([""])
        } else {
            this.http.geAlltRestaurantMenu({ resID: resID, city: city })
                .subscribe((response: any) => {
                    console.log(response.data.fetched.menu)
                    if (response.response == "okay") {
                        let data = response.data.fetched
                        this.hasDelivery = data.delivery;
                        this.hasPickup = data.pickup;
                        this.hasReservation = data.tReservation
                        this.menus = data.menu;
                        this.restaurantName = data.resName
                        this.deliveryCity = data.dCity;
                        this.deliveryCost = data.dCost;
                        this.tableOptions.costPerTable = data.tableOptions.costPerTable;
                        this.tableOptions.maximumChairPertable = data.tableOptions.maximumChairPerTable;
                        this.tableOptions.totalChairs = data.tableOptions.totalChairs;
                        this.tableOptions.totalTables = data.tableOptions.totalTables;
                        this.restaurantPicture=data.picture;
                        this.orderCart.deliveryFee = data.dCost ? data.dCost : 0;

                        if (this.sessionData) {
                            if (data.resID == this.sessionData.restaurantID) {
                                this.orderCart = this.sessionData;
                                sessionStorage.removeItem(this.sessionKey)
                            }
                        }
                    }

                })

        }
    }

}