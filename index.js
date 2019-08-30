// creat by zdchen

window.onload = function () {
  let $imgWrap = document.querySelector('.infoList')
  initPage($imgWrap)
  EventFunc($imgWrap)
}
// 是否正在拖动
let mouseAbout = false
// 定时触发旋转计算单位
let piece = 0
// 当前旋转值
let currRotate = 0
let moveLengthX = 0
let isOnClick = false

const initPage = ($imgWrap) => {
  let imgList = $imgWrap.querySelectorAll('.item')
  let len = imgList.length

  for (let i = 0; i < len; i++) {
    imgList[i].style.transform = `rotateY(${45 * i}deg) translateZ(500px)`
    imgList[i].style.transition = `1s linear ${(len - 1 - i)*0.2}s`
    imgList[i].addEventListener('click', () => {
      showCurrentPage($imgWrap, imgList[i], i)
    })
  }

  window.setInterval(function () {
    // 如果正在推拽，停止定时器触发运动
    if (mouseAbout || isOnClick) return false
    piece++
    let degNum = currRotate + piece * 0.4
    if (degNum >= 360) {
      degNum -= 360
      currRotate = 0
      piece = 0
    }
    
    $imgWrap.style.transform = `rotateY(${degNum}deg)`
  }, 30)
}

const EventFunc = ($imgWrap) => {
  mouseFunc($imgWrap)
}

const showCurrentPage = ($imgWrap, $item, index) => {
  // 点击时无拖拽则认定为点击
  if (Math.abs(moveLengthX) > 10) return false
  isOnClick = !isOnClick
  if (!isOnClick) return false
  let currentDeg = 360 - index * 45
  $imgWrap.style.transform = `rotateY(${currentDeg === 360 ? 0 : currentDeg}deg)`
  $imgWrap.style.transition = `1s linear`
  // TODO 点击之后对当前点击item放大
}

const mouseFunc = ($imgWrap) => {
  let firstX = 0
  let currX = 0
  document.onmousedown = (e) => {
    // 拖拽开始时，获取当前rotat值，便于拖拽平稳进行
    mouseAbout = true
    moveLengthX = 0
    let currRotate = getRotate($imgWrap)
    firstX = e.clientX

    $imgWrap.onmousemove = (e) => {
      currX = e.clientX
      moveLengthX = currX - firstX
      let degNum = currRotate + moveLengthX * 0.1
      if (degNum >= 360) {
        degNum -= 360
      }
      $imgWrap.style.transform = `rotateY(${degNum}deg)`
    }

    document.onmouseup = (e) => {
      // 拖拽完毕时，获取当前rotate值，便于定时器运动平稳性
      mouseAbout = false
      currRotate = getRotate($imgWrap)
      piece = 0
      $imgWrap.onmousemove = null
    }
  }
}



// 获取当前rotate的值
const getRotate = ($el) => {
  let str = $el && $el.style.transform
  
  return str && +str.split('(')[1].split('deg)')[0]
}