import * as services from "../services/index.js"

const createUser = async (req, res) => {
    try {
        const json = await services.user.createUser(req.body)
        res.status(201).json({ json })
    } catch (error) {
        console.log(error)
        res.status(500).json({ succeded: false, error })
    }
}

const login = async (req, res) => {
    try {
        const json = await services.user.login(req)
        return (json.status == true) ? res.cookie("jwt", json.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }).redirect("/user/control-board") : res.status(500).json({ json })
    } catch (error) {
        console.log(error)
        res.status(500).json({ succeded: false, error })
    }
}

const controlBoard = async (req, res) => {
    try {
        return res.status(201).render("controlBoard")
    } catch (error) {
        console.log(error)
        res.status(500).json({ succeded: false, error })
    }
}
const logOut = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(201).redirect("/")
    } catch (error) {
        console.log(error)
        res.status(500).json({ succeded: false, error })
    }
}




export { createUser, login, controlBoard, logOut }