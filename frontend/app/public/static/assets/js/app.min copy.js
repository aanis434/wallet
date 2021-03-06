!(function (n) {
  "use strict";
  var t = function () {};
  (t.prototype.initTooltipPlugin = function () {
    n.fn.tooltip && n('[data-toggle="tooltip"]').tooltip();
  }),
    (t.prototype.initPopoverPlugin = function () {
      n.fn.popover && n('[data-toggle="popover"]').popover();
    }),
    (t.prototype.initSlimScrollPlugin = function () {
      n.fn.slimScroll &&
        n(".slimscroll").slimScroll({
          height: "auto",
          position: "right",
          size: "8px",
          touchScrollStep: 20,
          color: "#9ea5ab",
        });
    }),
    (t.prototype.initFormValidation = function () {
      n(".needs-validation").on("submit", function (t) {
        return (
          n(this).addClass("was-validated"),
          !1 !== n(this)[0].checkValidity() ||
            (t.preventDefault(), t.stopPropagation(), !1)
        );
      });
    }),
    (t.prototype.initCustomModalPlugin = function () {
      n('[data-plugin="custommodal"]').on("click", function (t) {
        t.preventDefault(),
          new Custombox.modal({
            content: {
              target: n(this).attr("href"),
              effect: n(this).attr("data-animation"),
            },
            overlay: { color: n(this).attr("data-overlayColor") },
          }).open();
      });
    }),
    (t.prototype.initCounterUp = function () {
      n(this).attr("data-delay") && n(this).attr("data-delay"),
        n(this).attr("data-time") && n(this).attr("data-time");
      n('[data-plugin="counterup"]').each(function (t, i) {
        n(this).counterUp({ delay: 100, time: 1200 });
      });
    }),
    (t.prototype.initPeityCharts = function () {
      n('[data-plugin="peity-pie"]').each(function (t, i) {
        var a = n(this).attr("data-colors")
            ? n(this).attr("data-colors").split(",")
            : [],
          o = n(this).attr("data-width") ? n(this).attr("data-width") : 20,
          e = n(this).attr("data-height") ? n(this).attr("data-height") : 20;
        n(this).peity("pie", { fill: a, width: o, height: e });
      }),
        n('[data-plugin="peity-donut"]').each(function (t, i) {
          var a = n(this).attr("data-colors")
              ? n(this).attr("data-colors").split(",")
              : [],
            o = n(this).attr("data-width") ? n(this).attr("data-width") : 20,
            e = n(this).attr("data-height") ? n(this).attr("data-height") : 20;
          n(this).peity("donut", { fill: a, width: o, height: e });
        }),
        n('[data-plugin="peity-donut-alt"]').each(function (t, i) {
          n(this).peity("donut");
        }),
        n('[data-plugin="peity-line"]').each(function (t, i) {
          n(this).peity("line", n(this).data());
        }),
        n('[data-plugin="peity-bar"]').each(function (t, i) {
          var a = n(this).attr("data-colors")
              ? n(this).attr("data-colors").split(",")
              : [],
            o = n(this).attr("data-width") ? n(this).attr("data-width") : 20,
            e = n(this).attr("data-height") ? n(this).attr("data-height") : 20;
          n(this).peity("bar", { fill: a, width: o, height: e });
        });
    }),
    (t.prototype.initKnob = function () {
      n('[data-plugin="knob"]').each(function (t, i) {
        n(this).knob();
      });
    }),
    (t.prototype.init = function () {
      this.initTooltipPlugin(),
        this.initPopoverPlugin(),
        this.initSlimScrollPlugin(),
        this.initFormValidation(),
        this.initCustomModalPlugin(),
        this.initCounterUp(),
        this.initPeityCharts(),
        this.initKnob();
    }),
    (n.Components = new t()),
    (n.Components.Constructor = t);
})(window.jQuery),
  (function (a) {
    "use strict";
    var t = function () {
      (this.$body = a("body")), (this.$window = a(window));
    };
    (t.prototype._resetSidebarScroll = function () {
      a(".slimscroll-menu").slimscroll({
        height: "auto",
        position: "right",
        size: "8px",
        color: "#9ea5ab",
        wheelStep: 5,
        touchScrollStep: 20,
      });
    }),
      (t.prototype.initMenu = function () {
        var i = this;
        a(".button-menu-mobile").on("click", function (t) {
          t.preventDefault(),
            i.$body.toggleClass("sidebar-enable"),
            768 <= i.$window.width()
              ? i.$body.toggleClass("enlarged")
              : i.$body.removeClass("enlarged"),
            i._resetSidebarScroll();
        }),
          a("#side-menu").metisMenu(),
          i._resetSidebarScroll(),
          a(".right-bar-toggle").on("click", function (t) {
            a("body").toggleClass("right-bar-enabled");
          }),
          a(document).on("click", "body", function (t) {
            0 < a(t.target).closest(".right-bar-toggle, .right-bar").length ||
              0 < a(t.target).closest(".left-side-menu, .side-nav").length ||
              a(t.target).hasClass("button-menu-mobile") ||
              0 < a(t.target).closest(".button-menu-mobile").length ||
              (a("body").removeClass("right-bar-enabled"),
              a("body").removeClass("sidebar-enable"));
          }),
          a("#side-menu a").each(function () {
            var t = window.location.href.split(/[?#]/)[0];
            this.href == t &&
              (a(this).addClass("active"),
              a(this).parent().addClass("mm-active"),
              a(this).parent().parent().addClass("mm-show"),
              a(this).parent().parent().prev().addClass("active"),
              a(this).parent().parent().parent().addClass("mm-active"),
              a(this).parent().parent().parent().parent().addClass("mm-show"),
              a(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .addClass("mm-active"));
          }),
          a(".navbar-toggle").on("click", function (t) {
            a(this).toggleClass("open"), a("#navigation").slideToggle(400);
          });
      }),
      (t.prototype.initLayout = function () {
        768 <= this.$window.width() && this.$window.width() <= 1024
          ? this.$body.addClass("enlarged")
          : 1 != this.$body.data("keep-enlarged") &&
            this.$body.removeClass("enlarged");
      }),
      (t.prototype.init = function () {
        var i = this;
        this.initLayout(),
          this.initMenu(),
          a.Components.init(),
          i.$window.on("resize", function (t) {
            t.preventDefault(), i.initLayout(), i._resetSidebarScroll();
          });
      }),
      (a.App = new t()),
      (a.App.Constructor = t);
  })(window.jQuery),
  (function (t) {
    "use strict";
    window.jQuery.App.init();
  })(),
  Waves.init();
// #! sourceMappingURL=app.min.js.map
