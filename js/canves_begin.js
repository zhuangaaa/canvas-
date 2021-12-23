var c = 0,
  count = 0
;(d = 0),
  (z = 0),
  (end = 0),
  (endx = 0),
  (endy = 0),
  (hour = 0),
  (hour1 = 0),
  (hour2 = 0),
  (pauseNum = 1),
  (playTime = 0)
var t,
  r,
  ddd = "",
  ccc = "",
  cc = ""
var backNum = 0
var playNum = 0
var zz = 0,
  drag = 0,
  zzz = 0
var _w = $(window).width(),
  _h = $(window).height()
//简写绘画代码定义的变量
var myAry = new Array()
var myAryR = new Array()
var canvas_begin = new Array()
var ctx_begin = new Array()
var length = 0
//秒表跳动的时间定义
var ex = 0,
  f = 0
var u
function canvasBegin() {
  $(".page-current").val(1)
  length = strs.split("|").length
  ddd = strs.split("|")
  optimiCode()
  abc = Math.round(abc / 100)
  var j = Math.round(abc / 10)
  $(".duration").text(forMatTime(j))
  f = Math.round(abc / 10)
  canvas_div()
}
function optimiCode() {
  var smallLength = ddd[0].split(",").length
  for (var i = 0; i < length; i++) {
    myAry[i] = new Array()
    for (j = 0; j < smallLength; j++) {
      myAry[i][j] = ddd[i].split(",")[j]
    }
  }
  abc = myAry[length - 1][2]
  $(".page-total").text(pageTotal)
}
//绘制图形
function drawCircle() {
  //timedCounts(pauseNum);
  for (var i = count; i < length; i++) {
    r = setTimeout("timedCountsDraw(" + i + ")", myAry[i][2] - zz)
    myAryR[i] = r
  }
}
function canvas_div() {
  for (var i = 0; i < pageTotal; i++) {
    canvas_begin[i] = document.getElementById("canvas_begin" + i)
    ctx_begin[i] = canvas_begin[i].getContext("2d")
  }
}
function timedCountsDraw(num) {
  var cc = parseInt(myAry[num][9]) - 1
  $(".canvas").eq(cc).show().siblings(".canvas").hide()
  if (cc != 0) $(".imglist").css("top", "0px")
  count = num //记录暂停时候的帧数
  zz = myAry[num - 1][2] //记录暂停时上一个帧数的时间
  if (pauseNum == 0) return
  if (
    myAry[num + 1][5] == 0 &&
    myAry[num + 1][6] == 0 &&
    myAry[num + 1][7] == 0
  ) {
    ctx_begin[cc].beginPath()
    var _a = myAry[num][0]
    if (_a.indexOf("=") > -1) _a = _a.substr(1, _a.length)
    ctx_begin[cc].moveTo(_a * _pw, myAry[num][1] * _ph)
    ctx_begin[cc].strokeStyle = myAry[num][3] //画笔颜色
    ctx_begin[cc].lineWidth = myAry[num][4] //画笔粗细
    ctx_begin[cc].lineTo(myAry[num + 1][0] * _pw, myAry[num + 1][1] * _ph)
    ctx_begin[cc].stroke()
  } else {
    if (myAry[num + 1][5] == 1) {
      //橡皮差
      ctx_begin[cc].globalCompositeOperation = "destination-out"
      ctx_begin[cc].beginPath()
      ctx_begin[cc].arc(
        myAry[num + 1][0] * _pw,
        myAry[num + 1][1] * _ph,
        15,
        0,
        Math.PI * 2
      )
      ctx_begin[cc].strokeStyle = "rgba(250,250,250,0)"
      ctx_begin[cc].fill()
      ctx_begin[cc].globalCompositeOperation = "source-over"
    }
    if (myAry[num + 1][7] == 1) {
      //清除画布
      ctx_begin[cc].beginPath()
      ctx_begin[cc].clearRect(0, 0, _canvasWidth, _canvasHeight)
      imgurl()
    }
  }
  pencil(myAry[num + 1][1], myAry[num + 1][0]) //鼠标显示的点
  $(".page-current").val(myAry[num][9])
}
//无延时绘制图片方法
function backDrawCircle() {
  for (var i = 1; i < backNum; i++) {
    var cc = parseInt(myAry[i][9]) - 1
    if (cc != 0) $(".imglist").css("top", "0px")
    $(".canvas").eq(cc).show().siblings(".canvas").hide()
    if (myAry[i + 1][5] == 0 && myAry[i + 1][6] == 0 && myAry[i + 1][7] == 0) {
      ctx_begin[cc].beginPath()
      var _a = myAry[i][0]
      if (_a.indexOf("=") > -1) _a = _a.substr(1, _a.length)
      ctx_begin[cc].moveTo(_a * _pw, myAry[i][1] * _ph)
      ctx_begin[cc].strokeStyle = myAry[i][3] //画笔颜色
      ctx_begin[cc].lineWidth = myAry[i][4] //画笔粗细
      ctx_begin[cc].lineTo(myAry[i + 1][0] * _pw, myAry[i + 1][1] * _ph)
      ctx_begin[cc].stroke()
    } else {
      if (myAry[i + 1][5] == 1) {
        //橡皮差
        ctx_begin[cc].globalCompositeOperation = "destination-out"
        ctx_begin[cc].beginPath()
        ctx_begin[cc].arc(
          myAry[i + 1][0] * _pw,
          myAry[i + 1][1] * _ph,
          15,
          0,
          Math.PI * 2
        )
        ctx_begin[cc].strokeStyle = "rgba(250,250,250,0)"
        ctx_begin[cc].fill()
        ctx_begin[cc].globalCompositeOperation = "source-over"
      }
      if (myAry[i + 1][7] == 1) {
        //清除画布
        ctx_begin[cc].beginPath()
        ctx_begin[cc].clearRect(0, 0, _canvasWidth, _canvasHeight)
        imgurl()
      }
    }
    $(".page-current").val(myAry[i][9])
    pencil(myAry[i][1], myAry[i][0])
  }
}
//定义播放时的鼠标点位置
function pencil(y, x) {
  x = x * _pw
  y = y * _ph
  var tnumx = _canvasWidth / $(window).width()
  var tnumy = _canvasHeight / ($(window).height() - 64)
  var _x = Math.round(parseInt(x) / tnumx)
  var _y = Math.round(parseInt(y) / tnumy)
  $(".pencil").css({ top: _y + "px", left: _x + "px" })
}
//清除画布
function clearCanvas() {
  for (var i = 0; i < 10; i++) {
    var canvas_begin = document.getElementById("canvas_begin" + i)
    var ctx_begin = canvas_begin.getContext("2d")
    ctx_begin.clearRect(0, 0, _canvasWidth, _canvasHeight)
  }
}
function timeChange() {
  var totalWidth = $("#stage").width()
  var Left = Math.round((totalWidth * 10 * ex) / abc)
  dragTime(Left)
  starn = ex * 1000
  ex = ex + 1
  u = setTimeout("timeChange()", 1000)
  if (ex == Math.round(abc / 10) + 1) {
    $(".pause").hide()
    $(".play").show()
    playNum = 2
  }
}
//插入图片
function imgurl() {
  $(".imglist ul").text("")
  if (ImgUrl != "=" && ImgUrl != undefined && ImgUrl != "") {
    var imgs = ImgUrl.split("|").length
    for (var i = 0; i < imgs; i++) {
      var srcString = ImgUrl.split("|")[i].split("=")[0]
      var dataString = ImgUrl.split("|")[i].split("=")[1]
      if (dataString == "" || dataString == undefined) dataString = srcString
      var text =
        "<li><img src='" + dataString + "' data='" + dataString + "' /></li>"
      $(".imglist ul").append(text)
    }
  }
  $(".imglist ul li img").css({
    width: imgWidth + "px",
    height: imgHeight + "px",
  })
  $(".imglist").css("top", question() + "px")
  if (isTeacher) teacherPicLoad()
}
function question() {
  var _phs = ($(window).height() - 64) / _pageHx
  var _pageHeight = $(window).height() - 64
  var pageHeight = _pageHx
  var c = document.getElementById("canvas_begin0")
  var ctx = c.getContext("2d")
  var _sd = ($(window).height() - 64) / _canvasHeight
  var height = 20 * _sd
  ctx.font = height + "px '宋体'"
  var oneWidth = 36
  var length = Math.ceil(questionText.length / oneWidth)
  for (var i = 0; i <= length; i++) {
    questionMs[i] = questionText.substr(i * oneWidth, oneWidth)
    ctx.fillText(questionMs[i], 0, (i + 1) * height)
  }
  var _imgMargin = Math.round((length + 0.5) * height * _sd)
  DataUrlNum = height
  return _imgMargin
}
function EnterPress(e) {
  var e = e || window.event
  if (e.keyCode == 13) {
    if (parseInt($(".page-current").val()) < 1) {
      $(".page-current").val(1)
    }
    if (
      parseInt($(".page-current").val()) > parseInt($(".page-total").text())
    ) {
      $(".page-current").val($(".page-total").text())
    }
    var pagecurrent = $(".page-current").val()
    var pages = []
    //$(".imglist").css("top",question(pagecurrent)+"px");
    for (var i = 0; i < length; i++) {
      pages.push(myAry[i][9])
    }
    clearTimeout(u) //停止时间
    for (var i = 0; i < myAryR.length; i++) {
      clearTimeout(myAryR[i])
    }
    count = pages.indexOf(pagecurrent)
    if (count == 0) count = 1
    $(".canvas").eq(pagecurrent).show().siblings(".canvas").hide()
    zz = myAry[count - 1][2]
    ex = Math.round(myAry[count][2] / 1000) || 0
    $(".played").text(forMatTime(ex))
    var k = Math.round((ex * 1000) / abc)
    $(".progress").css("width", k + "%")
    $("#drag").css("left", k + "%")
    clearCanvas() //清除画布
    backDrawCircle() //无延时绘制图片
    play()
    pauseNum = 0 //暂停播放
  }
}
