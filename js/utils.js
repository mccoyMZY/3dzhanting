/**
 *mcfee
 *utils
 * */
 
 
(function($, owner) {
	var _inited = false;
	
    owner.mask = function(html){
		/*if(_inited){
			html=html?html:'waiting...';
			if(!$('#mask').length){            
				$('<div id="mask"><div class="mask"></div><div class="mask-content"><span>'+html+'</span><a href="javascript:void(0)" title="关闭"><i class="fa fa-times-circle"></i></a></div></div>').appendTo($('body'));
				$('#mask a').click(function(){
					$('#mask').hide();
				});
			}
			else{
				$('#mask div.mask-content span').html(html);
				$('#mask').show();
			}      
		}		*/
		owner.progress.start();
    };
    
    owner.unmask = function(){
        //$('#mask').hide();
		owner.progress.stop();
    };
    
    owner.log = function(msg){
		console.log(msg);
    };
    
    owner.error = function(err){
        throw Error(err);
    };
    
    owner.uuid = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };
	
	owner.generateId = function() {
		var str = "";
		for (var i=0;i<8;i++) {
			var code = Math.floor(Math.random()*26);
			str += String.fromCharCode("a".charCodeAt(0) + code);
		}
		return str;
	};
    
    owner.htmlencode = function (s){  
        var div = document.createElement('div');  
        div.appendChild(document.createTextNode(s));  
        return div.innerHTML;  
    };
    
    owner.htmldecode = function (s){  
        var div = document.createElement('div');  
        div.innerHTML = s;  
        return div.innerText || div.textContent;  
    };
    
    owner.JsonToRaw = function(object) {
        var str = "";
        for (var index in object) str = str + index + "=" + object[index] + "&";
        return str.substring(0, str.length - 1);
    };
    
    owner.JsonToStr = function(object){
        return JSON.stringify(object);
    };
    	
    owner.StrToJson = function(str){
        return eval('('+str+')');// JSON.parse(str);
    };
    
    owner.CloneJson = function(json){
        return JSON.parse(JSON.stringify(json));
    };
    
    owner.atoi = function(str){
        return parseInt(str);
    };
	    
    owner.loadStyleString = function(css,id) {
        var style = document.createElement("style");
        if(id)style.id=id;
        style.type = "text/css";
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    };

    owner.removeStyle = function(id){
        var style=document.getElementById(id);
        if(style){
            var p;
            if(p=style.parentNode)
                p.removeChild(style);
        }
    };
	
	function makeProtocol(url){
		if('https:' == document.location.protocol){
			return url.replace('http://','https://');
		} 
		else 
			return url.replace('https://','http://');;
	};
	
	owner.loadIcon =function( url){ 
        var link = document.createElement( "link" ); 
        link.rel = "shortcut icon"; 
        link.href = makeProtocol(url); 
        document.getElementsByTagName( "head" )[0].appendChild( link ); 
    };

    owner.loadCSS =function( url ,id,syn){
		url = makeProtocol(url);
		memoryCSS(url);
		if(syn){
			document.write('<link type="text/css"  rel="stylesheet" href="'+url+'">');
		}
		else{
			var link = document.createElement( "link" ); 
			link.type = "text/css"; 
			link.rel = "stylesheet"; 
			link.href = url; 
			if (id) link.id=id;
			document.getElementsByTagName( "head" )[0].appendChild( link ); 
		}
    };

	/*owner.loadCSS = function(url , success ,error) {
		url = makeProtocol(url);
        var link = document.createElement( "link" ); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		link.href = url; 
        success = success || function(){};
        error = error || function() {};
        if(navigator.userAgent.indexOf("MSIE")>0){
            link.onreadystatechange = function(){
                if('loaded' === this.readyState || 'complete' === this.readyState){
                    success();
                    this.onload = this.onreadystatechange = null;
                }
            }
        }else{
            link.onload = function(){
                success();
                this.onload = this.onreadystatechange = null;
            }
        };
        link.onerror = function () {
            error(url);
        };
        document.getElementsByTagName( "head" )[0].appendChild( link ); 
    };	*/
	
    owner.loadJS = function(url, success ,error) {
		url = makeProtocol(url);
        var domScript = document.createElement('script');
        domScript.src = url;
        success = success || function(){};
        error = error || function() {};
        if(navigator.userAgent.indexOf("MSIE")>0){
            domScript.onreadystatechange = function(){
                if('loaded' === this.readyState || 'complete' === this.readyState){
                    success();
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                }
            }
        }else{
            domScript.onload = function(){
                success();
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        };
        domScript.onerror = function () {
            error(url);
        };
        document.getElementsByTagName('head')[0].appendChild(domScript);
    };	
    
    owner.loadJSS = function (urls, success ,error,flag) {
		if(flag !== true)
			memoryJS(urls,flag);
        var nurl = urls[0];
        owner.loadJS(nurl,function(){
            urls.splice(0,1);
            if(urls.length>0){
                owner.loadJSS(urls,success,error,true);
            }
            else if(success){
                success();
            }
        },error);
    };
    
    owner.getCookie =function(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return null;
    };
    
    owner.setCookie =function(name,value){
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date();   
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };
    
    owner.getCache = function(name){
        return localStorage.get(name);
    };
    
    owner.setCache = function(name,value){
        localStorage.set(name,value);
    };
    
    owner.open = function(url,_blank){
        window.open(url);
    };
	
	owner.stopDefault = function( e ) { 
		 if ( e && e.preventDefault ) 
			e.preventDefault(); 
		else 
			window.event.returnValue = false; 
			
		return false; 
	}; 
    
    owner.getUrlParams = function() {  
        var result = {};  
		var params = '';
		if(window.location.search)
			params = (window.location.search.split('?')[1] || '').split('&');  
		else
			params = (window.location.href.split('?')[1] || '').split('&');
        for(var param in params) {  
            if (params.hasOwnProperty(param)) {  
                paramParts = params[param].split('=');  
                result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");  
            }  
        }  
        return result;  
    };  
    
    owner.getQueryString = function (key){
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
		var result = '';
		if(window.location.search)
			result = window.location.search.substr(1).match(reg);
		else{
			result = window.location.href.split('?')[1];
			if(result){
				result = result.match(reg);
			}
		}
        return result?decodeURIComponent(result[2]):'';
    };
    
	owner.replaceQuery = function(v){
		var params = owner.getUrlParams();
		var val = v?v.toString():'';
		if(val){
			for(var key in params){
				if(key){
					val = val.replace('['+key+']',owner.getQueryString(key));
				}
			}
			if(val.indexOf('[')==0)
				val='';
		}
		return val;
	};
	
	owner.replaceTags = function(v){
		var params = owner.getUrlParams();
		var val = v?v.toString():'';
		if(val){
			for(var key in params){
				if(key){
					if(val.indexOf('['+ key +']') > 0)
						val = val.replace('['+key+']',owner.getQueryString(key));
				}
			}
			if(val.indexOf('[') > 0){
				val = val.substring(0,val.indexOf('['));
			}
			if(val.indexOf('[')==0)
				val='';
		}
		return val;
	};
	
	owner.check = function(str,reg){
		return str.match(reg) !== null;
	};
	
	
    owner.ready = function(_paths,_handle,flag){  
		function _ready(paths,handle){
			if(paths){
				owner.loadJSS(paths,function(){ 
						utilsTag.init(function(){
							handle && handle(owner);
						});
					},function(url){
						throw Error('The load ' + (url) + ' fails,check the url！ ')   
					},flag);
			}else{
				handle && handle(owner);
			}
		}
		setTimeout(function(){
			if(!_inited){
				owner.ready(_paths,_handle,flag);
			}
			else
				_ready(_paths,_handle,flag);
		},100)
    }; 
	//owner.colpick = function(arguments){  
		
    //};    	  	

	function memoryJS(urls,flag){
		if(window["packMemory"]){
			var i = packMemory.length;
			packMemory.push({flag:flag?flag:i,urls:urls.join(',').split(',')})	
		}
	};
	
	function memoryCSS(url){
		if(window["cssMemory"]){
			cssMemory.push(url)	
		}
	};

	owner.loadCSS("https://cdn.csdu.net/core/utils.min.css",null,true);
	if(navigator.userAgent.indexOf("MSIE 8")>0 && !window.innerWidth){
		owner.loadJSS([
			'https://cdn.csdu.net/lib/html5shiv/dist/html5shiv.min.js',
			'https://cdn.csdu.net/lib/html5shiv/dist/respond.src.js'
		])
	};
	
	var _URole = '';
	if(owner.getUrlParams().Cookie)
		_URole = '/csb/auth/?cmd=role&Cookie='+owner.getUrlParams().Cookie;
	else
		_URole = '/csb/auth/?cmd=role';
	var Role_Res = $.ajax({
      url: _URole,
      async: false
    });
	utils._tocken = Role_Res.getResponseHeader('tocken');
	owner.loadJSS([
			   //'https://cdn.csdu.net/core/utils.min.js'
			   'https://cdn.csdu.net/core/net.js',
			   'https://cdn.csdu.net/core/log.js',
			   'https://cdn.csdu.net/core/state.js',			   
			   'https://cdn.csdu.net/lib/jquery/plugins.js',
			   'https://cdn.csdu.net/lib/jquery/jquery.json2xml.js',
			   'https://cdn.csdu.net/lib/jquery/jquery.xml2json.js',
			   'https://cdn.csdu.net/lib/modernizr.js',
			   'https://cdn.csdu.net/lib/store/store.js',
			   'https://cdn.csdu.net/lib/store/store-exp.js',
			   'https://cdn.csdu.net/lib/artTemplate/template.js',
			   'https://cdn.csdu.net/lib/artTemplate/plugins.js',
			   'https://cdn.csdu.net/page/js/page-template.js',
			   'https://cdn.csdu.net/core/utils-tag.js',
			   'https://cdn.csdu.net/lib/splash/nprogress.js',
			   'https://cdn.csdu.net/core/utils-progress.js',
			   'https://cdn.csdu.net/lib/alertify/alertify.min.js',
			   'https://cdn.csdu.net/core/utils-alertify.js',
			   'https://cdn.csdu.net/lib/Color-Picker/js/colpick.js'
			   ],
	function(){
		_inited = true;			
	},null,'utils')

}(jQuery, window.utils = {}));


(function($, owner) {
	owner.path = [];
	owner.handle = [];
	owner.ready = function(_handle,_paths){
		if(_paths){
			for(var i=0;i<_paths.length;i++){
				if(owner.path.indexOf(_paths[i])<0){
					owner.path.push(_paths[i]);
				}
			}
		}
		owner.handle.push(_handle);
	}
	
	owner.reload = function(){
		if(module.path.length){
			var paths = [];
			for(var i = 0; i < module.path.length; i++){
				paths.push(module.path[i]);
			}
			utils.loadJSS(paths,function(){
				for(var j = 0; j < module.handle.length; j++)
					module.handle[j]();
			});
		}else{
			for(var j = 0; j < module.handle.length; j++)
				module.handle[j]();
		}
	}
}(jQuery, window.module = {}));