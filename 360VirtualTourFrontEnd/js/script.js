const sceneE = document.getElementById('cameras');
const backendWebsiteURL = 'https://cegvirtualtourbackend.onrender.com/';
const cloudfrontURL = 'https://d1yiyt8gtbx7gi.cloudfront.net/';
if (AFRAME.utils.device.isMobile()){
	sceneE.innerHTML+=`<a-entity id="cam" camera position="0 1.6 0" look-controls wasd-controls><a-entity cursor="fuse:true;fuseTimeout:500" geometry="primitive:ring;radiusInner:0.01;radiusOuter:0.02" position="0 0 -1.8" material="shader:flat;color:green" animation__mouseenter="property:scale;to:3 3 3;startEvents:mouseenter;endEvents:mouseleave;dir:reverse;dur:500;loop:1"></a-entity></a-entity>`
	console.log("yes");
}
else{
	sceneE.innerHTML+=`<a-camera id="cam" position="0 1.6 0" look-controls-enabled="true" wasd-controls-enabled="false"><a-cursor id="cursor" material="shader:flat;color:green" animation__click="property: scale; from: 0.1 0.1 0.1; to: 2 2 2; easing: easeInCubic; dur: 150; startEvents: click" animation__clickreset="property: scale; to: 0.1 0.1 0.1; dur: 1; startEvents: animationcomplete__click" animation__mouseenter="property:scale;to:2 2 2;startEvents:mouseenter;dur:300;" animation__mouseleave="property:scale;from:2 2 2;to:1 1 1;startEvents:mouseleave;dur:300"></a-cursor></a-camera>`
	console.log("no");
}
var playing = false;
var count = 1;
var noAudio = false;
AFRAME.registerComponent('spot', {
	schema:{
	  name:{type:"string",default:""}
	},

	init:function(){
	  //add image source of hotspot icon
	  //this.el.setAttribute("src","#hotspot");
	  //make the icon look at the camera all the time
	  this.el.setAttribute("look-at","#cam");

	  var data=this.data;
      const transports = document.getElementById('transports');

	const aboutE = document.getElementById('about');
	const headE = document.getElementById('head');
	const websiteLinkE = document.getElementById('websiteLink');
	const picE = document.getElementById('pic');
	const audioE = document.getElementById('audio');
	const bgmMuteE = document.getElementById("mute");


	  this.el.addEventListener('click',function(){


		async function fetchWithTimeout(resource, options = {}) {
			  const { timeout = 8000 } = options;
			  
			  const controller = new AbortController();
			  const id = setTimeout(() => controller.abort(), timeout);

			  const response = await fetch(resource, {
				...options,
				signal: controller.signal  
			  });
			  clearTimeout(id);

			  return response;
		}
		function getNBB(inJson){return ((inJson.description).nearByBuildings)}

		function getNameAndPositionNBB(nbbData,Bnumber){
			let output = nbbData;
			switch (Bnumber) {
			  case 0:
				output = output.building1;
				break;
			  case 1:
				output = output.building2;
				break;
			  case 2:
				output = output.building3;
				break;
			  case 3:
				output = output.building4;
				break;
			  case 4:
				output = output.building5;
				break;
			  case 5:
				output = output.building6;
				break;
			  default:
				console.log(404);
				output = {};
			}

			return output;
		}
		function updateNearby(inJson){
			transports.innerHTML = "";
			let nearCount = inJson.nearCount;
			console.log("nearCount: "+nearCount);
			let nbbData = getNBB(inJson);
			// stuff to update on each spot is 1. buildingname 2. position
			const spotsDoc = document.getElementById('spots');
			spotsDoc.innerHTML = "";
			//console.log(spotsDoc.innerHTML);
			for (let i = 0;i<nearCount;i++){
				let nbb_i =getNameAndPositionNBB(nbbData,i); 
				var posVal = nbb_i.position;
				spotsDoc.innerHTML += `<a-image id="spot${i+1}" spot="name:${nbb_i.name}" scale="1 1 1" position="${posVal}" src ="#arrow"></a-image>`;
				var first_space = nbb_i.position.indexOf(" ");
				var last_space = nbb_i.position.lastIndexOf(" ");
				var posX = posVal.slice(0,first_space);
				var posY = posVal.slice(first_space+1,last_space)-1;
				var posZ = posVal.substring(last_space);
				transports.innerHTML += `<a-entity id="transport${i+1}" lookatcam visible="true" position="${posX + " " + posY + " " + posZ}"><a-text value="${nbb_i.name}" color="white" scale="2 2 2" position="-1.2 0 0"></a-text></a-entity>`;
				console.log(nbb_i.position.x);

			}
		}
		//set the skybox source to the new image as per the spot
		async function getImage(imgName,img_link_db){
			if (count) {
				count -= 1;
				var source = document.querySelectorAll("[sound]");
				source[0].components.sound.playSound();
				console.log("Playing bgm");
			}
			else{
				var boxTrigger = document.getElementById("closeButton");
				var box = document.getElementById('info');
				if (box.object3D.visible == true) {
					boxTrigger.emit('click');
				}
				
			}
			var sky = document.getElementById("skybox");
			//sky.setAttribute("src",data.url);
			sky.setAttribute("src", cloudfrontURL + imgName);
			console.log("no");
		}

		async function descriptionUpdate(data){

			console.log((data.description).departmentOrCenterOrLandmark);
			aboutE.setAttribute('value',(data.description).about);
			if ((data.description).departmentOrCenterOrLandmark!=="landmark"){
				var DCL="Head: ";
				headE.setAttribute('value',DCL+(data.description).directorOrHead);
			}
			else{
				headE.setAttribute('value',"");
			}
			websiteLinkE.setAttribute('href',(data.description).websiteLink);


			var panel = document.getElementById('panel');
			if ((data.description).departmentOrCenterOrLandmark!=="intersection"){
				console.log("showing");
				panel.setAttribute('visible', 'true');
				bgmMuteE.setAttribute('visible','true');

                try {
					var response = await fetch(cloudfrontURL+data.name + "_1");
					if (response.status=="200"){
						picE.setAttribute("visible","true");
						picE.setAttribute("src", cloudfrontURL+data.name + "_1");
						console.log("worked");
					}
					else{
						picE.setAttribute("visible","false");
						console.log("Status: "+ response.status);
					}
                }
                catch (err) {
                    console.log("caught: "+err);
                    picE.setAttribute("scale", "0 0 0");
                }
				try {
					var audioURL = cloudfrontURL+"360Tour_Audio_Clips/" + data.name + "_audio.mp3";
					var response = await fetch(audioURL);
					if (response.status!="200"){
						audioURL = cloudfrontURL+ data.name + "_audio.mp3";
						response = await fetch(audioURL);
					}
					if (response.status=="200"){
						console.log(response.status);
						noAudio = false;
						audioE.setAttribute("sound", "src:" + audioURL + ";")
						console.log("worked");
					}
					else{
						console.log("in sound");
						console.log("Status: "+ response.status);
						audioE.setAttribute("sound", "volume", 0);
						noAudio = true;
					}
				}
				catch (err) {
					console.log("audiocaught: " + err);
				}
			}
			else{
				console.log("not showing");
				panel.setAttribute('visible','false');
				bgmMuteE.setAttribute('visible','false');
			}
		}
		async function getData(img_link_db) {
			try{
				const response = await fetchWithTimeout(img_link_db,{timeout:500});
				const Data = await response.json();
				const json = JSON.stringify(data);
				updateNearby(Data);
				descriptionUpdate(Data);
				console.log("Received Data");
			} catch(error){
				transports.innerHTML = "";
				var sky = document.getElementById("skybox");
				//sky.setAttribute("src",data.url);
				//sky.setAttribute("src", cloudfrontURL + imgName);
				sky.setAttribute("src", "server_start.jpg");
				console.log("no");
				console.log(error.name==="AbortError");
				//window.location.reload();
				setTimeout(() => {window.location.reload();}, 40000);
			}
		}
		/* PANEL CHANGES*/
        //<!--about,head,websiteLink,pic-->


		//console.log(JSON.stringify(this.el.id));
		console.log("inside: "+data.name);
		getImage(data.name);
		//getData('http://localhost:3500/images/name/'+data.name);
		getData(backendWebsiteURL+'images/name/'+data.name);
	  });
	},
	update: function(oldData){
		//console.log("previously:"+JSON.stringify(oldData));
		console.log("now"+JSON.stringify(this.data)+" "+JSON.stringify(this.el.id));
	}
});
// Component to make element look at camera
AFRAME.registerComponent('lookatcam', {
	init: function () {
		console.log("Added camera looker");
		this.el.setAttribute("look-at", "#cam");
	}
});

// Component to play and stop audio on mouse enter and leave
AFRAME.registerComponent('audioplayer', {
	init: function () {
		console.log("Created audio player");
		this.el.addEventListener('click', function () {
			var sources = document.querySelectorAll("[sound]");
			console.log("Toggling");
			if (!noAudio) {
				if (!playing) {
					console.log("Playing sound");
					sources[1].components.sound.playSound();
					sources[0].components.sound.pauseSound();
					playing = true;
				}
				else {
					console.log("Stopped sound");
					sources[1].components.sound.stopSound();
					sources[0].components.sound.playSound();
					playing = false;
				}
			}
		});
	}

});
// Component to make the info display visible or invisible on click
AFRAME.registerComponent('openbox', {
	init: function () {
		this.el.addEventListener('click', function () {
			var pic = document.getElementById('pic');
			//var head = document.getElementById('head');
			var picExists;
			//var headExists;
			if (pic.object3D.visible == true) {
				console.log("Image exists");
				picExists = true;
			}
			else {
				console.log("No image");
				picExists = false;
			}

			var box = document.getElementById('info');
			var descBox = document.getElementById('panelsE');
			var sources = document.querySelectorAll("[sound]");
			//console.log(box.getAttribute('visible'));
			if (box.object3D.visible == false) {
				console.log("Opening box");
				box.object3D.visible = true;
				box.object3D.scale.set(1, 1, 1);
				descBox.object3D.visible = false;
				descBox.object3D.scale.set(0, 0, 0);
				if (picExists) {
					document.getElementById("toggle").setAttribute("position", "3.5, 1.5, 0");
					document.getElementById("audioLink").setAttribute("position", "8.5, 1.5, 0");
					document.getElementById("website").setAttribute("position", "4.5, 0.5, 0");
					document.getElementById("websiteLink").setAttribute("position", "8.5, 0.5, 0");
					document.getElementById("head").setAttribute("position", "3.5, -1, 0");
				}
				else {
					document.getElementById("toggle").setAttribute("position", "1.5, 1.5, 0");
					document.getElementById("audioLink").setAttribute("position", "6.5, 1.5, 0");
					document.getElementById("website").setAttribute("position", "2.5, 0.5, 0");
					document.getElementById("websiteLink").setAttribute("position", "6.5, 0.5, 0");
					document.getElementById("head").setAttribute("position", "1, -1, 0");
				}
				if (!noAudio) {
					sources[1].components.sound.playSound();
					sources[0].components.sound.pauseSound();
					playing = true;
				}
			}
			else {
				console.log("Closing box");
				box.object3D.visible = false;
				box.object3D.scale.set(0, 0, 0);
				descBox.object3D.visible = true;
				descBox.object3D.scale.set(1, 1, 1);
				if (!noAudio) {
					sources[1].components.sound.stopSound();
					sources[0].components.sound.playSound();
					playing = false;
				}
			}
		});
	}
});
// Component to make background panel unclickable
AFRAME.registerComponent("noclick", {
	init: function () {
		this.el.removeAttribute("data-clickable");
	}
});

// Resets the description audio once it finishes playing
AFRAME.registerComponent("soundreset", {
	init: function () {
		this.el.addEventListener("sound-ended", function () {
			playing = false;
			var source = document.querySelectorAll("[sound]");
			source[0].components.sound.playSound();
			console.log("Sound ended");
		});
	}
});

AFRAME.registerComponent('togglebgm', {
	init: function () {
		
		this.el.addEventListener("click", function () {
			var source = document.querySelectorAll("[sound]");
			if (source[0].components.sound.data.volume > 0) {
				console.log("Muted");
				source[0].setAttribute("sound", "volume", 0);
			}
			else{
				console.log("Unmuted");
				source[0].setAttribute("sound", "volume", 1);

			}
		})
	}
});
