// 游戏控制类
var Game = {

	// 游戏背景
	gamePanel : null,
	
	// 分数
	score : 0,
	
	// 时间
	time : 0,
	
	// 图片映射表
	pieceMap : null,
	
	// 图片列表不包含图片
	pieceList : [],
	
	// 图片列表
	pieceImgList : [],
	
	// 图片随机数列表
	randomList : [],
	
	// 轨迹列表 空的div
	trackList : [],

	// 游戏是否开始
	isGameBigin : false,
	
	// 游戏是否结束
	isGameOver : false,
	
	// 游戏是否重置
	isGameReset : false,
	
	// 图片元素是否第一次点击
	isFirstClick : true,

	//div的行数
	row : 8,			//default is 12

	//div的列数
	column : 7,		//default is 17

	//图片的宽度
	imgWidth : 32,

	//图片的高度
	imgHeight:36,

	//图片的数量
	imgcount : 3,   //default is 23

	setImgWidthAndHeight : function(){
		// alert(getDeviceWidth()+','+this.row);
		this.imgWidth=getDeviceWidth()/this.row;
		this.imgHeight=getDeviceWidth()/this.row;
	},
	
	// 开始游戏
	start : function() {
		this.setImgWidthAndHeight();
		document.getElementById("start").disabled = true;
		document.getElementById("reset").disabled = false;
		var pieces=document.getElementById('pieces');
		pieces.style.width=(this.imgWidth*this.column+2)+"px";
		pieces.style.height=(this.imgHeight*this.row+2)+"px";
	
		if (this.isGameReset) {
			
			this.isGameOver = false;
			this.startTime();
			
			return;
		
		} else if (this.isGameBegin) {
		
			return;
			
		} else {
		
			this.init();
			
			return;
			
		}
	
	},
	//重置游戏，清除面板，重置参数
	reset : function() {
		
		document.getElementById("start").disabled = false;
		document.getElementById("reset").disabled = true;
		
		this.clear();
		this.initPieces();
		this.initImgPieces();
		this.time = 0;
		document.getElementById("time").innerHTML = 0;
		
		// this.score = 0;
		// document.getElementById("score").innerHTML = 0;
		
		this.isGameReset = true;
		this.isGameBegin = true;

	},
	
	// 开始游戏，进行初始化，
	init : function() {



		if (this.isGameBegin) {
		
			return;
		
		}
		
		this.pieceMap = new Map();
		// alert(this.pieceMap);
		
		var _this = this;
		
		this.time = 0;
		this.startTime();
		
		this.gamePanel = document.getElementById("pieces");

		this.initPieces();		//tag:add div to the gamePanel
		this.initImgPieces();	//tag:add img to the div 检测点击事件

		this.isGameBegin = true;

	},
	
	// 生成了12*17的div，并对这204个div进行分类
	initPieces : function() {
	
		var _this = this;
	
		this.initRandomList();
		
		// 打乱随机列表排序
		this.messRandomList();
			
		for (var i = 0; i < (this.row*this.column); i ++) {	//循环加入div
		
			var piece = new Piece(this);	//创建了div和img
			this.pieceList.push(piece);
			
			var x = (i%this.column);					
			var y = Math.floor(i/this.column);
			
			this.pieceMap.put(x+","+y, piece);
			
			piece.setPosition(x, y);
			// alert(x+","+y);
			this.gamePanel.appendChild(piece.dom);	//dom 为承载img的div
			//边界元素添加一个空的div
			if (x == 0 || x == (this.column-1) || y == 0 || y == (this.row-1)) { 
				
				piece.track = document.createElement("div");
				piece.track.className = "track";
				piece.dom.appendChild(piece.track);
				piece.isTracked = true;
				
				continue;
			
			} else {
			
				if (x == 1 || (x == this.column-2) || y == 1 || y == (this.row-2)) {	//游戏界面边界图片
				
					piece.setAtEdge(true);
				
				}
				
				this.pieceImgList.push(piece);
								
			}
									
		}
		// alert(this.pieceImgList.length);
	
	},
	
	// 将150张图片随机添加到div中并检测点击事件
	initImgPieces : function() {

		for (var i = 0; i < this.pieceImgList.length; i ++) {
		
			this.pieceImgList[i].initImg();	//create img and add to div
			// this.pieceImgList[i].img.src = "img/pieces/"+this.randomList[i]+".gif"
			this.pieceImgList[i].img.src = MyImg.Src[this.randomList[i]];
			// alert("3333333333"+MyImg.Src[0]);
			this.pieceImgList[i].setImgSrc(this.pieceImgList[i].img.src);			
			// alert(this.pieceImgList[i].img.width);
			// 执行图片点击事件
			this.pieceImgList[i].onClick();

		}
		
	},
		
	// 初始化随机表75*2
	initRandomList : function() {

		// 获取随机数列，成双出现
		for (var i = 0; i < ((this.row-2)*(this.column-2)/2); i ++) {
		
			var random = parseInt(Math.random()*(this.imgcount-1)*10000, 10);
			var number = random%(this.imgcount);			//得到范围为0-22的数
			this.randomList.push(number);
			this.randomList.push(number);
		
		}	
	
	},
	
	// 打乱随机表
	messRandomList : function() {
	
		for (var i = 0; i < this.randomList.length; i ++) {
		
			var random = parseInt(Math.random()*15*10000, 10);
			var number = random%((this.row-2)*(this.column-2));	  //得到0-149的数

			var temp;
			temp = this.randomList[i];
			this.randomList[i] = this.randomList[number];
			this.randomList[number] = temp;
		
		}		
	
	},
	
	// 开始计时
	startTime : function() {
	
		var _this = this;
	
		if (this.isGameOver) {
		
			return;
		
		} else {
			
			document.getElementById("time").innerHTML = this.time;
			this.time ++;
			this.isGameBegin = true;
			setTimeout(function() {_this.startTime();}, 1000);
		
		}

		// while(this.isGameOver){
			
		// 	this.time ++;
		// 	this.isGameBegin = true;
		// 	setTimeout(function(){document.getElementById("time").innerHTML = this.time;}, 1000)
		// }
	
	},

	
	// 清除，将17*12个div清除掉
	clear : function() {
	
		for (var i = 0; i < this.pieceList.length; i ++) {

			this.gamePanel.removeChild(this.pieceList[i].dom);		
		
		}
		// var text=this.gamePanel.getElementById("text");
		// alert(text);
		// if (text!=null) 
		// {
		// 	alert("llllll");
		// 	this.gamePanel.removeChild(text);
		// }
		
		this.pieceList = [];
		this.randomList = [];
		this.pieceImgList = [];
		
		this.isGameOver = true;
		this.isGameBegin = false;
		
	},
	
	isOver : function(){
		// alert(this.gamePanel.getElementsByTagName("img").length);
		if (this.gamePanel.getElementsByTagName("img").length==0) {
			alert("你的挑战时间为："+(this.time-1)+"秒");
			this.clear();
			// var textNode = document.createTextNode("挑战时间："+this.time);
			// textNode.id="text";
			// this.gamePanel.appendChild(textNode);
		}
	}

}

var MyImg={
	Src:[]
}

window.onload = function() {
	
	document.getElementById("start").disabled = false;
	document.getElementById("reset").disabled = true;

}

// 游戏开始入口
function Start() {
	// alert("hello"+Game.imgSrcList[0]);
	Game.start();

}

// 游戏重置入口
function Reset() {

	Game.reset();
	
}


function ReStart(){
	
	Game.reset();
	Game.start();
	
}


function getDeviceWidth(){
	var device_width=window.innerWidth || document.documentElement.
		clientWidth || document.body.clientWidth;
	return device_width;
}

function getDeviceHeight(){
	var device_height=window.innerHeight || document.documentElement.
		clientHeight || document.body.clientHeight;
	return device_height;
}

function validate(count){
	var a=true;
	if (count!=3) {
		a=false;
		alert("请选择前三张图片");
	}
	return a;
}