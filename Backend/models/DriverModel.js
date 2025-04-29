 import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({

    DriverID:{

        type: String,   
        required: true
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


driverSchema.pre("save", async function (next) {
    if (!this.DriverID) {
        const lastDriver = await mongoose.model("Driver").findOne().sort({ DriverID: -1 });
        this.DriverID = lastDriver ? lastDriver.DriverID + 1 : 1000; // Start from 1000
    }
    next();
});




const driver = mongoose.model('Driver', driverSchema);
export default driver;