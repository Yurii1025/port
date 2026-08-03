const mouse={

x:0,
y:0,

targetX:0,
targetY:0

}

window.addEventListener("mousemove",e=>{

mouse.targetX=
(e.clientX/window.innerWidth-.5);

mouse.targetY=
(e.clientY/window.innerHeight-.5);

});

export default mouse;