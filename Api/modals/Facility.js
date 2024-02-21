import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
    
    facilities_id: Number,
    facilities_name: String,

})
export default mongoose.model("Facility", facilitySchema)