// 三维坐标
function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

// 欧拉角
function Euler(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Euler.prototype.rotate = function() {
  var x = DTR * this.x,
      y = DTR * this.y,
      z = DTR * this.z;
  var te = [];

  var a = Math.cos( x ), b = Math.sin( x );
  var c = Math.cos( y ), d = Math.sin( y );
  var e = Math.cos( z ), f = Math.sin( z );

  var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

  te[ 0 ] = c * e;
  te[ 4 ] = - f;
  te[ 8 ] = d * e;

  te[ 1 ] = ac * f + bd;
  te[ 5 ] = a * e;
  te[ 9 ] = ad * f - bc;

  te[ 2 ] = bc * f - ad;
  te[ 6 ] = b * e;
  te[ 10 ] = bd * f + ac;

  te[3] = 0;
  te[7] = 0;
  te[11] = 0;
  
  te[12] = 0;
  te[13] = 0;
  te[14] = 0;
  te[15] = 1;

  return te;
};

function LineCloud(){
    this._vertexs = [];
    this.vertexs = [];
    this.centerVertex = new Vector3();
    this.faces = [];
    this.euler = new Euler();
    this.buildMesh();
    this.progress = 0;
}
LineCloud.prototype.buildMesh = function() {
    this._vertexs = [
      new Vector3(-48,108,36),
      new Vector3(120,-36,-36),
      new Vector3(-66,-84,-72),
      new Vector3(48,-90,120)
    ];
    this.reset();
};
LineCloud.prototype.upTransform = function() {
    // this.euler.x += 1;
    this.euler.y += 1;
    this.euler.z += 1;
    var te = this.euler.rotate();
    for (var i = 0; i < this._vertexs.length; i++) {
        var vec = this._vertexs[i];
        if (!this.vertexs[i]) this.vertexs[i] = new Vector3();
      
        this.vertexs[i].z = te[8] * vec.x + te[9] * vec.y + te[10] * vec.z;
      
        this.vertexs[i].x = (te[0] * vec.x + te[1] * vec.y + te[2] * vec.z) * 
                            (this.vertexs[i].z + 400) / 400;
        this.vertexs[i].y = (te[4] * vec.x + te[5] * vec.y + te[6] * vec.z) *
                            (this.vertexs[i].z + 400) / 400;
    }
};
LineCloud.prototype.render = function(ctx) {
  
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,245,41,1)';
    ctx.strokeStyle = 'rgba(0,245,56,1)';
    for(var i=0;i<this.vertexs.length;i++){
        var cd = this.vertexs[i];
        ctx.beginPath();
        ctx.arc(cd.x,cd.y,4,0,2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cd.x,cd.y,10,0,2*Math.PI);
        ctx.stroke();
        for(var j=i+1;j<this.vertexs.length;j++){
            var ccdd = this.vertexs[j];
            ctx.beginPath();
            ctx.moveTo(cd.x,cd.y);
            ctx.lineTo(ccdd.x,ccdd.y);
            ctx.stroke();
        }
    }
    this.launch(ctx);
};
LineCloud.prototype.launch = function(ctx) {
    this.age = Date.now()-this.birthday;
    if(this.age>this.life){
      this.reset();
    }
    var space = this.life-this.age;
    var alpha = this.age<=200?this.age/200:this.age>=this.life-200?space/200:1;
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#8fffa2';//ffb4ca
    ctx.lineWidth = 1.8;
    ctx.moveTo(this.vertexs[this.first].x, this.vertexs[this.first].y);
    ctx.lineTo(0, 0);
    ctx.stroke();
  
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(0,245,41,1)';
    ctx.strokeStyle = 'rgba(0,245,41,1)';
    ctx.beginPath();
    ctx.arc(0,0,6,0,2*Math.PI);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.rotate(-90*DTR);
    ctx.arc(0,0,14,0,2*this.progress*Math.PI/100);
    ctx.stroke(); 
    ctx.restore();
    ctx.lineWidth = 1;

};
LineCloud.prototype.reset = function() {
    var preIdx = this.first;
    this.birthday = Date.now();
    this.life = random(500,2000);
    this.first = random([0,1,2,3]);
    while(preIdx === this.first){
        this.first = random([0,1,2,3]);
    }
    this.age = 0;
};

function Text(opts){
    opts = opts || {};
    this.font = opts.font||'bold 24px Arial';
    this.text = opts.text||'loading...';
    this.color = opts.color||'rgba(0,245,41,1)';
    this.textAlign = "center";
    this.textBaseline = "middle";
    this.lineWidth = 1;

    this.x = 0;
    this.y = -32;
}
Text.prototype.update = function(pres){
    this.pres = pres = pres||0;
    this.text = pres+'%';
};
Text.prototype.upTransform = function(ctx){
    ctx.transform(1,0,0,1,this.x,this.y);
};
Text.prototype.render = function(ctx){
    ctx.save();
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowColor = '#ff1f6b';
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.strokeText(this.text,0,0);
    ctx.restore();
};

var lineCloud = new LineCloud();
var loading = new Text();

function Stage(opts) {
    opts = opts || {};
    this.canvas = typeof opts.canvas !== 'string' ? opts.canvas : document.getElementById(opts.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.children = [lineCloud,loading];
}
Stage.prototype.resize = function (w,h,sw,sh){
    this.width = this.canvas.width = w||document.documentElement.offsetWidth;
    this.height = this.canvas.height = h||document.documentElement.offsetHeight;
    if(this.setStyle&&sw&&sh){
        this.canvas.style.width = sw+'px';
        this.canvas.style.height = sh+'px';
    }
};
Stage.prototype.stop = function() {
    this.isAnimating = false;
};
Stage.prototype.start = function() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
};
Stage.prototype.animate = function() {
    var This = this;

    function render() {
        This.render();
        This.isAnimating && window.RAF(render);
    }
    render();
};
Stage.prototype.render = function() {
    var pre = (Date.now()/100)%100>>0;
    lineCloud.progress = pre;
    loading.update(pre);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.transform(1, 0, 0, 1, this.width >> 1, this.height >> 1);
    this.ctx.globalAlpha = 1;
    for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].upTransform(this.ctx);
        this.children[i].render(this.ctx);
    }
    this.ctx.restore();
};

var stage = new Stage({
    canvas: 'canvas'
});

stage.start();