 import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({

    DriverID:{

        type: Number,   
        required: false
    },

    DriverName:{

        type: String,
        required: true
    },

    DriverPhone:{

        type: String,
        required: true
    },

    DriverAdd :{
        type: String,
        required: true
    },


    DriverEmail:{

        type: String,
        required: true
    },

    DLNo:{

        type: String,
        required: true
    },

    NICNo:{

        type: String,
        required: true
    },

    DriverPW: {
            
            type: String,
            required: true
    }


});







const driver = mongoose.model('Driver', driverSchema);
export default driver;