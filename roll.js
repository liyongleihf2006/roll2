/**
 * 滚动展示
 * options:
 *  speed:50,//每秒钟移动的像素
 *  data:[],//数据
 *  pause:false,//是否暂停移动
 *  formatter:function(item),//格式化展示项
 * methods:
 *  setData(data),//重新填充数据
 *  pause(),//暂停移动
 *  run(),//继续移动
 */
(function ($) {
    if ($.fn.roll) {
        return;
    }
    var setMethods = {
        setData: setData
    };
    var getMethods = {
        pause: pause,
        run: run
    };
    $.fn.roll = function () {
        var args = arguments, params, method;
        if (!args.length || typeof args[0] == 'object') {
            return this.each(function (idx) {
                var $self = $(this);
                $self.data('roll', $.extend(true, {}, $.fn.roll.default, args[0]));
                params = $self.data('roll');
                _init.call($self, params);
                _render.call($self);
            });
        } else {
            if (!$(this).data('roll')) {
                throw new Error('You has not init roll!');
            }
            params = Array.prototype.slice.call(args, 1);
            if (setMethods.hasOwnProperty(args[0])) {
                method = setMethods[args[0]];
                return this.each(function (idx) {
                    var $self = $(this);
                    method.apply($self, params);
                    _render.call($self);
                });
            } else if (getMethods.hasOwnProperty(args[0])) {
                method = getMethods[args[0]];
                return method.apply(this, params);
            } else {
                throw new Error('There is no such method');
            }
        }
    }
    $.fn.roll.default = {
        speed: 50,
        data: [],
        formatter: function (item) {
            return item;
        }
    }
    function _init(params) {
        return this;
    }
    function _render() {
        var $self = this,
            self = $self.get(0),
            params = $self.data("roll"),
            data = params.data,
            formatter = params.formatter;
        $self.addClass("roll-container").html(
            [$("<div/>", {
                class: "roll-inner"
            }).append(
                data.map(function (item) {
                    return $("<li/>", {
                        class: "roll-item",
                        html: formatter.call($self, item)
                    })
                })
            )]
        )
        if (self.scrollHeight > self.clientHeight) {
            $self.addClass("roll-container").html(
                [$("<div/>", {
                    class: "roll-inner"
                }).append(
                    data.map(function (item) {
                        return $("<li/>", {
                            class: "roll-item",
                            html: formatter.call($self, item)
                        })
                    })
                ), $("<div/>", {
                    class: "roll-inner"
                }).append(
                    data.map(function (item) {
                        return $("<li/>", {
                            class: "roll-item",
                            html: formatter.call($self, item)
                        })
                    })
                )]
            )
            doRoll.call($self);
        }
    }
    function doRoll() {
        var $self = this,
            self = $self.get(0),
            params = $self.data("roll"),
            speed = params.speed;
        params._t = setTimeout(function () {
            var first = self.firstElementChild;
            $self.find(".roll-inner").each(function (i, inner) {
                inner.style.top = parseFloat(inner.style.top || 0) - speed / (1000 / 17) + "px";
            });
            if (parseFloat(first.style.top || 0) + first.offsetHeight < 0) {
                $self.find(".roll-inner").each(function (i, inner) {
                    inner.style.top = 0;
                });
                $self.append(first);
            }
            doRoll.call($self);
        }, 17)
    }
    function setData(data) {
        var params = this.data('roll');
        params.data = data;
    }
    function pause() {
        var $self = this,
            params = $self.data("roll");
        clearTimeout(params._t);
    }
    function run() {
        var $self = this,
            params = $self.data("roll");
        clearTimeout(params._t);
        doRoll.call($self);
    }
})(jQuery);