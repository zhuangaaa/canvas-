/*
//定义全局变量
*/
var abc = 0, //文字录入总时长
  pagePerson = 1, //坐标和画布的比例
  beginDraw = 0, //控制是否可以画
  strs = "", //生成的画布文件
  ImgUrl = "=", //获取过来的图片，格式为：缩略图1=大图1|缩略图2=大图2|缩略图3=大图3
  questionText = "", //获取传过来的问题描述
  firstTime = 0, //获取老师是不是第一次登陆从而产生新手引导
  DataURL = "", //最后生成的题目图片
  pers = 0, //点击暂停的次数
  hourAll = 0, //所有点暂停时产生的时间和
  hour1 = new Array(), //记录暂停和结束的时间值
  hour2 = new Array(), //记录点开始按钮的时间值
  questionMs = new Array(), //将文字描述拆分为数组
  a = 0, //
  pageTotal = 0, //总页数
  DataUrlNum = 0, //文字描述一共占用的高度
  addCanvasNum = 1, //控制画布数量
  pointer = 1 //新手引导点击的次数

//2014-7-4 整理代码新加的变量
var _pageW = $(window).width(), //页面宽度
  _pageH = $(window).height(), //页面高度
  _canvasW = 740, //画布绝对值宽度
  _canvasH = 480, //画布绝对值高度
  qImgLength = 0 //获取到的图片的个数
;(qImgLength = 0), //回答问题时候图片的宽度
  (qImgHeight = 0), //回答问题是图片的高度
  (checkNum = false), //false为回答问题，true为检查作业
  u

//赋值
hour1[0] = 0
