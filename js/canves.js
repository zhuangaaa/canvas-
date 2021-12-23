var atrs = 0 //X坐标最后的集合
var atrs_y = 0 //Y坐标最后的集合
var hour = 0 //每个步骤的系统时间集合
var xpc = 0 //开始使用橡皮
var xingz = 0 //特殊形状的代码，0是没有，1是圆形，2是矩形
var colors = "red" //所用到颜色
var font_weight = 2 //画笔的粗细的宽度
var clearNum = 0 //是否清除画布
$.paint = {
  init: function (pagePerson, canvasIndex) {
    this.load(pagePerson, canvasIndex)
  },
  load: function (pagePerson, canvasIndex) {
    this.x = [] //记录鼠标移动是的X坐标
    this.y = [] //记录鼠标移动是的Y坐标
    this.hours = [] //记录鼠标移动所记录的当前毫秒数
    this.clickDrag = []
    this.lock = false //鼠标移动前，判断鼠标是否按下
    this.isEraser = false //判断橡皮擦是否启用
    this.isYuan = false //判断是否开始画圆圈
    this.isJux = false //判断是否开始画矩形
    this.eraserRadius = 15 //擦除半径值
    this.color = ["#000000", "#FF0000", "#80FF00"] //画笔颜色值
    this.fontWeight = [2, 5, 8]
    var colors = $("#color input.hover").index()
    font_weight = this.fontWeight[$("#font input.hover").index()]
    this.storageColor = this.color[colors]
    this.$ = function (id) {
      return typeof id == "string" ? document.getElementById(id) : id
    }
    this.canvas = this.$("canvas" + canvasIndex)
    if (this.canvas.getContext) {
    } else {
      alert("您的浏览器不支持 canvas 标签")
      return
    }
    this.cxt = this.canvas.getContext("2d")
    this.cxt.lineJoin = "round" //context.lineJoin - 指定两条线段的连接方式
    this.cxt.lineWidth = 2 //线条的宽度
    this.iptClear = this.$("clear") //清除画布
    //this.huab = this.$("huab"); //清除所有，成为画笔模式
    //this.begin = this.$("begin"); //结束讲课
    this.upBox = this.$("upBox") //上传
    this.restar = this.$("restar") //重新录制
    this.time_begin = this.$("time_begin") //开始讲课
    this.pauseBox = this.$("pauseBox") //暂停录制
    //this.TextM = this.$("Message"); //输入文字
    this.lookBox = this.$("lookBox") //播放预览
    this.w = this.canvas.width //取画布的宽
    this.h = this.canvas.height //取画布的高
    this.touch = "createTouch" in document //判定是否为手持设备
    this.StartEvent = this.touch ? "touchstart" : "mousedown" //支持触摸式使用相应的事件替代
    this.MoveEvent = this.touch ? "touchmove" : "mousemove"
    this.EndEvent = this.touch ? "touchend" : "mouseup"
    this.bind()
  },
  bind: function () {
    var t = this
    /*清除画布*/
    this.iptClear.onclick = function () {
      t.clear()
      imgOnLoad()
      atrs = 0
      atrs_y = 0
    }
    function getTime() {
      var myDate = new Date()
      hour =
        myDate.getHours() * 3600000 +
        myDate.getMinutes() * 60000 +
        myDate.getSeconds() * 1000 +
        myDate.getMilliseconds()
    }
    /*获取坐标组合*/
    /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
    this.canvas["on" + t.StartEvent] = function (e) {
      $(".list").hide()
      var touch = t.touch ? e.touches[0] : e
      var _x = touch.clientX - touch.target.offsetLeft //鼠标在画布上的x坐标，以画布左上角为起点
      var _y = touch.clientY - touch.target.offsetTop //鼠标在画布上的y坐标，以画布左上角为起点
      _x = Math.round(parseInt(_x) / _px)
      _y = Math.round(parseInt(_y) / _py)
      getTime()
      if (t.isEraser) {
        xpc = 1
        t.movePoint(_x, _y)
        t.resetEraser()
      } else {
        xpc = 0
        xingz = 0
        t.movePoint(_x, _y) //记录鼠标位置
        t.drawPoint() //绘制路线
      }
      t.lock = true
    }
    /*鼠标移动事件*/
    this.canvas["on" + t.MoveEvent] = function (e) {
      var touch = t.touch ? e.touches[0] : e
      if (t.lock) {
        //t.lock为true则执行
        var _x = touch.clientX - touch.target.offsetLeft //鼠标在画布上的x坐标，以画布左上角为起点
        var _y = touch.clientY - touch.target.offsetTop //鼠标在画布上的y坐标，以画布左上角为起点
        _x = Math.round(parseInt(_x) / _px)
        _y = Math.round(parseInt(_y) / _py)
        getTime()
        if (t.isEraser) {
          xpc = 1
          t.movePoint(_x, _y)
          t.resetEraser()
        } else {
          xpc = 0
          xingz = 0
          t.movePoint(_x, _y, true) //记录鼠标位置
          t.drawPoint() //绘制路线
        }
      }
    }
    this.canvas["on" + t.EndEvent] = function (e) {
      /*重置数据*/
      t.lock = false
      t.x = []
      t.y = []
      t.clickDrag = []
      clearInterval(t.Timer)
      t.Timer = null
      types()
      return false
    }
    this.changeColor()
    /*橡皮擦*/
    this.$("eraser").onclick = function (e) {
      t.isEraser = true
    }
    //this.$("huab").onclick = function(e) {
    //t.isEraser = false;
    //};
  },
  movePoint: function (x, y, dragging) {
    /*将鼠标坐标添加到各自对应的数组里*/
    this.hours.push(hour)
    this.x.push(x)
    this.y.push(y)
    this.clickDrag.push(y)
  },
  //橡皮擦
  resetEraser: function (x, y, radius) {
    if (beginDraw == 0) return
    for (var i = 0; i < this.x.length; i++) {
      this.cxt.globalCompositeOperation = "destination-out"
      this.cxt.beginPath()
      this.cxt.arc(this.x[i], this.y[i], 15, 0, Math.PI * 2)
      this.cxt.strokeStyle = "rgba(250,250,250,0)"
      this.cxt.fill()
      this.cxt.globalCompositeOperation = "source-over"
      hour = this.hours
      atrs = this.x
      atrs_y = this.y
    }
  },
  drawPoint: function (x, y, radius) {
    if (beginDraw == 0) return
    for (
      var i = 0;
      i < this.x.length;
      i++ //循环数组
    ) {
      this.cxt.beginPath() //context.beginPath() , 准备绘制一条路径
      if (this.clickDrag[i] && i) {
        //当是拖动而且i!=0时，从上一个点开始画线。
        this.cxt.moveTo(this.x[i - 1], this.y[i - 1]) //context.moveTo(x, y) , 新开一个路径，并指定路径的起点
      } else {
        this.cxt.moveTo(this.x[i] - 1, this.y[i])
      }
      this.cxt.lineTo(this.x[i], this.y[i]) //context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
      this.cxt.strokeStyle = this.storageColor
      this.cxt.lineWidth = font_weight
      this.cxt.closePath() //context.closePath() , 如果当前路径是打开的则关闭它
      this.cxt.stroke() //context.stroke() , 绘制当前路径
      hour = this.hours
      atrs = this.x
      atrs_y = this.y
    }
  },
  changeColor: function () {
    /*为按钮添加事件*/
    var t = this,
      iptNum = this.$("color").getElementsByTagName("input"),
      fontIptNum = this.$("font").getElementsByTagName("input")
    for (var i = 0, l = iptNum.length; i < l; i++) {
      iptNum[i].index = i
      iptNum[i].onclick = function () {
        t.cxt.save()
        t.cxt.strokeStyle = t.color[this.index]
        t.storageColor = t.color[this.index]
        t.cxt.strokeStyle = t.storageColor
        t.isEraser = false
        colors = t.storageColor
        //$("#eraser").removeClass("current");
        //$("#huab").addClass("current");
      }
    }
    for (var i = 0, l = fontIptNum.length; i < l; i++) {
      t.cxt.save()
      fontIptNum[i].index = i
      fontIptNum[i].onclick = function () {
        t.changeBackground(this.index)
        t.cxt.lineWidth = t.fontWeight[this.index]
        font_weight = t.fontWeight[this.index]
        t.cxt.strokeStyle = t.storageColor
        t.isEraser = false
        colors = t.storageColor
      }
    }
  },

  changeBackground: function (num) {
    //添加画笔粗细的提示背景颜色切换，灰色为当前
    var fontIptNum = this.$("font").getElementsByTagName("input")
    for (var j = 0, m = fontIptNum.length; j < m; j++) {
      fontIptNum[j].className = ""
      if (j == num) fontIptNum[j].className = "hover"
    }
  },
  getUrl: function () {
    this.$("html").innerHTML = this.canvas.toDataURL()
  },
  /*清除画布方法*/
  clear: function () {
    //var ha=hour.split(",");
    var myDate = new Date()
    hourClear =
      myDate.getHours() * 3600000 +
      myDate.getMinutes() * 60000 +
      myDate.getSeconds() * 1000 +
      myDate.getMilliseconds()
    this.cxt.clearRect(0, 0, this.w, this.h) //清除画布，左上角为起点
    var currentPage = parseInt($(".currentPage").text())
    strs += "0,0," + hourClear + ",#000,5,0,0,1,0," + addCanvasNum + "|"
  },
}
//开始讲课
this.time_begin.onclick = function () {
  $("#pauseBox").removeClass("hide")
  $("#time_begin").addClass("hide")
  $("li.li_tool").removeClass("hide")
  //$("li.li_Message").removeClass("hide");
  $("li.li_over").addClass("hide")
  begin()
}
//上传
this.upBox.onclick = function () {
  upBox()
}
//重新录制
this.restar.onclick = function () {
  restar()
}
//暂停录制
this.pauseBox.onclick = function () {
  $("#pauseBox").addClass("hide")
  $("#time_begin").removeClass("hide")
  $("li.li_tool").addClass("hide")
  //$("li.li_Message").addClass("hide");
  $("li.li_over").removeClass("hide")
  $(".list").hide()
  pers++
  pauseBox()
}
//预览播放
this.lookBox.onclick = function () {
  pers++
  lookBox()
}
function types() {
  //将时间，坐标列成数组
  if (hour[hour.length - 1] == undefined) return
  var hourL = 0,
    hourY = 0
  for (var i = 0; i < atrs.length; i++) {
    hourL = i + (hour.length - atrs.length)
    hourY = hour[hourL - 1]
    if (hourL == 0) {
      hourY = hour2[0]
    }
    hi = hour[hourL] - hourAll - hour2[0]
    strs +=
      atrs[i] +
      "," +
      atrs_y[i] +
      "," +
      hi +
      "," +
      colors +
      "," +
      font_weight +
      "," +
      xpc +
      "," +
      xingz +
      "," +
      clearNum +
      "," +
      pers +
      "," +
      addCanvasNum +
      "|"
  }
  strs += "="
}
