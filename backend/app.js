const express = require('express');
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require("cors")
const port = process.env.PORT || 8000;
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const {cloudinary}=require("./connection/cloudinary")
const connection= require("./connection/db")

// app.use(bodyParser.json());
app.use(cors())

// Set up a storage engine using Multer (adjust as needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const Photo = mongoose.model('Photo', {
  image:String, // Store image data as a buffer
});





app.post("/uploads", upload.single("image"), async (req, res) => {
    try {
        
        const file = req.file;
        // console.log(file)
        if (!file) {
            return res.status(404).json({ msg: "No file Found" });
        }
        // multer give buffer by default
        const image = file.buffer.toString("base64");
        // console.log(image, "Image")
        // base64 converts the binary data into ASCII characters
        cloudinary.uploader.upload(
            // it is specifying that the image is in jpeg format to upload on cloudinary
            `data:image/jpeg;base64,${image}`,
            async (err, result) => {
                if (err) {
                    return res.status(400).json({ msg: err.message });
                }
                console.log(result.secure_url)
                const user = new Photo({image:result.url})
                await user.save()
                return res.json({ msg: "New User added Succesfully", user });
            }
        );

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
});

app.listen(port, async() => {
    try {
        await connection
    } catch (err) {
        console.log(err)
    }
  console.log(`Server is running on port ${port}`);
});
