


export type OrderItemType = {
    name: string;
    quantity: number;
    photo: string;
    price: number;
    productId: string;
}

export type ShippingInfoType = {
    address: string;
    city: string;
    country: string;
    state : string;
    pinCode: number;
}


export interface NewOrderRequestType {
    shippingInfo: ShippingInfoType;
    user: string;
    tax: number;
    shippingCharges: number;
    total: number;
    subtotal: number;
    discount: number;
    orderItems: [OrderItemType];

}


export interface IOrder extends NewOrderRequestType {
    status: "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
}
