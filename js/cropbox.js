



function load(){ 
    //设置canvas 宽度（全屏显示），高度,上下居中显示
    // sqrt=1;
    var posX = 0,posY = 0;     //相对坐标
    var scale = 0;             //记录在缩放动作执行前的 缩放值
    var start_X1=0,start_Y1=0,start_X2=0,start_Y2=0;
    var start_sqrt =0;         //开始缩放比例

    can_obj.width = device_width*4/5 ;
    can_obj.height = device_width*4/5 ;
    can_obj.style.top = (device_height - device_width - 2) / 2 + "px";
    
    //设置图片自适应大小及图片的居中显示
    img_obj.width=can_obj.width;
    img_obj.style.top = (8*device_height/9 - img_obj.height - 2) / 2 + "px";
    img_obj.style.left = (device_width - img_obj.width) / 2 + "px"; 
    dx=img_obj.offsetLeft-can_obj.offsetLeft;
    dy=img_obj.offsetTop-can_obj.offsetTop;
    // imageWidth=img_obj.width;
    // imageHeight=img_obj.height;
    
    document.querySelector("#canvas_div").addEventListener('touchstart',touch, false);
    document.querySelector("#canvas_div").addEventListener('touchmove',touch, false);
    document.querySelector("#canvas_div").addEventListener('touchend',touch, false);
    
    function touch (event){
         var event = event || window.event;
         event.preventDefault();//阻止浏览器或body 其他冒泡事件
         var mv_x1 = event.touches[0].clientX,mv_y1 = event.touches[0].clientY;//手指坐标
         var img_left = img_obj.left;
         var img_top = img_obj.top;//图片坐标
         if(event.touches.length == 1){//单指操作
            if(event.type == "touchstart"){//开始移动
                posX = mv_x1 - img_obj.offsetLeft; //获取img相对坐标
                posY = mv_y1 - img_obj.offsetTop;
            }else if(event.type == "touchmove"){//移动中
                var _x = mv_x1 - posX; //移动坐标
                var _y = mv_y1 - posY;
                dx=_x-can_obj.offsetLeft;
                dy=_y-can_obj.offsetTop;
                img_obj.style.left = _x + "px";
                img_obj.style.top = _y + "px";
            }
         }else if(event.touches.length == 2){//双指操作
             if(event.type == "touchstart"){
                 scale = img_obj.style.Transform == undefined ? 1 : parseFloat(img_obj.style.Transform.replace(/[^0-9^\.]/g,""));//获取在手指按下瞬间的放大缩小值（scale），作用，在移动时，记录上次移动的放大缩小值
                 start_X1 = event.touches[0].clientX;//记录开始的坐标值,作用：在下次放大缩小后，去掉上次放大或缩小的值
                 start_Y1 = event.touches[0].clientY;
                 start_X2 = event.touches[1].clientX;
                 start_Y2 = event.touches[1].clientY;
                 start_sqrt = Math.sqrt((start_X2 - start_X1) * (start_X2 - start_X1) + (start_Y2 - start_Y1) * (start_Y2 - start_Y1)) / 200;//获取在缩放时 当前缩放的值
                 
             }else if(event.type == "touchmove"){
                 var mv_x2 = event.touches[1].clientX,mv_y2 = event.touches[1].clientY;
                 var move_sqrt = Math.sqrt((mv_x2 - mv_x1) * (mv_x2 - mv_x1) + (mv_y2 - mv_y1) * (mv_y2 - mv_y1)) / 200;//动态获取上一次缩放值(随时变更)，在下次缩放时减去上一次的值，作用：防止累加之前的缩放
                 sqrt = move_sqrt - start_sqrt + scale;//求出缩放值
                 
                 img_obj.style.webkitTransform = "scale("+ sqrt +")";//设置放大缩小
                 img_obj.style.Transform = "scale("+ sqrt +")";
             }
         }
    }
}

    //裁图
function getImageData(){
    var imageWidth=img_obj.width;
    var imageHeight=img_obj.height;
    // alert(sqrt);
    var canvas = document.createElement("canvas");
    canvas.width=can_obj.width;
    canvas.height=can_obj.height;
    var context = canvas.getContext("2d");
    
    dx=dx+(1-sqrt)*imageWidth/2;
    dy=dy+(1-sqrt)*imageHeight/2;
    imageWidth=imageWidth*sqrt;
    imageHeight=imageHeight*sqrt;
    context.drawImage(img_obj, dx,dy,imageWidth,imageHeight);
    var imageData = canvas.toDataURL('image/png');
    img_obj.src="";
    // sqrt=1;
    return imageData;
}
