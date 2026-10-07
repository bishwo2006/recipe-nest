import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Public path to image
            required: true,
        },
        link: {
            type: String,
            default: '#',
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
export default Advertisement;
