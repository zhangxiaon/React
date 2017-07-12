require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom'

//获取图片信息
let ImageData = require('json!../data/imageData.json');
//根据图片信息，新增图片路径属性
ImageData = ((img)=> {
    for (let i of img) {
        //i.imageURL = require('../images/' + i.fileName);
        i.imgUrl = '../images/' + i.fileName;
    }
    return img;
})(ImageData);
//获取一个区间的任意值
let getRangeRandom = (start, end) => {
    if(end < start){
        let temp = end;
        end = start;
        start = temp;
    }
    return parseInt(Math.random() * (end - start + 1)) + start;
}
//获取0-30度之间的任意正负值
let get30DegRandom = () => {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
    //handleClick(e){
    //    console.log(e.target);
        //if(this.props.arrage.isCenter){
        //    this.props.inverse();
        //}else{
        //    this.props.center();
        //}
        //e.stopPropagation();
        //e.preventDefault();
    //}
    //在类里面，异步执行的函数，内部的this指向null
    handleClick = (e) => {
        if(this.props.arrage.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
        //console.log('this is:', this);
    }
    render() {
        let styleobj = {};
        if(this.props.arrage.pos){
            styleobj = this.props.arrage.pos;
        }
        if (this.props.arrage.rotate) {
            (['MozTransform', 'WibkitTransform', 'MsTransform', 'transform']).forEach((value) => {
                styleobj[value] = 'rotate(' + this.props.arrage.rotate + 'deg)'
            })
        }
      if(this.props.arrage.isCenter){
        styleobj.zIndex = 11;
      }
        var imgFIgureClassName = 'img-figure';
        imgFIgureClassName += this.props.arrage.isInverse ? ' isInverse' : '';
        return (
            <figure className={imgFIgureClassName} style={styleobj} onClick={this.handleClick}>
                <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>{this.props.data.dsc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class ControllerUnit extends React.Component {
    handleClick = (e) => {
        if(this.props.arrage.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
        //console.log('this is:', this);
    }
    render(){
        let controllerUnitClassName = 'controller-unit';
        if(this.props.arrage.isCenter){
            controllerUnitClassName += ' is-center';
            if(this.props.arrage.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }
        return <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                top: 0
            },
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        }
        this.state = {
            imgsArrangeArr: []
        }
    }
    //翻转状态记录
    inverse(index){
        return ()=>{
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            })
        }
    }
    //把指定图片放到中间
    center(index){
        return ()=>{
            this.reArrage(index);
        }
    }
    //排列照片函数
    reArrage(centerIndex) {
        //保存每张图片的定位，旋转，翻转信息
        let imgsArrangeArr = this.state.imgsArrangeArr;

        let Constant = this.Constant;
        let centerPos = Constant.centerPos;
        let hPosRange = Constant.hPosRange;
        let vPosRange = Constant.vPosRange;
        let hPosRangeLeftSecX = hPosRange.leftSecX;
        let hPosRangeRightSecX = hPosRange.rightSecX;
        let hPosRangeY = hPosRange.y;
        let vPosRangx = vPosRange.x;
        let vPosRangTopY = vPosRange.topY;

        //生成顶部图片的数量
        let topImgNum = parseInt(Math.random() * 2);//0或1
        //根据传入的索引值，在imgsArrangeArr获取中间图片的信息
        let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //设置中间图片的定位值
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate:0,
            isInverse:false,
            isCenter:true
        }

        //随机生成一个数值，作为上侧图片的索引
        let topImgSpliceIndex = parseInt(Math.random() * imgsArrangeArr.length);
        //根据索引，在imgsArrangeArr获取顶部图片的信息
        let imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局上侧图片
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangTopY[0], vPosRangTopY[1]),
                    left: getRangeRandom(vPosRangx[0], vPosRangx[1])
                },
                rotate:get30DegRandom(),
                isInverse:false,
                isCenter:false
            }
        })
        //布局左右两侧图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            }else{
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos:{
                    left:getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
                    top:getRangeRandom(hPosRangeY[0], hPosRangeY[1])
                },
                rotate:get30DegRandom(),
                isInverse:false,
                isCenter:false
            }
        }

        //把之前顶部以及中间的图片重新放到imgsArrangeArr里面
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        //调用setstate方法，触发回调函数
        this.setState({
            imgsArrangeArr:imgsArrangeArr
        })
    }

    //组件加载后，为每一张图计算其位置
    componentDidMount() {
        //获取页面大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
        let stageW = stageDOM.scrollWidth;
        let stageH = stageDOM.scrollHeight;
        let halfStageW = Math.ceil(stageW / 2);
        let halfStageH = Math.ceil(stageH / 2);
        //获取图片盒子大小
        let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0);
        let imgW = imgFigureDom.scrollWidth;
        let imgH = imgFigureDom.scrollHeight;
        let halfImgW = Math.ceil(imgW / 2);
        let halfImgH = Math.ceil(imgH / 2);
        //计算中心点的位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        //计算两侧图片的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;
        //计算顶部图片的取值范围
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.reArrage(0);
    }

    render() {
        let controllerUnits = [];
        let imgFigures = [];

        ImageData.forEach((val, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }
            imgFigures.push(<ImgFigure data={val} ref={'imgFigure' + index} key={index}
                                       arrage={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
            controllerUnits.push(<ControllerUnit key={index} arrage={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        })

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">{controllerUnits}</nav>
            </section>
        );
    }
}
/*class Child extends React.Component {
 render() {
 return (<p>
 <span>这是子元素的内部</span>
 </p>)
 }
 }
 class App extends React.Component {
 render() {
 return (
 <div>
 <div ref={div => {
 this._div = div
 }}>app
 </div>
 <Child ref={child => this._child = child}/>
 <button onClick={()=> {
 console.log(ReactDOM.findDOMNode(this._div) === this._div);
 console.log(ReactDOM.findDOMNode(this._child));
 }}>log refs
 </button>
 </div>

 )
 }
 }*/

AppComponent.defaultProps = {};

export default AppComponent;
