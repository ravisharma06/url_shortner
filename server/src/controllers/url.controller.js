import Url from '../models/url.model.js';
import { generateCode } from '../utils/generateCode.js';

async function urlRegisterController(req, res) {
    try {
        const { originalUrl } = req.body;


        const isURlExists = await Url.findOne({ originalUrl });
        if (isURlExists) {
            return res.status(400).json({
                message: 'URL already exists',
                success: false,
            });
        }

        const shortCode = generateCode();
        const url = await Url.create({
            originalUrl,
            shortCode,
            clicks: 0,
        });

        res.status(201).json({
            message: 'URL registered successfully',
            success: true,
            response: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                clicks: url.clicks,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/urls:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

async function getUrlController(req, res) {

    try {
        const urls = await Url.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "urls fetched successfully",
            success: true,
            response: urls
        })
    }
    catch (error) {
        console.error('Error in GET /api/urls:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,

        })
    }
}

async function deleteUrlController(req, res) {

    try {
        const { shortCode } = req.params;

        if (!shortCode) {
            return res.status(400).json({
                message: "shortCode is required",
                success: false,
            })
        }

        const url = await Url.findOneAndDelete({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "URL not found",
                success: false,
            })
        }

        res.status(200).json({
            message: "URL deleted successfully",
            success: true,
            response: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                clicks: url.clicks,
            }
        })

    }
    catch (error) {
        console.error('Error in DELETE /api/urls/:shortCode:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }

}


async function redirectUrlController(req, res) {

    try {

        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({
                message: "shortCode is required",
                success: false,
            })
        }

        const url = await Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({
                message: "URL not found",
                success: false,
            })
        }

        await Url.findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } }, { new: true });
        res.redirect(302, url.originalUrl);


    }
    catch (error) {
        console.error('Error in GET /api/:shortCode:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}




export { urlRegisterController, getUrlController, deleteUrlController, redirectUrlController };