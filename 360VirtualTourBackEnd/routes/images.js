//import multer from 'multer'
const express = require('express')
const router = express.Router()
const Image = require("../models/image");

//const storage = multer.memoryStorage()
//const upload = multer({ storage: storage })

//Getting all
router.get('/', async (req,res) => {
	try{
		const images = await Image.find();
		res.json(images);
	} catch (err){
		res.status(500).json({message: err.message}); // error sent as json , 500 error => error on db
	}
});

//Getting one
router.get('/:id',getImage,(req,res) => {
	res.json(res.image);
});

// getting by name
router.get('/name/:name', async (req, res) => {
	//res.json({ name: req.params.name });
	try {
		const images = await Image.findOne({ name: req.params.name });
		res.json(images);
	} catch (err) {
		res.status(500).json({message:err.message})
	}
})

//Creating one
router.post('/',async (req,res) => {
	const image = new Image({
		name: req.body.name,
		est: req.body.est,
		imgDirection: req.body.imgDirection,
		dateOfImage: req.body.dateOfImage,
		description: req.body.description,
		nearCount: req.body.nearCount,
		img_name: req.body.img_name
	})

	// to save async
	try{
		const newImage = await image.save();
		res.status(201).json(newImage); // 201 -> successfully created an object 
	} catch (err){
		res.status(400).json({message: err.message}); // user bad data fail -> fail
	}
});

//Updating one
router.patch('/:id',getImage, async (req,res) => { // patch instead of put because we are updating only 1 field not the whole thing
	if (req.body.name != null){
		res.image.name = req.body.name;
	}
	if (req.body.est != null){
		res.image.est = req.body.est;
	}
	if (req.body.imgDirection != null){
		res.image.imgDirection = req.body.imgDirection;
	}
	if (req.body.dateOfImage != null){
		res.image.dateOfImage = req.body.dateOfImage;
	}
	if (req.body.description != null){
		res.image.description = req.body.description;
	}
	if (req.body.nearCount != null){
		res.image.nearCount = req.body.nearCount;
	}
	if (req.body.image_name != null){
		res.image.image_name = req.body.image_name;
	}
	try{
		const updatedImage = await res.image.save();
		res.json(updatedImage);
	}
	catch (err){
		res.status(400).json({message: err.message});
	}

});


//PATCH BY NAME
router.patch('/name/:name',getImageByName, async (req,res) => { // patch instead of put because we are updating only 1 field not the whole thing
	if (req.body.name != null){
		res.image.name = req.body.name;
	}
	if (req.body.est != null){
		res.image.est = req.body.est;
	}
	if (req.body.imgDirection != null){
		res.image.imgDirection = req.body.imgDirection;
	}
	if (req.body.dateOfImage != null){
		res.image.dateOfImage = req.body.dateOfImage;
	}
	if (req.body.description != null){
		res.image.description = req.body.description;
	}
	if (req.body.nearCount != null){
		res.image.nearCount = req.body.nearCount;
	}
	if (req.body.image_name != null){
		res.image.image_name = req.body.image_name;
	}
	try{
		const updatedImage = await res.image.save();
		res.json(updatedImage);
	}
	catch (err){
		res.status(400).json({message: err.message});
	}

});

//Deleting one
router.delete('/:id',getImage,async (req,res) => {
	try{
		await res.image.deleteOne();
		res.json({message: "Deleted image"})
	} catch(err){
		res.status(500).json({message: err.message})
	}

});


router.delete('/name/:name',getImageByName,async (req, res) => {
	//res.json({ name: req.params.name });
	try {
		const images = await Image.deleteOne({ name: req.params.name });
		res.json(images);
	} catch (err) {
		res.status(500).json({message:err.message})
	}
})


// middleware for specific id req
async function getImage(req, res, next){
	let image;
	try{
		image = await Image.findById(req.params.id); // try to get image based on id passed through the url
		if (image == null){
			return res.status(404).json({message: "Cannot find image"}); // 404 -> image missing, this return leaves the function and no longer moves forward with the request
		}
	} catch(err){
		return res.status(500).json({message: err.message});
	}
	res.image = image;
	next(); // moves on to next piece of middleware or actual request
};


async function getImageByName(req, res, next){
	let image;
	try{
		image = await Image.findOne({name:req.params.name});
		if (image == null){
			return res.status(404).json({message: "Cannot find image"}); // 404 -> image missing, this return leaves the function and no longer moves forward with the request
		}
	} catch(err){
		return res.status(500).json({message: err.message});
	}
	res.image = image;
	next(); // moves on to next piece of middleware or actual request
};



module.exports = router
