// JavaScript Document
function canvasPage(canNum) {
  $(".currentPage").text(canNum + 1)
  $(".canvas")
    .eq(canNum)
    .removeClass("hide")
    .siblings(".canvas")
    .addClass("hide")
  $.paint.init(pagePerson, canNum)
}
//加载时候
function onLoadPage() {
  _pageWx = $(window).width()
  _pageHx = $(window).height()
  var canvasW = _pageWx - 60

  _px = canvasW / _canvasWidth
  _py = _pageHx / _canvasHeight

  $("#box").width(canvasW).height(_pageHx)
  $("#play_canvas").width(canvasW).height(_pageHx)
  $(".canvas").height(_pageHx).width(canvasW)
  $("#left").height(_pageHx).width(60)
  $(".list")
    .css("left", (canvasW - 320) / 2 + "px")
    .css("top", (_pageHx - 320) / 2 + "px")
  $(".xszd_list")
    .css("left", (canvasW - 320) / 2 + "px")
    .css("top", (_pageHx - 320) / 2 + "px")
  if (ImgUrl.split("|").length > 1) {
    imgWidth = _pageWx / 3 - 40
    imgHeight = _pageHx / 3
  } else {
    imgWidth = (_pageWx * 9) / 20 - 40
    imgHeight = (_pageHx * 2) / 5
  }
}
//添加画布
$("#addCanvas").click(function () {
  if (beginDraw == 0) return
  addCanvasNum++
  $(".imglist").css("top", "0px")
  $("li.up").show()
  if (addCanvasNum > 10) return
  $(".totalPage").text(addCanvasNum)
  canvasPage(addCanvasNum - 1)
  $(".eraser").removeClass("current")
  $(".pen").addClass("current")
})
//上一画布
$("#upPage").click(function () {
  $("li.down").show()
  var currentPage = parseInt($(".currentPage").text())
  var totalPage = $(".totalPage").text()
  currentPage--
  addCanvasNum--
  if (currentPage == 1) {
    $("li.up").hide()
    $(".imglist").css("top", DataUrlNum + "px")
  }
  if (currentPage == 0) return
  canvasPage(currentPage - 1)
})
//下一画布
$("#downPage").click(function () {
  $(".imglist").css("top", "0px")
  $("li.up").show()
  var currentPage = parseInt($(".currentPage").text())
  var totalPage = $(".totalPage").text()
  addCanvasNum++
  if (currentPage == totalPage - 1) $("li.down").hide()
  if (currentPage >= totalPage) return
  canvasPage(currentPage)
})
//图片加载
function imgOnLoad() {
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
}
function question() {
  var pageHeight = $(window).height()
  var c = document.getElementById("canvas0")
  var ctx = c.getContext("2d")
  ctx.font = "20px '宋体'"
  var height = (38 * pageHeight) / _canvasHeight
  var oneWidth = 36
  var length = Math.ceil(questionText.length / oneWidth)
  for (var i = 0; i <= length; i++) {
    questionMs[i] = questionText.substr(i * oneWidth, oneWidth)
    ctx.fillText(questionMs[i], 0, (i + 1) * height)
  }
  var _imgMargin = Math.round(length + 1 * height)
  DataUrlNum = height
  if ($(".currentPage").text() != "1") _imgMargin = 0
  return _imgMargin
}
//工具点击所涉及到的
$("li.li_tool").click(function () {
  $(".list").show()
})
$(".list input").click(function () {
  $(".list").hide()
})
$("#color input").click(function () {
  $("#eraser").removeClass("hover")
  $(this).addClass("hover").siblings("input").removeClass("hover")
})
$("#eraser").click(function () {
  $(this).addClass("hover")
  $("#color input.hover").removeClass("hover")
})
$("#begin").click(function () {
  ends()
})
$("#Message").click(function () {
  TextM()
})
//新手指引所涉及到的
$(".pointer").click(function () {
  $("#step" + pointer).hide()
  pointer++
  if (pointer == 13) pointer = 14
  switch (pointer) {
    case 3:
      $("#time_begin").hide()
      $("#pauseBox").show()
      $("li.li_over").hide()
      $("li.li_tool").show()
      //$("li.li_Message").show();
      break
    case 12:
      $("li.up").show()
      $("li.down").show()
      break
    case 16:
      $("li.li_tool").hide()
      //$("li.li_Message").hide();
      $("li.up").hide()
      $("li.down").hide()
      $("li.li_over").show()
      break
    case 18:
      $("li.li_luzhi").hide()
      $("li.li_look").show()
      $("li.li_restar").show()
      $("li.li_up").show()
      $("li.li_over").hide()
      break
  }
  if (pointer > 3 && pointer < 13) $(".list").show()
  else $(".list").hide()
  if (pointer > 21) {
    //结束帮助
    $("#bgCeng").hide()
    $(".pointer").hide()
    $(".xszd").hide()
    $("#step1").hide()
    $("#left li.li_luzhi input").removeAttr("style")
    $("#left li").removeAttr("style")
    $("#left li.bottomList").attr("style", "position:absolute;bottom:0px")
  }
  $("#step" + pointer).show()
})
$(".bottomList").click(function () {
  /*
	//点击帮助重新出现新手引导
	$("#bgCeng").show();
	$(".pointer").show();
	$(".xszd").show();
	$("#step1").show();	
	*/
  helpBegin()
  pointer = 1
})
$(".imglist img").live("click", function () {
  var srcs = $(this).attr("data")
  $("#bgCeng").show()
  $("#bigImg").attr("src", srcs).show()
})
$("#bigImg").click(function () {
  $("#bgCeng").hide()
  $("#bigImg").hide()
})
function helpBegin() {
  $("#left li").hide()
  $("#bgCeng").show()
  $(".pointer").show()
  $(".xszd").show()
  $("#step1").show()
  $("#left li.bottomList").show()
  $("#left li.li_luzhi").show()
  $("#left li.li_over").show()
}
function getTimes() {
  var myDate = new Date()
  var dateTime =
    myDate.getHours() * 3600000 +
    myDate.getMinutes() * 60000 +
    myDate.getSeconds() * 1000 +
    myDate.getMilliseconds()
  return dateTime
}
