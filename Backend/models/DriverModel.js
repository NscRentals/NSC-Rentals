import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    DriverID: {
        type: String,
        unique: true
    },
    DriverName: {
        type: String,
        required: true
    },
    DriverPhone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
        }
    },
    DriverAdd: {
        type: String,
        required: true
    },
    DriverEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    DLNo: {
        type: String,
        required: true,
        unique: true
    },
    NICNo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.length === 10;
            },
            message: props => `${props.value} is not a valid NIC number! Must be 10 characters.`
        }
    },
    DriverPW: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Pre-save middleware to generate DriverID
driverSchema.pre("save", async function (next) {
    try {
        if (!this.DriverID) {
            const lastDriver = await this.constructor.findOne({}, { DriverID: 1 }).sort({ DriverID: -1 });
            const nextId = lastDriver ? String(Number(lastDriver.DriverID) + 1) : "1000";
            this.DriverID = nextId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Create and export the model
const Driver = mongoose.model("Driver", driverSchema);
export default Driver;