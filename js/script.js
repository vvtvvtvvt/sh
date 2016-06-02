//Объект отрисовывает элементы игры
function Draw( canvas){
	var drawingCanvas = document.getElementById(canvas);
	
    if(drawingCanvas && drawingCanvas.getContext) {
		 this.context = drawingCanvas.getContext('2d');
    }
	
	
	
	this.canvasPosition = {
		x: drawingCanvas.offsetLeft,
		y: drawingCanvas.offsetTop
	};
	this.razmer = drawingCanvas.width;
	this.WAlem = this.razmer/8;
	this.PhisikToLogic = function(x, y){
		return {x:((x- this.canvasPosition.x)/this.WAlem) | 0,
        y:((y - this.canvasPosition.y)/this.WAlem) | 0 }
	}
	this.LogicToPhisik = function(x, y){
		return {x:x*this.WAlem,
        y:y*this.WAlem}
	}
	//рисование клетки поля
	this.DrawPole = function(x, y){
		var temp = this.LogicToPhisik(x,y);
	
		if((x%2==0&&y%2==0)||(x%2==1&&y%2==1))
			this.context.fillStyle="#F00";
		else
			this.context.fillStyle="#00F";
		this.context.beginPath();
	    this.context.rect(temp.x, temp.y, this.WAlem, this.WAlem);
		
		this.context.fill();
		this.context.closePath(); 	
	}
	
	this.DrawPole2 = function(x, y){
		
		var temp = this.LogicToPhisik(x,y);
	
		if((x%2==0&&y%2==0)||(x%2==1&&y%2==1))
			this.context.fillStyle="#0F0";
		else
			this.context.fillStyle="#0F0";
		this.context.beginPath();
	    this.context.rect(temp.x, temp.y, this.WAlem, this.WAlem);
		
		this.context.fill();
		this.context.closePath(); 	
	}
	//рисование шашки по координатам
	this.DrawShahka = function( x,y, color, vozrast){	
		var temp = this.LogicToPhisik(y,x);	
		this.context.lineWidth = 1; // толщина линии
		if(color=="w"){
			this.context.fillStyle="#FFF";
			this.context.strokeStyle="#000";
		}
		else{
			this.context.fillStyle="#000";
			this.context.strokeStyle="#FFF";
		}
		
		if(vozrast==1){
			this.context.beginPath();
			this.context.arc(temp.x+this.WAlem/2,temp.y+this.WAlem/2,this.WAlem/2,0,2*Math.PI,true);
			this.context.fill();
	
			this.context.closePath();
			var temp3 = this.WAlem/2;
			while(temp3>0){
				this.context.beginPath();
				temp3 -= (this.WAlem/2)/5;
				
				this.context.arc(temp.x+this.WAlem/2,temp.y+this.WAlem/2,temp3,0,2*Math.PI,true);
				this.context.stroke();
				this.context.closePath();
			}
		}
		else{
			this.context.beginPath();
			this.context.lineWidth = (this.WAlem/2)/5;
			this.context.arc(temp.x+this.WAlem/2,temp.y+this.WAlem/2,this.WAlem/2,0,2*Math.PI,true);
			this.context.fill();
	
			this.context.closePath();
			var temp3 = this.WAlem/2;
			
				this.context.beginPath();
				temp3 -= (this.WAlem/2)/3;
				this.context.arc(temp.x+this.WAlem/2,temp.y+this.WAlem/2,temp3,0,2*Math.PI,true);
				this.context.stroke();
				this.context.closePath();
			
		}
			
	}
	

	//удаление шашки
	this.ClearShahka = function(X,Y){		
		this.DrawPole(Y,X);
	}
	//перенос шашки по координатам
	this.MoveSh = function(X,Y, X2, Y2, color,vz){	
		this.ClearShahka(X,Y);
		this.DrawShahka(X2,Y2,color, vz);
	}
	
}



//конструктор для объекта клетка поля
function KlPole (X1,Y1, cvet, draw, mainAlem) {
	var X=X1;// координата x
	var Y=Y1;// координата y
	var color = cvet; // цвет поля
	var figure=0; // наличие фигуры
	this.color = cvet;
	this.InsertFigure = function(amount){ // вставка фигуры в поле
		if(figure!=0)
			return -1;// если фигура уже есть то ошибка
		else{
			figure = amount;
			return 0;
			}
		}
	this.hasFigure = function(){
		if(figure==0)
			return false;
		return true;
		}
	this.DeleteFigure = function(){// удаление фигруы с поля
		if(figure==0)
			return -1;//если фигуры нет то ошибка
		else{
			figure.Clear();
			figure = 0;
			return 0;
			}
		}
	this.DoMoveFigure = function(X2, Y2){// передвижение фигруы на клеткe x2, y2
		
		if(figure==0)
			return -1;
		else{
			var temp =  figure.DoMove(X2, Y2);
			if((X2==0&&figure.color=="w")||(X2==7&&figure.color=="b")){
				temp.SetVozrast(2);
				//temp = new Damka(figure.color, mainAlem, draw, X2, Y2, 0);
			}
			
			figure=0;
			return temp;
			}
		}
	
	this.GetFigure = function(){// возврат значения фигуры
		return figure ;		
		}
	// рисуем поле
	 draw.DrawPole(X, Y);// отрисовка поляM
}

// конструктор для объекта игровое поле
function Pole (X, Y, draw, mainAlem) {
	this.mas = [];// двумерный массив клеток поля
	var flag="b";
	for (var j = 0; j < Y; j++){//отрисовка поля
		this.mas[j] = [];
		for (var i = 0; i < X; i++){
			if(flag=="w")
				flag="b";
			else
				flag="w";
       		this.mas[j][i] = new KlPole(j, i, flag, draw, mainAlem);
		}
		if(flag=="w")
			flag="b";
		else
			flag="w";
	}
	this.CanEatS= function (shahka){//провекра может ли есть шашка
		var ms = [];
		if(shahka==0)
			return ms;
		if(shahka.GetVozrast()==1){
			var color = shahka.GetColor();
			if((shahka.GetX()+2)<X&&(shahka.GetY()+2)<Y){
			if(this.mas[shahka.GetX()+1][shahka.GetY()+1].GetFigure()!=0){
				if(this.mas[shahka.GetX()+1][shahka.GetY()+1].GetFigure().GetColor()!=color&&
					this.mas[shahka.GetX()+2][shahka.GetY()+2].GetFigure()==0){
				
					ms.push({end:{x:shahka.GetX()+2, y:shahka.GetY()+2},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:shahka.GetX()+1, y:shahka.GetY()+1}});
				}
			}
			}
			if((shahka.GetX()-2)>-1&&(shahka.GetY()-2)>-1){
			if(this.mas[shahka.GetX()-1][shahka.GetY()-1].GetFigure()!=0 && this.mas[shahka.GetX()-1][shahka.GetY()-1].GetFigure().GetColor()!=color&&this.mas[shahka.GetX()-2][shahka.GetY()-2].GetFigure()==0){
					
					ms.push({end:{x:shahka.GetX()-2, y:shahka.GetY()-2},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:shahka.GetX()-1, y:shahka.GetY()-1}});
				}
			}
			if((shahka.GetX()-2)>-1&&(shahka.GetY()+2)<Y){
			if(this.mas[shahka.GetX()-1][shahka.GetY()+1].GetFigure()!=0 && this.mas[shahka.GetX()-1][shahka.GetY()+1].GetFigure().GetColor()!=color&&this.mas[shahka.GetX()-2][shahka.GetY()+2].GetFigure()==0){
					
					ms.push({end:{x:shahka.GetX()-2, y:shahka.GetY()+2},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:shahka.GetX()-1, y:shahka.GetY()+1}});
				}
			}
			if((shahka.GetX()+2)<X&&(shahka.GetY()-2)>-1){
				;
			if(this.mas[shahka.GetX()+1][shahka.GetY()-1].GetFigure()!=0 && this.mas[shahka.GetX()+1][shahka.GetY()-1].GetFigure().GetColor()!=color&&this.mas[shahka.GetX()+2][shahka.GetY()-2].GetFigure()==0){
	
					ms.push({end:{x:shahka.GetX()+2, y:shahka.GetY()-2},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:shahka.GetX()+1, y:shahka.GetY()-1}});
				}
			}
		}
		else{
			var chX = shahka.GetX(); var chY = shahka.GetY();
				
				
				while(true){
					chX+=1;
					chY+=1;
					
					if(!(chX<X&&chY<Y))
						break;
				
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()==color)
						break;
					
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()!=color){
						var tempX1 = chX+1;
						var tempY1 = chY+1;
						if(!(tempX1<X&&tempY1<Y))
							break;
						while(this.mas[tempX1][tempY1].GetFigure()==0){
							if(!(tempX1<X&&tempY1<Y))
								break;
							ms.push({end:{x:tempX1, y:tempY1},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:chX, y:chY}});
							tempX1+=1;
							tempY1+=1;
							if(!(tempX1<X&&tempY1<Y))
								break;
						}
						break;
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
				
				while(true){
					chX+=1;
					chY-=1;
					if(!(chX<X&&chY>-1))
						break;
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()==color)
						break;
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()!=color){
						var tempX1 = chX+1;
						var tempY1 = chY-1;
						if(!(tempX1<X&&tempY1>-1))
							break;
						while(this.mas[tempX1][tempY1].GetFigure()==0){
							if(!(tempX1<X&&tempY1>-1))
								break;
							ms.push({end:{x:tempX1, y:tempY1},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:chX, y:chY}});
							tempX1+=1;
							tempY1-=1;
							if(!(tempX1<X&&tempY1>-1))
								break;
						}
						break;
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
				
				while(true){
					chX-=1;
					chY+=1;
				
					if(!(chX>-1&&chY<Y)){
						break;
					}
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()==color){
						break;
					}
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()!=color){
						var tempX1 = chX-1;
						var tempY1 = chY+1;
						if(!(tempX1>-1&&tempY1<Y))
							break;
						while(this.mas[tempX1][tempY1].GetFigure()==0){
							if(!(tempX1<X&&tempY1>-1))
								break;
							ms.push({end:{x:tempX1, y:tempY1},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:chX, y:chY}});
							tempX1-=1;
							tempY1+=1;
							if(!(tempX1<X&&tempY1>-1))
								break;
						}
						break;
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
			
				while(true){
					chX-=1;
					chY-=1;
					if(!(chX>-1&&chY>-1))
						break;
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()==color)
						break;
					if(this.mas[chX][chY].GetFigure()!=0&&this.mas[chX][chY].GetFigure().GetColor()!=color){
						var tempX1 = chX-1;
						var tempY1 = chY-1;
						if(!(tempX1>-1&&tempY1>-1))
							break;
						while(this.mas[tempX1][tempY1].GetFigure()==0){
							if(!(tempX1<X&&tempY1>-1))
								break;
							ms.push({end:{x:tempX1, y:tempY1},start:{x:shahka.GetX(), y:shahka.GetY()}, eat:{x:chX, y:chY}});
							tempX1-=1;
							tempY1-=1;
							if(!(tempX1<X&&tempY1>-1))
								break;
						}
						break;
					}
				}
				
			}
			
		return ms;
	}
	this.CatGoS= function (shahka){//поиск допустимых шашкой ходов без взятния
		var ms = [];// массив допустимых ходов
		if(shahka.GetVozrast()==1){
			if(shahka.GetColor()=="w"){
				if((shahka.GetX()-1)<X&&(shahka.GetY()+1)<Y){
					if(this.mas[shahka.GetX()-1][shahka.GetY()+1].GetFigure()==0){
						ms.push({x:shahka.GetX()-1, y:shahka.GetY()+1});
						}
				}
				if((shahka.GetX()-1)<X&&(shahka.GetY()-1)>-1){
					if(this.mas[shahka.GetX()-1][shahka.GetY()-1].GetFigure()==0){
						ms.push({x:shahka.GetX()-1, y:shahka.GetY()-1});
						}
				}
			}
			else{
				if((shahka.GetX()+1)<X&&(shahka.GetY()+1)<Y){
					if(this.mas[shahka.GetX()+1][shahka.GetY()+1].GetFigure()==0){
						ms.push({x:shahka.GetX()+1, y:shahka.GetY()+1});
						}
				}
				if((shahka.GetX()-1)<X&&(shahka.GetY()-1)>-1){
					if(this.mas[shahka.GetX()+1][shahka.GetY()-1].GetFigure()==0){
						ms.push({x:shahka.GetX()+1, y:shahka.GetY()-1});
						}
				}
			}
		}
		else{
			
			var chX = shahka.GetX(); var chY = shahka.GetY();
			
				while(true){
					chX+=1;
					chY+=1;
					if(!(chX<X&&chY<Y))
						break;
					if(this.mas[chX][chY].GetFigure()!=0)
						break;
					if(this.mas[chX][chY].GetFigure()==0){
						ms.push({x:chX, y:chY});
						
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
				
				while(true){
					chX+=1;
					chY-=1;
					
					if(!(chX<X&&chY>-1)){
						
						break;
					}
					if(this.mas[chX][chY].GetFigure()!=0){
						break;
					}
					if(this.mas[chX][chY].GetFigure()==0){
						ms.push({x:chX, y:chY});
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
				
				while(true){
					chX-=1;
					chY+=1;
				
					if(!(chX>-1&&chY<Y)){
						break;
					}
					if(this.mas[chX][chY].GetFigure()!=0){
						break;
					}
					if(this.mas[chX][chY].GetFigure()==0){
						ms.push({x:chX, y:chY});
					}
				}
				chX = shahka.GetX(); chY = shahka.GetY();
				
				while(true){
					chX-=1;
					chY-=1;
					if(!(chX>-1&&chY>-1))
						break;
					if(this.mas[chX][chY].GetFigure()!=0)
						break;
					if(this.mas[chX][chY].GetFigure()==0){
						ms.push({x:chX, y:chY});
					}
				}
				
			}
		
		return ms;
	}

}
function Figure(color1,  draw1, X1, Y1){
	//координаты шашки
	this.X=X1;
	this.Y=Y1;

	this.color = color1;//цвет
	this.draw = draw1;// объект с функциями для отрисовки
	this.GetColor= function (){
		return this.color;
		}
	this.GetX= function (){
		return this.X;
		}
	this.GetY= function (){
		return this.Y;
		}
	}
//конструктор шашки
function Shahka(color1, mainAlem, draw1, X1, Y1, faver){
	//координаты шашки
	Figure.call(this, color1,  draw1, X1, Y1);
	this.vozrast=1;
	

	
	
	this.SetVozrast=function(val){
		this.vozrast=val;
		this.draw.DrawShahka(this.X,this.Y, this.color,  this.GetVozrast());
		}
	this.GetVozrast=function(){
		return this.vozrast;
		}
	this.Clear = function (){
		this.draw.ClearShahka(this.X,this.Y);
		}
	this.DoMove = function (X2, Y2){

		this.draw.MoveSh(this.X,this.Y, X2, Y2, this.color, this.GetVozrast());
		this.X=X2;
		this.Y=Y2;
		return this ;
	}
	this.draw.DrawShahka(this.X,this.Y, this.color,  this.GetVozrast());
}

//конструктор дамки
function Damka(color1, mainAlem, draw1, X1, Y1, faver){
	//координаты шашки
	Figure.call(this, color1,  draw1, X1, Y1);
	this.vozrast=2;
	

	
	
	this.SetVozrast=function(val){
		vozrast=val;
		}
	this.GetVozrast=function(){
		return vozrast;
		}
	this.Clear = function (){
		this.draw.ClearShahka(this.X,this.Y);
		}
	this.DoMove = function (X2, Y2){
		this.draw.MoveSh(this.X,this.Y, X2, Y2, this.color, this.GetVozrast());
		this.X=X2;
		this.Y=Y2;
		return this ;
	}
	this.draw.DrawShahka(this.X,this.Y, this.color,  this.GetVozrast());
}



function Game(xl, yl, draw1){
	var mainAlem = document.getElementById("game");//контейнер игрового полея
	var X=xl;//ширина поля
	var Y=yl;//высота поля
	var draw = draw1;//объект с функциями для отрисовки
	var pole = new Pole (X, Y, draw, mainAlem);//создание игрового поля
	var bSh=12;//кол=во чёрных фигур
	var Wsh=12;//кол-во белых фигур
	var hod="w";//очередь хода
	var startHodX=-1;//кординаты первого клика(начало хода)
	var startHodY=-1;
	var endHodX=-1;//кординаты второго клика(конец хода)
	var endHodY=-1;
	var FigDo;//выбраннай фигура
	var vareantEat = [];//массив допустимых взятий фигуры
	var mastit=false;//должен ли игрок есть
	var hx;//шашка которой игрок начал есть(координаты)
	var hy;
	var ChanchColor = function(){// меняет цвет по окончанию хода.
		if(hod=="w")
			hod="b";
		else
			hod="w";

		for (var j = 0; j < Y; j++){
			for (var i = 0; i < X; i++){
				t=5;
				//if(pole.mas[j][i].GetFigure()!=0)
					//pole.mas[j][i].GetFigure().fig.classList.toggle("cursor1");
			}
		}
	
	}
	
	var NexIt = function(hx, hy){// находит может ли шашка находящаяся по заданным координатам что-либо съесть
	//console.log(pole.mas[hx][hy].GetFigure())
		vareantEat=pole.CanEatS(pole.mas[hx][hy].GetFigure());	
				if(vareantEat.length==1){
					mastit=true;
					return;
				}
				
				if(vareantEat.length>1){
					mastit=true;
					return;
				}
				if(vareantEat.length==0){
					mastit=false;
					return;
				}
		
		}
	var FindIt = function(){// проверяет может ли какая либо шашка игрока что либо сьъесть
		vareantEat=[];
		for (var j = 0; j < Y; j++){
			for (var i = 0; i < X; i++){	
				if(pole.mas[j][i].GetFigure()!=0&&pole.mas[j][i].GetFigure().GetColor()==hod){
					//if(pole.mas[j][i].GetFigure().GetVozrast()==1)
						var temp = pole.CanEatS(pole.mas[j][i].GetFigure());
						if (temp.length==0)
							continue;
						if(temp.length==1){
							vareantEat.push(temp[0]);
							continue;
						}
						for(var p=0;p<temp.length;++p)
							vareantEat.push(temp[p]);
					}		
			}
		}
		if(vareantEat.length==1){
			mastit=true;
			return;
		}
		if(vareantEat.length>1){
			mastit=true;
			return;
		}
		if(vareantEat.length==0){
			mastit=false;
			
			return;
		}
		
}
	var CanGo = function(hx, hy, hx2, hy2){//Проверяет допустимость хода шашки с поля hx, hy, на поле hx2, hy2
		var mass2 = pole.CatGoS(pole.mas[hx][hy].GetFigure());
		for(var i=0;i<mass2.length;++i){
			if(mass2[i].x==hx2&&mass2[i].y==hy2)
				return true;
			}
		return false;
		
	}
	var hodDo =function(){// завершает выполнение хода с переключением цвета
		
			ChanchColor();
			
			startHodX = -1;
			startHodY = -1;
			endHodY = -1;
			endHodX=-1;
			
	}
	var EndGo = function(){ // Завершает выполнение действия хода
		startHodX = -1;
			startHodY = -1;
			endHodY = -1;
			endHodX=-1;
		}
	this.newGame = function(){// новая игра
		bSh=12;
		Wsh=12;
		hod="w";
		pole = new Pole (X, Y, draw, mainAlem);//создание игрового поля
		for (var i = 0; i < X; i++){// удаление фигур
			for (var j = 0; j < Y; j++){
				if(pole.mas[j][i].GetFigure()!=0)
				t=4;
       				pole.mas[j][i].DeleteFigure();
			}
		
		}
		// начальная расстановка фигур
		for (var j = 0; j < Y; j++){
			for (var i = 0; i < X; i++){
				if(((i%2==1&&j%2==0)||(i%2!=1&&j%2!=0))&&(j<3)){
					pole.mas[j][i].InsertFigure( new Shahka("b", mainAlem, draw, j, i, 0));
				}
				if(((i%2==1&&j%2==0)||(i%2!=1&&j%2!=0))&&(j>4)){
					pole.mas[j][i].InsertFigure(new Shahka("w", mainAlem, draw, j, i, 0));	
				}
			}
		
		}
	}
	
    
	this.newGame();
	
	mainAlem.addEventListener('mousemove', function (event)
        {
			var logic = draw.PhisikToLogic(event.clientX, event.clientY);
			if(logic.y>0&&logic.x>0&&logic.y<8&&logic.x<8&&pole.mas[logic.y][logic.x].hasFigure()!=0){
				if(hod==pole.mas[logic.y][logic.x].GetFigure().color){
					mainAlem.style.cursor = 'pointer';
					return;
				}
				
			}
			mainAlem.style.cursor = 'default';
		});
	// обработчик для кликов по полю
	mainAlem.addEventListener("click", function (event){
		
		//var target = event.target;
		
		if(bSh==0){
			alert("Белые выйграли");
			return;
			}
		if(Wsh==0){
			alert("Чёрные выйграли");
			return;
		}
		var flag=false;
		
        var logic = draw.PhisikToLogic(event.clientX, event.clientY);

		if(pole.mas[logic.y][logic.x].hasFigure()){
			
			flag=true;
		}

	
		if(startHodX==-1||startHodY==-1){// если это начало хода(первый клик)
			
			if(flag==true){
				startHodX = logic.y;
			    startHodY = logic.x;
				var f = pole.mas[startHodX][startHodY].GetFigure();

				if(f.color==hod){// если истино занчит чёлкнули по фигуре того цвета, которого должен делаться ход.
					//target.classList.add("poleV");// заносим координаты фигуры которой будет делаться ход
					FigDo = f.fig;
					draw.DrawPole2(startHodY, startHodX);
					if(pole.mas[startHodX][startHodY].hasFigure()){
						if(pole.mas[startHodX][startHodY].GetFigure().color=="b"){
							draw.DrawShahka(startHodX,startHodY,"b",pole.mas[startHodX][startHodY].GetFigure().GetVozrast());
							}
						else{
							draw.DrawShahka(startHodX,startHodY,"w", pole.mas[startHodX][startHodY].GetFigure().GetVozrast());
							}
						
					}
				}
				else{
					startHodX=-1;
					startHodY=-1;
					if(hod=="w")
						alert("Нельзя ходить чёрными фигурами, сейчас ход белых");
					else
						alert("Нельзя ходить белыми фигурами, сейчас ход чёрных");
					}
			}
		}
		else{// второй клик, вторая часть кода
			draw.DrawPole(startHodY, startHodX);
			if(pole.mas[startHodX][startHodY].hasFigure()){
				if(pole.mas[startHodX][startHodY].GetFigure().color=="b"){
					draw.DrawShahka(startHodX,startHodY,"b",pole.mas[startHodX][startHodY].GetFigure().GetVozrast());
					}
				else{
					draw.DrawShahka(startHodX,startHodY,"w", pole.mas[startHodX][startHodY].GetFigure().GetVozrast());
					}
				
			}
			var logic = draw.PhisikToLogic(event.clientX, event.clientY);
			endHodX=logic.y;// заносим координаты поля на которое клинули
			endHodY=logic.x;
			if(pole.mas[endHodX][endHodY].GetFigure()==0){// если нет фигуры	
				if(pole.mas[startHodX][startHodY].color=="b"){
					if(mastit==false){
						FindIt();// проверка можно ли что-либо съесть
						if(mastit==false){// если нельзя, то проверям вход без взятия
							if(CanGo(startHodX, startHodY, endHodX, endHodY)){
								pole.mas[endHodX][endHodY].InsertFigure(pole.mas[startHodX][startHodY].DoMoveFigure(endHodX, endHodY));
								hodDo();
								return;
							}
							else{
								alert("Данная фигура не способна выполнить такой ход.");
								EndGo();
								return;
								}
						}
						else{
							var fls=false;
							
							for(var i=0;i<vareantEat.length;++i){// проверяем допустимость взятия
							
								if(vareantEat[i].end.x==endHodX&&vareantEat[i].end.y==endHodY){
									pole.mas[endHodX][endHodY].InsertFigure(pole.mas[startHodX][startHodY].DoMoveFigure(endHodX, endHodY));
									pole.mas[vareantEat[i].eat.x][vareantEat[i].eat.y].DeleteFigure();
										if(hod=="w")
											bSh--;
										else
											Wsh--;
									hx=endHodX;
									hy = endHodY;
									fls = true;
								
								}
							}
							if(fls==false){
								var str = "Ошибка, Вы обязаны есть, одну из фигур на полях:";
								var ahms=['А','B','C','D','E','F','G','H'];
								for(var i=0;i<vareantEat.length;++i){
									str+=" "+ahms[vareantEat[i].eat.y]+":"+(8-vareantEat[i].eat.x);
									}
								alert(str);
								EndGo();
								return;
							}
							else{
								mastit=false;
								NexIt(hx, hy);
								
								if(mastit==false){
								
									hodDo();
								
									return;
									}
									else{
										EndGo();
									return;
								}
								}
								
							
						}
					}
					else{
					
						var fls=false;
						for(var i=0;i<vareantEat.length;++i){// проверка допустимости взятия
							if(vareantEat[i].end.x==endHodX&&vareantEat[i].end.y==endHodY){
								pole.mas[endHodX][endHodY].InsertFigure(pole.mas[startHodX][startHodY].DoMoveFigure(endHodX, endHodY));
								pole.mas[vareantEat[i].eat.x][vareantEat[i].eat.y].DeleteFigure();
								if(hod=="w")
									bSh--;
								else
									Wsh--;
								//NexIt(endHodX,endHodY);
								hx=endHodX;
									hy = endHodY;
								fls = true;
							}
						}
						}
						if(fls==false){
								var str = "Ошибка, Вы обязаны есть, одну из фигур на полях:";
								var ahms=['А','B','C','D','E','F','G','H'];
								for(var i=0;i<vareantEat.length;++i){
									str+=" "+ahms[vareantEat[i].eat.y]+":"+(vareantEat[i].eat.x+1);
									}
								alert(str);
								EndGo();
								return;
							}
							else{
								mastit=false;
								NexIt(hx, hy);
								if(mastit==false){
									hodDo();
									return;
									}
								}
				}
				else{
						alert("Можно ходить только по чёрным полям");
						EndGo();
								return;
					}
			}
			else{
				alert("Ход невозможен. Поле занято другой фигурой");
				EndGo();
								return;
				}
			
			
			}
	});
	

	}
function main2(){
	//game = document.getElementById("gamesh");
	//var new2 = document.getElementById("newgame");
	
	//var dr = new Draw();
	//var mnGame =new Game(8,8,dr);
	//new2.addEventListener("click", function (event){
	//	mnGame.newGame();
	//});
	var drawingCanvas = document.getElementById('game');
    if(drawingCanvas && drawingCanvas.getContext) {
		 var context = drawingCanvas.getContext('2d');
		 
		 var dr = new Draw('game');
		 var mnGame =new Game(8,8,dr);
		 var new2 = document.getElementById("newgame");
		 new2.addEventListener("click", function (event){
			 mnGame.newGame();
		});
    
    }
}

