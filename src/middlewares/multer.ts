import multer from 'multer';
import { v4 as uuid } from 'uuid';



const storage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const fileExt = file.originalname.split('.').pop();

        return cb(null, uuid() + '.' + fileExt);
    }
})



const upload = multer({storage: storage});




export const uploadSingle = upload.single('photo');










