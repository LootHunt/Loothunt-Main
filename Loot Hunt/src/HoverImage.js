import * as React from 'react';
import "./HoverImage.css"

export default class HoverImage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            lock: false
        }
    }


    handleMove(e,el) {
        try{
            const height = el.clientHeight;
            const width = el.clientWidth;
            const xVal = e.layerX;
            const yVal = e.layerY;
            
            const yRotation = 20 * ((xVal - width / 2) / width)
            
            const xRotation = -20 * ((yVal - height / 2) / height)
            
            const string = 'perspective(500px) scale(1.1) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'
            
            el.style.transform = string
        }catch(e){

        }
      }
    //https://codepen.io/Lakston/pen/gwPYvr
    render() {

        return(
            <div className='flip-card-inner' 
            onMouseMove={(e)=>{
                if(!this.state.lock){
                    this.handleMove(e.nativeEvent, this.myRef2)
                }
            }}
            onMouseDown={()=>{
                if(!this.state.lock){
                    this.myRef2.style.transform = `perspective(500px) scale(0.9) rotateX(0) rotateY(180)`
                }
                
            }} onMouseUp={()=>{
                if(!this.state.lock){
                    this.setState({lock:true})
                    this.myRef2.style.transition = 'transform 0.6s'
                    this.myRef2.style.transform = 'rotateY(180deg)'
                    setTimeout(()=>{
                        this.myRef2.style.transition = '';
                    },600);
                }else{
                    this.myRef2.style.transition = 'transform 0.6s'
                    this.myRef2.style.transform = 'rotateY(0)'
                    setTimeout(()=>{
                        this.myRef2.style.transition = '';
                        this.setState({lock:false})
                    },600);
                }

            }} onMouseOut={()=>{
                if(!this.state.lock){
                    this.myRef2.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
                }
                
            }}
            
                ref={(myRef) => {           
                this.myRef2 = myRef; }}  >

                <div className='flip-card' 
                ref={(myRef) => {           
                    this.myRef = myRef; }} style={{background: `url(https://${this.props.url}.ipfs.infura-ipfs.io) no-repeat center center fixed`, backgroundSize:"cover"}}>
                </div>

                <div 
                className='flip-card-back'

             
                ref={(myRef) => {           
                    this.myRef1 = myRef; }} 
                style={{ background:'url(https://i.pinimg.com/736x/91/b5/e4/91b5e42c24ccab8f044b338611d2b07f.jpg) no-repeat center fixed',backgroundSize:"cover",color:"white",justifyContent:"center",alignItems:"center",display:"flex"}}
                >
                    <div style={{maxWidth:"50%",textAlign:"center"}}>
                  {this.props.secret.toUpperCase()}
                   </div>
                </div>
            </div>
        )
    }
}