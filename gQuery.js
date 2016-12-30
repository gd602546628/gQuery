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
    };

    gQuery.extend=gQuery.fn.extend=function(){
        var options,copy,clone,src,name, i,length,copyisArray,target,deep;
        length=arguments.length;
        i=1;
        deep=false;
        target=arguments[0];

        if(gQuery.type(target) === "boolean"){
            deep = target;
            target = arguments[1] || {};
            i=2;
        };

        if(length == i){
            target = this;
            --i;
        };

        for(;i<length;i++){
            if((options = arguments[i]) != null){
                 for(name in options){
                     src=target[name];
                     copy=options[name];

                     if(src === copy ){
                         continue
                     };

                     if(deep && (gQuery.isPlainObject(copy) || (copyisArray=gQuery.isArray(copy)))){
                          if(copyisArray){
                              copyisArray=false;
                              clone = src && gQuery.isArray(src) ? src :[] ;
                          }else{
                              clone = src && gQuery.isPlainObject(src) ? src : {};
                          };

                         target[name] = gQuery.extend(deep,clone,copy);

                     }else{
                         target[name]=copy
                     }
                 }
            }
        };

        return target
    };

    gQuery.CallBacks=function(options){
        var defaults={
            once:false,//是否只执行一次
            memory:false,//是否记忆，启用将触发所有回调，包含后面加入的
            only:false,//同一回调是否只添加一次
            stopOnFalse:false//某一回调返回false，是否停止后续回调
        };
        defaults=gQuery.extend(true,defaults,options);

        var self={},list=[],firing,fired,fireStart,firingLength,firingIndex,stack = !defaults.once && [],memory;

        var fire=function(data){
            memory= defaults.memory && data;
            fired=true;
            firingIndex=fireStart || 0;
            fireStart=0;
            firingLength=list.length;
            firing=true;
            for(;firingIndex<firingLength;firingIndex++){
                if(list[firingIndex].apply(data[0],data[1]) == false && defaults.stopOnFalse){
                     memory = false;
                     break;
                }
            };

            firing = false ;

            if(stack){
                if(stack.length){
                    fire(stack.shift());
                }
            }else if(memory){
                list=[];
            }else{
                list=null;
                memory=false;
            }

        };

        self={

            add:function(){
              if(list){
                  var start=list.length;

                  (function add(args){
                        gQuery.each(args,function(i,arg){
                            var type=gQuery.type(arg);
                            if(type == "function"){
                                if( !defaults.only || !self.has(arg)){
                                     list.push(arg);
                                }
                            }else{
                                    if(arg && arg.length && type!="string"){
                                        add(arg);
                                    }
                            };
                        });

                      if(firing){
                          firingLength=list.length;

                      }else if(memory){
                          fireStart=start;
                          fire(memory)
                      }

                  })(arguments)
              }
                return this;
            },

            fire:function(){
                self.fireWith(this,arguments);
                return this;
            },

            fireWith:function(context,args){
                args=args || [];
                args=[ context, args.slice ? args.slice() : args ];
                if(list && (!fired || stack)){
                    if(firing){
                        stack.push(args);
                    }else{
                        fire(args)
                    }
                };

                return this;
            },

            has:function(obj){
                return gQuery.inArray(obj,list) != -1;
            }
        }

        return self;
    };

    gQuery.Deferred=function(){
         var deferred={};
         var  CallBack=gQuery.CallBacks({memory:true,once:true});
        deferred.resolve=function(){
            CallBack.fire();
        };
        deferred.done=function(fn){
            CallBack.add(fn)
        };

        return deferred;
    };



    window.gQuery=window.g=gQuery;
})(window)