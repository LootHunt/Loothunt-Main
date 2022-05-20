import "./Matches.css"
import { Box } from "@mui/system"
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";

export default ()=>{

    const [matchList, setMatchList] = useState([])
    const [isProgress, setProgress ] = useState(false);   

    useEffect(()=>{
      getData()
    },[])


    const getData = async ()=>{
       let config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt')
            },
        }
       const response = await fetch("https://bobaap.herokuapp.com/myparticipation",config)
       const data = await response.json();
        for(let i = 0;i<data['data'].length;i++){
            data['data'][i].sstart = data['data'][i].start 
            data['data'][i].start = new Date(data['data'][i].start).toDateString();
          
        }
       setMatchList(data['data'])
    }
    const getDate = (time) => {
        var d = new Date(1382086394000);
        return d


    }
    return(
        <Box sx={{'display':'flex', flexDirection:'column', marginTop: '30px'}}>
            {isProgress && (<div style={{display: 'flex', justifyContent:'center'}}>
                <CircularProgress  style={{marginTop:'10px'}} color='secondary'/>
            </div>)}
            {!isProgress &&   (<>
            <div className="containerDivHead" style={{display: 'flex',  marginBottom:'20px'}}>
                <span className="headSpan">Match ID</span>
                <span className="headSpan">Entry Fee</span>
                <span className="headSpan">Start Time</span>
                <div onClick={()=>{}} className="cardButtonxx" style={{opacity: 0,     cursor: "default"}}>
                                <span className="cardButtonSpanxx" >Join Match</span>
                             </div>

            </div>
            
            {
               !isProgress && matchList.map((el, index)=>{
                    return(
                        <div key={index} className="containerDiv" style={{display: 'flex', alignItems:'center', justifyContent:'center', padding:'10px'}}>
                            <span className="itemSpan">{el.gameid}</span>
                            <span className="itemSpan">{el.price} ETH</span>
                            <span className="itemSpan">{el.start}</span>
                            <div onClick={()=>{
                                 window.open(`https://loothunt-game.b-cdn.net/?jwt=${localStorage.getItem('jwt')}&gameid=${el.gameid}`, '_blank').focus();
                            }} className="cardButtonxx">
                                <span className="cardButtonSpanxx" >
                                {Date.now()<el.sstart ? 'Join Match' : 'Match Ended'}</span>
                             </div>
                        </div>
                    )
                })
            }
            </>)}
        </Box>
    )
}