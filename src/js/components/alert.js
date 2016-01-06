;(function ($,win) { //start with a [;] because if our code is combine or minification  with other code,AND other code not terminated with [;] then it will not infect ours.
    var self = this;
	var defaults = {
		title:"",
		content:"这里填写你想要展示的提示内容！~~",// 可以使文字，也可以是html
		btnOK:"OK",
		icon:"",
		callback:null
	};
	
	$(document).ready(function(){
		var pa = $(document.body);
		if(pa.find("[id*='alert'][class*='modal fade']").length==0){
			var wrapper = $('<div class="modal fade" tabindex="-1" role="dialog" id="alert-holder">\
					  <div class="modal-dialog modal-md modal-dialog-ndp">\
						<div class="modal-content"></div>\
					  </div>\
					</div>');
			var header = $('<div class="modal-header">\
						  		<button class="close" data-dismiss="modal">\
						  			<span aria-hidden="true">&times;</span>\
						  		</button>\
						    </div>');
			var body = $('<div class="modal-body"></div>');
			var footer = $('<div class="modal-footer">\
								<button class="btn btn-default" data-dismiss="modal"></button>\
						    </div>');
			wrapper.find("div.modal-content").append(header).append(body).append(footer);
			pa.append(wrapper);
		}

		win.showAlert = function(options){	
			body.empty();
			var icon = $('<div id="icon-holder"></div>');
			var content = $('<div id="content-holder"><div class="content-title"></div>\
								<p class="content-itself"></p></div>');
			body.append(icon).append(content);
			var cfg = $.extend(true,{},defaults,options);
			if(cfg.icon){
				icon.html(cfg.icon).addClass("showing");
				content.addClass("showing");
			}else{
				icon.removeClass("showing");
				content.removeClass("showing");
			}
			if(cfg.title){
				body.find(".content-title").html(cfg.title);
			}
			if(cfg.content){
				content.find(".content-itself").html(cfg.content);
			}
			if(cfg.btnOK){
				footer.find("button.btn").text(cfg.btnOK).attr("value",cfg.btnOK);
			}
			wrapper.unbind("hide.bs.modal").on("hide.bs.modal",function(){
				if(cfg.callback && typeof(cfg.callback)) cfg.callback(wrapper); 
			})
			
			wrapper.modal();//显示alert
		}
		
		
	});
}(jQuery,window));