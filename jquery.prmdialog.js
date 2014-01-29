define(['jquery', 'underscore'], function ($, _) {
    var prm_dialog_dialogClass = 'prm_dialog';
    var prm_dialog_modalClass = 'prm_dialog_modal';
    var prm_dialog_modalID = '_modal';

	  $.Event("dialogClosed");
    $.fn.prm_dialog_open = function (options) {
        if (typeof options == "undefined") {
            options = {
                closeOnEsc: true,
                closeOnModal: true,
                topPosition: 0,
                customOpen: false,
                customClose: false,
            };
        }
        var a = typeof options.closeOnEsc == "undefined" ? true : options.closeOnEsc;
        var d = typeof options.closeOnModal == "undefined" ? true : options.closeOnModal;
        var c = navigator.userAgent.toLowerCase().search(/msie [678]/) == -1 ? false : true;
        var topPosition = typeof options.topPosition == "undefined" ? 0 : options.topPosition;
        var customOpen = typeof options.customOpen == "undefined" ? false : options.customOpen;
        var customClose = typeof options.customClose == "undefined" ? false : options.customClose;
        return $(this).each(function () {
            var f = $(this);
            var i = f.css("position") == "fixed" ? true : false;
            var e = f.attr("id");
            if (!e.length) {
                e = "prm_dialog_" + Math.floor(Math.random() * 100000);
                f.attr("id", e);
            }
            var j = e + prm_dialog_modalID;
            $('<div id="' + j + '" class="' + prm_dialog_modalClass + '"></div>').appendTo("body");
            var g = $("#" + j).css({
                position: "fixed",
                top: topPosition,
                left: "0"
            });
            prm_dialog_stretchObj(g);

            if (topPosition == 0) {
              f.appendTo("body").addClass(prm_dialog_dialogClass);
            }
            if (customOpen) {
              customOpen(f);
            } else {
              f.css("display", "block");
            }

            if (!i) {
                f.css("position", "absolute");
            }
            if (topPosition > 0) {
              f.css("top", topPosition)
            } else {
              prm_dialog_centerObj(f, i);
            }
            var h = c ? "resize" : "DOMSubtreeModified";
            f.bind(h + ".prm_dialog_" + e, function (event) {
                var displayElement = $(event.target).css('display');
                if(/block/.test(displayElement)) {
                    prm_dialog_centerObj(f, i);
                }
            });
            $(window).bind("resize.prm_dialog_" + e, function () {
                prm_dialog_centerObj($("#" + e), i);
                prm_dialog_stretchObj(g);
            });
            if (a) {
                $(document).bind("keydown.prm_dialog_" + e, function (l) {
                    var k = l.which ? l.which : l.keyCode;
                    if (k == 27 && !$("#" + e + " ~ ." + prm_dialog_dialogClass + ":visible").length) {
                        $("#" + e).prm_dialog_close({customClose: customClose});
                    }
                });
            }
            if (d) {
                g.bind("click.prm_dialog_" + e, function () {
                    $("#" + e).prm_dialog_close({customClose: customClose});
                    return false;
                });
            }
        });
    };

    $.fn.prm_dialog_close = function (options) {
      options = options || {}
      var customClose = typeof options.customClose == "undefined" ? false : options.customClose;
      return $(this).each(function () {
          var b = $(this);
          var a = b.attr("id");
          $("#" + a + prm_dialog_modalID).remove();
          b.unbind(".prm_dialog_" + a);
          if (customClose) {
            customClose(b);
          } else {
            b.hide();
          }
          $(document).unbind(".prm_dialog_" + a);
          $(window).unbind(".prm_dialog_" + a);
          $('body').trigger('dialogClosed', b);
      });
    };

    function dialogClosed(a) {
      $(".prm_dialog_" + a).empty();
    }

    function prm_dialog_centerObj(c, b) {
        var a = Math.max(Math.round(($(window).width() - c.outerWidth()) / 2), 0);
        var d = Math.max(Math.round(($(window).height() - c.outerHeight()) / 2), 0);
        if (!b) {
            d += $(document).scrollTop();
        }
        c.css({
            top: d,
            left: a
        });
    }

    function prm_dialog_stretchObj(a) {
        a.width($("body").width()).height($("body").height());
    }
});
