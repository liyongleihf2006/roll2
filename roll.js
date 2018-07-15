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
(function($){
    if($.fn.roll){
        return;
    }
    var setMethods={
        setData:setData
    };
    var getMethods={
        pause:pause,
        run:run
    };
    $.fn.roll=function( ){
        var args=arguments,params,method;
        if(!args.length|| typeof args[0] == 'object'){
            return this.each(function(idx){
                var $self=$(this);
                $self.data('roll',$.extend(true,{},$.fn.roll.default,args[0]));
                params=$self.data('roll');
                _init.call( $self,params);
                _render.call($self);
            });
        }else{
            if(!$(this).data('roll')){
                throw new Error('You has not init roll!');
            }
            params=Array.prototype.slice.call(args,1);
            if (setMethods.hasOwnProperty(args[0])){
                method=setMethods[args[0]];
                return this.each(function(idx){
                    var $self=$(this);
                    method.apply($self,params);
                    _render.call($self);
                });
            }else if(getMethods.hasOwnProperty(args[0])){
                method=getMethods[args[0]];
                return method.apply(this,params);
            }else{
                throw new Error('There is no such method');
            }
        }
    }
    $.fn.roll.default={
        speed:50,
        data:[],
        pause:false,
        formatter:function(item){
            return item;
        }
    }
    function _init(params) {
        return this;
    }
    function _render(){
        var $self=this,
        self = $self.get(0),
        params=$self.data("roll"),
        data = params.data,
        formatter = params.formatter,
        speed = params.speed,
        multData = data.concat(data);
        $self.addClass("roll-container").html(
            data.map(function(item){
                return $("<li/>",{
                    class:"roll-item",
                    html:formatter.call($self,item)
                })
            })
        )
        if(self.scrollHeight>self.clientHeight){
            $self.addClass("roll-container").html(
                multData.map(function(item){
                    return $("<li/>",{
                        "class":"roll-item",
                        html:formatter.call($self,item)
                    })
                })
            )
            setInterval(function(){
                if(!params.pause){
                    var first = self.firstElementChild;
                    $self.find(".roll-item").each(function(i,item){
                        item.style.top =parseFloat(item.style.top||0) - speed/50+"px";
                    })
                    if(parseFloat(first.style.top||0)+first.offsetHeight<0){
                        $self.find(".roll-item").each(function(i,item){
                            item.style.top =0;
                        })
                        $self.append(first);
                    }
                }

            },20)
        }
    }
    function setData(data){
        var params = this.data('roll');
        params.data = data;
    }
    function pause(){
        var $self=this,
        params=$self.data("roll");
        params.pause=true;
    }
    function run(){
        var $self=this,
        params=$self.data("roll");
        params.pause=false;
    }
})(jQuery);