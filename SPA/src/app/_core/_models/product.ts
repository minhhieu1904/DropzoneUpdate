export interface Product {
    product_ID: number;
    product_Name: string;
    time_Sale: number;
    content: string;
    price: number;
    amount: number;
    isSale: boolean;
    discount: number;
    price_Sale: string;
    from_Date_Sale: Date;
    to_Date_Sale: Date;
    new: boolean;
    hot_Sale: boolean;
    status: boolean;
    update_By: string;
    update_Time: Date;
    product_Cate_ID: string;
}