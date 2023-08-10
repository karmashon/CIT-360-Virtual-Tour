const express = require('express')
const router = express.Router()
const multer = require('multer');
const crypto = require('crypto');
const fetch = require("node-fetch");

const path = require('path');

require('dotenv').config();

//const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const { S3Client, PutObjectCommand,GetObjectCommand,DeleteObjectCommand } = require("@aws-sdk/client-s3");
//const { access } = require('fs');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccesskey = process.env.SECRET_ACCESS_KEY;
const passwd = process.env.SITE_PASSWD;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccesskey,
    }
})

router.get('/bucketname',async(req,res) => {
    res.send(bucketName);
})

router.get('/get/:name', async (req, res) => {
    const img_name = req.params.name;
    const getObjectParams = {
        Bucket: bucketName,
        Key: img_name,
    }
    try{

		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		//res.redirect(url);
		res.json({"url":url});
		//console.log(url);
	}
    catch(err){
		return res.status(404).json({message: err.message});
    }
})


router.post('/get', async (req, res) => {
    const img_name = req.body.bname;
    console.log(img_name);
    const getObjectParams = {
        Bucket: bucketName,
        Key: img_name,
    }
    try{
		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		res.redirect(url);
    }
    catch (err){
		return res.status(404).json({message: err.message});
    }
})

router.post('/send', upload.single('myImage'), async (req, res) => {
	if (passwd !== req.body.passwd){
		return res.status(500).json({message: "Wrong Password"});
	}
    const randomNameValue = req.body.bname;
    console.log(req.body);
    const params = {
        Bucket: bucketName,
        Key: randomNameValue,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    try{
		const command = new PutObjectCommand(params)
		await s3.send(command);
		res.send({message: "Success"});
		await fetch(process.env.DB_SITE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"passwd": req.body.passwd,
				"name": req.body.bname,
				"est": req.body.est,
				"imgDirection": req.body.NSEW,
				"description": {
					"departmentOrCenterOrLandmark": req.body.dept_center_landmark,
					"about": req.body.about,
					"directorOrHead": req.body.directorOrHead,
					"websiteLink": req.body.website_link,
					"audioLink": req.body.audio_link,
					"nearByBuildings": {
						"building1": {
							"name": req.body.building1name,
							"position": req.body.building1pos
						},
						"building2": {
							"name": req.body.building2name,
							"position": req.body.building2pos
						},
						"building3": {
							"name": req.body.building3name,
							"position": req.body.building3pos
						},
						"building4": {
							"name": req.body.building4name,
							"position": req.body.building4pos
						},
						"building5": {
							"name": req.body.building5name,
							"position": req.body.building5pos
						},
						"building6": {
							"name": req.body.building6name,
							"position": req.body.building6pos
						}
					}

				},
				"nearCount": req.body.nearCount,
				"img_name": randomNameValue
			})
		}).then(res => res.json())
			.then(data => console.log(data))
    }
    catch (err){
		return res.status(500).json({message: err.message});
    }
})


//IMAGE PATCH S3
router.post('/patchimage', upload.single('myImage'), async (req, res) => {
    //console.log("req.body",req.body);
    //console.log("req.file", req.file);
	if (passwd !== req.body.passwd){
		return res.status(500).json({message: "Wrong Password"});
	}
    const randomNameValue = req.body.bname;
    const params = {
        Bucket: bucketName,
        Key: randomNameValue,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    try{
		const command = new PutObjectCommand(params)
		await s3.send(command);
		res.send({message: "Success"});
    }
    catch(err){
		return res.status(500).json({message: err.message});
    }
})

//DB INFO PATCH
router.post('/update',upload.single('myImage'),async (req,res) => {
	if (passwd !== req.body.passwd){
		return res.status(500).json({message: "Wrong Password"});
	}
    const randomNameValue = req.body.bname;

	try{
		/* DATA RECEIVED FROM DB */
		const response = await fetch(process.env.DB_SITE+'name/'+randomNameValue);
		const data = await response.json();

		/* DELETING */
		await fetch(process.env.DB_SITE+'name/' + randomNameValue, {
		  method: 'DELETE',
		})
			.then(res => res.text()) // or res.json()
			.then(res => console.log(res))


		/* PATCHING */
		function equals(data1,data2){
			return (data1=="" ||  typeof data1 == 'undefined' || typeof data1== null || data1.length===0)?data2:data1;
		}
		function nbb(data){
			return (((data.description).nearByBuildings));
		}
		await fetch(process.env.DB_SITE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"name": randomNameValue,
				"est": equals(req.body.est,data.est),
				"imgDirection": equals(req.body.NSEW,data.imgDirection),
				"description": {
					"departmentOrCenterOrLandmark": equals(req.body.dept_center_landmark,(data.description).departmentOrCenterOrLandmark),
					"about": equals(req.body.about,(data.description).about),
					"directorOrHead": equals(req.body.directorOrHead,(data.description).directorOrHead),
					"websiteLink": equals(req.body.website_link,(data.description).websiteLink),
					"audioLink": equals(req.body.audio_link,(data.description).audioLink),
					"nearByBuildings": {
						"building1": {
							"name": equals(req.body.building1name,(nbb(data).building1).name),
							"position": equals(req.body.building1pos,(nbb(data).building1).position)
						},
						"building2": {
							"name": equals(req.body.building2name,(nbb(data).building2).name),
							"position": equals(req.body.building2pos,(nbb(data).building2).position)
						},
						"building3": {
							"name": equals(req.body.building3name,(nbb(data).building3).name),
							"position": equals(req.body.building3pos,(nbb(data).building3).position)
						},
						"building4": {
							"name": equals(req.body.building4name,(nbb(data).building4).name),
							"position": equals(req.body.building4pos,(nbb(data).building4).position)
						},
						"building5": {
							"name": equals(req.body.building5name,(nbb(data).building5).name),
							"position": equals(req.body.building5pos,(nbb(data).building5).position)
						},
						"building6": {
							"name": equals(req.body.building6name,(nbb(data).building6).name),
							"position": equals(req.body.building6pos,(nbb(data).building6).position)
						}
					}

				},
				"nearCount": equals(req.body.nearCount,data.nearCount),
				"img_name": randomNameValue
			})
		}).then(res => res.json())
			.then(data => console.log(data))

		res.json({message: "Success"});
	}
	catch (err){
		console.log("in update");
		return res.status(500).json({message: err.message});
	}
})

//DELETE COMMAND TODO: UPDATE
router.post('/delete',async (req,res) => {
    //console.log(req.body);
	if (passwd !== req.body.passwd){
		return res.status(500).json({message: "Wrong Password"});
	}
    const building_name = req.body.bname;
    const deleteObjectParams = {
        Bucket: bucketName,
        Key: building_name,
    }
    //console.log('in here');
	// audio
	try{
		const audioName = building_name+"_audio.mp3";
		const deleteObjectParams1 = {
			Bucket: bucketName,
			Key: audioName,
		}
		const command1 = new DeleteObjectCommand(deleteObjectParams1);
		await s3.send(command1);
	}
	catch(err){
		console.log(err);
	}
	// image
	try{
		const imgName = building_name+"_1";
		const deleteObjectParams2 = {
			Bucket: bucketName,
			Key: imgName,
		}
		const command2 = new DeleteObjectCommand(deleteObjectParams2);
		await s3.send(command2);
	}
	catch(err){
		console.log(err);
	}

	try{
		const command = new DeleteObjectCommand(deleteObjectParams);
		await s3.send(command);

		await fetch(process.env.DB_SITE+'name/' + building_name, {
		  method: 'DELETE',
		})
			.then(res => res.text()) // or res.json()
			.then(res => console.log(res))
		res.json({message: "Success"});
	}
	catch (err){
		return res.status(500).json({message: err.message});
	}
});

module.exports = router
/* END OF S3 METHODS*/
