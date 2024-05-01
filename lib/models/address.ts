import mongoose from "mongoose";


const ShippingAddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    }
}, {
    timestamps: true

});

const ShippingAddress = mongoose.model('CustomerShippingAddress', ShippingAddressSchema);


export default ShippingAddress;
