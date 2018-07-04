

// variavel de precisão entre pontos
var precisao = 50

//array de pontos
var pontos  =[
    {x: 239, y: 365},//0
    {x: 248, y: 330},//1
    {x: 257, y: 296},//2
    {x: 269, y: 266},//3
    {x: 272, y: 243},//4
    {x: 275, y: 210},//5
    {x: 277, y: 192},//6
   ];

var canvas = jQuery('#canvas')[0]
var ctx = canvas.getContext('2d')
resizeCanvas()

var BSpline = function(p){
    this.pontos = p
};

BSpline.prototype.calcSpline = function(t, i){

    let x1 = pontos[i-3].x
    let x2 = pontos[i-2].x
    let x3 = pontos[i-1].x
    let x4 = pontos[i].x
    let y1 = pontos[i-3].y
    let y2 = pontos[i-2].y
    let y3 = pontos[i-1].y
    let y4 = pontos[i].y

    let bx = (Math.pow((1-t),3)/6)*x1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*x2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*x3+(Math.pow(t,3)/6)*x4
    let by = (Math.pow((1-t),3)/6)*y1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*y2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*y3+(Math.pow(t,3)/6)*y4
    
    return [bx,by]
}

//Desenha a curva b-spline
function desenharSpline() {
    if(pontos.length >= 4){
        ctx.strokeStyle = "yellow"
        var spline = new BSpline(pontos)
        ctx.beginPath()
        var antx,anty,x,y
        ctx.moveTo(antx,anty)
        for (let i = 3; i < pontos.length; i++) {
            for(var t = 0;t <= 1;t += (1/precisao)){
            
                var interpol = spline.calcSpline(t,i)
                x = interpol[0]
                y = interpol[1]
                ctx.lineTo(x,y)
                antx = x
                anty = y
            }
        }
        ctx.stroke()
        ctx.closePath()
    }
}

//desenha na tela
function desenhar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	desenharSpline()
}