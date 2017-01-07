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
        gd_trim=gd_verson.trim,
        dataFlag = "gQuery" +("1.0.0"+Math.random()).replace(/\D/,"");

    var gQuery=function(selector){
         return new gQuery.fn.init(selector);
    };

    gQuery.fn=gQuery.prototype={
        constructor:gQuery,
        length:0,
        init:function(selector){

            if(!selector){
                return this;
            };

            if(typeof selector === "string"){
                 if(selector.charAt(0) === "<" && selector.charAt(selector.length-1) === ">" && selector.length >=3){
                     gQuery.merge(this,gQuery.parseHTML(selector));
                 }else{
                        return this.find(selector);
                 }
            }else if(gQuery.isArray(selector)){
                gQuery.merge(this,selector)
            }else if(gQuery.isDOM(selector)){
                this[0]=selector;
                this.length=1;
            }else if(gQuery.isFunction(selector)){
                document.addEventListener( "DOMContentLoaded", selector, false );
            }else if(gQuery.isArrayLike(selector)){
                gQuery.merge(this,selector)
            }


            return this
        },

        each:function(callBacks){
            gQuery.each(this,callBacks);
        },

        pushStack:function(obj){
            var newGq=gQuery();
            gQuery.merge(newGq,obj);
            newGq.preObj = this;
            return newGq;
        },

        eq:function(i){
            var len= i>=0 ? i : this.length+i
            return this.pushStack([this[len]]);
        },

        end:function(){
           return this.preObj || gQuery();
        },

        find:function(obj){
            //TODO：这里没有使用jQuery的Sizzlee而是使用querySelectorAll实现元素选择器，对老式浏览器没做兼容。
             var list=[];
             var length=this.length;
            if(length > 0){
                this.each(function(i,item){
                    gQuery.merge(list,item.querySelectorAll(obj))
                });
            }else{
                gQuery.merge(list,document.querySelectorAll(obj))
            };

            if(this.length == 0){
                return gQuery.merge(this,list)
            }
            return this.pushStack(list);
        },

        css:function(name,value){
            var _this=this;
            if(typeof name === "string"){
                var result=gQuery.camelCase(name);
               this.each(function(i,item){
                   item.style[result]=value;
               })
            }else if(gQuery.isPlainObject(name)){
                gQuery.each(name,function(i,value){
                    var result=gQuery.camelCase(i);
                    _this.each(function(i,item){
                        item.style[result]=value
                    });
                })
            };
            return this
        },

        attr:function(name,value){
            var _this=this;
            if(typeof name === "string"){
                if(arguments.length == 1){
                    return this[0].getAttribute(name);
                }else{
                    this.each(function(i,item){
                        item.setAttribute(name,value)
                    })
                }
            }else if(gQuery.isPlainObject(name)){
                gQuery.each(name,function(attr,value){
                    _this.each(function(i,item){
                         item.setAttribute(attr,value)
                    })
                })
            };
            return this
        },

        removeAttr:function(obj){
            if(typeof obj === "string"){
                this.each(function(i,item){
                    item.removeAttribute(obj)
                })
            }else if(gQuery.isArray(obj)){
                this.each(function(i,item){
                    gQuery.each(obj,function(j,attr){
                        item.removeAttribute(attr);
                    })
                })
            }
            return this;
        },

        addClass:function(obj){
            if(typeof obj === "string"){
                 this.each(function(i,item){
                     var copy=item.className
                         ,result=copy+" "+obj;
                     item.className=result;

                 })
            }else if(gQuery.isArray(obj)){
                this.each(function(i,item){
                    gQuery.each(obj,function(j,className){
                        var copy=item.className
                            ,result=copy+" "+className;
                        item.className=result;
                    })
                })
            }
            return this;
        },

        removeClass:function(obj){
            if(typeof obj === "string"){
                this.each(function(i,item){
                    var result=item.className.replace(obj,"");
                    item.className=result;
                })
            }else if(gQuery.isArray(obj)){
                this.each(function(i,item){
                    gQuery.each(obj,function(j,className){
                        var result=item.className.replace(className,"");
                        item.className=result;
                    })
                })
            }
            return this;
        },

        append:function(obj){
             this.each(function(i,item){
                   if(gQuery.isDOM(obj)){
                       var copy=obj.cloneNode(true);
                       item.appendChild(copy);
                   }else if(gQuery.isArrayLike(obj)){
                       obj.each(function(i,beAppend){
                           var copy=beAppend.cloneNode(true); //拷贝一份DOM，不进行拷贝的话DOM，添加的是DOM引用，导致只会添加到最后一个
                           item.appendChild(copy);
                       });
                   }
             });
            return this
        },

        appendTo:function(obj){
            var _this=this;
            if(gQuery.isDOM(obj)){
                 this.each(function(i,beAppend){
                     var copy=beAppend.cloneNode(true);
                     obj.appendChild(copy);
                 })
            }else if(gQuery.isArrayLike(obj)){
                obj.each(function(i,item){
                    _this.each(function(i,beAppend){
                        var copy=beAppend.cloneNode(true);
                        item.appendChild(copy);
                    })
                })
            };
            return this;
        },

        parent:function(){
            return this.pushStack(gQuery(this[0].parentNode));
        },

        child:function(){
            var list=[];
            var list=gQuery.merge(list,this[0].childNodes);
            gQuery.each(list,function(i,item){
                if(item.nodeName == "#text" && /\s/.test(item.nodeValue)){ //有些浏览器会将换行也当做子节点，这里讲换行删除
                     list.splice(i,1);
                }
            })
            return this.pushStack(list);
        },

        data:function(name,value){
            gQuery(this,name,value);
        },


    }
    gQuery.fn.init.prototype=gQuery.fn;
    /*工具方法*/
    gQuery.camelCase=function(string){
          return string.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(a,b){
              return b.toUpperCase();
          })
    };
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

    gQuery.isDOM=function(obj){
        return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
    }

    gQuery.isArray=function(obj){
        return Array.isArray(obj);
    };

    gQuery.isArrayLike=function(obj){
         var length=obj.length;
         if((gQuery.type(obj) == "object" || gQuery.type(obj) == "nodelist") && gQuery.type(length) === "number" ){
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
        return first;
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
        var tuples=[
            ["resolve","done",gQuery.CallBacks({memory:true,once:true}),"resolved"],
            ["reject","fail",gQuery.CallBacks({memory:true,once:false}),"rejected"]
        ]
            ,state
            ,deferred={}
            ,promise={
                //TODO:增加promise的方法
                 promise:function(obj){
                     return obj !=null ? gQuery.extend(obj,promise) : promise;
                 }
            };

        gQuery.each(tuples,function(i,item){
            var list=item[2]
                ,stateString=item[3];

            if(stateString){
                list.add(function(){
                    state=stateString;
                })
            }
            promise[item[1]]=list.add;
            deferred[item[0]]=function(){
                deferred[item[0]+"With"](this === deferred ? promise:this,arguments);
            };
            deferred[item[0]+"With"]=list.fireWith;
        });
        promise.promise( deferred );
        return deferred;

    };

    gQuery.data=function(obj,name,value){
        var target = gQuery.isArrayLike(obj) ? obj[0] : obj ;
         var getCache=function(target){
             target[dataFlag] = target[dataFlag] || {};
             return target[dataFlag];
         }
         var getData=function(cache,name){
             return cache[name];
         }
         var setData=function(cache,name,value){
                 cache[name]=value;
         }


        if(value === undefined){
            if(typeof name === "string"){
                var cache = getCache(target);
                return getData(cache,name);
            }else if(gQuery.isPlainObject(name)){
                var cache = getCache(target);
                gQuery.each(name,function(a,b){
                    setData(cache,a,b);
                });
            }

        }else{
            var cache = getCache(target);
            setData(cache,name,value)
        }

    };



    window.gQuery=window.g=gQuery;
})(window)