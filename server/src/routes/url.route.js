import express from 'express'
import { urlRegisterController, getUrlController,deleteUrlController,redirectUrlController } from '../controllers/url.controller.js';
import validateUrl from '../validator/url.validator.js';
const urlRoute = express.Router()

/**
 * @route GET /api/health
 * @desc check if server is healthy or working
 * @access Public
 */
urlRoute.get("/health", (req, res) => {
    res.status(200).json({
        message: "server is healthy or working",
        success: true
    })
})


/**
 * @route POST /api/urls
 * @description  register a new url and provide a short url in response use   the original url provided in the request body check the validate the original url and if it is valid then generate a short code for the url and save it in the database and return the short url in the response and click count should be 0 in the response
 * @access Private
 */

urlRoute.post("/url", validateUrl, urlRegisterController)



/**
 * @route GET /api/urls
 * @description  fetch all registered urls with response containing original url, short code and click count for each url
 * @access Public
 */
urlRoute.get("/urls", getUrlController)


/**
 * @route DELETE /api/urls/:shortCode
 * @description  delete a registered url by short code and return a success message in the response
 * @access Private
 */


urlRoute.delete("/url/:shortCode", deleteUrlController)



/**
 * @route GET /api/:shortCode
 * @description  redirect to the original url by short code and increment the click count for the url in the database
 * @access Public
 */


urlRoute.get("/:shortCode", redirectUrlController)

export default urlRoute;