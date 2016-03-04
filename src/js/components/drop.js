;(function ($) { //start with a [;] because if our code is combine or minification  with other code,AND other code not terminated with [;] then it will not infect ours.
    var self = this;
    
    function Drop(element, options) {
		var self = this;
		this.elem = element;
		this.config = $.extend(true,{},$.fn.drop.defaults,element.data(),options);
		this.config.width = this.elem.width();
		this.init();	
    };
    
    /**
    **下拉菜单展示的方向问题
    **/
    function setDirect(ta){
        var peal = ta.peal;
        var dp = ta.list; 
        var ls = dp.get(0).getBoundingClientRect();
		var p = peal.get(0).getBoundingClientRect();
		if((window.innerHeight-p.bottom)>ls.height){//下面容得下 下拉菜单的展示，正常
			dp.removeAttr("style");
			ta.elem.find("span.caret-wrapper").removeClass("turnback");
		}else if(p.top>ls.height){//向上展示
			dp.css({"top":-(ls.height)+"px","box-shadow":"0 0 1px #ccc"});
			ta.elem.find("span.caret-wrapper").addClass("turnback");
		}
    };
	
	/***
	** 处理树桩菜单
	**/
	function recursive(fa,arr,cfg){
		var deep = arguments[3]||0;
		var gap = arguments[4]||5;
		deep++;
		var rec = arguments.callee;
		var ul = $("<ul class='sub-drop-list'/>");
		if(cfg.type!=3){
			ul.addClass("hidden");
		}
		ul.css({width:(cfg.width+gap+5)+"px",left:-(gap)+"px"});
		for(var i=0;i<arr.length;i++){
			var o = arr[i];
			var array = o[cfg.subKey]||o.sub||o.son||o.next||o.group;
			var text = o[cfg.textKey]||o.text||o.label||o.title||o.name;
			var li = $("<li class='drop-one-item' value="+text+" deep="+deep+" title="+text+" />");
			var pad = (deep+2)*5 + 2;
			li.css({"padding-left":pad+"px"});
			if(array && array instanceof Array){
				li.addClass("drop-recursive");
				var ca = $("<i/>",{class:"glyphicon"});
				ca.addClass(cfg.caret);
				li.append(ca).append(text);
				rec(li,array,cfg,deep,pad);
			}else{
				li.append(text);
			}
			ul.append(li);
		}
		fa.append(ul);
	}
	/**
	**列表组件的初始化
	**/
    Drop.prototype.init = function () {
        var _this = this;
		this.elem.addClass(this.config.containerClass);//设置 包裹容器的 dim,外观
        this.concrate();//构建下来菜单的样子
		this.initConfig();
        
		/***** 注册监听事件 *****/
		
        _this.peal.click(function(e){
            e.stopImmediatePropagation();
			_this.elem.toggleClass("focus");
            _this.list.toggleClass("hidden");
            setDirect(_this);
        });
        
		
		/****
		** 下拉选项被点击
		***/
        _this.list.find("li[class='drop-one-item'],li[class='drop-one-item split-line']").click(function(e){
            e.stopImmediatePropagation();
            _this.list.addClass("hidden");
			var itemIndex = $(this).index();
//			var deep = parseInt($(this).attr("deep"));
            var value = $(this).attr("value");
            _this.peal.find("input").val(value);
			//deep 表示树桩菜单第几层 base from 0。index:表示这一层的第几个， base from 1
			if(_this.config.type==3){
				var gp = $(this).parents(".drop-one-item[deep='0']:first");
				fireEvent(_this.elem.get(0),"ITEM_CLICK",{val:value,group:gp.index(),gpname:gp.attr("title")});
			}else{
            	fireEvent(_this.elem.get(0),"ITEM_CLICK",{val:value});
			}
        });
		
		
		/***
		** input 输入框里面 点击键盘
		***/
		_this.peal.keyup(function(e){			
			if(e.keyCode == 13){//回车
				if(!_this.list.hasClass("hidden") && _this.list.find("li.em").length){
					var item = _this.list.find("li.em");
					var val = item.attr("value");
					var deep = item.attr("deep");
					$(this).find("input").val(val);
					if(_this.config.type==3){
						var gp = item.parents(".drop-one-item[deep='0']:first");
						fireEvent(_this.elem.get(0),"ITEM_CLICK",{val:val,group:gp.index(),gpname:gp.attr("title")});
					}else{
						fireEvent(_this.elem.get(0),"ITEM_CLICK",{val:val});
					} 
					_this.list.addClass("hidden");
				}
			}

			var items = _this.list.find("li[class='drop-one-item'],li[class='drop-one-item split-line'],li[class='drop-one-item em'],li[class='drop-one-item split-line em']");	
			var arr = [].slice.call(items,0);
			if(e.keyCode == 40){//下
				//默认选中下拉的 第一个
				//_this.list.focus();
				if(_this.list.find("li.em").length){//存在
					//这个em 处在 items数组中的第几个
					var now = _this.list.data("now")||(function(){
						for(var i=0;i<arr.length;i++){
							if($(arr[i]).hasClass("em")) return i;
						};						
					}());
					var the = items.filter(".em").first();
					var next = $(items[parseInt(now)+1]);
					if(next.get(0)){
						next.addClass("em");
					}else{
						items.first().addClass("em");
					}
					the.removeClass("em");
				}else{//不存在
					items.first().addClass("em");
				}
			}else if(e.keyCode == 38){//上
				//默认选中下拉的最后一个
				the = items.filter(".em").first();
				if(_this.list.find("li.em").length){
					now = _this.list.data("now")||(function(){
						for(var i=0;i<arr.length;i++){
							if($(arr[i]).hasClass("em")) return i;
						};						
					}());
					var prev = $(items[parseInt(now)-1]);
					if(prev.get(0)){
						prev.addClass("em");
					}else{
						items.last().addClass("em");
					}
					the.removeClass("em");
				}else{
					items.last().addClass("em");
				}				
			}			
		});		
		
		/***
		** 如果是树桩菜单，加监听
		**/
		if(_this.config.type!=3) _this.list.find("li.drop-recursive").click(function(e){
			e.stopImmediatePropagation();
			$(this).children("ul.sub-drop-list").toggleClass("hidden");	
			$(this).children("i.glyphicon").toggleClass("turndown");
			setDirect(_this);
		});
		
		/***
		** 处理 有checkbox 的 列表
		**/
		if(_this.config.type == 4){
			var apply = $("<li class='drop-one-item apply-item'><button class='btn btn-default'>Apply</button></li>")
			_this.list.append(apply);
			/**
			**点击 全选
			**/
			_this.list.find("li.all-banner>input[type=checkbox]").change(function(){
				_this.list.find("li.checkbox-item>").prop("checked",this.checked);
			});
			
			/**
			** 点击单个 item 行
			**/
			_this.list.find("li.checkbox-item:not(.all-banner)>input[type=checkbox]").change(function(){
				if(!this.checked){
					_this.list.find("li.all-banner>input[type=checkbox]").prop("checked",this.checked);
				}else{
					
				}
			});
			
			/***
			**点击应用按钮
			**/
			_this.list.find("li.apply-item").click(function(e){
				e.stopImmediatePropagation();
				_this.list.addClass("hidden");
				//派发事件
				var chks = _this.list.find("li.checkbox-item:not(.all-banner):has(input[type]:checked)");
				var cksArr = [];
				var vals = [];
				chks.each(function(index,item){
					var val = $(item).find("span").text();
					cksArr.push({index:$(item).index(),value:val});
					vals.push(val);
				});
				_this.peal.find("input").val(vals.join(","));
				fireEvent(_this.elem.get(0),"APPLY_CLICK",{checkedArr:cksArr});
			});
			
			$(document).click(function(e){
				if(!(e.target.tagName == "INPUT" && e.target.type == "checkbox")){
					$(".ndp-drop-wrapper ul.drop-list:has(li.drop-one-item)").addClass("hidden");
				}
				$(".ndp-drop-wrapper").removeClass("focus");
			});
		}
    };
	
	/**
	** 构建下来菜单样子
	**/
	Drop.prototype.concrate = function(data){
		var _this = this;
        this.peal = $("<div class='drop-peal' tabIndex='-1' />");//外观包装
        if(this.config.type==2) this.peal.addClass("drop-split-peal");
        this.list = $("<ul class='drop-list hidden' tabIndex='-1' tabIndex='-1' />");
        this.peal.html('<input type="text" readonly="true"><span class="caret-wrapper" tabIndex=-1><span class="caret glyphicon '+_this.config.caret+'"></span></span>');
        this.elem.append(_this.peal).append(_this.list);
		if(_this.config.type == 4){
			var all = $("<li class='drop-one-item checkbox-item all-banner'><span>All</span><input type='checkbox'/></li>");
			this.list.append(all);
		}
	};

	/***
	** 设置用户配置选项
	***/
    Drop.prototype.initConfig = function(){
        var _this = this;
        if(this.placeholder){
            _this.peal.find("input").attr("placeholder",_this.placeholder);
        }
        
        if(_this.config.val){
            _this.peal.find("input").val(_this.config.val);
        }
        
		//ser 需要设置名字
        if(_this.config.name){
            _this.peal.find("input").attr("name",_this.config.name);
        }	
		
		/**
		**构建下拉列表
		**/
        _this.config.data.forEach(function(item,index){
			if(item && typeof(item)=="object"){
				var key2 = _this.config.subKey;
				var key1 = _this.config.textkey;
				var sub = item[key2]||item.sub||item.son||item.next||item.group;
				var text = item[key1]||item.text||item.label||item.title||item.name;
				if(sub && sub instanceof Array){//存在下一层数组，说明这是一个
					var li = $("<li class='drop-one-item drop-recursive' deep='0' />");
					if(_this.config.type!=3){
						var ca = $("<i/>",{class:"glyphicon"});
						ca.addClass(_this.config.caret);
						li.append(ca);
					}else{
						li.addClass("group-hilight");
					}
					li.append(text).attr("title",text);
					recursive(li,sub,_this.config,0);
					_this.list.append(li);
				}else{
					li = $("<li class='drop-one-item' value="+text+" deep='0' title="+text+" >"+text+"</li>");
					if(item.disable) li.addClass("disabled");
					if(item.split) li.addClass("split-line");
					if(_this.config.type==4){
						var check = $("<input type='checkbox' />");
						li.addClass("checkbox-item").append(check);
					}
					_this.list.append(li);	
				}
			}else if(typeof(item)=="number"||typeof(item)=="string"){
				li = $("<li class='drop-one-item' />");
				li.attr("value",item).append("<span title="+item+" >"+item+"</span>");
				if(_this.config.type==4){
					li.addClass("checkbox-item");
					var check = $("<input type='checkbox' />");
					li.append(check);
				}
				_this.list.append(li);
			}
        });
    }
    /**
     * jquery 提供了一个objct 即 fn，which is a shotcut of jquery object prototype
     * or you can call it jquery plugin shell  == fn
     *  类似于  Class.prototype.jqplugin = function(){};0  
     *  the   $.fn  [same as] Class.prototype
     * plugin entrance
     */
    $.fn.drop = function (options) {
		var the = this.first();
        var drop = new Drop(the, options);
		the = $.extend(true,{},the,new exchange(drop));
		return the;
    };
	
    /***
    **和其他插件的交互
	** factory Class
    **@param {Drop} drop :  instacne of the plugin builder
    **/
    function exchange(drop){
		/***
		** 设置显示的值
		***/
		this.val = function(o){
			var txt = (typeof(o)=="string"||typeof(o)=="number")?o:(o.label||o.text||o.name||o.value);
			drop.elem.find("input").val(txt);
			return drop.elem;
		}
    }
	/***
	** outside accessible default setting
	**/
	$.fn.drop.defaults = {
        type:1,//1，inline; 2 split dropdown下拉,3 分组显示菜单，组名高亮，不能被点击,4 checkbox,多选
		name:"drop",//为了便于serialize 设置name属性
        placeholder:null,//提示文字
		textKey:"",//默认猜测，text,label,title,name
		subKey:"",//默认猜测，sub, son, next
        val:null,//默认值
		caret:"glyphicon-triangle-right",//只是箭头的样式，仅支持bootstrap 里面列出的 glyphicon 
        data:[]//下拉菜单列表
	};
}(jQuery));
