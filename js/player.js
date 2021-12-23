;(function (d) {
  //鼠标滑动涉及到的JS
  var b = ["DOMMouseScroll", "mousewheel"]
  if (d.event.fixHooks) {
    for (var a = b.length; a; ) {
      d.event.fixHooks[b[--a]] = d.event.mouseHooks
    }
  }
  d.event.special.mousewheel = {
    setup: function () {
      if (this.addEventListener) {
        for (var e = b.length; e; ) {
          this.addEventListener(b[--e], c, false)
        }
      } else {
        this.onmousewheel = c
      }
    },
    teardown: function () {
      if (this.removeEventListener) {
        for (var e = b.length; e; ) {
          this.removeEventListener(b[--e], c, false)
        }
      } else {
        this.onmousewheel = null
      }
    },
  }
  d.fn.extend({
    mousewheel: function (e) {
      return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
    },
    unmousewheel: function (e) {
      return this.unbind("mousewheel", e)
    },
  })
  function c(k) {
    var i = k || window.event,
      g = [].slice.call(arguments, 1),
      l = 0,
      j = true,
      f = 0,
      e = 0
    k = d.event.fix(i)
    k.type = "mousewheel"
    if (i.wheelDelta) {
      l = i.wheelDelta / 120
    }
    if (i.detail) {
      l = -i.detail / 3
    }
    e = l
    if (i.axis !== undefined && i.axis === i.HORIZONTAL_AXIS) {
      e = 0
      f = -1 * l
    }
    if (i.wheelDeltaY !== undefined) {
      e = i.wheelDeltaY / 120
    }
    if (i.wheelDeltaX !== undefined) {
      f = (-1 * i.wheelDeltaX) / 120
    }
    g.unshift(k, l, f, e)
    return (d.event.dispatch || d.event.handle).apply(this, g)
  }
})(jQuery)
;(function () {
  //全屏用到的js
  var d = {
      supportsFullScreen: false,
      isFullScreen: function () {
        return false
      },
      requestFullScreen: function () {},
      cancelFullScreen: function () {},
      fullScreenEventName: "",
      prefix: "",
    },
    c = "webkit moz o ms khtml".split(" ")
  if (typeof document.cancelFullScreen != "undefined") {
    d.supportsFullScreen = true
  } else {
    for (var b = 0, a = c.length; b < a; b++) {
      d.prefix = c[b]
      if (typeof document[d.prefix + "CancelFullScreen"] != "undefined") {
        d.supportsFullScreen = true
        break
      }
    }
  }
  if (d.supportsFullScreen) {
    //判断刚开始时候的全屏
    d.fullScreenEventName = d.prefix + "fullscreenchange"
    d.isFullScreen = function () {
      switch (this.prefix) {
        case "":
          return document.fullScreen
        case "webkit":
          return document.webkitIsFullScreen
        default:
          return document[this.prefix + "FullScreen"]
      }
    }
    d.requestFullScreen = function (e) {
      //点开全屏
      fullScreen = true
      return this.prefix === ""
        ? e.requestFullScreen()
        : e[this.prefix + "RequestFullScreen"]()
    }
    d.cancelFullScreen = function (e) {
      fullScreen = false
      return this.prefix === ""
        ? document.cancelFullScreen()
        : document[this.prefix + "CancelFullScreen"]()
    }
  }
  if (typeof jQuery != "undefined") {
    jQuery.fn.requestFullScreen = function () {
      return this.each(function () {
        if (d.supportsFullScreen) {
          d.requestFullScreen(this)
        }
      })
    }
  }
  window.fullScreenApi = d
})()
//接下来开始是正文
var AFD = {}
AFD.utils = {}
AFD.player = {}
;(function () {
  //判断用户浏览器
  var b = 0
  var c = ["ms", "moz", "webkit", "o"]
  for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
    window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"]
    window.cancelAnimationFrame =
      window[c[a] + "CancelAnimationFrame"] ||
      window[c[a] + "CancelRequestAnimationFrame"]
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (i, e) {
      var d = new Date().getTime()
      var f = Math.max(0, 16 - (d - b))
      var g = window.setTimeout(function () {
        i(d + f)
      }, f)
      b = d + f
      return g
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (d) {
      clearTimeout(d)
    }
  }
})()
;(function (b) {
  function a() {
    //判断鼠标事件
    var e = (this._event_handles = {}),
      c = 0
    function d() {
      return "e" + ++c
    }
    this.on = function (g, f, i) {
      i = i || f.hashid || d()
      if (!e[g]) {
        e[g] = {}
      }
      if (!e[g][i]) {
        f.hashid = i
        e[g][i] = f
      }
    }
    this.un = function (g, f) {
      if (!f) {
        e[g] = {}
        return
      }
      var i = f
      if (typeof f === "function") {
        i = f.hashid
      }
      if (e[g] && e[g][i]) {
        e[g][i] = null
        delete e[g][i]
      }
    }
    this.fire = function (g, i) {
      var f = Array.prototype.slice.call(arguments, 1)
      if (e[g]) {
        $.each(e[g], function (j, l) {
          l.apply(null, f)
        })
      }
    }
  }
  b.utils.event = a
})(AFD)
;(function (b) {
  var a = {}
  $.extend(a, {
    parse: function (c) {
      c = c || location.href
      var d = c.replace(/\#.*$/, "").replace(/^[^?]*\?*/, "")
      var e = c.replace(/^[^#]*#?/, "")
      var f = {}
      $.each(d.split("&"), function (g, j) {
        var k = j.split("=")
        f[k[0]] = decodeURIComponent(k[1] || "")
      })
      return {
        href: c,
        search: d,
        hash: e,
        params: f,
      }
    },
    getParam: function (d, e) {
      if (typeof e == "undefined") {
        e = d
        d = location.href
      }
      var c = a.parse(d)
      return c.params[e]
    },
  })
  b.utils.URI = a
})(AFD)
;(function (d) {
  function b() {
    this.callbacks = $.Callbacks()
    this.called = 0
    this.cache = []
    this.defaultHandles = []
  }
  function a(f) {
    var e = $.type(f)
    return e == "object" || e == "function" || e == "array"
  }
  function c(g, i) {
    if (!(a(g) && a(i))) {
      return false
    }
    for (var f in i) {
      if (i.hasOwnProperty(f)) {
        var e = i[f],
          j = a(e)
        if ((j && !c(g[f], e)) || (!j && e !== g[f])) {
          return false
        }
      }
    }
    return true
  }
  $.extend(b.prototype, {
    on: function (f, i) {
      var e = this
      function g(j) {
        if (c(j, f)) {
          i(j)
          e.called++
        }
      }
      this.cache.push([g, i])
      this.callbacks.add(g)
      return this
    },
    un: function (f) {
      for (var e = this.cache.length - 1; e >= 0; e--) {
        if (this.cache[e] && this.cache[e][1] === f) {
          this.callbacks.remove(this.cache[e][0])
          this.cache.splice(e, 1)
        }
      }
      return this
    },
    onDefault: function (e) {
      this.defaultHandles.push(e)
    },
    fire: function (g) {
      this.callbacks.fire(g)
      if (this.called === 0) {
        for (var f = 0, e = this.defaultHandles.length; f < e; f++) {
          this.defaultHandles[f](g)
        }
      }
      this.called = 0
      return this
    },
  })
  d.utils.listens = b
})(AFD)
;(function (c) {
  function b(f, e, j) {
    ;(this.duration = e.key), (this.limit = e.limit)
    this.start = e.start
    if (this.duration < this.limit) {
      return false
    }
    var i = this
    function g(k) {
      if (typeof e.ok == "function") {
        e.ok.apply(i, arguments)
      }
    }
    function d(m) {
      var l = ~~(e.key / 2),
        k = $.extend({}, e, {
          key: l,
          start: i.start,
        })
      if (typeof e.fail == "function") {
        e.fail.apply(i, arguments)
      }
      a(f, k, j)
      a(
        f,
        $.extend({}, k, {
          start: i.start + l,
        }),
        j
      )
    }
    return [g, d]
  }
  function a(e, d, g) {
    var f = g || {}
    f[d.name] = d.key
    f.start = d.start
    var i = new b(e, d, f)
    if (i) {
      $.getJSON(e, f).success(i[0]).fail(i[1])
    }
  }
  c.utils.request = a
})(AFD)
;(function (c) {
  //绘画画布
  function a(d) {
    this.init(d)
  }
  a.isSupport = function () {
    var e = document.createElement("canvas")
    var d = !!(e && e.getContext)
    e = null
    return d
  }
  $.extend(a.prototype, {
    init: function (d) {
      this.element = $(d).get(0)
      if (!this.element) {
        this.element = document.createElement("canvas")
      }
      this.context = this.element.getContext("2d")
      return this
    },
    setStyle: function (d) {
      b(this.context, d || {}, this)
    },
    line: function (g, d, e) {
      //绘画直线
      this.setStyle(e)
      var f = this.context
      f.beginPath()
      f.moveTo(g[0], g[1])
      f.lineTo(d[0], d[1])
      f.closePath()
      f.stroke()
    },
    lines: function (f, g, e) {
      this.line(g, e, f)
      if (arguments.length > 3) {
        var d = Array.prototype.splice.call(arguments, 1, 1)
        this.lines.apply(this, d)
      }
    },
    area: function (e, f, r, q, p) {
      //获取时间
      var s = new Date().getTime(),
        n = this.context.createImageData(f, r),
        d = n.data
      for (var m = 0, g = f * r; m < g; m++) {
        var k = m * 4
        $.each(c.color(q[m] || 0, p), function (j, i) {
          d[k + j] = i
        })
      }
      this.context.putImageData(n, e[0], e[1])
      var o = new Date().getTime()
    },
    fillRect: function (e, i, g, d, f) {
      if (f) {
        this.setStyle({
          fillStyle: f,
        })
      }
      this.context.fillRect(e, i, g, d)
    },
    putData: function (e, d, f) {
      if (!e) {
        return
      }
      this.context.putImageData(e, d || 0, f || 0)
    },
    mergeData: function (l, e, m) {
      var f = this.getImageData(e, m, l.width, l.height)
      var d = l.width * l.height
      for (var k = 0; k < d; k++) {
        if (l.data[k * 4 + 3] > 0) {
          for (var g = 0; g < 4; g++) {
            f.data[k * 4 + g] = l.data[k * 4 + g]
          }
        }
      }
      this.putData(f, e, m)
    },
    makeTransparent: function (n, k, e) {
      var l = this.getImageData(n[0], n[1], k, e),
        d = k * e
      for (var g = 0; g < d; g++) {
        if (l.data[g * 4 + 3] == 255) {
          var m = true
          for (var f = 0; f < 4; f++) {
            m = m && l.data[g * 4 + f] == 255
          }
          if (m) {
            l.data[g * 4 + 3] = 0
          }
        }
      }
      this.putData(l, n[0], n[1])
    },
    image: function (d, f, g, n, m, l, j) {
      var i = new Image()
      var e = this.context
      var k = this
      i.loaded = false
      i.onload = function () {
        if (k) {
          k.drawImage.call(k, i, f[0], f[1], g || i.width, n || i.height, j)
        }
        if (m) {
          m(this)
        }
        this.loaded = true
      }
      if (l) {
        i.onerror = l
      }
      i.src = d
      return i
    },
    drawImage: function (i, f, j, g, e, d) {
      this.context.drawImage(i, f, j, g || i.width, e || i.height)
      if (d) {
        this.makeTransparent([f, j], g || i.width, e || i.height)
      }
      i = null
    },
    loadImage: function (g, f, d, j) {
      var i = new a()
      i.setStyle({
        width: f,
        height: d,
      })
      var e = i.image(g, [0, 0], f, d, function (k) {
        j(i)
      })
      return i
    },
    getImageData: function (e, g, f, d) {
      f = f || this.element.width
      d = d || this.element.height
      return this.context.getImageData(e || 0, g || 0, f, d)
    },
    text: function (e, d, g, f) {
      if (f) {
        this.setStyle(f)
      }
      this.context.fillText(e, d, g)
    },
    clear: function () {
      this.context.clearRect(0, 0, this.element.width, this.element.height)
    },
  })
  function b(e, f, d) {
    $.each(f, function (i, g) {
      if (b[i]) {
        b[i](e, g, d)
      }
    })
  }
  $.extend(b, {
    color: function (e, d) {
      var f = d
      if ($.isNumeric(d)) {
        return b.color(e, c.color.parse(d))
      }
      if ($.isArray(d)) {
        f = (d.length == 3 ? "rgb" : "rgba") + "(" + d.join(",") + ")"
      }
      e.strokeStyle = f
    },
    lineWidth: function (e, d) {
      e.lineWidth = d
    },
    width: function (f, d, e) {
      e.element.width = d
    },
    height: function (e, f, d) {
      d.element.height = f
    },
    viewWidth: function (f, d, e) {
      $(e.element).width(d)
    },
    viewHeight: function (e, f, d) {
      $(d.element).height(f)
    },
    font: function (f, d, e) {
      f.font = d
    },
    fillStyle: function (f, d, e) {
      f.fillStyle = d
    },
  })
  c.canvas = a
})(AFD.player)
;(function (b) {
  function a(d, e) {
    e = e || 0
    var c = ["parse", "erase", "getList", "getRepeat"]
    return a[c[e]](d)
  }
  a.defaultColor = (function () {
    var c = []
    c[0] = 4294967295
    c[1] = 0
    c[2] = 4294967295
    c[3] = 4278255615
    c[4] = 4294902015
    c[5] = 4278190335
    c[6] = 4291611852
    c[7] = 4287137928
    c[8] = 4282664004
    c[9] = 4294967040
    c[10] = 4278255360
    c[11] = 4294901760
    c[12] = 4278190080
    return c
  })()
  a.parse = function (e) {
    var d = (e >>> 0).toString(16).split("")
    while (d.length < 8) {
      d.unshift("0")
    }
    var c = []
    for (var f = 0; f < 4; f++) {
      c[f] = parseInt(["0x", d[2 * f], d[2 * f + 1]].join(""))
    }
    return c
  }
  a.getRGBA = function (c) {
    var d = a.parse(c).reverse()
    return d
  }
  a.getRepeat = function (c) {
    return [c, c, c, 255]
  }
  a.getList = function (c) {
    return a.getRGBA(a.defaultColor[c])
  }
  a.erase = function (c) {
    return a.getList(c || 0)
  }
  b.color = a
})(AFD.player)
;(function (a) {
  a.config = {
    DEBUG: true,
    baseUrl: "/",
    courseUrl: "/kejian?",
    snapBaseUrl: "http://www.aifudao.com/kejian?action=page&sid=",
    audioBaseUrl: "http://210.14.147.28/sound/",
    resourceBaseUrl: "http://aifudao.com/ppts/",
    cmdLen: 16000,
    snapGap: 300,
    SyncCommandTypeCoData: "SyncData",
    SyncCommandTypeDockView: "SyncDockview",
    SyncCommandTypeDrawLines: "syncDrawLines",
    defaultWidth: 1024,
    defaultHeight: 768,
    pageMaxWidth: 680,
    lastCoursePPTId: 45881,
  }
})(AFD.player)
;(function (b) {
  function a(c) {
    b.utils.event.call(this)
    var d = this
    this.app = c
    this.tempcanvas = new b.player.canvas()
    this.dockviewListener = new b.utils.listens()
    this.init()
  }
  $.extend(a.prototype, {
    exec: function (d) {
      var c = this[d.Type]
      if (c) {
        c.call(this, d)
      }
    },
    init: function () {
      var c = this
      this.app.on("data:courseInfoLoaded", function (d) {
        c.tempcanvas.setStyle({
          width: d.width,
          height: d.height,
        })
      })
      this.app.on("seek", function () {})
      this.dockviewListener.on(
        {
          Left: 0,
          Top: 0,
          Bottom: 1,
          Right: 1,
        },
        function (d) {
          c.fire("cmd:dockview:close", d)
        }
      )
      this.dockviewListener.on(
        {
          Left: 0,
          Top: 0,
          Bottom: 1,
          Right: 2,
        },
        function (d) {
          c.fire("cmd:dockview:mini", d)
        }
      )
      this.dockviewListener.on(
        {
          Left: 0,
          Top: 0,
          Bottom: 1,
          Right: 3,
        },
        function (d) {
          c.fire("cmd:dockview:max", d)
        }
      )
      this.dockviewListener.onDefault(function (d) {
        if (d.Right > 0 && d.Bottom > 0) {
          c.fire("cmd:dockview:open", d)
        }
      })
    },
    SyncDrawline: function (d) {
      var c = this
      requestAnimationFrame(function () {
        var f = d.ColorType >= 0 && d.ColorType <= 12 ? 2 : 0
        var e = b.player.color(d.ColorType, f)
        c.app.stage.lines(
          {
            color: e,
            lineWidth: 3,
          },
          d.Msecond,
          d.Coordinate
        )
      })
    },
    SyncData: function (g) {
      var d = [],
        f = this
      var e = g.Right - g.Left + 1,
        c = g.Bottom - g.Top + 1
      $.each(g.Pixels, function (l, j) {
        if (g.ColorType == 3) {
          $.each(b.player.color.getRGBA(j), function (n, k) {
            d[l * 4 + n] = k
          })
        } else {
          var i = b.player.color(j)
          var m = i[2]
          i[2] = i[0]
          i[0] = m
          str = "0x"
          $.each(i, function (n, o) {
            var k = o.toString(16)
            if (k.length < 2) {
              k = "0" + k
            }
            str += k
          })
          d[l] = parseInt(str, 10)
        }
      })
      requestAnimationFrame(function () {
        f.app.stage.area([g.Left, g.Top], e, c, d, g.ColorType, g.Msecond)
      })
    },
    SyncDockview: function (c) {
      this.dockviewListener.fire(c)
    },
    SyncResource: function (c) {
      this.fire("cmd:resorce:exec", c)
    },
    SyncImage: function (d) {
      var c = this
      requestAnimationFrame(function () {
        var g = "data:image/jpeg;base64," + d.Image,
          f = d.Right - d.Left + 1,
          e = d.Bottom - d.Top + 1
        c.app.stage.drawImage([d.Left, d.Top], f, e, g, d.Msecond)
      })
    },
    SyncRotate: function (c) {
      this.fire("cmd:SyncRotate:exec", c)
    },
  })
  b.player.cmd = a
})(AFD)
;(function (b) {
  function a(c) {
    this.view = c
    this.status = {
      activeTime: 0,
      display: true,
    }
    this.init()
  }
  $.extend(a.prototype, {
    init: function () {
      var f = this,
        e = {
          progress: null,
          volume: null,
          toolbarDisplay: null,
        }
      this.seekHanding = false
      if (this.view.isMobile) {
        $(".volume-bar").hide()
      }
      if (this.view.isMobile) {
        $(".player .play").live({
          touchstart: function (k) {
            f.view.app.play()
            return false
          },
        })
        $(".player-cover .play").live({
          touchstart: function (k) {
            f.view.app.loading()
            return false
          },
        })
        $(".player .pause").live({
          touchstart: function (k) {
            f.view.app.pause()
            return false
          },
        })
      } else {
        $(".player .play").live({
          click: function (k) {
            f.view.app.play()
            return false
          },
        })
        $(".player-cover .play").live({
          click: function (k) {
            f.view.app.loading()
            return false
          },
        })
        $(".player .pause").live({
          click: function (k) {
            f.view.app.pause()
            return false
          },
        })
      }
      function c(o, l) {
        var n = 0,
          k = 1,
          m = $(".scrubber").width()
        if (l && l.changedTouches && l.changedTouches[0]) {
          k = Math.round(l.changedTouches[0].pageX)
        } else {
          k = o.pageX
        }
        n = Math.round(((k - $(".scrubber").offset().left) / m) * 100) || 0
        n = Math.min(Math.max(n, 0), 100)
        return n
      }
      function g(m, k) {}
      function j(m, k) {}
      function d(l, k) {}
      $(".player .scrubber").live({
        click: function (l) {
          var k = c(l)
          f.view.seek(k)
          clearTimeout(e.progress)
          f.seekHanding = false
          l.preventDefault()
          l.stopPropagation()
        },
        "mousedown touchstart": d,
        "mousemove touchmove": g,
        mouseout: function (k) {
          if (f.seekHanding) {
            $("#page")
              .off("mousemove touchmove", g)
              .on("mousemove touchmove", g)
              .off("mouseup touchend", j)
              .on("mouseup touchend", j)
          } else {
            $("#page").off("mousemove touchmove", g).off("mouseup touchend", j)
          }
        },
        "mouseup touchend": j,
      })
      $(".player .volume-scrubber").live({
        click: function (l) {
          var k = l.offsetX / $(this).width() || 0
          k = Math.min(Math.max(k, 0), 1)
          f.setVolume(k)
          l.preventDefault()
          l.stopPropagation()
        },
        mousedown: function (k) {
          $(this).data("hover", true)
          clearTimeout(e.volume)
          e.volume = setTimeout(function () {
            $(".player .volume-scrubber").data("hover", false)
          }, 1000)
          k.preventDefault()
          k.stopPropagation()
        },
        mousemove: function (l) {
          if ($(this).data("hover")) {
            var k = Math.round((l.offsetX / $(this).width()) * 100) || 0
            k = Math.min(Math.max(k, 0), 100)
            $(this)
              .find(".progress")
              .width(k + "%")
            clearTimeout(e.volume)
            e.volume = setTimeout(function () {
              $(".player .volume-scrubber").data("hover", false)
            }, 1000)
          }
          l.preventDefault()
          l.stopPropagation()
        },
        mouseup: function (k) {
          clearTimeout(e.volume)
          $(this).data("hover", false)
          k.preventDefault()
          k.stopPropagation()
        },
      })
      $(".player .volume").live({
        click: function (l) {
          var k = $(this)
          if (k.hasClass("mute")) {
            f.setVolume(0, false)
          } else {
            f.setVolume(1, true)
          }
          l.preventDefault()
          l.stopPropagation()
        },
      })
      //全屏
      if (fullScreenApi.supportsFullScreen) {
        $(".player .full").live("click", function (k) {
          $(".player .full").addClass("hide")
          $(".player .exit").removeClass("hide")
          $(".player").addClass("player-fullscreen")
          $("#stage").requestFullScreen()
          return false
        })
        $(".player .exit").live("click", function (k) {
          $(".player .exit").addClass("hide")
          $(".player .full").removeClass("hide")
          $(".player").removeClass("player-fullscreen")
          fullScreenApi.cancelFullScreen()
          return false
        })
        $("#stage").on(fullScreenApi.fullScreenEventName, function (k) {
          if (fullScreenApi.isFullScreen()) {
            $(".player .full").addClass("hide")
            $(".player .exit").removeClass("hide")
            $(".player").addClass("player-fullscreen")
            f.view.status.fullscreen = true
          } else {
            $(".player .exit").addClass("hide")
            $(".player .full").removeClass("hide")
            $(".player").removeClass("player-fullscreen")
            f.view.status.fullscreen = false
          }
          f.view.resize()
        })
      } else {
        $(".player .fullscreen").hide()
      }
      $(".gotopage").submit(function (k) {
        f.gotoPage.call(f)
        return false
      })
      $(".page-current").change(function () {
        f.gotoPage.call(f)
      })
      function i() {
        f.status.activeTime = new Date().getTime()
        if (!f.status.display) {
          $(".player").removeClass("mini")
          f.status.display = true
        }
      }
      $(document).click(i)
      $("#stage").hover(i)
      $(window).keydown(function (l) {
        if (
          l.keyCode == 37 ||
          (l.keyCode == 39 && l.target.tagName.toLowerCase() != "input")
        ) {
          var m = $(".page-current"),
            n = ~~m.val(),
            k = $(".page-total").text()
          n = l.keyCode == 37 ? n - 1 : n + 1
          n = Math.min(n, k)
          n = Math.max(1, n)
          m.val(n).change()
        }
      })
      if (f.view.isMobile) {
        $(document).on("touchstart", i)
        $("#stage-inner").on("touchstart", i)
      }
      this.view.on("view:play", function () {
        $(".player").addClass("playing")
        f.status.activeTime = new Date().getTime()
        clearInterval(e.toolbarDisplay)
        e.toolbarDisplay = setInterval(function () {
          var k = new Date().getTime()
          if (
            f.status.display &&
            f.view.app.status.play &&
            Math.abs(k - f.status.activeTime) > 6000
          ) {
            $(".player").addClass("mini")
            f.status.display = false
          }
        }, 2000)
      })
      this.view.on("view:pause", function () {
        $(".player").removeClass("playing")
        f.showMessage("暂停")
        clearInterval(e.toolbarDisplay)
        $(".player").removeClass("mini")
        f.status.display = true
      })
      this.view.on("view:progress", function (k) {
        if (!f.seekHanding) {
          f.setProgress(k)
        }
      })
      this.view.on("view:loadedprogress", function (k) {
        $(".loaded").width(k * 100 + "%")
      })
      this.view.on("view:lock", function (k) {
        f.locked = true
      })
      this.view.on("view:unlock", function (k) {
        f.locked = false
      })
      this.view.app.on("timeupdate", function (k) {
        //播放时已经播放的时间显示
        $(".played").text(b.player.view.secondToString(k))
      })
      this.view.app.on("data:courseInfoLoaded", function (k) {
        $(".duration").text(b.player.view.secondToString(k.totalTime))
        $(".page-total").text(Math.floor(k.maxHeight / k.height) + 1)
      })
      this.view.app.on("audio:volumechange", function (l, k) {
        if (k) {
          l = 0
        }
        if (l == 0) {
          $(".volume").addClass("mute").removeClass("volume-on")
        } else {
          $(".volume").removeClass("mute").addClass("volume-on")
        }
        $(".volume-scrubber .progress").width(l * 100 + "%")
      })
      this.view.on("view:scroll", function () {
        var k = Math.floor(f.view.status.top / f.view.app.info.height) + 1
        $(".page-current").val(k)
      })
      this.view.app.audio.on("canplay", function () {
        var k = this.volume
        $(".volume-scrubber .progress").width(k * 100 + "%")
      })
    },
    setVolume: function (d, c) {
      //控制音量
      this.view.app.audio.audio.muted = !!c
      if (typeof c === "undefined") {
        d = Math.min(Math.max(d, 0), 100)
        this.view.app.audio.setVolume(d)
      }
    },
    gotoPage: function () {
      //跳转页面
      var c = ~~$(".page-current").val(),
        d = $(".page-total").text()
      c = Math.max(1, Math.min(d, c))
      var e = (c - 1) * this.view.app.info.height
      if (e == this.view.status.top) {
        return false
      }
      this.view.app.pause()
      this.view.scrollTo(e)
    },
    setProgress: function (c) {
      //拖动进度条
    },
    msgTimer: null,
    showMessage: function (c) {
      clearTimeout(this.msgTimer)
      $("#info p").text(c).parent().addClass("show")
      this.msgTimer = setTimeout(function () {
        $("#info").removeClass("show")
      }, 1000)
    },
  })
  b.player.toolbar = a
})(AFD)
;(function (b) {
  //测试在不同客户端上
  function a(c) {
    b.utils.event.call(this)
    var d = this
    this.app = c
    this.isMobile = (function () {
      var e = navigator.userAgent.toLowerCase()
      if (/ipad/i.test(e)) {
        return "ipad"
      }
      if (/iphone os/i.test(e)) {
        return "iphone"
      }
      if (
        /android/i.test(e) ||
        (/linux/i.test(e) && /arm/i.test(navigator.platform))
      ) {
        return "android"
      }
      return false
    })()
    this.toolbar = new b.player.toolbar(this)
    this.status = {
      loading: 0,
      zoomRate: 1,
      top: 0,
      bottom: 768,
      currentPage: 0,
      step: 768 / 4,
      maxTop: 0,
      pageChanged: [],
      maxPage: 1,
      maxWidth: b.player.config.pageMaxWidth,
      toolbarHeight: 70,
      dockviewUpdate: 0,
    }
    this.stage = $("#stage")
    this.out = this.stage.find(".inner")
    this.canvas = new b.player.canvas("#stage .page")
    this.next = new b.player.canvas($("#stage .page").get(1))
    this.dockviewCanvas = new b.player.canvas("#stage .dock-canvas")
    this.dockviewEle = $("#stage-dock")
    this.timer = {
      play: null,
      //pencil: null
    }
    this.init()
  }
  $.extend(a.prototype, {
    getStatus: function () {
      var c = {
        top: this.status.top,
        bottom: this.status.bottom,
        currentPage: this.status.currentPage,
        maxPage: this.status.maxPage,
      }
      c = $.extend(c, this.app.info)
      return JSON.stringify(c)
    },
    init: function () {
      var d = this
      this.updateStageView = function () {
        if (this.status.scrolling) {
          return false
        }
        var j,
          g,
          f = new Date().getTime(),
          e = Math.floor(this.status.top / this.app.info.height) || 0
        if (
          !(
            $(this.canvas.element).data("page") === e &&
            !this.status.pageChanged[e]
          )
        ) {
          j = this.app.stage.getPage(e)
          this.canvas.putData(j.getData())
          $(this.canvas.element).data("page", e)
          $(this.canvas.element).css("top", j.top * this.status.zoomRate)
          this.status.pageChanged[e] = 0
        }
        g =
          $(this.next.element).data("page") === e + 1 &&
          !this.status.pageChanged[e + 1]
        if (!(g || e + 1 > this.status.maxPage)) {
          p2 = this.app.stage.getPage(e + 1)
          this.next.putData(p2.getData())
          $(this.next.element).data("page", e + 1)
          $(this.next.element).css("top", p2.top * this.status.zoomRate)
          this.status.pageChanged[e + 1] = 0
        }
        if (
          this.app.status.dockview &&
          (this.status.dockviewUpdate ||
            f - this.dockviewEle.data("updateTime") > 2000)
        ) {
          this.app.updateDockviewData()
          this.dockviewEle.data("updateTime", f)
          this.status.dockviewUpdate = 0
        }
      }
      if (!this.isMobile) {
        this.out.mousewheel(function (e, f) {
          d.scrollByDelta(-f * 120)
          e.preventDefault()
          e.stopPropagation()
        })
      }
      if (this.isMobile) {
        var c = {
          start: 0,
          end: 0,
          startY: 0,
          endY: 0,
          timeout: null,
        }
        this.out.get(0).addEventListener(
          "touchstart",
          function (e) {
            e.preventDefault()
            e.stopPropagation()
            c.start = e.timeStamp
            if (e.changedTouches && e.changedTouches[0]) {
              e = e.changedTouches[0]
            }
            c.endY = c.startY = e.pageY
          },
          false
        )
        this.out.get(0).addEventListener(
          "touchend",
          function (f) {
            var g = c.endY - c.startY,
              e = c.end - c.start
            if (e && e < 1000 && Math.abs(g) > 200) {
            }
            c.end = c.endY = c.start = c.startY = 0
            f.preventDefault()
            f.stopPropagation()
          },
          false
        )
        this.out.get(0).addEventListener(
          "touchmove",
          function (f) {
            f.preventDefault()
            f.stopPropagation()
            c.end = f.timeStamp
            if (f.changedTouches && f.changedTouches[0]) {
              f = f.changedTouches[0]
            }
            delta = (c.endY - f.pageY) / d.status.zoomRate
            if (Math.abs(delta) > 5) {
              var e = d.status.top + delta
              e = Math.min(Math.max(e, 0), d.status.maxTop)
              d.status.top = e
              d.out.css("top", -e * d.status.zoomRate)
              d.fire("view:scroll", e)
              if (d.app.status.play) {
                d.app.pause()
              }
            }
            c.endY = f.pageY
          },
          false
        )
        $(function () {
          window.scrollTo(0, 1)
        })
      }
      this.app.on("data:loading", function () {
        if (!d.coverHide) {
          $(".player-cover").html("").hide()
          d.out.show()
          d.coverHide = true
        }
        $(".player").hide()
        d.dataloading()
      })
      this.app.on("page:image:loading", function (e) {
        var f = d.out.find("#page-loading-" + e)
        if (!f.get(0)) {
          d.out.prepend(
            '<img src="http://s.aifudao.com/player/img/loading.gif" data-page="' +
              e +
              '" id="page-loading-' +
              e +
              '" class="loading" />'
          )
          d.out
            .find("#page-loading-" + e)
            .css(
              "top",
              (e * d.app.info.height + d.app.info.height / 2 - 16) *
                d.status.zoomRate
            )
        }
      })
      this.app.on("page:image:loaded", function (e) {
        d.out.find("#page-loading-" + e).remove()
      })
      this.app.on("page:image:error", function (e) {
        d.out.find("#page-loading-" + e).remove()
      })
      this.app.on("player:error", function (e) {
        //页面文件加载出错时
        $(".error-message")
          .html('<p class="alert-error">' + e + "</p>")
          .removeClass("hide")
        //$(".player").hide();
        $(".player").show()
        d.resize()
        $(window).off("keypress")
      })
      this.app.on("play", function () {
        d.play()
        clearInterval(d.timer.play)
        d.timer.play = setInterval(function () {
          d.updateStageView.call(d)
        }, 300)
      })
      this.app.on("pause", function () {
        d.pause()
        d.updateStageView()
      })
      this.app.on("seek", function (e) {})
      this.app.on("timeupdate", function (f, e) {
        //播放时进度条的改变
        //d.fire("view:progress", Math.round(f / e * 100))
      })
      this.app.on("audio:loadedprogress", function (e) {
        d.fire("view:loadedprogress", e)
      })
      this.app.on("resource:SyncResource", function (g) {
        if (g.CourseId > 0) {
          var j = ~~(g.Top / d.app.info.height)
          var e = g.PageNum
          if (e == 0 && d.app.cache.resourcePageNumber[g.Msecond]) {
            e = d.app.cache.resourcePageNumber[g.Msecond]
          }
          for (var f = 0; f < e; f++) {
            d.loadResource(g.CourseId, g.Index, f, f + j, e)
          }
        } else {
          if (g.Msecond > 0) {
            d.app.seek(g.Msecond / 1000 + 1)
          }
        }
      })
      this.app.on("data:courseInfoLoaded", function (l) {
        d.canvas.setStyle({
          width: l.width,
          height: l.height,
        })
        d.next.setStyle({
          width: l.width,
          height: l.height,
        })
        d.status.bottom = l.height
        d.status.step = l.height / 4
        d.status.maxTop = Math.floor(l.maxHeight / l.height) * l.height
        d.status.maxPage = Math.floor(l.maxHeight / l.height)
        var k = Math.floor(l.maxHeight / l.height) + 1
        var m = document.createDocumentFragment()
        for (var g = 0; g < k; g++) {
          var n = document.createElement("span")
          n.className = "pagecount"
          n.innerHTML = "- " + (g + 1) + "/" + k + " -"
          m.appendChild(n)
          n = null
        }
        d.out.prepend(m)
        m = null
        var e = $(
          '<div class="pencil" style="display:none"><!-- img src="http://s.aifudao.com/player/img/pencil.png" width="100%" height="100%" --></div>'
        )
        d.out.append(e)
        d.pencil = e
        d.resize()
        var f = [
          "<h5>",
          "<span>老师：<a target='_blank' href='/teacher/info?username=",
          encodeURIComponent(l.teacher),
          "'>",
          l.teacher,
          "</a></span>",
          l.student ? "<span>学生:" + l.student + "</span>" : "",
          "<span class='time'>时间：",
          l.startTime,
          "</span>",
          "</h5>",
          " <ul id='player-cover-play'>",
          " <li><img class='play' src='http://s.aifudao.com/player/img/play.png'></li>",
          " </ul>",
          "<ul class='time-snap'>",
        ]
        var j = Math.floor(l.totalTime / 6)
        f.push(
          '<li data-sec="' +
            l.totalTime +
            '"><span>时长：' +
            b.player.view.secondToString(l.totalTime, 1) +
            '</span><img  class="snapshot-img" src="about:blank"></li>'
        )
        f.push("</ul>")
        $(".player-cover").html(f.join("")).removeClass("hide")
        $(".player-cover .time-snap li .snapshot-img")
          .on("load", function () {
            if (!this) {
              return
            }
            $(this).css({
              width: "100%",
              height: "100%",
              visibility: "visible",
              position: "absolute",
            })
          })
          .each(function () {
            this.src = b.player.config.snapBaseUrl + d.app.info.courseId
          })
        d.coverHide = false
      })
      this.app.on("data:change", function (j, f, i, g) {
        var e = (j[0] + j[2] - d.app.info.height) / 2
        if (e < 0) {
          e = 0
        }
        if (j[0] >= d.status.top && j[2] <= d.status.bottom) {
        } else {
          if (d.app.status.playByPage) {
            e = f[0] * d.app.info.height
          }
          d.out.css("top", -e * d.status.zoomRate)
          d.status.top = e
          d.status.bottom = e + d.app.info.height
          d.fire("view:scroll", d.status.top)
        }
        d.pencilShow(j[3] * d.status.zoomRate, j[2] * d.status.zoomRate)
      })
      this.app.on("page:update", function (e) {
        d.status.pageChanged[e] = 1
      })
      this.app.on("dockview:status:close", function () {
        d.dockviewEle.hide()
      })
      this.app.on("dockview:status:min", function () {
        d.dockviewEle.hide()
      })
      this.app.on("dockview:status:max", function () {
        d.dockviewEle.show()
      })
      this.app.on("dockview:status:open", function (i) {
        var g = d.dockviewEle
        var e = i[1] - i[3],
          f = i[2] - i[0]
        d.dockviewCanvas.setStyle({
          width: e,
          height: f,
        })
        g.width(e * d.status.zoomRate)
          .height(f * d.status.zoomRate)
          .show()
        g.show()
          .data("width", e)
          .data("height", f)
          .data("top", i[0])
          .data("left", i[3])
        if (d.app.cache.resource.length > 0) {
          var k = Math.floor(i[0] / d.app.info.height),
            j = Math.floor(i[2] / d.app.info.height)
          $(".dock-stage")
            .css({
              width: d.status.stageWidth,
              height: d.out.height(),
              top: -i[0] * d.status.zoomRate,
              left: -i[3] * d.status.zoomRate,
            })
            .html(
              d.out
                .find(
                  ".resource[data-page=" +
                    k +
                    "],.resource[data-page=" +
                    j +
                    "]"
                )
                .clone()
            )
        }
      })
      this.app.on("data:dockview:update", function (f, e) {
        d.status.dockviewUpdate = 1
      })
      //暂停或播放的悬浮按钮
      $(window).keypress(function (e) {})
      $(window).unload(function (e) {
        d.app.pause()
      })
      this.on("view:lock", function () {})
      this.on("view:unlock", function () {})
      this.on("view:scroll:done", function (e) {})
      this.on("view:scroll:begin", function (e) {})
      this.on("view:resize", function (e, i) {
        d.stage.width(e).height(i)
        d.out
          .height(
            (d.status.maxTop + d.app.info.height) * d.status.zoomRate +
              d.status.toolbarHeight
          )
          .width(e)
        if (d.app.status.dockview) {
          var k = $("#stage-dock"),
            g = k.data("width"),
            l = k.data("height"),
            f = k.data("left"),
            j = k.data("top")
          k.width(g * d.status.zoomRate).height(l * d.status.zoomRate)
          k.find(".dock-stage")
            .width(e)
            .height(d.out.height())
            .css({
              left: -(f * d.status.zoomRate),
              top: -(j * d.status.zoomRate),
            })
        }
        d.out.css("top", -d.status.top * d.status.zoomRate)
        d.out.find(".page ").each(function (m, n) {
          //判断有多少页
          var o = $(this).data("page") || 0
          $(this).css("top", o * i)
          $(this).height(i)
        })
        d.out.find(".pagecount").each(function (m, n) {
          $(this).css("top", (m + 1) * i - 20)
        })
      })
      $(window).resize(function () {
        d.resize.call(d)
      })
    },
    play: function () {
      this.fire("view:play")
    },
    pause: function () {
      this.fire("view:pause")
    },
    seek: function (c) {
      this.fire("view:seek", c)
    },
    loading: function () {
      this.status.loading = 1
      this.lock()
    },
    lock: function () {
      this.status.scrolling = true
      this.fire("view:lock")
    },
    unlock: function () {
      this.status.scrolling = false
      this.fire("view:unlock")
    },
    resize: function () {
      var c = document.documentElement.clientWidth
      if (typeof PlayInWeb !== "undefined") {
        c = Math.min(c, this.status.maxWidth)
      }
      var d = document.documentElement.clientHeight
      if (this.status.fullscreen) {
        c = document.documentElement.clientWidth
      }
      this.status.zoomRate = Math.min(
        c / this.app.info.width,
        d / this.app.info.height
      )
      this.status.stageWidth = this.app.info.width * this.status.zoomRate
      this.status.stageHeight = this.app.info.height * this.status.zoomRate
      this.fire("view:resize", this.status.stageWidth, this.status.stageHeight)
    },
    scrollByDelta: function (e) {
      var c = this
      e = Math.round(e / this.status.zoomRate)
      var d = this.status.top + e
      if (d < 0) {
        d = 0
      }
      if (d > this.status.maxTop) {
        d = this.status.maxTop
      }
      if (this.app.status.play) {
        this.app.pause()
      }
      this.scrollTo(d)
    },
    scrollUp: function (c) {
      this.scrollByDelta(-this.status.step)
    },
    scrollDown: function (c) {
      this.scrollByDelta(this.status.step)
    },
    scrollTo: function (e) {
      if (this.status.scrolling || this.status.top == e) {
        return
      }
      var d = this
      if (e < 0) {
        e = 0
      }
      this.lock()
      var c = Math.floor(e / this.app.info.height)
      d.status.top = e
      d.status.bottom = this.status.top + this.app.info.height
      d.currentPage = c
      d.out.animate(
        {
          top: -d.status.top * d.status.zoomRate,
        },
        150,
        function () {
          d.fire("view:scroll")
          d.unlock()
          d.updateStageView()
        }
      )
    },
    loadResource: function (i, j, f, k, m, e) {
      var l = this
      var c =
        b.player.config.resourceBaseUrl +
        "CourseId" +
        i +
        "_Index" +
        j +
        "/Kejian"
      if (m && m > 1) {
        c += "-" + f
      }
      c += ".jpg"
      var d = "resource-" + i + "-" + j + "-" + k
      if ($("#" + d).length == 0 && k <= this.status.maxPage) {
        var n = $(
          '<div class="resource" data-page="' + k + '"id="' + d + '"></div>'
        )
        this.out.prepend(n)
        n.css({
          top: (this.status.stageHeight * k * 100) / this.out.height() + "%",
          position: "absolute",
          margin: "0 auto",
          "text-align": "center",
          width: "100%",
          height: (this.status.stageHeight * 100) / this.out.height() + "%",
        }).data("page", k)
        var g = new Image()
        if (typeof e !== undefined) {
          $(g).data("time", e)
        }
        g.onload = function () {
          a.scaleImage(this, l.app.info.width, l.app.info.height)
        }
        g.src = c
        n.append(g)
      }
    },
    dataloading: function () {
      var c = this
      $("#loading-cover").show()
      $(".loading-progress .progress").data("percent", 0)
      this.app.un("data:loading:percent")
      this.app.on("data:loading:percent", function (d) {
        d = Math.min(1, d)
        if (d > $(".loading-progress .progress").data("percent")) {
          $(".loading-progress .progress")
            .data("percent", d)
            .clearQueue()
            .animate(
              {
                width: d * 100 + "%",
              },
              "slow",
              "swing"
            )
        }
        if (d >= 1) {
          $(".loading-progress .progress")
            .clearQueue()
            .animate(
              {
                width: "100%",
              },
              "fast",
              "swing"
            )
            .promise()
            .done(function () {
              $("#loading-cover")
                .hide("slow")
                .promise()
                .done(function () {
                  $("#loading-cover").remove()
                })
              $(".player").show()
              c.app.play()
            })
        }
        $("#stage")
          .css("border", "1px solid #ccc")
          .css("border-color", "transparent")
      })
    },
  })
  //显示播放时长
  a.secondToString = function (j, i) {
    var e = Math.ceil(j),
      g = Math.floor(e / 3600),
      d = Math.floor(e / 60) % 60,
      f = e % 60,
      k = d + ":" + (f > 9 ? f : "0" + f)
    if (g > 0) {
      k = g + ":" + k
    }
    if (i) {
      var c = k.split(":")
      if (c.length == 3) {
        k = c[0] + "小时" + c[1] + "分" + c[2] + "秒"
      }
      if (c.length == 2) {
        k = c[0] + "分" + c[1] + "秒"
      }
      if (c.length == 1) {
        k = c[0] + "秒"
      }
    }
    return k
  }
  a.scaleImage = function (j, i, c) {
    var d = j.width,
      g = j.height,
      e = 0,
      f = 1
    if (d > i || g > c) {
      f = Math.max(d / i, g / c)
    }
    e = (1 - g / f / c) * 50 * (c / i) + "%"
    $(j).css({
      width: (d / f / i) * 100 + "%",
      margin: e + " auto",
    })
  }
  b.player.view = a
})(AFD)
;(function (e) {
  var c = e.player.config,
    a = e.utils
  function d(i, g, f) {
    e.utils.event.call(this)
    this.page = i
    this.app = g
    this.canvas = this.app.canvasBuilder(f.element, f)
    this.height = f.height || this.app.info.height
    this.width = f.width || this.app.info.width
    this.top = f.top || this.app.info.height * this.page
    this.bottom = this.top + this.height
    this.left = f.left || 0
    this.right = f.right || 0
    this.needBgTransparent = f.needBgTransparent || false
    this.startTime = f.startTime || 0
    this.endTime = f.endTime || 0
    this.status = {
      bgLoaded: false,
      bgTimer: null,
      bgImage: null,
    }
    this.loadBgImage(this.startTime)
    this.checkCmdHandle = null
  }
  $.extend(d.prototype, {
    checkTime: function (f) {
      if (typeof f !== "undefined" && f < this.endTime) {
        return false
      }
      return true
    },
    checkCmd: function () {
      var f = this
      if (this.status.bgLoaded) {
        $(this.canvas.element).dequeue("cmd")
      } else {
        clearTimeout(this.checkCmdHandle)
        this.checkCmdHandle = setTimeout(function () {
          if (f) {
            f.checkCmd.call(f)
          }
        }, 100)
      }
    },
    line: function (k, f, g, j) {
      var i = this
      if (this.checkTime(j)) {
        $(this.canvas.element).queue("cmd", function () {
          if (!i) {
            return
          }
          i.canvas.line(
            [k[0] - i.left, k[1] - i.top],
            [f[0] - i.left, f[1] - i.top],
            g
          )
          i.app.fire("page:update", i.page)
          $(this).dequeue("cmd")
        })
        this.checkCmd()
        this.endTime = j || this.endTime
      }
    },
    area: function (m, i, f, k, g, l) {
      var j = this
      if (this.checkTime(l)) {
        $(this.canvas.element).queue("cmd", function () {
          if (!j) {
            return
          }
          j.canvas.area([m[0] - j.left, m[1] - j.top], i, f, k, g)
          j.app.fire("page:update", j.page)
          $(this).dequeue("cmd")
        })
        this.checkCmd()
        this.endTime = l || this.endTime
      }
    },
    text: function (g, f, j, i) {
      j = j - this.top
      f = f - this.left
      this.canvas.text(g, f, j, i)
    },
    drawImage: function (l, g, f, k, j) {
      var i = this
      if (this.checkTime(j)) {
        $(this.canvas.element).queue("cmd", function () {
          if (!i) {
            return
          }
          i.canvas.image(k, [l[0] - i.left, l[1] - i.top], g, f)
          i.app.fire("page:update", i.page)
          $(this).dequeue("cmd")
        })
        this.checkCmd()
        this.endTime = j || this.endTime
      }
    },
    image: function (j, l, g, f, k) {
      var i = this
      this.app.fire("page:image:loading", this.page)
      this.canvas.image(
        j,
        [l[0] - this.left, l[1] - this.top],
        g,
        f,
        function () {
          if (!i) {
            return
          }
          i.status.bgLoaded = true
          i.needBgTransparent = false
          i.app.fire("page:update", i.page)
          i.app.fire("page:image:loaded", i.page)
          $(i.canvas.element).dequeue("cmd")
        },
        function () {
          i.app.fire("page:image:error", i.page)
        },
        this.needBgTransparent
      )
      clearTimeout(this.status.bgTimer)
      this.status.bgTimer = setTimeout(function () {
        if (i) {
          i.status.bgLoaded = true
        }
      }, 10000)
    },
    loadBgImage: function (g) {
      var f
      if ((f = this.status.bgImage)) {
        this.status.bgImage = f.onload = f.onerror = null
        this.clear()
      }
      if (this.app.info.start == "0") {
        this.status.bgLoaded = true
        this.canvas.fillRect(0, 0, this.width, this.height, "#ffffff")
        return
      }
      g = Math.floor(g) + 1
      var i = Math.min(Math.max(0, g), this.app.info.totalTime)
      this.startTime = i
      this.status.bgImage = this.image(
        c.courseUrl +
          $.param({
            sid: this.app.info.courseId,
            action: "snapshot",
            t: i,
            start: this.page + 1,
          }),
        [0, this.top],
        this.width,
        this.height
      )
    },
    putData: function (g, f, i) {
      i = i - this.top
      f = f - this.left
      this.canvas.putData(g, f, i)
    },
    start: function (f) {
      this.startTime = f
    },
    end: function (f) {
      this.endTime = f
    },
    config: function (f) {
      var g = this
      $.each(f, function (j, i) {
        g[j] = i
      })
      g.width = g.right - g.left
      g.height = g.bottom - g.top
      g.canvas.setStyle({
        width: g.width,
        height: g.height,
      })
    },
    save: function () {
      return {
        page: this.page,
        start: this.startTime,
        end: this.endTime,
      }
    },
    clear: function (f) {
      $(this.canvas.element).clearQueue("cmd")
      this.status.bgLoaded = false
      this.startTime = f
      this.endTime = f * 1000
      this.canvas.clear()
      this.loadBgImage(this.startTime)
    },
    getData: function () {
      return this.canvas.getImageData()
    },
  })
  function b(l) {
    var k = this,
      f = [],
      i = [],
      j = []
    a.event.call(this)
    this.app = l
    this.startTime = 0
    function g() {
      return new Date().getTime()
    }
    this.length = 0
    this.setNeedBgTransparentPage = function (m) {
      if ($.inArray(m, j) == -1) {
        j.push(m)
      }
    }
    this.getPage = function (r) {
      var u = f[r]
      if (!u) {
        var q = {
          startTime: this.startTime,
        }
        u = f[r] = new d(r, this.app, q)
        i.push({
          page: r,
          time: g(),
        })
        this.length++
      } else {
        var m = $.grep(i, function (p) {
          return p.page == r
        })
        if (m) {
          m[0].time = g()
        }
      }
      if (i.length > 30) {
        i.sort(function (v, p) {
          return v.time < p.time ? 1 : -1
        })
        var o = i.splice(30)
        for (var s = 0, n = o.length; s < n; s++) {
          try {
            delete f[o[s].page]
          } catch (t) {}
          f[o[s]] = null
        }
        this.app.info.start = this.startTime
      }
      return u
    }
    this.savePage = function (m) {
      f[m.page] = m
    }
    this.clear = function () {
      for (var n = 0, m = f.length; n < m; n++) {
        if (f[n]) {
          f[n].clear(this.startTime)
        }
      }
    }
    this.app.on("timeupdate", function () {
      k.startTime = k.app.info.currentTime
    })
  }
  $.extend(b.prototype, {
    line: function (i, l, g, k) {
      var o = i[1],
        n = l[1],
        m = Math.min(o, n),
        f = Math.max(o, n),
        j = Math.min(i[0], l[0]),
        r = Math.max(i[0], l[0])
      h = this.app.info.height
      var q = Math.floor(m / h),
        p = Math.floor(f / h)
      this.getPage(q).line(i, l, g, k)
      if (q !== p) {
        this.getPage(p).line(i, l, g, k)
      }
      this.fire("data:change", [m, r, f, j], [q, p], k, "line")
    },
    lines: function (j, k, m) {
      if (m.length >= 2) {
        for (var g = 0, f = m.length - 2; g <= f; g++) {
          this.line(m[g + 0], m[g + 1], j, k)
        }
      }
    },
    area: function (g, i, s, o, m, j) {
      var n = g[1],
        k = g[0],
        r = k + i,
        f = n + s,
        l = this.app.info.height,
        q = Math.floor(n / l),
        p = Math.floor(f / l)
      this.getPage(q).area(g, i, s, o, m, j)
      if (q !== p) {
        this.getPage(p).area(g, i, s, o, m, j)
      }
      this.fire("data:change", [n, r, f, k], [q, p], j, "area")
    },
    drawImage: function (i, j, r, g, k) {
      var n = i[1],
        l = i[0],
        q = l + j,
        f = n + r,
        m = this.app.info.height,
        p = Math.floor(n / m),
        o = Math.floor(f / m)
      this.getPage(p).drawImage(i, j, r, g, k)
      if (p !== o) {
        this.getPage(o).drawImage(i, j, r, g, k)
      }
      this.fire("data:change", [n, q, f, l], [p, o], k, "drowImage")
    },
  })
  e.player.stage = b
  e.player.page = d
})(AFD)
;(function (b) {
  function a(c) {
    this.audio = new Audio()
    this.item = $(this.audio)
    this.init()
  }
  a.isSupport = function () {
    return typeof Audio != "undefined" &&
      typeof new Audio().canPlayType == "function" &&
      (new Audio().canPlayType("audio/mpeg") == "maybe" ||
        new Audio().canPlayType("audio/mpeg") == "probably")
      ? true
      : false
  }
  a.prototype = {
    init: function () {
      var c = this
      $.each(this.handles, function (e, d) {
        c.on(e, d)
      })
      this.preload("auto")
    },
    handles: {
      play: function () {},
      pause: function () {},
      canplay: function () {},
      playing: function () {},
      waiting: function () {},
      canplaythrough: function () {},
      loadstart: function () {},
      abort: function () {},
      loadeddata: function () {},
      loadedmetadata: function () {},
      durationchange: function () {},
      timeupdate: function () {},
      emptied: function () {},
      error: function () {},
    },
    on: function (d, c) {
      this.item.on(d, c)
    },
    un: function (d, c) {
      this.item.un(d, c)
    },
    play: function (c) {
      if (c) {
        this.audio.src = c
      }
      this.audio.play()
      if (!(this.audioloaded || this.startTrack)) {
        this.trackLoadedProgress()
      }
    },
    load: function () {
      this.audio.load()
    },
    preload: function (c) {
      this.audio.preload = c
    },
    pause: function () {
      this.audio.pause()
    },
    seek: function (c) {
      if (c < 0) {
        c = 0
      }
      if (c > this.audio.duration) {
        c = this.audio.duration
      }
      this.audio.currentTime = c
      this.audioloaded = this.startTrack = false
    },
    setVolume: function (c) {
      if (c >= 0 && c <= 1) {
        this.audio.volume = c
      }
    },
    getTime: function () {
      return this.audio.currentTime
    },
    getStatus: function () {
      return {
        duration: this.audio.duration,
        currentTime: this.audio.currentTime,
        initialTime: this.audio.initialTime,
        buffered: this.audio.buffered,
        played: this.audio.played,
        paused: this.audio.paused,
        ended: this.audio.ended,
      }
    },
    getLoadProgressPercent: function () {
      if (this.audio.buffered != null && this.audio.buffered.length) {
        var d = this.audio.buffered.end(this.audio.buffered.length - 1),
          c = d / this.audio.duration
        return c
      }
      return 0
    },
    audioloaded: false,
    startTrack: false,
    trackLoadedProgress: function () {
      if (this.audioloaded || this.startTrack) {
        return false
      }
      var d = this,
        c,
        e
      c = setInterval(function () {
        d.startTrack = true
        if (d.audio.readyState > 1) {
          clearInterval(c)
          e = setInterval(function () {
            percent = d.getLoadProgressPercent()
            d.item.trigger("loading", [percent])
            if (percent >= 1) {
              clearInterval(e)
              d.audioloaded = true
            }
          }, 200)
        }
      }, 100)
      d.readyTimer = c
      d.loadTimer = e
      return true
    },
  }
  b.audio = a
})(AFD.player)
;(function (b) {
  var a = function (d, c) {
    b.utils.event.call(this)
    this.audio = new b.player.audio(this)
    this.cmd = new b.player.cmd(this)
    this.stage = new b.player.stage(this)
    this.view = new b.player.view(this)
    this.cache = {
      cmds: [],
      dockview: [],
      resource: [],
      resourcePageNumber: [],
      dockviewPos: [0, 0, 0, 0],
    }
    this.status = {
      play: 0,
      loading: 0,
      cmds: [],
      preload: {
        cmd: 0,
        cmdLoaded: 0,
      },
      dockview: 0,
      dockviewLoaded: 0,
      audio: 0,
      cmdloadpercent: 0,
      error: 0,
      seekTime: null,
      hasResource: false,
      lastPlayTime: 0,
      playByPage: false,
      pauseByHidden: false,
    }
    this.timer = {
      play: null,
      cmd: null,
      loading: null,
    }
    this.info = {
      teacher: null,
      student: null,
      totalTime: 0,
      currentTime: 0,
      start: 0,
      end: null,
      width: 1024,
      height: 768,
      audioId: null,
      courseId: d,
      lastTime: 0,
      maxHeight: 768,
      type: null,
      playType: 1,
    }
    this.init(c)
    this.dockviewPage = new b.player.page(0, this, {
      top: 0,
      width: 0,
      height: 0,
      element: "#stage .dock-canvas",
    })
    this.visibilitychange = function () {
      var g, f, e
      if (typeof document.hidden !== "undefined") {
        g = "hidden"
        e = "visibilitychange"
        f = "visibilityState"
      } else {
        if (typeof document.mozHidden !== "undefined") {
          g = "mozHidden"
          e = "mozvisibilitychange"
          f = "mozVisibilityState"
        } else {
          if (typeof document.msHidden !== "undefined") {
            g = "msHidden"
            e = "msvisibilitychange"
            f = "msVisibilityState"
          } else {
            if (typeof document.webkitHidden !== "undefined") {
              g = "webkitHidden"
              e = "webkitvisibilitychange"
              f = "webkitVisibilityState"
            }
          }
        }
      }
      me = this
      $(document).on(e, function (i) {
        if (document[g] || document[f] == "hidden") {
          if (me.status.play == 1) {
            me.pause()
            me.status.pauseByHidden = true
          }
        } else {
          if (me.status.pauseByHidden && me.status.play === 0) {
            me.status.pauseByHidden = false
            me.play()
          }
        }
      })
    }
  }
  $.extend(a.prototype, {
    init: function (c) {
      var d = this
      this.getCourseInfo()
      this.getDockViewInfo()
      if (this.info.courseId < b.player.config.lastCoursePPTId) {
        this.getResourceInfo()
      }
      this.timer.cmd = setInterval(function () {
        var g = b.player.config.cmdLen / 1000
        if (d.status.play) {
          var f = Math.floor(d.info.currentTime / g)
          if (!d.cache.cmds[f] && !d.status.cmds[f]) {
            d.getCmd(d.info.currentTime)
          }
          if (
            d.info.currentTime + g < d.info.totalTime &&
            !d.cache.cmds[f + 1] &&
            !d.status.cmds[f + 1]
          ) {
            d.getCmd(d.info.currentTime + g)
          }
        }
      }, 1000)
      this.on("data:courseInfoLoaded", function () {})
      this.on("data:resourceLoaded", function (f) {
        $.each(f, function (j, m) {
          if (m.Type == "SyncResource" && m.CourseId > 0) {
            for (var k = 0, g = ~~(m.Top / d.info.height); k < m.PageNum; k++) {
              d.stage.setNeedBgTransparentPage(k + g)
            }
          }
        })
      })
      this.on("play", function () {})
      this.on("timeupdate", function (g, f) {
        d.playing()
      })
      this.on("data:loading", function () {})
      this.on("data:cmd:loadedprogress", function (f) {
        if (f >= 1) {
          f = 1
        }
        d.status.cmdloadpercent = f
        var g = f * 8 + (d.status.audio > 0) * 2
        if (g >= 10) {
          d.preLoadDone()
        }
        d.fire("data:loading:percent", g / 10)
      })
      this.audio.on("loadedmetadata", function () {
        d.status.audio = 1
      })
      this.audio.on("canplay", function () {
        d.status.audio = 2
        if (d.status.loading) {
          var f = d.status.cmdloadpercent * 8 + 2
          d.fire("data:loading:percent", f / 10)
          if (f >= 10) {
            d.preLoadDone()
          }
        }
        if (d.status.seekTime !== null) {
          d.seek(d.status.seekTime)
          setTimeout(function () {
            d.seek(d.status.seekTime)
            d.status.seekTime = null
          }, 500)
        }
      })
      this.audio.on("loading", function (g, f) {
        d.fire("audio:loadedprogress", f)
      })
      this.audio.on("canplaythrough", function () {})
      this.audio.on("abort", function () {
        d.status.audio = 0
      })
      this.audio.on("timeupdate", function () {
        d.info.currentTime = this.currentTime
        d.fire("timeupdate", this.currentTime, this.duration)
      })
      var e = function () {
        d.status.play = 1
        d.status.pauseByHidden = false
        d.fire("play")
      }
      this.audio.on("play", e)
      this.audio.on("playing", e)
      this.audio.on("pause", function () {
        d.status.play = 0
        if (this.currentTime >= d.info.totalTime) {
          d.status.play = 2
        }
        d.fire("pause")
      })
      this.audio.on("error", function () {
        d.error("音频文件加载出错，请确认id是否正确")
      })
      this.audio.on("volumechange", function () {
        d.fire("audio:volumechange", this.volume, this.muted)
      })
      this.view.on("view:seek", function (f) {
        var g = (f * d.info.totalTime) / 100
        d.seek(g)
      })
      this.stage.on("data:change", function (k, f, j, i) {
        if (d.status.dockview) {
          var g = d.cache.dockviewPos
          if (k[0] > g[0] && k[1] < g[1] && k[2] < g[2] && k[3] > g[3]) {
            d.fire("data:dockview:update", k, f, j, i)
          } else {
            d.fire("data:change", k, f, j, i)
          }
        } else {
          d.fire("data:change", k, f, j, i)
        }
      })
      this.on("page:update", function (f) {})
      this.cmd.on("cmd:dockview:close", function (f) {
        d.status.dockview = 0
        d.cache.dockviewPos = [0, 0, 0, 0]
        d.fire("dockview:status:close", f)
      })
      this.cmd.on("cmd:dockview:open", function (f) {
        d.status.dockview = 1
        d.dockviewPage.config({
          top: f.Top,
          bottom: f.Bottom,
          left: f.Left,
          right: f.Right,
        })
        var i = d.cache.dockviewPos,
          g = !(
            i[0] == f.Top &&
            i[1] == f.Right &&
            i[2] == f.Bottom &&
            i[3] == f.Left
          )
        d.cache.dockviewPos = [f.Top, f.Right, f.Bottom, f.Left]
        d.fire("dockview:status:open", d.cache.dockviewPos)
        if (g) {
          d.fire("data:dockview:update", d.cache.dockviewPos, [
            Math.floor(f.Top / d.info.height),
            Math.floor(f.Bottom / d.info.height),
          ])
        }
      })
      this.cmd.on("cmd:dockview:min", function (f) {
        d.fire("dockview:status:min", f)
      })
      this.cmd.on("cmd:dockview:max", function (f) {
        d.fire("dockview:status:max", f)
      })
      this.cmd.on("cmd:resorce:exec", function (f) {
        if (f.Type == "SyncResource") {
          d.status.hasResource = true
          if (d.info.type == "Course") {
            d.status.playByPage = true
          }
          d.fire("resource:SyncResource", f)
        }
      })
      this.cmd.on("cmd:SyncRotate:exec", function (g) {
        var f = g.Msecond + 2000
        d.info.lastTime = f
        d.info.start = d.stage.startTime = f / 1000
        d.stage.clear()
      })
    },
    getCachedCmd: function (e, g) {
      g = g || this.info.lastTime
      var f = b.player.config.cmdLen / 1000,
        d = Math.max(0, Math.floor(e / f)),
        c = [],
        i = e * 1000
      if (i <= g) {
        return []
      }
      if (d > 0 && Math.floor(g / b.player.config.cmdLen) < d) {
        c = this.getCachedCmd(d * f - 0.001, g)
      }
      if (this.cache.cmds[d] && this.cache.cmds[d]["Commands"]) {
        $.each(this.cache.cmds[d]["Commands"], function (j, k) {
          if ((g == 0 || k.Msecond > g) && k.Msecond < i) {
            c.push(k)
          }
        })
      }
      return c
    },
    playing: function () {
      var e = this,
        d = new Date().getTime()
      if (d - this.status.lastPlayTime < 100) {
        return
      }
      this.status.lastPlayTime = d
      var c = this.getCachedCmd(this.info.currentTime)
      if (c.length > 0) {
        $.each(c, function (f, g) {
          e.cmd.exec(g)
          e.info.lastTime = g.Msecond
        })
      }
    },
    error: function (c) {
      this.status.error = true
      this.fire("player:error", c)
    },
    getCourseInfo: function () {
      if (this.status.info == 2) {
        return
      }
      var c = this
      c.status.info = 1
      $.getJSON(
        b.player.config.courseUrl,
        {
          sid: this.info.courseId,
          action: "info",
        },
        function (d) {
          c.status.info = 2
          c.info.totalTime = d.Duration
          c.info.audioId = d.SessionId
          c.info.teacher = d.Teacher
          c.info.student = d.Student
          c.info.width = d.Width
          c.info.height = d.Height
          c.info.maxHeight = d.MaxHeight
          c.info.startTime = d.StartTimestamp
          c.info.closeTime = d.ClosedTimestamp
          c.info.type = d.FudaoType
          c.info.playType = d.CommandsNum ? 1 : 3
          c.info.serverIp = d.ServerIp
          b.player.config.audioBaseUrl = "http://" + d.ServerIp + "/sound/"
          c.fire("data:courseInfoLoaded", c.info)
        }
      ).fail(function () {
        c.error("课程暂不能播放，请稍后再试")
      })
    },
    getDockViewInfo: function () {
      var d = this
      var c = $.getJSON(
        b.player.config.courseUrl,
        {
          sid: this.info.courseId,
          action: "dockview",
        },
        function (e) {
          if (e.CommandsNum > 0 && e.Commands) {
            d.cache.dockview = e.Commands
          }
          d.status.dockviewLoaded = 1
          d.fire("data:dockviewLoaded", d.cache.dockview)
        }
      )
      return c
    },
    fixResourcePageNumber: function (d) {
      var c = this
      $.getJSON(
        b.player.config.baseUrl + "classes/get_resource_page_number",
        {
          course_id: d.CourseId,
          index: d.Index,
        },
        function (g) {
          if (g.res == "0") {
            c.cache.resourcePageNumber[d.Msecond] = g.page
            if (d.Type == "SyncResource" && d.CourseId > 0) {
              for (var f = 0, e = ~~(d.Top / c.info.height); f < g.page; f++) {
                c.stage.setNeedBgTransparentPage(f + e)
              }
            }
          }
        }
      )
    },
    getResourceInfo: function () {
      var d = this
      var c = $.getJSON(
        b.player.config.courseUrl,
        {
          sid: d.info.courseId,
          action: "resource",
        },
        function (e) {
          if (e.Commands) {
            d.cache.resource = e.Commands
            d.status.hasResource = true
            d.status.coursePPT = 0
            $.each(e.Commands, function (f, g) {
              if (g.CourseId > 0) {
                d.status.coursePPT = true
              }
              if (g.PageNum == "0") {
                d.fixResourcePageNumber(g)
              }
            })
          }
          d.status.resourceLoaded = 1
          d.fire("data:resourceLoaded", d.cache.resource)
        }
      )
      return c
    },
    getDockViewCmdByTime: function (e) {
      var j = [0, 0, 0, 0],
        c = {
          status: 0,
          cmd: {},
          opencmd: false,
          pos: j,
        }
      if (!this.status.dockviewLoaded) {
        this.getDockViewInfo()
      }
      for (var f = 0, d = this.cache.dockview.length; f < d; f++) {
        var g = this.cache.dockview[f]
        if (g.Msecond < e) {
          if (g.Bottom == 1 && g.Right == 1) {
            c.status = 0
            c.cmd = g
            c.pos = j
          } else {
            c.status = 1
            c.cmd = g
            if (g.Right > 3) {
              c.pos = [g.Top, g.Right, g.Bottom, g.Left]
              c.opencmd = g
            }
          }
        } else {
          return c
        }
      }
      return c
    },
    play: function () {
      //点击开始播放
      if (this.info.audioId) {
        if (this.status.play == 2 || this.audio.audio.ended) {
          this.seek(0)
        } else {
          this.playAudio()
        }
      }
    },
    playAudio: function () {
      var c = this
      if (this.status.audio === 0) {
        this.audio.play(
          b.player.config.audioBaseUrl + this.info.audioId + ".mp3"
        )
      } else {
        this.audio.play()
      }
    },
    pause: function () {
      this.audio.pause() //点击暂停按钮
    },
    seek: function (e) {
      var j = this
      e = Math.floor(e)
      if (this.status.audio === 0) {
        this.play()
        this.status.seekTime = e
      } else {
        this.info.start = e
        this.info.lastTime = this.info.start * 1000
        this.stage.startTime = this.info.start
        this.stage.clear()
        var m = this.getDockViewCmdByTime(e * 1000)
        this.status.dockview = m.status
        this.cache.dockviewPos = m.pos
        if (m.opencmd && m.opencmd.Msecond < m.cmd.Msecond) {
          this.cmd.SyncDockview(m.opencmd)
        }
        this.cmd.SyncDockview(m.cmd)
        this.view.status.pageChanged = []
        if (e > 0) {
          for (var f = 0, d = this.cache.resource.length; f < d; f++) {
            var k = this.cache.resource[f]
            if (k.CourseId > 0 && k.Msecond <= this.info.start * 1000) {
              this.cmd.exec(k)
            } else {
              break
            }
          }
        }
        if (!this.status.dockview) {
          this.fire("dockview:status:close", this.cache.dockviewPos)
        }
        var g = Math.floor(this.info.lastTime / b.player.config.cmdLen)
        var c = function (o) {
          var p = o
          if ($.type(o) == "array") {
            p = o[0]
          }
          if (p.CommandsNum > 0) {
            for (var l = p.CommandsNum - 1; l >= 0; l--) {
              var n = p.Commands[l].Type
              if (n == "SyncDrawline" || n == "SyncData") {
                if (p.Commands[l].Msecond < j.info.lastTime) {
                  j.cmd.exec(p.Commands[l])
                  return
                }
              }
            }
          }
          if (g > 0) {
            j.getCmdsData(--g).then(c)
          }
        }
        this.getCmdsData(g).then(c)
        this.audio.seek(e)
      }
    },
    getCmd: function (d) {
      d = Math.floor(d)
      var g = this,
        f = b.player.config.cmdLen / 1000
      if (d % f !== 0) {
        d = d - (d % f)
      }
      var c = Math.max(0, Math.floor(d / f))
      d = d * 1000
      this.status.cmds[c] = 1
      var e = $.getJSON(
        b.player.config.courseUrl,
        {
          sid: this.info.courseId,
          action: "pixel",
          start: d,
          len: b.player.config.cmdLen,
        },
        function (i) {
          g.cache.cmds[c] = i
          g.status.cmds[c] = 2
        },
        function (i) {
          g.status.cmds[c] = 0
        }
      )
      return e
    },
    getCmdsData: function (i) {
      var d = arguments,
        c = [],
        g = b.player.config.cmdLen / 1000,
        f = this
      $.each(d, function (j, k) {
        if (f.cache.cmds[k]) {
          c[j] = f.cache.cmds[k]
        } else {
          c[j] = f.getCmd(k * g)
        }
      })
      var e = $.when.apply(null, c)
      return e
    },
    preloadCmds: function (j, g) {
      var c = 512,
        f = this
      if (g > c) {
        var i = g,
          e = j
        while (i > 0 && e < this.info.totalTime) {
          this.preloadCmds(e, Math.min(c, i))
          i -= c
          e += c
        }
        return
      }
      this.status.preload.cmd++
      while (c > g && g < c / 2) {
        c = c / 2
      }
      b.utils.request(
        "/kejian",
        {
          name: "len",
          key: c * 1000,
          start: j * 1000,
          limit: 100,
          ok: function (o) {
            var d = b.player.config.cmdLen,
              s = this.start,
              m = this.start + this.duration,
              p = -1,
              r = function (t, l) {
                return t.Msecond > l.Msecond ? 1 : -1
              }
            while (s < m) {
              var q = Math.floor(s / d)
              s += d
              f.status.cmds[q] = 2
              if (!f.cache.cmds[q] || !f.cache.cmds[q]["Commands"]) {
                f.cache.cmds[q] = {
                  CommandsNum: 0,
                  Commands: [],
                }
              }
              if (o.CommandsNum > 0 && o.Commands) {
                for (var n = p + 1, k = o.Commands.length; n < k; n++) {
                  if (o.Commands[n].Msecond <= s) {
                    f.cache.cmds[q]["Commands"].push(o.Commands[n])
                    p = n
                  } else {
                    break
                  }
                }
                f.cache.cmds[q].Commands.sort(r)
                f.cache.cmds[q].CommandsNum = f.cache.cmds[q].Commands.length
              }
            }
            f.status.preload.cmdLoaded++
            if (f.status.preload.cmd > 0) {
              f.fire(
                "data:cmd:loadedprogress",
                f.status.preload.cmdLoaded / f.status.preload.cmd
              )
            }
          },
          fail: function () {
            f.status.preload.cmd++
          },
        },
        {
          sid: this.info.courseId,
          action: "pixel",
        }
      )
    },
    updateDockviewData: function () {
      if (this.status.dockview) {
        var f = Math.floor(this.cache.dockviewPos[0] / this.info.height),
          c = Math.floor(this.cache.dockviewPos[2] / this.info.height),
          e = this.stage.getPage(f)
        this.dockviewPage.putData(e.getData(), 0, e.top)
        if (f !== c) {
          var d = this.stage.getPage(c)
          this.dockviewPage.putData(d.getData(), 0, d.top)
        }
      }
    },
    canvasBuilder: function (e, d) {
      d = d || {}
      var f = new b.player.canvas(e)
      f.setStyle({
        width: d.width || this.info.width,
        height: d.height || this.info.height,
      })
      return f
    },
    loading: function () {
      this.status.loading = 1
      this.fire("data:loading")
      this.preloadCmds(0, this.info.totalTime)
      this.play()
      this.audio.load()
      clearTimeout(this.timer.loading)
      var c = this
      this.timer.loading = setTimeout(function () {
        c.fire("data:cmd:loadedprogress", 1)
      }, 20000)
    },
    preLoadDone: function () {
      clearTimeout(this.timer.loading)
      this.status.loading = 0
    },
  })
  b.player.app = a
  $.ajaxSetup({
    error: $.noop,
  })
})(AFD)
