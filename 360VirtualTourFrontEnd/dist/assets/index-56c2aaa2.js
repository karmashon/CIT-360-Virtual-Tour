(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function p(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(n){if(n.ep)return;n.ep=!0;const i=p(n);fetch(n.href,i)}})();const b="https://virtualtourtest.onrender.com/";AFRAME.registerComponent("spot",{schema:{name:{type:"string",default:""}},init:function(){this.el.setAttribute("look-at","#cam");var o=this.data;const s=document.getElementById("transports"),p=document.getElementById("about"),l=document.getElementById("head"),n=document.getElementById("websiteLink");document.getElementById("pic"),this.el.addEventListener("click",function(){function i(t){return t.description.nearByBuildings}function d(t,r){let e=t;switch(r){case 0:e=e.building1;break;case 1:e=e.building2;break;case 2:e=e.building3;break;case 3:e=e.building4;break;case 4:e=e.building5;break;case 5:e=e.building6;break;default:console.log(404),e={}}return e}function y(t){s.innerHTML="";let r=t.nearCount;console.log("nearCount: "+r);let e=i(t);const f=document.getElementById("spots");f.innerHTML="";for(let u=0;u<r;u++){let c=d(e,u);var a=c.position;f.innerHTML+=`<a-image id="spot${u+1}" spot="name:${c.name}" scale="1 1 1" position="${a}" src ="arrowFin.png"></a-image>`;var m=c.position.indexOf(" "),g=c.position.lastIndexOf(" "),E=a.slice(0,m),O=a.slice(m+1,g)-1,k=a.substring(g);s.innerHTML+=`<a-entity id="transport${u+1}" lookatcam visible="true" position="${E+" "+O+" "+k}"><a-plane material="shader:flat;color:black;opacity:0.7" scale="2.5 1 1"></a-plane><a-text value="${c.name}" color="white" scale="2 2 2" position="-1.2 0 0"></a-text></a-entity>`,console.log(c.position.x)}}async function h(t,r){const e=b+"s3/get/",a=await(await fetch(e+t,{method:"GET",headers:{mode:"cors",cache:"no-cache"}})).json();var m=document.getElementById("skybox");console.log("yes"),m.setAttribute("src",a.url),console.log("no")}async function v(t){if(console.log(t.description.departmentOrCenterOrLandmark),p.setAttribute("value","About: "+t.description.about),t.description.departmentOrCenterOrLandmark!=="landmark"){var r="";t.description.departmentOrCenterOrLandmark=="dept"?r="HOD: ":t.description.departmentOrCenterOrLandmark=="center"&&(r="Diretor: "),l.setAttribute("value",r+t.description.directorOrHead)}else l.setAttribute("value","");n.setAttribute("href",t.description.websiteLink);var e=document.getElementById("panel");e.setAttribute("visible","true")}async function A(t){const e=await(await fetch(t)).json();JSON.stringify(o),y(e),v(e)}console.log("inside: "+o.name),h(o.name),A(b+"images/name/"+o.name)})},update:function(o){console.log("now"+JSON.stringify(this.data)+" "+JSON.stringify(this.el.id))}});AFRAME.registerComponent("lookatcam",{init:function(){console.log("Added camera looker"),this.el.setAttribute("look-at","#cam")}});AFRAME.registerComponent("audioplayer",{init:function(){console.log("Created audio player"),this.el.addEventListener("mouseenter",function(){var o=document.querySelector("[sound]");o.components.sound.playSound()}),this.el.addEventListener("mouseleave",function(){var o=document.querySelector("[sound]");o.components.sound.stopSound()})}});AFRAME.registerComponent("openbox",{init:function(){this.el.addEventListener("click",function(){var o=document.getElementById("info");o.object3D.visible==!1?o.setAttribute("visible",!0):o.setAttribute("visible",!1)})}});
