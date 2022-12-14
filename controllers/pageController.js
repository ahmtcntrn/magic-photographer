import { validate } from "../utils/utils.js"
import { mail as mailler } from "../utils/utils.js"
import { donateService } from "../services/pageService.js"
import { donationIncome } from "../services/donationIncomeService.js"
import Donate from "../models/donateModel.js"
import { getFormPayment } from "../services/paymentService.js"

const indexPage = (req, res) => {
  res.render("index")
}
const aboutPage = (req, res) => {
  res.render("about")
}
const contactPage = (req, res) => {
  res.render("contact")
}
const registerPage = (req, res) => {
  res.locals.error = null
  res.render("register")
}
const loginPage = (req, res) => {
  res.locals.error = null
  res.render("login")
}
const donatePage = (req, res) => {
  res.locals.postId = req.params.photoId
  res.locals.error = null
  res.render("donate")
}
const donatePost = async (req, res) => {
  if (validate(req, res, "donate") != null) { return }
  const body = req.body
  const data = { body, photoId: req.params.photoId }
  const json = await donateService(data, req.ip)
  return (json === null) ? res.status(400).redirect("/") : res.redirect(json.url)
}

const checkInPayment = async (req, res) => {
  const json = await getFormPayment(req.body.token)
  if (json?.status == "success") {
    const donate = await Donate.findOneAndUpdate({ token: req.body.token }, { status: "true" })
    await donationIncome(donate.amount, donate.user)
  }
  else { await Donate.findOneAndUpdate({ token: req.body.token }, { status: "false" }) }
  res.redirect("/")
}
const mail = async (req, res) => {
  try {
    await mailler(req)
    res.status(200).redirect("/")
  } catch (error) {
    console.log(error)
    res.status(500).json({ succeeded: false, error })
  }
}

export { indexPage, aboutPage, contactPage, registerPage, loginPage, mail, donatePage, donatePost, checkInPayment }