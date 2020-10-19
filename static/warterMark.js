'use strict'

let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 150
  can.height = 120

  let cans = can.getContext('2d')

  /*var imgObj = new Image();
  imgObj.src = "img_mark_jl.png";
  imgObj.onload = function(){
    cans.drawImage(imgObj,0,0,268,50);
  };*/


  cans.rotate(-20 * Math.PI / 180)
  cans.font = '20px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.50)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 3, can.height / 2)

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '70px'
  div.style.left = '0px'
  div.style.position = 'absolute'
  div.style.zIndex = '100000'
  div.style.width = '100%'
  div.style.height = '100%'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  //div.style.background = 'url("../../../assets/images/lhq/img_mark_jl.png") left top repeat'
  //document.body.appendChild(div)
  let oldEle = document.getElementsByClassName('canvImg');
  for(let i=0;i<oldEle.length;i++){
    oldEle[i].appendChild(div);
    //oldEle[i].parentNode.insertBefore( div,oldEle[i] );
  }
  //oldEle.parentNode.appendChild(div);
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark
