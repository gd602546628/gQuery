/**
 * Created by gd on 2016/12/26.
 */

(function(window){
    var gd_verson="1",
        gd_array=[],
        gd_obj={},
        gd_concat=gd_array.concat,
        gd_push=gd_array.push,
        gd_slice=gd_array.slice,
        gd_indexOf=gd_array.indexOf,
        gd_toString=gd_obj.toString,
        gd_hasOwn=gd_obj.hasOwnProperty,
        gd_trim=gd_verson.trim;

    var gQuery=function(selector){
         return new gQuery.fn.init(selector);
    };

    gQuery.fn=gQuery.prototype={
        constructor:gQuery,
        length:0,
        init:function(selector){
              gQuery.merge(this,[5,7,11,3]);
            return this
        },

        each:function(callBacks){
            gQuery.each(this,callBacks);
        }
    }
    gQuery.fn.init.prototype=gQuery.fn;
    /*工具方法*/
    gQuery.type=function(obj){
        if(obj === null){
            return String(obj)
        };
        var a=gd_toString.call(obj).split(" ")[1];
        return a.substring(0, a.length-1).toLowerCase();
    };

    gQuery.isFunction=function(obj){
        return gQuery.type(obj) === "function";
    };

    gQuery.isArray=function(obj){
        return Array.isArray(obj);
    };

    gQuery.isArrayLike=function(obj){
         var length=obj.length;
         if(gQuery.type(obj) == "object" && length ){
             return true
         };

          return  false
    }

    gQuery.isWindow=function(obj){
        return obj != null && obj === obj.window;
    }

    gQuery.isPlainObject=function(obj){  //判断对象是否为字面量对象
        if(gQuery.type(obj) == "object" && !gQuery.isWindow(obj)){
            return true
        };
        return false
    };

    gQuery.inArray= function( elem, arr ) {
        return arr == null ? -1 : gd_indexOf.call( arr, elem );
    };

    //数组及类数组合并
    gQuery.merge=function(first,secoend){
        var i=first.length,
            l=secoend.length,
            j=0;
        for(;j<l;j++){
            first[i++]=secoend[j]
        };

        first.length=i;
    };

    //将字符串解析为HTML数组
    gQuery.parseHTML=function(obj){
        var wrap=document.createElement("div")
         var fragment=document.createDocumentFragment().appendChild(wrap);
        fragment.innerHTML=obj;
         return fragment.childNodes;
    }

    gQuery.error=function(mees){
        throw new Error(mees);
    };

    gQuery.each=function(obj,callBack){
         var type;
         gQuery.isArrayLike(obj) || gQuery.type(obj) == "array" ? type=true : type = false ;

        if(type){
            for(var i=0;i<obj.length;i++){
                callBack(i,obj[i]);
            };
        }else{
            for(var name in obj){
                callBack(name,obj[name]);
            }
        }
    }

    gQuery.extend=function(){
    }

    window.gQuery=window.g=gQuery;
})(window)