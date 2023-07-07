import midtransClient from 'midtrans-client'

export const paymentMidtrans = async (dataPayment) => {
    let { 
        payment_type, 
        payment_method, 
        orderId, 
        order_total,
        item_details,
        customer_details,
        shipping_address,
    } = dataPayment
    order_total = parseInt(order_total)
    try{
        let coreApi = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: 'SB-Mid-server-mLL8ijkGNaNpWymfz-CFWlCb',
            clientKey: 'SB-Mid-client-82dlgHsaoRGF719e'
        })
        let parameter
        if(item_details.length > 1) {
            parameter = {
                "payment_type": payment_type,
                "transaction_details": {
                    "gross_amount": order_total,
                    "order_id": orderId
                },
                "bank_transfer": {
                    "bank": payment_method
                },
                "item_details": item_details,
                "customer_details": customer_details,
                "shpping_address": shipping_address
            }
        }else {
            parameter = {
                "payment_type": payment_type,
                "transaction_details": {
                    "gross_amount": order_total,
                    "order_id": orderId
                },
                "bank_transfer": {
                    "bank": payment_method
                },
                "item_details": item_details[0],
                "customer_details": customer_details,
                "shpping_address": shipping_address
            }
        }
        return await coreApi.charge(parameter)
    }catch(error) {
        console.info(error)
    }
}
export const paymentNotification = async (resultPay) => {
    try{
        const coreApi = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: 'SB-Mid-server-mLL8ijkGNaNpWymfz-CFWlCb',
            clientKey: 'SB-Mid-client-82dlgHsaoRGF719e'
        })
        return await coreApi.transaction.notification(resultPay)
    }catch(error) {
        console.info(error)
    }
}
export const statusPayment = async (orderId) => {
    try{
        const coreApi = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: 'SB-Mid-server-mLL8ijkGNaNpWymfz-CFWlCb',
            clientKey: 'SB-Mid-client-82dlgHsaoRGF719e'
        })
        return await coreApi.transaction.status(orderId)
    }catch(error) {
        console.info(error)
    }
}