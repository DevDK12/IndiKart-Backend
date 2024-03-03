


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
    pincode: number;
}


export interface NewOrderRequestType {
    shippingInfo: ShippingInfoType;
    user: string;
    tax: number;
    shippingCharge: number;
    total: number;
    subtotal: number;
    discount: number;
    orderItems: [OrderItemType];

}


export interface OrderSchemaType extends NewOrderRequestType {
    status: "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
}
