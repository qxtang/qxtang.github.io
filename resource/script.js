"use strict";

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
document.addEventListener('DOMContentLoaded', function () {
  var utils = {
    getQueryString: function getQueryString(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    }
  };
  var LAST_VISIT_STORAGE_KEY = 'LAST_VISIT_KEY_FJHY3PHJ00';
  var COLLAPSE_STORAGE_KEY = 'COLLAPSE_KEY_IXIFMU64D7';
  var isMobile = Boolean(document.body.clientWidth < 900);
  var currPath = decodeURIComponent(window.location.pathname);
  var isIndex = ["".concat(window.root, "/"), "".concat(window.root, "/index.html"), '/', '/index.html'].includes(currPath);
  var lastVisitPathInStore = window.localStorage.getItem(LAST_VISIT_STORAGE_KEY);

  // navigate to last visit
  /*(function () {
    if (isIndex && lastVisitPathInStore) {
      fetch(lastVisitPathInStore)
        .then(res => {
          if (res.status === 200) {
            window.location.href = lastVisitPathInStore;
          } else {
            window.localStorage.removeItem(LAST_VISIT_STORAGE_KEY);
          }
        });
    }
  })();*/

  // menu
  (function () {
    var $dirs = $('#menu .dir');
    var $loading = $('#menu .loading');
    var $links = $('#menu .children > a');
    var host = window.location.protocol + '//' + window.location.host;
    var getCurrCollapseArr = function getCurrCollapseArr() {
      return JSON.parse(window.localStorage.getItem(COLLAPSE_STORAGE_KEY) || '[]');
    };
    var currCollapseArr = getCurrCollapseArr();
    var toggleMenu = function toggleMenu(id) {
      var $parent = $("#".concat(id)).parent('.parent');
      $parent.toggleClass('expand');
      var currCollapseArr = getCurrCollapseArr();
      var hasExpand = $parent.hasClass('expand');
      if (hasExpand) {
        currCollapseArr.remove(id);
      } else {
        currCollapseArr.push(id);
      }
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(currCollapseArr));
    };
    var expandMenuById = function expandMenuById(id) {
      var $parents = $("#".concat(id)).parents('.parent');
      $parents.each(function () {
        $(this).addClass('expand');
      });
    };
    var scrollToId = function scrollToId(id) {
      if (!id) {
        return;
      }
      var ele = $("#".concat(id));
      if (ele.length > 0) {
        $('#menu').scrollTop(ele.offset().top - 100);
      }
    };

    // 设置 dir
    $dirs.each(function () {
      var id = $(this).attr('id');
      var $parent = $(this).parent('.parent');
      var $triangle = $(this).children('.triangle');
      var href = decodeURIComponent($(this).data('href'));
      if (currCollapseArr.includes(id)) {
        $parent.removeClass('expand');
      }
      if (href) {
        var _path = href.replace(host, '');
        var isActive = currPath === _path;
        if (isActive) {
          expandMenuById(id);
          scrollToId(id);
          $(this).addClass('active');
        }
      }

      // 跳转指引
      $(this).on('click', function () {
        if (href) {
          window.location.href = href;
        } else {
          toggleMenu(id);
        }
      });

      // 三角点击事件
      $triangle.on('click', function (event) {
        event.stopPropagation();
        toggleMenu(id);
      });
    });

    // 设置 links
    $links.each(function () {
      var href = decodeURIComponent($(this).prop('href'));
      var _path = href.replace(host, '');
      var isActive = currPath === _path;
      var isLastVisit = lastVisitPathInStore === _path;
      var $children = $(this).parent('.children');
      var id = $children.attr('id');
      if (isActive) {
        expandMenuById(id);
        scrollToId(id);
        $children.addClass('active');
      }
      if (isLastVisit) {
        $(this).addClass('last-visit');
      }
    });
    $loading.remove();
  })();

  // expand-all
  (function () {
    if (isMobile) {
      return;
    }
    var $expandAll = $('#expand-all');
    var $parents = $('#menu .parent');
    $expandAll.on('click', function () {
      $parents.addClass('expand');
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, '[]');
    });
  })();

  // collapse-all
  (function () {
    if (isMobile) {
      return;
    }
    var $collapseAll = $('#collapse-all');
    var $parents = $('#menu .parent');
    var $dirs = $('#menu .dir');
    var ids = $.map($dirs, function (item) {
      return $(item).attr('id');
    });
    $collapseAll.on('click', function () {
      $parents.removeClass('expand');
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(ids));
    });
  })();

  // menu drag
  (function () {
    if (isMobile) {
      return;
    }
    var $drager = $('#drager');
    var $body = $('body');
    var $menu = $('#menu');
    $drager.mouseover(function () {
      if ($menu.hasClass('expand')) {
        $(this).css('cursor', 'e-resize');
      } else {
        $(this).css('cursor', 'unset');
      }
    });
    $drager.mousedown(function () {
      if ($menu.hasClass('expand')) {
        $(this).css('cursor', 'e-resize');
      } else {
        $(this).css('cursor', 'unset');
      }
      $body.mousemove(function (e) {
        var _x = e.pageX;
        if (_x < 245) {
          return;
        }
        $menu.animate({
          width: _x
        }, 0);
      });
    });
    $body.mouseup(function () {
      $(this).unbind('mousemove');
      $(this).css('cursor', 'default');
    });
  })();

  // menu switcher
  (function () {
    if (isMobile) {
      return;
    }
    var $menu = $('#menu');
    var $expandAll = $('#expand-all');
    var $collapseAll = $('#collapse-all');
    var $switcher = $('#drager > #switcher');
    $switcher.on('click', function () {
      $menu.removeAttr('style');
      $menu.toggleClass('expand');
      $expandAll.toggle();
      $collapseAll.toggle();
      $(this).toggleClass('expand');
    });
  })();

  // mobile_menu
  (function () {
    if (!isMobile) {
      return;
    }
    var $mobileMenu = $('#mobile_menu');
    var $menu = $('#menu');
    var $content = $('body > .content.markdown-body');
    $mobileMenu.on('click', function () {
      $menu.toggleClass('show');
    });
    $content.on('click', function () {
      $menu.removeClass('show');
    });
  })();

  // search_bar
  (function () {
    var $input = $('#search_bar > input');
    var $clear = $('#search_bar > #clear');
    var timer = null;
    var getSearchResult = function getSearchResult(str) {
      str = str.toLowerCase();
      var tree = window.__doc_builder_dir_tree__ || [];
      var res = [];
      var fn = function fn(arr) {
        arr.forEach(function (info) {
          var isDir = !!info.dirname;
          if (isDir) {
            fn(info.children);
          } else {
            var findInTitle = info.basename.toLowerCase().indexOf(str) !== -1;
            var findInContent = info.content.toLowerCase().indexOf(str) !== -1;
            if (findInTitle || findInContent) {
              res.push(info);
            }
          }
        });
      };
      fn(tree);
      return res;
    };
    var addHighlight = function addHighlight(str, keyword) {
      var regExp = new RegExp(keyword, 'gi');
      var text = regExp.exec(str);
      return str.replace(regExp, '<mark class="keyword">' + ((text === null || text === void 0 ? void 0 : text[0]) || keyword) + '</mark>');
    };
    var handleInputChange = function handleInputChange(value) {
      value = value.trim().toLowerCase();
      var res = getSearchResult(value);
      var showSearchResult = value.length !== 0;
      var showEmpty = res.length === 0;
      var $wrapEle = $('#search_result');
      var html = '';
      if (value.length !== 0) {
        $clear.show();
      } else {
        $clear.hide();
      }
      if (showEmpty) {
        html = '<div class="empty">No Results!</div>';
      } else {
        html = res.map(function (info) {
          var index = info.content.toLowerCase().indexOf(value);
          var summary = "...".concat(info.content.substring(index, index + 50), "...");
          var href = "".concat(window.root, "/").concat(info.id, ".html?search=").concat(value);
          return "\n              <a class=\"item\" href=\"".concat(href, "\">\n                <div class=\"title\">").concat(addHighlight(info.basename, value), "</div>\n                <div class=\"content\">").concat(addHighlight(summary, value), "</div>\n              </a>\n            ");
        }).join('');
      }
      if (showSearchResult) {
        $wrapEle.html(html);
        $wrapEle.show();
      } else {
        $wrapEle.hide();
      }
    };
    $input.bind('input propertychange', function (e) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        handleInputChange(e.target.value);
      }, 500);
    });
    $clear.on('click', function () {
      $input.val('');
      handleInputChange('');
    });

    // add search input hotkey
    document.addEventListener('keyup', function (e) {
      if (e.key === 's') {
        $input.trigger('focus');
      }
    });
  })();

  // keyword highlight
  (function () {
    var search = utils.getQueryString('search');
    if (search) {
      $('.content.markdown-body').mark(search, {
        className: 'keyword'
      });
    }
  })();

  // image viewer
  (function () {
    $('.markdown-body img').viewer({
      title: false,
      toolbar: false,
      navbar: false
    });
  })();

  // back to top
  (function () {
    if (isMobile) {
      return;
    }
    var $btt = $('#btt');
    var $content = $('body > .content');
    $content.scroll(function () {
      if ($content.scrollTop() > 50) {
        $btt.fadeIn(200);
      } else {
        $btt.fadeOut(200);
      }
    });
    $btt.on('click', function () {
      $content.animate({
        scrollTop: 0
      }, 200);
    });
  })();

  // navigate to hash
  (function () {
    var hash = window.location.hash.slice(1);
    var $content = $('body > .content.markdown-body');
    if (hash) {
      var _$, _$$offset;
      var ele = document.getElementById(hash);
      $content.scrollTop(((_$ = $(ele)) === null || _$ === void 0 ? void 0 : (_$$offset = _$.offset()) === null || _$$offset === void 0 ? void 0 : _$$offset.top) || 0);
    }
  })();

  // set last visit
  (function () {
    if (isIndex) {
      return;
    }
    window.localStorage.setItem(LAST_VISIT_STORAGE_KEY, currPath);
  })();
});