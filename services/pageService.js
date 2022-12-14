import Donate from "../models/donateModel.js"
import Photo from "../models/photoModel.js"
import { initializeCheckoutForm } from "./paymentService.js"


const donateService = async (data, ip) => {
    const photo = await Photo.findById(data.photoId)
    data.body.user = photo.user
    data.body.photo = data.photoId
    const donate = await Donate.create(data.body)
    const pay = await initializeCheckoutForm(donate, ip)
    await Donate.findByIdAndUpdate(donate.id, { token: pay.token })
    if (pay?.status == false) {
        await Donate.findByIdAndUpdate(donate._id, { status: "false" })
    }
    return pay
}


export { donateService }