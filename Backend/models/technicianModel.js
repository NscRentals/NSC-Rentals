 import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({

    TechnicianName:{

        type: String,
        required: true
    },

    TechnicianAdd :{
        type: String,
        required: true
    }/*
    DriverPhone:{

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
    }


*/
    

});


const technician = mongoose.model('Technician', technicianSchema);
export default technician;