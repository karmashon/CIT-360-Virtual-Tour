const express = require('express');
const router = express.Router();
const path = require('path');


router.get('^/$|/contentManagementInterface(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','contentManagementInterface.html'));
});

router.get('/dataFill(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','dataFill.html'));
});

router.get('/patchData(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','patchData.html'));
});

router.get('/deleteData(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','deleteData.html'));
});


router.get('/getData(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','getData.html'));
});

router.get('/patchImage(.html)?',(req,res) => {
	res.sendFile(path.join(__dirname,'..','views','patchImage.html'));
});



module.exports = router
