var dore = 0
//拖动和点击滚动条
function YDrag() {
  //起初刚加载时
  dragTime(0)
  //拖动滚动条
  var oDiv = document.getElementById("drag")
  var outDiv = document.getElementById("scrubber")
  var widthX = $(".scrubber").width()
  var leftWidth = $("#stage").offset().left
  var dargX = 0
  var Left = 0
  oDiv.onmousedown = function (ev) {
    ev = ev || event
    document.onmousemove = function (ev) {
      pauseNum = 0
      ev = ev || event
      Left = ev.clientX - leftWidth
      if (Left < 0) Left = 0
      if (Left > widthX) Left = widthX
      dragTime(Left)
    }
    document.onmouseup = function (ev) {
      document.onmousemove = null
      document.onmouseup = null
      playNum = 1
      gotoPlay(Left) //开始播放
      dragPost(Left)
    }
    return false
  }
  outDiv.onmouseup = function (ev) {
    ev = ev || event
    if (fullScreen) leftWidth = 0
    Left = ev.clientX - leftWidth
    playNum = 1
    dragTime(Left) //时间轴变化
    gotoPlay(Left) //开始播放
    dragPost(Left)
  }
}
//进度条填充部分
function dragTime(Left) {
  var k = (Left / $(".scrubber").width()) * 100 || 0
  k = Math.min(Math.max(k, 0), 100)
  $(".progress").css("width", k + "%")
  $("#drag").css("left", k + "%")
  //如果改动了前面的计时毫秒，这里也要相应的更改
  var j = Math.round((abc * k) / 1000) || 0
  $(".played").text(forMatTime(j))
}
function forMatTime(j) {
  var ex = Math.ceil(j),
    g = Math.floor(ex / 3600),
    d = Math.floor(ex / 60) % 60,
    f = ex % 60,
    k = d + ":" + (f > 9 ? f : "0" + f)
  if (g > 0) {
    k = g + ":" + k
  }
  return k
}
//将时间转换为数字
function backTime(str) {
  var ddd = str.split(":")
  var d = parseInt(ddd[0]) * 60
  var f = parseInt(ddd[1])
  var k = d + f
  return k
}
function gotoPlay(Left) {
  pageLoad()
  clearTimeout(u) //停止时间
  for (var i = 0; i < myAryR.length; i++) {
    clearTimeout(myAryR[i])
  }
  ex = backTime($(".played").text()) //获取当前时间
  for (var i = 0; i < length; i++) {
    if (myAry[i][2] > ex * 1000) {
      count = i
      backNum = i
      break
    }
  }
  zz = ex * 1000
  clearCanvas() //清除画布
  dore = 1
  imgurl()
  play()
  pauseNum = 0 //暂停播放
}
$(window).resize(function () {
  pageLoad()
})
function pageLoad() {
  var pageWidth = $(window).width()
  var pageHeight = $(window).height()
  var canvasH = pageHeight - 64
  $("#stage").width(pageWidth).height(pageHeight)
  $("#stage-inner").width(pageWidth).height(canvasH)
  $(".canvas").width(pageWidth).height(canvasH)

  var _imgW = _pageWx - 60
  var _a = pageWidth / _imgW
  var _b = canvasH / _pageHx
  if (ImgUrl.split("|").length > 1) {
    imgWidth = (_imgW / 3 - 40) * _a
    imgHeight = (_pageHx * _b) / 3 - 10
  } else {
    imgWidth = ((_imgW * 9) / 20 - 40) * _a
    imgHeight = (_pageHx * 2 * _b) / 5 - 10
  }

  _pw = _canvasWidth / _uw
  _ph = _canvasHeight / _uh
}
function teacherPicLoad() {
  if (teacherPic == "") return
  var _length = teacherPic.split("|").length
  for (var i = 0; i < _length; i++) {
    ty(i)
  }
}
function ty(i) {
  var output = new Image()
  output.src = teacherPic.split("|")[i]
  var canvas_begin = document.getElementById("canvas_begin" + i)
  var ctx = canvas_begin.getContext("2d")
  var top = 0
  var _canvasHeights = _canvasHeight
  if (i == 0) {
    top = DataUrlNum
    _canvasHeights = _canvasHeight - top
  }
  output.onload = function () {
    ctx.drawImage(output, 0, top, _canvasWidth, _canvasHeights)
    if (dore == 1) backDrawCircle() //无延时绘制图
  }
}
