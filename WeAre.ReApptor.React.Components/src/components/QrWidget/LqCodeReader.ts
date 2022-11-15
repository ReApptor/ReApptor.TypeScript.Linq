const OutputWidth: number = 800;
const OutputHeight: number = 600;

interface ILqCodeReader {
    canvas_qr2: HTMLCanvasElement | null;
    qrcontext2: CanvasRenderingContext2D | null;
    debug: boolean;
    callback: (result: object) => void;
    decode: () => void;
}

export default class LqCodeReader {

    private static readonly _lqCodeReaderJs: string = "var _aa={};function _a1(t,e){this.count=t,this._fc=e,this.__defineGetter__(\"Count\",function(){return this.count}),this.__defineGetter__(\"_dm\",function(){return this._fc})}function _a2(t,e,n){this._bm=t,n?this._do=[e,n]:this._do=Array(e),this.__defineGetter__(\"_bo\",function(){return this._bm}),this.__defineGetter__(\"_dn\",function(){return this._bm*this._fo}),this.__defineGetter__(\"_fo\",function(){for(var t=0,e=0;e<this._do.length;e++)t+=this._do[e].length;return t}),this._fb=function(){return this._do}}function _a3(t,e,n,a,i,r){this._bs=t,this._ar=e,this._do=[n,a,i,r];for(var _=0,h=n._bo,s=n._fb(),o=0;o<s.length;o++){var w=s[o];_+=w.Count*(w._dm+h)}this._br=_,this.__defineGetter__(\"_fd\",function(){return this._bs}),this.__defineGetter__(\"_as\",function(){return this._ar}),this.__defineGetter__(\"_dp\",function(){return this._br}),this.__defineGetter__(\"_cr\",function(){return 17+4*this._bs}),this._aq=function(){var t=this._cr,e=new _ac(t);e._bq(0,0,9,9),e._bq(t-8,0,8,9),e._bq(0,t-8,9,8);for(var n=this._ar.length,a=0;a<n;a++)for(var i=this._ar[a]-2,r=0;r<n;r++)(0!=a||0!=r&&r!=n-1)&&(a!=n-1||0!=r)&&e._bq(this._ar[r]-2,i,5,5);return e._bq(6,9,1,t-17),e._bq(9,6,t-17,1),this._bs>6&&(e._bq(t-11,0,3,6),e._bq(0,t-11,6,3)),e},this._bu=function(t){return this._do[t.ordinal()]}}function _ay(){return[new _a3(1,[],new _a2(7,new _a1(1,19)),new _a2(10,new _a1(1,16)),new _a2(13,new _a1(1,13)),new _a2(17,new _a1(1,9))),new _a3(2,[6,18],new _a2(10,new _a1(1,34)),new _a2(16,new _a1(1,28)),new _a2(22,new _a1(1,22)),new _a2(28,new _a1(1,16))),new _a3(3,[6,22],new _a2(15,new _a1(1,55)),new _a2(26,new _a1(1,44)),new _a2(18,new _a1(2,17)),new _a2(22,new _a1(2,13))),new _a3(4,[6,26],new _a2(20,new _a1(1,80)),new _a2(18,new _a1(2,32)),new _a2(26,new _a1(2,24)),new _a2(16,new _a1(4,9))),new _a3(5,[6,30],new _a2(26,new _a1(1,108)),new _a2(24,new _a1(2,43)),new _a2(18,new _a1(2,15),new _a1(2,16)),new _a2(22,new _a1(2,11),new _a1(2,12))),new _a3(6,[6,34],new _a2(18,new _a1(2,68)),new _a2(16,new _a1(4,27)),new _a2(24,new _a1(4,19)),new _a2(28,new _a1(4,15))),new _a3(7,[6,22,38],new _a2(20,new _a1(2,78)),new _a2(18,new _a1(4,31)),new _a2(18,new _a1(2,14),new _a1(4,15)),new _a2(26,new _a1(4,13),new _a1(1,14))),new _a3(8,[6,24,42],new _a2(24,new _a1(2,97)),new _a2(22,new _a1(2,38),new _a1(2,39)),new _a2(22,new _a1(4,18),new _a1(2,19)),new _a2(26,new _a1(4,14),new _a1(2,15))),new _a3(9,[6,26,46],new _a2(30,new _a1(2,116)),new _a2(22,new _a1(3,36),new _a1(2,37)),new _a2(20,new _a1(4,16),new _a1(4,17)),new _a2(24,new _a1(4,12),new _a1(4,13))),new _a3(10,[6,28,50],new _a2(18,new _a1(2,68),new _a1(2,69)),new _a2(26,new _a1(4,43),new _a1(1,44)),new _a2(24,new _a1(6,19),new _a1(2,20)),new _a2(28,new _a1(6,15),new _a1(2,16))),new _a3(11,[6,30,54],new _a2(20,new _a1(4,81)),new _a2(30,new _a1(1,50),new _a1(4,51)),new _a2(28,new _a1(4,22),new _a1(4,23)),new _a2(24,new _a1(3,12),new _a1(8,13))),new _a3(12,[6,32,58],new _a2(24,new _a1(2,92),new _a1(2,93)),new _a2(22,new _a1(6,36),new _a1(2,37)),new _a2(26,new _a1(4,20),new _a1(6,21)),new _a2(28,new _a1(7,14),new _a1(4,15))),new _a3(13,[6,34,62],new _a2(26,new _a1(4,107)),new _a2(22,new _a1(8,37),new _a1(1,38)),new _a2(24,new _a1(8,20),new _a1(4,21)),new _a2(22,new _a1(12,11),new _a1(4,12))),new _a3(14,[6,26,46,66],new _a2(30,new _a1(3,115),new _a1(1,116)),new _a2(24,new _a1(4,40),new _a1(5,41)),new _a2(20,new _a1(11,16),new _a1(5,17)),new _a2(24,new _a1(11,12),new _a1(5,13))),new _a3(15,[6,26,48,70],new _a2(22,new _a1(5,87),new _a1(1,88)),new _a2(24,new _a1(5,41),new _a1(5,42)),new _a2(30,new _a1(5,24),new _a1(7,25)),new _a2(24,new _a1(11,12),new _a1(7,13))),new _a3(16,[6,26,50,74],new _a2(24,new _a1(5,98),new _a1(1,99)),new _a2(28,new _a1(7,45),new _a1(3,46)),new _a2(24,new _a1(15,19),new _a1(2,20)),new _a2(30,new _a1(3,15),new _a1(13,16))),new _a3(17,[6,30,54,78],new _a2(28,new _a1(1,107),new _a1(5,108)),new _a2(28,new _a1(10,46),new _a1(1,47)),new _a2(28,new _a1(1,22),new _a1(15,23)),new _a2(28,new _a1(2,14),new _a1(17,15))),new _a3(18,[6,30,56,82],new _a2(30,new _a1(5,120),new _a1(1,121)),new _a2(26,new _a1(9,43),new _a1(4,44)),new _a2(28,new _a1(17,22),new _a1(1,23)),new _a2(28,new _a1(2,14),new _a1(19,15))),new _a3(19,[6,30,58,86],new _a2(28,new _a1(3,113),new _a1(4,114)),new _a2(26,new _a1(3,44),new _a1(11,45)),new _a2(26,new _a1(17,21),new _a1(4,22)),new _a2(26,new _a1(9,13),new _a1(16,14))),new _a3(20,[6,34,62,90],new _a2(28,new _a1(3,107),new _a1(5,108)),new _a2(26,new _a1(3,41),new _a1(13,42)),new _a2(30,new _a1(15,24),new _a1(5,25)),new _a2(28,new _a1(15,15),new _a1(10,16))),new _a3(21,[6,28,50,72,94],new _a2(28,new _a1(4,116),new _a1(4,117)),new _a2(26,new _a1(17,42)),new _a2(28,new _a1(17,22),new _a1(6,23)),new _a2(30,new _a1(19,16),new _a1(6,17))),new _a3(22,[6,26,50,74,98],new _a2(28,new _a1(2,111),new _a1(7,112)),new _a2(28,new _a1(17,46)),new _a2(30,new _a1(7,24),new _a1(16,25)),new _a2(24,new _a1(34,13))),new _a3(23,[6,30,54,78,102],new _a2(30,new _a1(4,121),new _a1(5,122)),new _a2(28,new _a1(4,47),new _a1(14,48)),new _a2(30,new _a1(11,24),new _a1(14,25)),new _a2(30,new _a1(16,15),new _a1(14,16))),new _a3(24,[6,28,54,80,106],new _a2(30,new _a1(6,117),new _a1(4,118)),new _a2(28,new _a1(6,45),new _a1(14,46)),new _a2(30,new _a1(11,24),new _a1(16,25)),new _a2(30,new _a1(30,16),new _a1(2,17))),new _a3(25,[6,32,58,84,110],new _a2(26,new _a1(8,106),new _a1(4,107)),new _a2(28,new _a1(8,47),new _a1(13,48)),new _a2(30,new _a1(7,24),new _a1(22,25)),new _a2(30,new _a1(22,15),new _a1(13,16))),new _a3(26,[6,30,58,86,114],new _a2(28,new _a1(10,114),new _a1(2,115)),new _a2(28,new _a1(19,46),new _a1(4,47)),new _a2(28,new _a1(28,22),new _a1(6,23)),new _a2(30,new _a1(33,16),new _a1(4,17))),new _a3(27,[6,34,62,90,118],new _a2(30,new _a1(8,122),new _a1(4,123)),new _a2(28,new _a1(22,45),new _a1(3,46)),new _a2(30,new _a1(8,23),new _a1(26,24)),new _a2(30,new _a1(12,15),new _a1(28,16))),new _a3(28,[6,26,50,74,98,122],new _a2(30,new _a1(3,117),new _a1(10,118)),new _a2(28,new _a1(3,45),new _a1(23,46)),new _a2(30,new _a1(4,24),new _a1(31,25)),new _a2(30,new _a1(11,15),new _a1(31,16))),new _a3(29,[6,30,54,78,102,126],new _a2(30,new _a1(7,116),new _a1(7,117)),new _a2(28,new _a1(21,45),new _a1(7,46)),new _a2(30,new _a1(1,23),new _a1(37,24)),new _a2(30,new _a1(19,15),new _a1(26,16))),new _a3(30,[6,26,52,78,104,130],new _a2(30,new _a1(5,115),new _a1(10,116)),new _a2(28,new _a1(19,47),new _a1(10,48)),new _a2(30,new _a1(15,24),new _a1(25,25)),new _a2(30,new _a1(23,15),new _a1(25,16))),new _a3(31,[6,30,56,82,108,134],new _a2(30,new _a1(13,115),new _a1(3,116)),new _a2(28,new _a1(2,46),new _a1(29,47)),new _a2(30,new _a1(42,24),new _a1(1,25)),new _a2(30,new _a1(23,15),new _a1(28,16))),new _a3(32,[6,34,60,86,112,138],new _a2(30,new _a1(17,115)),new _a2(28,new _a1(10,46),new _a1(23,47)),new _a2(30,new _a1(10,24),new _a1(35,25)),new _a2(30,new _a1(19,15),new _a1(35,16))),new _a3(33,[6,30,58,86,114,142],new _a2(30,new _a1(17,115),new _a1(1,116)),new _a2(28,new _a1(14,46),new _a1(21,47)),new _a2(30,new _a1(29,24),new _a1(19,25)),new _a2(30,new _a1(11,15),new _a1(46,16))),new _a3(34,[6,34,62,90,118,146],new _a2(30,new _a1(13,115),new _a1(6,116)),new _a2(28,new _a1(14,46),new _a1(23,47)),new _a2(30,new _a1(44,24),new _a1(7,25)),new _a2(30,new _a1(59,16),new _a1(1,17))),new _a3(35,[6,30,54,78,102,126,150],new _a2(30,new _a1(12,121),new _a1(7,122)),new _a2(28,new _a1(12,47),new _a1(26,48)),new _a2(30,new _a1(39,24),new _a1(14,25)),new _a2(30,new _a1(22,15),new _a1(41,16))),new _a3(36,[6,24,50,76,102,128,154],new _a2(30,new _a1(6,121),new _a1(14,122)),new _a2(28,new _a1(6,47),new _a1(34,48)),new _a2(30,new _a1(46,24),new _a1(10,25)),new _a2(30,new _a1(2,15),new _a1(64,16))),new _a3(37,[6,28,54,80,106,132,158],new _a2(30,new _a1(17,122),new _a1(4,123)),new _a2(28,new _a1(29,46),new _a1(14,47)),new _a2(30,new _a1(49,24),new _a1(10,25)),new _a2(30,new _a1(24,15),new _a1(46,16))),new _a3(38,[6,32,58,84,110,136,162],new _a2(30,new _a1(4,122),new _a1(18,123)),new _a2(28,new _a1(13,46),new _a1(32,47)),new _a2(30,new _a1(48,24),new _a1(14,25)),new _a2(30,new _a1(42,15),new _a1(32,16))),new _a3(39,[6,26,54,82,110,138,166],new _a2(30,new _a1(20,117),new _a1(4,118)),new _a2(28,new _a1(40,47),new _a1(7,48)),new _a2(30,new _a1(43,24),new _a1(22,25)),new _a2(30,new _a1(10,15),new _a1(67,16))),new _a3(40,[6,30,58,86,114,142,170],new _a2(30,new _a1(19,118),new _a1(6,119)),new _a2(28,new _a1(18,47),new _a1(31,48)),new _a2(30,new _a1(34,24),new _a1(34,25)),new _a2(30,new _a1(20,15),new _a1(61,16)))]}function _ae(t,e,n,a,i,r,_,h,s){this.a11=t,this.a12=a,this.a13=_,this.a21=e,this.a22=i,this.a23=h,this.a31=n,this.a32=r,this.a33=s,this._ad=function(t){for(var e=t.length,n=this.a11,a=this.a12,i=this.a13,r=this.a21,_=this.a22,h=this.a23,s=this.a31,o=this.a32,w=this.a33,f=0;f<e;f+=2){var $=t[f],c=t[f+1],u=i*$+h*c+w;t[f]=(n*$+r*c+s)/u,t[f+1]=(a*$+_*c+o)/u}},this._fp=function(t,e){for(var n=t.length,a=0;a<n;a++){var i=t[a],r=e[a],_=this.a13*i+this.a23*r+this.a33;t[a]=(this.a11*i+this.a21*r+this.a31)/_,e[a]=(this.a12*i+this.a22*r+this.a32)/_}},this._fr=function(){return new _ae(this.a22*this.a33-this.a23*this.a32,this.a23*this.a31-this.a21*this.a33,this.a21*this.a32-this.a22*this.a31,this.a13*this.a32-this.a12*this.a33,this.a11*this.a33-this.a13*this.a31,this.a12*this.a31-this.a11*this.a32,this.a12*this.a23-this.a13*this.a22,this.a13*this.a21-this.a11*this.a23,this.a11*this.a22-this.a12*this.a21)},this.times=function(t){return new _ae(this.a11*t.a11+this.a21*t.a12+this.a31*t.a13,this.a11*t.a21+this.a21*t.a22+this.a31*t.a23,this.a11*t.a31+this.a21*t.a32+this.a31*t.a33,this.a12*t.a11+this.a22*t.a12+this.a32*t.a13,this.a12*t.a21+this.a22*t.a22+this.a32*t.a23,this.a12*t.a31+this.a22*t.a32+this.a32*t.a33,this.a13*t.a11+this.a23*t.a12+this.a33*t.a13,this.a13*t.a21+this.a23*t.a22+this.a33*t.a23,this.a13*t.a31+this.a23*t.a32+this.a33*t.a33)}}function _bg(t,e){this.bits=t,this.points=e}function Detector(t){this.image=t,this._am=null,this._bi=function(t,e,n,a){var i=Math.abs(a-e)>Math.abs(n-t);if(i){var r=t;t=e,e=r,r=n,n=a,a=r}for(var _=Math.abs(n-t),h=Math.abs(a-e),s=-_>>1,o=e<a?1:-1,w=t<n?1:-1,f=0,$=t,c=e;$!=n;$+=w){var u=i?c:$,d=i?$:c;if(1==f?this.image[u+d*qrcode.width]&&f++:!this.image[u+d*qrcode.width]&&f++,3==f){var v=$-t,l=c-e;return Math.sqrt(v*v+l*l)}if((s+=h)>0){if(c==a)break;c+=o,s-=_}}var g=n-t,b=a-e;return Math.sqrt(g*g+b*b)},this._bh=function(t,e,n,a){var i=this._bi(t,e,n,a),r=1,_=t-(n-t);_<0?(r=t/(t-_),_=0):_>=qrcode.width&&(r=(qrcode.width-1-t)/(_-t),_=qrcode.width-1);var h=Math.floor(e-(a-e)*r);return r=1,h<0?(r=e/(e-h),h=0):h>=qrcode.height&&(r=(qrcode.height-1-e)/(h-e),h=qrcode.height-1),_=Math.floor(t+(_-t)*r),(i+=this._bi(t,e,_,h))-1},this._bj=function(t,e){var n=this._bh(Math.floor(t.X),Math.floor(t.Y),Math.floor(e.X),Math.floor(e.Y)),a=this._bh(Math.floor(e.X),Math.floor(e.Y),Math.floor(t.X),Math.floor(t.Y));return isNaN(n)?a/7:isNaN(a)?n/7:(n+a)/14},this._bk=function(t,e,n){return(this._bj(t,e)+this._bj(t,n))/2},this.distance=function(t,e){var n=t.X-e.X,a=t.Y-e.Y;return Math.sqrt(n*n+a*a)},this._bx=function(t,e,n,a){var i=Math.round(this.distance(t,e)/a),r=Math.round(this.distance(t,n)/a),_=(i+r>>1)+7;switch(3&_){case 0:_++;break;case 2:_--;break;case 3:throw\"Error\"}return _},this._bl=function(t,e,n,a){var i=Math.floor(a*t),r=Math.max(0,e-i),_=Math.min(qrcode.width-1,e+i);if(_-r<3*t)throw\"Error\";var h=Math.max(0,n-i),s=Math.min(qrcode.height-1,n+i);return new _ak(this.image,r,h,_-r,s-h,t,this._am).find()},this.createTransform=function(t,e,n,a,i){var r,_,h,s,o=i-3.5;return null!=a?(r=a.X,_=a.Y,h=s=o-3):(r=e.X-t.X+n.X,_=e.Y-t.Y+n.Y,h=s=o),_ae._ag(3.5,3.5,o,3.5,h,s,3.5,o,t.X,t.Y,e.X,e.Y,r,_,n.X,n.Y)},this._bz=function(t,e,n){return _aa._af(t,n,e)},this._cd=function(t){var e,n=t._gq,a=t._gs,i=t._gp,r=this._bk(n,a,i);if(r<1)throw\"Error\";var _=this._bx(n,a,i,r),h=_a3._at(_),s=h._cr-7,o=null;if(h._as.length>0)for(var w=a.X-n.X+i.X,f=a.Y-n.Y+i.Y,$=1-3/s,c=Math.floor(n.X+$*(w-n.X)),u=Math.floor(n.Y+$*(f-n.Y)),d=4;d<=16;d<<=1){o=this._bl(r,c,u,d);break}var v=this.createTransform(n,a,i,o,_),l=this._bz(this.image,v,_);return e=null==o?[i,n,a]:[i,n,a,o],new _bg(l,e)},this.detect=function(){var t=new _cc()._ce(this.image);return this._cd(t)}}_aa._ab=function(t,e){for(var n=qrcode.width,a=qrcode.height,i=!0,r=e.length,_=0;_<r&&i;_+=2){var h=Math.floor(e[_]),s=Math.floor(e[_+1]);if(h<-1||h>n||s<-1||s>a)throw\"Error._ab \";i=!1,-1==h?(e[_]=0,i=!0):h==n&&(e[_]=n-1,i=!0),-1==s?(e[_+1]=0,i=!0):s==a&&(e[_+1]=a-1,i=!0)}i=!0;for(var _=e.length-2;_>=0&&i;_-=2){var h=Math.floor(e[_]),s=Math.floor(e[_+1]);if(h<-1||h>n||s<-1||s>a)throw\"Error._ab \";i=!1,-1==h?(e[_]=0,i=!0):h==n&&(e[_]=n-1,i=!0),-1==s?(e[_+1]=0,i=!0):s==a&&(e[_+1]=a-1,i=!0)}},_aa._af=function(t,e,n){for(var a=new _ac(e),i=Array(e<<1),r=0;r<e;r++){for(var _=i.length,h=r+.5,s=0;s<_;s+=2)i[s]=(s>>1)+.5,i[s+1]=h;n._ad(i),_aa._ab(t,i);try{for(var s=0;s<_;s+=2)t[Math.floor(i[s])+qrcode.width*Math.floor(i[s+1])]&&a._dq(s>>1,r)}catch(o){throw\"Error._ab\"}}return a},_aa._ah=function(t,e,n,a,i,r,_,h,s,o,w,f,$,c,u,d,v,l){var g=_ae._ag(n,a,i,r,_,h,s,o,w,f,$,c,u,d,v,l);return _aa._af(t,e,g)},_a3._bv=[31892,34236,39577,42195,48118,51042,55367,58893,63784,68472,70749,76311,79154,84390,87683,92361,96236,102084,102881,110507,110734,117786,119615,126325,127568,133589,136944,141498,145311,150283,152622,158308,161089,167017],_a3.VERSIONS=_ay(),_a3._av=function(t){if(t<1||t>40)throw\"bad arguments\";return _a3.VERSIONS[t-1]},_a3._at=function(t){if(t%4!=1)throw\"Error _at\";try{return _a3._av(t-17>>2)}catch(e){throw\"Error _av\"}},_a3._aw=function(t){for(var e=4294967295,n=0,a=0;a<_a3._bv.length;a++){var i=_a3._bv[a];if(i==t)return this._av(a+7);var r=_ax._gj(t,i);r<e&&(n=a+7,e=r)}return e<=3?this._av(n):null},_ae._ag=function(t,e,n,a,i,r,_,h,s,o,w,f,$,c,u,d){var v=this._be(t,e,n,a,i,r,_,h);return this._bf(s,o,w,f,$,c,u,d).times(v)},_ae._bf=function(t,e,n,a,i,r,_,h){var s=h-r,o=e-a+r-h;if(0==s&&0==o)return new _ae(n-t,i-n,t,a-e,r-a,e,0,0,1);var w=n-i,f=_-i,$=t-n+i-_,c=a-r,u=w*s-f*c,d=($*s-f*o)/u,v=(w*o-$*c)/u;return new _ae(n-t+d*n,_-t+v*_,t,a-e+d*a,h-e+v*h,e,d,v,1)},_ae._be=function(t,e,n,a,i,r,_,h){return this._bf(t,e,n,a,i,r,_,h)._fr()};var _ca=21522,_cb=[[21522,0],[20773,1],[24188,2],[23371,3],[17913,4],[16590,5],[20375,6],[19104,7],[30660,8],[29427,9],[32170,10],[30877,11],[26159,12],[25368,13],[27713,14],[26998,15],[5769,16],[5054,17],[7399,18],[6608,19],[1890,20],[597,21],[3340,22],[2107,23],[13663,24],[12392,25],[16177,26],[14854,27],[9396,28],[8579,29],[11994,30],[11245,31]],_ch=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];function _ax(t){this._cf=_cg.forBits(t>>3&3),this._fe=7&t,this.__defineGetter__(\"_cg\",function(){return this._cf}),this.__defineGetter__(\"_dx\",function(){return this._fe}),this.GetHashCode=function(){return this._cf.ordinal()<<3|this._fe},this.Equals=function(t){var e=t;return this._cf==e._cf&&this._fe==e._fe}}function _cg(t,e,n){this._ff=t,this.bits=e,this.name=n,this.__defineGetter__(\"Bits\",function(){return this.bits}),this.__defineGetter__(\"Name\",function(){return this.name}),this.ordinal=function(){return this._ff}}_ax._gj=function(t,e){return _ch[15&(t^=e)]+_ch[15&_ew(t,4)]+_ch[15&_ew(t,8)]+_ch[15&_ew(t,12)]+_ch[15&_ew(t,16)]+_ch[15&_ew(t,20)]+_ch[15&_ew(t,24)]+_ch[15&_ew(t,28)]},_ax._ci=function(t){var e=_ax._cj(t);return null!=e?e:_ax._cj(t^_ca)},_ax._cj=function(t){for(var e=4294967295,n=0,a=0;a<_cb.length;a++){var i=_cb[a],r=i[0];if(r==t)return new _ax(i[1]);var _=this._gj(t,r);_<e&&(n=i[1],e=_)}return e<=3?new _ax(n):null},_cg.forBits=function(t){if(t<0||t>=FOR_BITS.length)throw\"bad arguments\";return FOR_BITS[t]};var L=new _cg(0,1,\"L\"),M=new _cg(1,0,\"M\"),Q=new _cg(2,3,\"Q\"),H=new _cg(3,2,\"H\"),FOR_BITS=[M,L,H,Q];function _ac(t,e){if(e||(e=t),t<1||e<1)throw\"Both dimensions must be greater than 0\";this.width=t,this.height=e;var n=t>>5;(31&t)!=0&&n++,this.rowSize=n,this.bits=Array(n*e);for(var a=0;a<this.bits.length;a++)this.bits[a]=0;this.__defineGetter__(\"Width\",function(){return this.width}),this.__defineGetter__(\"Height\",function(){return this.height}),this.__defineGetter__(\"Dimension\",function(){if(this.width!=this.height)throw\"Can't call getDimension() on a non-square matrix\";return this.width}),this._ds=function(t,e){var n=e*this.rowSize+(t>>5);return(1&_ew(this.bits[n],31&t))!=0},this._dq=function(t,e){var n=e*this.rowSize+(t>>5);this.bits[n]|=1<<(31&t)},this.flip=function(t,e){var n=e*this.rowSize+(t>>5);this.bits[n]^=1<<(31&t)},this.clear=function(){for(var t=this.bits.length,e=0;e<t;e++)this.bits[e]=0},this._bq=function(t,e,n,a){if(e<0||t<0)throw\"Left and top must be nonnegative\";if(a<1||n<1)throw\"Height and width must be at least 1\";var i=t+n,r=e+a;if(r>this.height||i>this.width)throw\"The region must fit inside the matrix\";for(var _=e;_<r;_++)for(var h=_*this.rowSize,s=t;s<i;s++)this.bits[h+(s>>5)]|=1<<(31&s)}}function _dl(t,e){this._dv=t,this._dw=e,this.__defineGetter__(\"_du\",function(){return this._dv}),this.__defineGetter__(\"Codewords\",function(){return this._dw})}function _cl(t){var e=t.Dimension;if(e<21||(3&e)!=1)throw\"Error _cl\";this._au=t,this._cp=null,this._co=null,this._dk=function(t,e,n){return this._au._ds(t,e)?n<<1|1:n<<1},this._cm=function(){if(null!=this._co)return this._co;for(var t=0,e=0;e<6;e++)t=this._dk(e,8,t);t=this._dk(7,8,t),t=this._dk(8,8,t),t=this._dk(8,7,t);for(var n=5;n>=0;n--)t=this._dk(8,n,t);if(this._co=_ax._ci(t),null!=this._co)return this._co;var a=this._au.Dimension;t=0;for(var i=a-8,e=a-1;e>=i;e--)t=this._dk(e,8,t);for(var n=a-7;n<a;n++)t=this._dk(8,n,t);if(this._co=_ax._ci(t),null!=this._co)return this._co;throw\"Error _cm\"},this._cq=function(){if(null!=this._cp)return this._cp;var t=this._au.Dimension,e=t-17>>2;if(e<=6)return _a3._av(e);for(var n=0,a=t-11,i=5;i>=0;i--)for(var r=t-9;r>=a;r--)n=this._dk(r,i,n);if(this._cp=_a3._aw(n),null!=this._cp&&this._cp._cr==t)return this._cp;n=0;for(var r=5;r>=0;r--)for(var i=t-9;i>=a;i--)n=this._dk(r,i,n);if(this._cp=_a3._aw(n),null!=this._cp&&this._cp._cr==t)return this._cp;throw\"Error _cq\"},this._gk=function(){var t=this._cm(),e=this._cq(),n=_dx._gl(t._dx),a=this._au.Dimension;n._dj(this._au,a);for(var i=e._aq(),r=!0,_=Array(e._dp),h=0,s=0,o=0,w=a-1;w>0;w-=2){6==w&&w--;for(var f=0;f<a;f++)for(var $=r?a-1-f:f,c=0;c<2;c++)i._ds(w-c,$)||(o++,s<<=1,this._au._ds(w-c,$)&&(s|=1),8!=o||(_[h++]=s,o=0,s=0));r^=!0}if(h!=e._dp)throw\"Error _gk\";return _}}_dl._gn=function(t,e,n){if(t.length!=e._dp)throw\"bad arguments\";for(var a=e._bu(n),i=0,r=a._fb(),_=0;_<r.length;_++)i+=r[_].Count;for(var h=Array(i),s=0,o=0;o<r.length;o++)for(var w=r[o],_=0;_<w.Count;_++){var f=w._dm,$=a._bo+f;h[s++]=new _dl(f,Array($))}for(var c=h[0]._dw.length,u=h.length-1;u>=0&&h[u]._dw.length!=c;){u--}u++;for(var d=c-a._bo,v=0,_=0;_<d;_++)for(var o=0;o<s;o++)h[o]._dw[_]=t[v++];for(var o=u;o<s;o++)h[o]._dw[d]=t[v++];for(var l=h[0]._dw.length,_=d;_<l;_++)for(var o=0;o<s;o++){var g=o<u?_:_+1;h[o]._dw[g]=t[v++]}return h};var _dx={};function _fg(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return(t+e&1)==0}}function _fh(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return(1&t)==0}}function _fi(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return e%3==0}}function _fj(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return(t+e)%3==0}}function _fk(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return(_ew(t,1)+e/3&1)==0}}function _fl(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){var n=t*e;return(1&n)+n%3==0}}function _fm(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){var n=t*e;return((1&n)+n%3&1)==0}}function _fn(){this._dj=function(t,e){for(var n=0;n<e;n++)for(var a=0;a<e;a++)this._fw(n,a)&&t.flip(a,n)},this._fw=function(t,e){return((t+e&1)+t*e%3&1)==0}}function _db(t){this._fa=t,this.decode=function(t,e){for(var n=new _bp(this._fa,t),a=Array(e),i=0;i<a.length;i++)a[i]=0;for(var r=!0,i=0;i<e;i++){var _=n.evaluateAt(this._fa.exp(i));a[a.length-1-i]=_,0!=_&&(r=!1)}if(!r)for(var h=new _bp(this._fa,a),s=this._eb(this._fa._ba(e,1),h,e),o=s[0],w=s[1],f=this._ey(o),$=this._di(w,f,!1),i=0;i<f.length;i++){var c=t.length-1-this._fa.log(f[i]);if(c<0)throw\"ReedSolomonException Bad error location\";t[c]=_az._bd(t[c],$[i])}},this._eb=function(t,e,n){if(t._ec<e._ec){var a=t;t=e,e=a}for(var i=t,r=e,_=this._fa.One,h=this._fa.Zero,s=this._fa.Zero,o=this._fa.One;r._ec>=Math.floor(n/2);){var w=i,f=_,$=s;if(i=r,_=h,s=o,i.Zero)throw\"r_{i-1} was zero\";r=w;for(var c=this._fa.Zero,u=i._ex(i._ec),d=this._fa.inverse(u);r._ec>=i._ec&&!r.Zero;){var v=r._ec-i._ec,l=this._fa.multiply(r._ex(r._ec),d);c=c._bd(this._fa._ba(v,l)),r=r._bd(i._dc(v,l))}h=c.multiply1(_)._bd(f),o=c.multiply1(s)._bd($)}var g=o._ex(0);if(0==g)throw\"ReedSolomonException sigmaTilde(0) was zero\";var b=this._fa.inverse(g),q=o.multiply2(b),m=r.multiply2(b);return[q,m]},this._ey=function(t){var e=t._ec;if(1==e)return Array(t._ex(1));for(var n=Array(e),a=0,i=1;i<256&&a<e;i++)0==t.evaluateAt(i)&&(n[a]=this._fa.inverse(i),a++);if(a!=e)throw\"Error locator degree does not match number of roots\";return n},this._di=function(t,e,n){for(var a=e.length,i=Array(a),r=0;r<a;r++){for(var _=this._fa.inverse(e[r]),h=1,s=0;s<a;s++)r!=s&&(h=this._fa.multiply(h,_az._bd(1,this._fa.multiply(e[s],_))));i[r]=this._fa.multiply(t.evaluateAt(_),this._fa.inverse(h)),n&&(i[r]=this._fa.multiply(i[r],_))}return i}}function _bp(t,e){if(null==e||0==e.length)throw\"bad arguments\";this._fa=t;var n=e.length;if(n>1&&0==e[0]){for(var a=1;a<n&&0==e[a];)a++;if(a==n)this._dd=t.Zero._dd;else{this._dd=Array(n-a);for(var i=0;i<this._dd.length;i++)this._dd[i]=0;for(var r=0;r<this._dd.length;r++)this._dd[r]=e[a+r]}}else this._dd=e;this.__defineGetter__(\"Zero\",function(){return 0==this._dd[0]}),this.__defineGetter__(\"_ec\",function(){return this._dd.length-1}),this.__defineGetter__(\"Coefficients\",function(){return this._dd}),this._ex=function(t){return this._dd[this._dd.length-1-t]},this.evaluateAt=function(t){if(0==t)return this._ex(0);var e=this._dd.length;if(1==t){for(var n=0,a=0;a<e;a++)n=_az._bd(n,this._dd[a]);return n}for(var i=this._dd[0],a=1;a<e;a++)i=_az._bd(this._fa.multiply(t,i),this._dd[a]);return i},this._bd=function(e){if(this._fa!=e._fa)throw\"GF256Polys do not have same _az _fa\";if(this.Zero)return e;if(e.Zero)return this;var n=this._dd,a=e._dd;if(n.length>a.length){var i=n;n=a,a=i}for(var r=Array(a.length),_=a.length-n.length,h=0;h<_;h++)r[h]=a[h];for(var s=_;s<a.length;s++)r[s]=_az._bd(n[s-_],a[s]);return new _bp(t,r)},this.multiply1=function(t){if(this._fa!=t._fa)throw\"GF256Polys do not have same _az _fa\";if(this.Zero||t.Zero)return this._fa.Zero;for(var e=this._dd,n=e.length,a=t._dd,i=a.length,r=Array(n+i-1),_=0;_<n;_++)for(var h=e[_],s=0;s<i;s++)r[_+s]=_az._bd(r[_+s],this._fa.multiply(h,a[s]));return new _bp(this._fa,r)},this.multiply2=function(t){if(0==t)return this._fa.Zero;if(1==t)return this;for(var e=this._dd.length,n=Array(e),a=0;a<e;a++)n[a]=this._fa.multiply(this._dd[a],t);return new _bp(this._fa,n)},this._dc=function(t,e){if(t<0)throw\"bad arguments\";if(0==e)return this._fa.Zero;for(var n=this._dd.length,a=Array(n+t),i=0;i<a.length;i++)a[i]=0;for(var i=0;i<n;i++)a[i]=this._fa.multiply(this._dd[i],e);return new _bp(this._fa,a)},this.divide=function(t){if(this._fa!=t._fa)throw\"GF256Polys do not have same _az _fa\";if(t.Zero)throw\"Divide by 0\";for(var e=this._fa.Zero,n=this,a=t._ex(t._ec),i=this._fa.inverse(a);n._ec>=t._ec&&!n.Zero;){var r=n._ec-t._ec,_=this._fa.multiply(n._ex(n._ec),i),h=t._dc(r,_),s=this._fa._ba(r,_);e=e._bd(s),n=n._bd(h)}return[e,n]}}function _az(t){this._gh=Array(256),this._gi=Array(256);for(var e=1,n=0;n<256;n++)this._gh[n]=e,(e<<=1)>=256&&(e^=t);for(var n=0;n<255;n++)this._gi[this._gh[n]]=n;var a=[,];a[0]=0,this.zero=new _bp(this,Array(a));var i=[,];i[0]=1,this.one=new _bp(this,Array(i)),this.__defineGetter__(\"Zero\",function(){return this.zero}),this.__defineGetter__(\"One\",function(){return this.one}),this._ba=function(t,e){if(t<0)throw\"bad arguments\";if(0==e)return this.zero;for(var n=Array(t+1),a=0;a<n.length;a++)n[a]=0;return n[0]=e,new _bp(this,n)},this.exp=function(t){return this._gh[t]},this.log=function(t){if(0==t)throw\"bad arguments\";return this._gi[t]},this.inverse=function(t){if(0==t)throw\"System.ArithmeticException\";return this._gh[255-this._gi[t]]},this.multiply=function(t,e){return 0==t||0==e?0:1==t?e:1==e?t:this._gh[(this._gi[t]+this._gi[e])%255]}}_dx._gl=function(t){if(t<0||t>7)throw\"bad arguments\";return _dx._dy[t]},_dx._dy=[new _fg,new _fh,new _fi,new _fj,new _fk,new _fl,new _fm,new _fn],_az._bb=new _az(285),_az._bc=new _az(301),_az._bd=function(t,e){return t^e};var Decoder={};Decoder.rsDecoder=new _db(_az._bb),Decoder.correctErrors=function(t,e){for(var n=t.length,a=Array(n),i=0;i<n;i++)a[i]=255&t[i];var r=t.length-e;try{Decoder.rsDecoder.decode(a,r)}catch(_){throw _}for(var i=0;i<e;i++)t[i]=a[i]},Decoder.decode=function(t){for(var e=new _cl(t),n=e._cq(),a=e._cm()._cg,i=e._gk(),r=_dl._gn(i,n,a),_=0,h=0;h<r.length;h++)_+=r[h]._du;for(var s=Array(_),o=0,w=0;w<r.length;w++){var f=r[w],$=f.Codewords,c=f._du;Decoder.correctErrors($,c);for(var h=0;h<c;h++)s[o++]=$[h]}return new QRCodeDataBlockReader(s,n._fd,a.Bits)};var qrcode={};function _ew(t,e){return t>=0?t>>e:(t>>e)+(2<<~e)}qrcode.imagedata=null,qrcode.width=0,qrcode.height=0,qrcode.qrCodeSymbol=null,qrcode.debug=!1,qrcode.maxImgSize=1048576,qrcode._eo=[[10,9,8,8],[12,11,16,10],[14,13,16,12]],qrcode.callback=null,qrcode.decode=function(){var t=qrcode.canvas_qr2,e=qrcode.qrcontext2;return qrcode.width=t.width,qrcode.height=t.height,qrcode.imagedata=e.getImageData(0,0,qrcode.width,qrcode.height),qrcode.result=qrcode.process(e),null!=qrcode.callback&&qrcode.callback(qrcode.result),qrcode.result},qrcode.isUrl=function(t){return/(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?/.test(t)},qrcode.decode_url=function(t){var e=\"\";try{e=escape(t)}catch(n){e=t}var a=\"\";try{a=decodeURIComponent(e)}catch(i){a=e}return a},qrcode.decode_utf8=function(t){return qrcode.isUrl(t)?qrcode.decode_url(t):t},qrcode.process=function(t){new Date().getTime();var e=qrcode.grayScaleToBitmap(qrcode.grayscale());if(qrcode.debug){for(var n=0;n<qrcode.height;n++)for(var a=0;a<qrcode.width;a++){var i=4*a+n*qrcode.width*4;qrcode.imagedata.data[i]=(e[a+n*qrcode.width],0),qrcode.imagedata.data[i+1]=(e[a+n*qrcode.width],0),qrcode.imagedata.data[i+2]=e[a+n*qrcode.width]?255:0}t.putImageData(qrcode.imagedata,0,0)}var r=new Detector(e).detect();if(qrcode.debug){for(var n=0;n<r.bits.Height;n++)for(var a=0;a<r.bits.Width;a++){var i=8*a+2*n*qrcode.width*4;qrcode.imagedata.data[i]=(r.bits._ds(a,n),0),qrcode.imagedata.data[i+1]=(r.bits._ds(a,n),0),qrcode.imagedata.data[i+2]=r.bits._ds(a,n)?255:0}t.putImageData(qrcode.imagedata,0,0)}for(var _=Decoder.decode(r.bits).DataByte,h=\"\",s=0;s<_.length;s++)for(var o=0;o<_[s].length;o++)h+=String.fromCharCode(_[s][o]);return new Date().getTime(),qrcode.decode_utf8(h)},qrcode.getPixel=function(t,e){if(qrcode.width<t||qrcode.height<e)throw\"point error\";var n=4*t+e*qrcode.width*4,a=qrcode.imagedata.data;return(33*a[n]+34*a[n+1]+33*a[n+2])/100},qrcode.binarize=function(t){for(var e=qrcode.width,n=qrcode.height,a=Array(e*qrcode.height),i=0;i<n;i++)for(var r=i*e,_=0;_<e;_++){var h=qrcode.getPixel(_,i);a[_+r]=h<=t}return a},qrcode._em=function(t){for(var e=Math.floor(qrcode.width/4),n=Math.floor(qrcode.height/4),a=[,,,,],i=0;i<4;i++){a[i]=[,,,,];for(var r=0;r<4;r++)a[i][r]=[0,0]}for(var _=qrcode.width,h=0;h<4;h++)for(var s=0;s<4;s++){a[s][h][0]=255;for(var o=0;o<n;o++)for(var w=0;w<e;w++){var f=t[e*s+w+(n*h+o)*_];f<a[s][h][0]&&(a[s][h][0]=f),f>a[s][h][1]&&(a[s][h][1]=f)}}for(var $=[,,,,],c=0;c<4;c++)$[c]=[,,,,];for(var h=0;h<4;h++)for(var s=0;s<4;s++)$[s][h]=Math.floor((a[s][h][0]+a[s][h][1])/2);return $},qrcode.grayScaleToBitmap=function(t){for(var e=qrcode._em(t),n=e.length,a=qrcode.width,i=qrcode.height,r=Math.floor(a/n),_=Math.floor(i/n),h=new ArrayBuffer(a*i),s=new Uint8Array(h),o=0;o<n;o++)for(var w=0;w<n;w++)for(var f=0;f<_;f++)for(var $=0;$<r;$++)s[r*w+$+(_*o+f)*a]=t[r*w+$+(_*o+f)*a]<e[w][o];return s},qrcode.grayscale=function(){for(var t=qrcode.width,e=qrcode.height,n=new ArrayBuffer(t*e),a=new Uint8Array(n),i=0;i<e;i++)for(var r=i*t,_=0;_<t;_++){var h=qrcode.getPixel(_,i);a[_+r]=h}return a};var _gf=3,_eh=57,_el=8,_eg=2;function _cz(t,e,n){this.x=t,this.y=e,this.count=1,this._aj=n,this.__defineGetter__(\"_ei\",function(){return this._aj}),this.__defineGetter__(\"Count\",function(){return this.count}),this.__defineGetter__(\"X\",function(){return this.x}),this.__defineGetter__(\"Y\",function(){return this.y}),this._ek=function(){this.count++},this._ev=function(t,e,n){if(Math.abs(e-this.y)<=t&&Math.abs(n-this.x)<=t){var a=Math.abs(t-this._aj);return a<=1||a/this._aj<=1}return!1}}function _es(t){this._go=t[0],this._gu=t[1],this._gr=t[2],this.__defineGetter__(\"_gp\",function(){return this._go}),this.__defineGetter__(\"_gq\",function(){return this._gu}),this.__defineGetter__(\"_gs\",function(){return this._gr})}function _cc(){this.image=null,this._cv=[],this._ge=!1,this._al=[0,0,0,0,0],this._am=null,this.__defineGetter__(\"_da\",function(){return this._al[0]=0,this._al[1]=0,this._al[2]=0,this._al[3]=0,this._al[4]=0,this._al}),this._ao=function(t){for(var e=0,n=0;n<5;n++){var a=t[n];if(0==a)return!1;e+=a}if(e<7)return!1;var i=Math.floor((e<<_el)/7),r=Math.floor(i/2);return Math.abs(i-(t[0]<<_el))<r&&Math.abs(i-(t[1]<<_el))<r&&Math.abs(3*i-(t[2]<<_el))<3*r&&Math.abs(i-(t[3]<<_el))<r&&Math.abs(i-(t[4]<<_el))<r},this._an=function(t,e){return e-t[4]-t[3]-t[2]/2},this._ap=function(t,e,n,a){for(var i=this.image,r=qrcode.height,_=this._da,h=t,s=qrcode.width;h>=0&&i[e+h*s];)_[2]++,h--;if(h<0)return NaN;for(;h>=0&&!i[e+h*s]&&_[1]<=n;)_[1]++,h--;if(h<0||_[1]>n)return NaN;for(;h>=0&&i[e+h*s]&&_[0]<=n;)_[0]++,h--;if(_[0]>n)return NaN;for(h=t+1;h<r&&i[e+h*s];)_[2]++,h++;if(h==r)return NaN;for(;h<r&&!i[e+h*s]&&_[3]<n;)_[3]++,h++;if(h==r||_[3]>=n)return NaN;for(;h<r&&i[e+h*s]&&_[4]<n;)_[4]++,h++;return _[4]>=n?NaN:5*Math.abs(_[0]+_[1]+_[2]+_[3]+_[4]-a)>=2*a?NaN:this._ao(_)?this._an(_,h):NaN},this._ej=function(t,e,n,a){for(var i=this.image,r=qrcode.width,_=this._da,h=t;h>=0&&i[h+e*r];)_[2]++,h--;if(h<0)return NaN;for(;h>=0&&!i[h+e*r]&&_[1]<=n;)_[1]++,h--;if(h<0||_[1]>n)return NaN;for(;h>=0&&i[h+e*r]&&_[0]<=n;)_[0]++,h--;if(_[0]>n)return NaN;for(h=t+1;h<r&&i[h+e*r];)_[2]++,h++;if(h==r)return NaN;for(;h<r&&!i[h+e*r]&&_[3]<n;)_[3]++,h++;if(h==r||_[3]>=n)return NaN;for(;h<r&&i[h+e*r]&&_[4]<n;)_[4]++,h++;return _[4]>=n?NaN:5*Math.abs(_[0]+_[1]+_[2]+_[3]+_[4]-a)>=a?NaN:this._ao(_)?this._an(_,h):NaN},this._cu=function(t,e,n){var a=t[0]+t[1]+t[2]+t[3]+t[4],i=this._an(t,n),r=this._ap(e,Math.floor(i),t[2],a);if(!isNaN(r)&&!isNaN(i=this._ej(Math.floor(i),Math.floor(r),t[2],a))){for(var _=a/7,h=!1,s=this._cv.length,o=0;o<s;o++){var w=this._cv[o];if(w._ev(_,r,i)){w._ek(),h=!0;break}}if(!h){var f=new _cz(i,r,_);this._cv.push(f),null!=this._am&&this._am._ep(f)}return!0}return!1},this._ee=function(){var t=this._cv.length;if(t<3)throw\"Couldn't find enough finder patterns (found \"+t+\")\";if(t>3){for(var e=0,n=0,a=0;a<t;a++){var i=this._cv[a]._ei;e+=i,n+=i*i}var r=e/t;this._cv.sort(function(t,e){var n=Math.abs(e._ei-r),a=Math.abs(t._ei-r);return n<a?-1:n==a?0:1});for(var _=Math.sqrt(n/t-r*r),h=Math.max(.2*r,_),a=this._cv.length-1;a>=0;a--)Math.abs(this._cv[a]._ei-r)>h&&this._cv.splice(a,1)}return this._cv.length>3&&this._cv.sort(function(t,e){return t.count>e.count?-1:t.count<e.count?1:0}),[this._cv[0],this._cv[1],this._cv[2]]},this._eq=function(){var t=this._cv.length;if(t<=1)return 0;for(var e=null,n=0;n<t;n++){var a=this._cv[n];if(a.Count>=_eg){if(null!=e)return this._ge=!0,Math.floor((Math.abs(e.X-a.X)-Math.abs(e.Y-a.Y))/2);e=a}}return 0},this._cx=function(){for(var t=0,e=0,n=this._cv.length,a=0;a<n;a++){var i=this._cv[a];i.Count>=_eg&&(t++,e+=i._ei)}if(t<3)return!1;for(var r=e/n,_=0,a=0;a<n;a++)_+=Math.abs((i=this._cv[a])._ei-r);return _<=.05*e},this._ce=function(t){this.image=t;var e=qrcode.height,n=qrcode.width,a=Math.floor(3*e/(4*_eh));a<_gf&&(a=_gf);for(var i=!1,r=[,,,,,],_=a-1;_<e&&!i;_+=a){r[0]=0,r[1]=0,r[2]=0,r[3]=0,r[4]=0;for(var h=0,s=0;s<n;s++)if(t[s+_*qrcode.width])(1&h)==1&&h++,r[h]++;else if((1&h)==0){if(4==h){if(this._ao(r)){var o=this._cu(r,_,s);if(o){if(a=2,this._ge)i=this._cx();else{var w=this._eq();w>r[2]&&(_+=w-r[2]-a,s=n-1)}}else{do s++;while(s<n&&!t[s+_*qrcode.width]);s--}h=0,r[0]=0,r[1]=0,r[2]=0,r[3]=0,r[4]=0}else r[0]=r[2],r[1]=r[3],r[2]=r[4],r[3]=1,r[4]=0,h=3}else r[++h]++}else r[h]++;if(this._ao(r)){var o=this._cu(r,_,n);o&&(a=r[0],this._ge&&(i=this._cx()))}}var f=this._ee();return qrcode._er(f),new _es(f)}}function _ai(t,e,n){this.x=t,this.y=e,this.count=1,this._aj=n,this.__defineGetter__(\"_ei\",function(){return this._aj}),this.__defineGetter__(\"Count\",function(){return this.count}),this.__defineGetter__(\"X\",function(){return Math.floor(this.x)}),this.__defineGetter__(\"Y\",function(){return Math.floor(this.y)}),this._ek=function(){this.count++},this._ev=function(t,e,n){if(Math.abs(e-this.y)<=t&&Math.abs(n-this.x)<=t){var a=Math.abs(t-this._aj);return a<=1||a/this._aj<=1}return!1}}function _ak(t,e,n,a,i,r,_){this.image=t,this._cv=[],this.startX=e,this.startY=n,this.width=a,this.height=i,this._ef=r,this._al=[0,0,0],this._am=_,this._an=function(t,e){return e-t[2]-t[1]/2},this._ao=function(t){for(var e=this._ef,n=e/2,a=0;a<3;a++)if(Math.abs(e-t[a])>=n)return!1;return!0},this._ap=function(t,e,n,a){var i=this.image,r=qrcode.height,_=this._al;_[0]=0,_[1]=0,_[2]=0;for(var h=t,s=qrcode.width;h>=0&&i[e+h*s]&&_[1]<=n;)_[1]++,h--;if(h<0||_[1]>n)return NaN;for(;h>=0&&!i[e+h*s]&&_[0]<=n;)_[0]++,h--;if(_[0]>n)return NaN;for(h=t+1;h<r&&i[e+h*s]&&_[1]<=n;)_[1]++,h++;if(h==r||_[1]>n)return NaN;for(;h<r&&!i[e+h*s]&&_[2]<=n;)_[2]++,h++;return _[2]>n?NaN:5*Math.abs(_[0]+_[1]+_[2]-a)>=2*a?NaN:this._ao(_)?this._an(_,h):NaN},this._cu=function(t,e,n){var a=t[0]+t[1]+t[2],i=this._an(t,n),r=this._ap(e,Math.floor(i),2*t[1],a);if(!isNaN(r)){for(var _=(t[0]+t[1]+t[2])/3,h=this._cv.length,s=0;s<h;s++)if(this._cv[s]._ev(_,r,i))return new _ai(i,r,_);var o=new _ai(i,r,_);this._cv.push(o),null!=this._am&&this._am._ep(o)}return null},this.find=function(){for(var e=this.startX,i=this.height,r=this.width,_=e+a,h=n+(i>>1),s=[0,0,0],o=0;o<i;o++){var w=h+((1&o)==0?o+1>>1:-(o+1>>1));s[0]=0,s[1]=0,s[2]=0;for(var f=e;f<_&&!t[f+r*w];)f++;for(var $=0;f<_;){if(t[f+w*r]){if(1==$)s[$]++;else if(2==$){if(this._ao(s)){var c=this._cu(s,w,f);if(null!=c)return c}s[0]=s[2],s[1]=1,s[2]=0,$=1}else s[++$]++}else 1==$&&$++,s[$]++;f++}if(this._ao(s)){var c=this._cu(s,w,_);if(null!=c)return c}}if(0!=this._cv.length)return this._cv[0];throw\"Couldn't find enough alignment patterns\"}}function QRCodeDataBlockReader(t,e,n){this._ed=0,this._cw=7,this.dataLength=0,this.blocks=t,this._en=n,e<=9?this.dataLengthMode=0:e>=10&&e<=26?this.dataLengthMode=1:e>=27&&e<=40&&(this.dataLengthMode=2),this._gd=function(t){var e=0;if(t<this._cw+1){for(var n=0,a=0;a<t;a++)n+=1<<a;return n<<=this._cw-t+1,e=(this.blocks[this._ed]&n)>>this._cw-t+1,this._cw-=t,e}if(t<this._cw+1+8){for(var i=0,a=0;a<this._cw+1;a++)i+=1<<a;return e=(this.blocks[this._ed]&i)<<t-(this._cw+1),this._ed++,e+=this.blocks[this._ed]>>8-(t-(this._cw+1)),this._cw=this._cw-t%8,this._cw<0&&(this._cw=8+this._cw),e}if(!(t<this._cw+1+16))return 0;for(var i=0,r=0,a=0;a<this._cw+1;a++)i+=1<<a;var _=(this.blocks[this._ed]&i)<<t-(this._cw+1);this._ed++;var h=this.blocks[this._ed]<<t-(this._cw+1+8);this._ed++;for(var a=0;a<t-(this._cw+1+8);a++)r+=1<<a;return r<<=8-(t-(this._cw+1+8)),e=_+h+((this.blocks[this._ed]&r)>>8-(t-(this._cw+1+8))),this._cw=this._cw-(t-8)%8,this._cw<0&&(this._cw=8+this._cw),e},this.NextMode=function(){return this._ed>this.blocks.length-this._en-2?0:this._gd(4)},this.getDataLength=function(t){for(var e=0;t>>e!=1;)e++;return this._gd(qrcode._eo[this.dataLengthMode][e])},this.getRomanAndFigureString=function(t){var e=t,n=0,a=\"\",i=[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"A\",\"B\",\"C\",\"D\",\"E\",\"F\",\"G\",\"H\",\"I\",\"J\",\"K\",\"L\",\"M\",\"N\",\"O\",\"P\",\"Q\",\"R\",\"S\",\"T\",\"U\",\"V\",\"W\",\"X\",\"Y\",\"Z\",\" \",\"$\",\"%\",\"*\",\"+\",\"-\",\".\",\"/\",\":\"];do if(e>1){var r=Math.floor((n=this._gd(11))/45),_=n%45;a+=i[r],a+=i[_],e-=2}else 1==e&&(a+=i[n=this._gd(6)],e-=1);while(e>0);return a},this.getFigureString=function(t){var e=t,n=0,a=\"\";do e>=3?((n=this._gd(10))<100&&(a+=\"0\"),n<10&&(a+=\"0\"),e-=3):2==e?((n=this._gd(7))<10&&(a+=\"0\"),e-=2):1==e&&(n=this._gd(4),e-=1),a+=n;while(e>0);return a},this.get8bitByteArray=function(t){var e=t,n=0,a=[];do a.push(n=this._gd(8)),e--;while(e>0);return a},this.getKanjiString=function(t){var e=t,n=0,a=\"\";do{var i=(n=this._gd(13))%192,r=(n/192<<8)+i,_=0;a+=String.fromCharCode(_=r+33088<=40956?r+33088:r+49472),e--}while(e>0);return a},this.parseECIValue=function(){var t=0,e=this._gd(8);return(128&e)==0&&(t=127&e),(192&e)==128&&(t=(63&e)<<8|this._gd(8)),(224&e)==192&&(t=(31&e)<<16|this._gd(8)),t},this.__defineGetter__(\"DataByte\",function(){for(var t=[];;){var e=this.NextMode();if(0==e){if(t.length>0)break;throw\"Empty data block\"}if(1!=e&&2!=e&&4!=e&&8!=e&&7!=e)throw\"Invalid mode: \"+e+\" in (block:\"+this._ed+\" bit:\"+this._cw+\")\";if(7==e)var n=this.parseECIValue();else{var a=this.getDataLength(e);if(a<1)throw\"Invalid data length: \"+a;switch(e){case 1:for(var i=this.getFigureString(a),r=Array(i.length),_=0;_<i.length;_++)r[_]=i.charCodeAt(_);t.push(r);break;case 2:for(var i=this.getRomanAndFigureString(a),r=Array(i.length),_=0;_<i.length;_++)r[_]=i.charCodeAt(_);t.push(r);break;case 4:var n=this.get8bitByteArray(a);t.push(n);break;case 8:var i=this.getKanjiString(a);t.push(i)}}}return t})}qrcode._er=function(t){function e(t,e){var n=t.X-e.X,a=t.Y-e.Y;return Math.sqrt(n*n+a*a)}var n,a,i,r,_,h,s,o,w=e(t[0],t[1]),f=e(t[1],t[2]),$=e(t[0],t[2]);if(f>=w&&f>=$?(a=t[0],n=t[1],i=t[2]):$>=f&&$>=w?(a=t[1],n=t[0],i=t[2]):(a=t[2],n=t[0],i=t[1]),0>(r=n,_=a,h=i,s=_.x,o=_.y,(h.x-s)*(r.y-o)-(h.y-o)*(r.x-s))){var c=n;n=i,i=c}t[0]=n,t[1]=a,t[2]=i};";
    private static _qrcode: ILqCodeReader | null = null;
    private static _mediaOptions: boolean | MediaTrackConstraints | null = null;
    private _generation: number = 0;
    private _timeout: number = 500;
    private _video: HTMLVideoElement | null = null;
    private _videoContext: CanvasRenderingContext2D | null = null;
    private _qrContext: CanvasRenderingContext2D | null = null;
    private _log?: ((message: string) => void) | null = null;
    private _dx: number = 0;
    private _dy: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _initialized: boolean = false;

    private static getQrcode(): ILqCodeReader {
        if (this._qrcode == null) {
            const container: any = window;
            container.eval(LqCodeReader._lqCodeReaderJs);
            this._qrcode = container["qrcode"];
        }
        return this._qrcode!;
    }

    private log(message: string, param?: any): void {
        message = `LqCodeReader: ${message}`;
        if (param != null) {
            console.log(message, param);
        } else {
            console.log(message);
        }
        
        if (this._log) {
            this._log(message);
        }
    }

    private get videoContext(): CanvasRenderingContext2D {
        return this._videoContext!;
    }

    private get qrContext(): CanvasRenderingContext2D {
        return this._qrContext!;
    }

    private get debug(): boolean {
        const qrCode: ILqCodeReader = LqCodeReader.getQrcode();
        return qrCode.debug;
    }

    private get video(): HTMLVideoElement {
        return this._video!;
    }

    private invokeCapture(generation: number): void {
        setTimeout(() => this.captureToCanvas(generation), this._timeout);
    }

    private captureToCanvas(generation: number): void {
        if ((!this._initialized) || (generation != this._generation)) {
            return;
        }

        try {
            const startTime: number = performance.now();

            try {

                const qrCode: ILqCodeReader = LqCodeReader.getQrcode();
                
                const resizing: boolean = (
                    (this._dx > 0) || (this._dy > 0) ||
                    (this._width != this.video.width) || 
                    (this._height != this.video.height)
                );

                if (resizing) {
                    this.videoContext.drawImage(this.video, 0, 0, this.video.width, this.video.height);

                    this.qrContext.drawImage(this.videoContext.canvas, this._dx, this._dy, this._width, this._height, 0, 0, OutputWidth, OutputHeight);
                } else {
                    this.qrContext.drawImage(this.video, 0, 0, OutputWidth, OutputHeight);
                }

                qrCode.decode();

            } catch (e) {
                if (this.debug) {
                    const endTime: number = performance.now();
                    const processing: number = (endTime - startTime);
                    this.log(`${e} (${processing.toFixed(0)} mlsec, G${generation})`);
                }

                this.invokeCapture(generation);
            }
        } catch (e) {

            if (this.debug) {
                this.log(e);
            }

            this.invokeCapture(generation);
        }
    }
    
    private static async getCamerasAsync(): Promise<MediaDeviceInfo[]> {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            let devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
            devices = devices.where(item => item.kind == "videoinput");
            return devices;
        }

        return [];
    }
    
    private static async getMediaOptionsAsync(): Promise<boolean | MediaTrackConstraints> {
        if (LqCodeReader._mediaOptions == null) {

            const cameras: MediaDeviceInfo[] = await this.getCamerasAsync();

            if (cameras.length > 0) {

                const mediaOptions = {
                    facingMode: "environment",
                    width: {
                        ideal: 800
                    },
                    height: {
                        ideal: 600
                    }
                } as MediaTrackConstraints;

                const backCamera: MediaDeviceInfo | null = cameras.firstOrDefault(device => /back|rear|environment/gi.test(device.label));

                if (backCamera) {
                    mediaOptions.deviceId = {
                        exact: backCamera.deviceId
                    };
                }

                LqCodeReader._mediaOptions = mediaOptions;

            } else {
                LqCodeReader._mediaOptions = true;
            }
        }

        return LqCodeReader._mediaOptions!;
    }

    private async initializeCameraAsync(): Promise<void> {
        const mediaOptions: boolean | MediaTrackConstraints = await LqCodeReader.getMediaOptionsAsync();

        if (this.debug) {
            this.log("MediqOptions = ", mediaOptions);
        }

        this.setWebCam2(this._generation, mediaOptions);
    }

    private setWebCam2(generation: number, options: boolean | MediaTrackConstraints): void {
        const self: LqCodeReader = this;
        const nav: Navigator = navigator;

        const constraints: MediaStreamConstraints = {
            video: options,
            audio: false
        };

        if (nav.mediaDevices.getUserMedia) {
            nav.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream: MediaStream) {
                    self.setWebCam2Success(generation, stream);
                }).catch(function (error) {
                self.setWebCam2Error(error)
            });
        } else if (nav.getUserMedia) {
            nav.getUserMedia(constraints, (stream: MediaStream) => this.setWebCam2Success(generation, stream), this.setWebCam2Error);
        } else if ((nav as any).webkitGetUserMedia) {
            (nav as any).webkitGetUserMedia(constraints, (stream: MediaStream) => this.setWebCam2Success(generation, stream), this.setWebCam2Error);
        }

        this._initialized = true;
    }

    private setWebCam2Success(generation: number, stream: MediaStream): void {
        if ((!this._initialized) || (generation != this._generation)) {
            return;
        }
        
        this.video.srcObject = stream;
        this.video.play();
        this.invokeCapture(generation);
    }

    private setWebCam2Error(error: Error | MediaStreamError): void {
        if (this.debug) {
            this.log("web cam initialization failed with error " + error);
        }
    }

    public async initializeAsync(video: HTMLVideoElement,
                                 qrCanvas: HTMLCanvasElement, videoCanvas: HTMLCanvasElement, 
                                 dx: number, dy: number, width: number, height: number,
                                 callback: (result: object) => void,
                                 timeout: number = 500,
                                 debug: boolean = false, 
                                 log?: ((message: string) => void) | null): Promise<void> {
        this._initialized = false;
        this._generation++;

        this._dx = dx;
        this._dy = dy;
        this._width = width;
        this._height = height;
        this._log = log;

        qrCanvas.style.width = OutputWidth + "px";
        qrCanvas.style.height = OutputHeight + "px";
        qrCanvas.width = OutputWidth;
        qrCanvas.height = OutputHeight;

        videoCanvas.style.width = video.width + "px";
        videoCanvas.style.height = video.height + "px";
        videoCanvas.width = video.width;
        videoCanvas.height = video.height;

        const qrContext: CanvasRenderingContext2D | null = qrCanvas.getContext("2d");

        const videoContext: CanvasRenderingContext2D | null = videoCanvas.getContext("2d");

        if ((qrContext == null) || (videoContext == null))
            throw Error("LrCodeReader: CanvasRendering context cannot be created. QR code scanner for HTML5 capable browsers only.");
        
        this._video = video;
        this._videoContext = videoContext;
        this._qrContext = qrContext;
        this._timeout = timeout;

        const qrCode: ILqCodeReader = LqCodeReader.getQrcode();

        qrCode.canvas_qr2 = qrCanvas;
        qrCode.qrcontext2 = qrContext;
        qrCode.debug = debug;
        qrCode.callback = callback;

        await this.initializeCameraAsync();
    }
}