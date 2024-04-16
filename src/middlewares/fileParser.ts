import { RequestHandler } from 'express';
import formidable, { File } from 'formidable';




// Define a custom interface for files
declare module 'express-serve-static-core' {
    interface Request {
        file: { [key: string]: File | File[] };
    }
}

const fileParser: RequestHandler = async (req, res, next) => {
    const form = formidable();

    const [fields, files] = await form.parse(req);

    if (!req.body) req.body = {};

    for (const key in fields) {
        const value = fields[key]?.[0];

        if (value)
            req.body[key] = value;
    }

    if (!req.file) req.file = {}; // Ensure req.files is initialized

    for (const key in files) {
        const value = files[key];

        if (value) {
            if (value.length > 1) {
                req.file[key] = value;
            } else {
                req.file[key] = value[0];
            }
        }
    }


    next();
}

export default fileParser;
