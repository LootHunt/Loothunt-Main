import "./CreateMatch.css"
import { Box } from "@mui/system"
import { useState } from "react"
import React, {useCallback} from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Web3Storage } from 'web3.storage'
import { useDropzone } from 'react-dropzone'
import {abi} from "./abi"

export default () => {
    const [price, setPrice] = useState(''); 
    const [secret, setSecret] = useState(''); 
    const [day, setDay] = useState(''); 
    const [month, setMonth] = useState(''); 
    const [year, setYear] = useState(''); 
    const [minute, setMinute] = useState(''); 
    const [hour,setHour ] = useState(''); 
    const [account, setAccount] = useState("");
    const [imagetext,setImagetext] = useState("Select NFT image");

    const [imagelist, setimagelist] = useState()
    function getAccessToken() {
        // If you're just testing, you can paste in a token
        // and uncomment the following line:
        // return 'paste-your-token-here'

        // In a real app, it's better to read an access token from an
        // environement variable or other configuration that's kept outside of
        // your code base. For this to work, you need to set the
        // WEB3STORAGE_TOKEN environment variable before you run your code.
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM4MmM1N2I1M0VEOGY2MEMxMmQxOTE3MzZjMUQ5NWY1MUViZWZiMDMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzc2MTY5MzMxNDIsIm5hbWUiOiJUaGV0YSJ9.8DpgeRXRcTyDAn-5IQYS6A0jA5oNQ--pC2ns0eDT7z8"
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
    }

    async function  onSubmit(){
        setProgress(true);

        var datum = new Date(Date.UTC(year,month,day,hour,minute));
        console.log(datum);
        let timestamp =  datum.getTime();

        let gameid = makeid(5);
        const client = makeStorageClient()
        console.log(imagelist)
       
        const cid = await client.put(imagelist,{wrapWithDirectory:false})
        console.log(cid)
        let data = {
            encrypt:secret
        }
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("https://bobaap.herokuapp.com/getencrypted", config)
        const json = await response.json()
        let secretenc = json.enc 
        let maindata = {
            price:price,
            gameid:gameid,
            secret:secretenc,
            start:timestamp,
            image: cid
        }
        let mainfile = makeFileObjects(maindata)
        let filecid = await client.put(mainfile)
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        let contract = await new window.web3.eth.Contract(abi,"0x4af41400A49f752190E735B1C3EC6Ccc97beA316");
        
        let {err,abc} = await contract.methods.creategame(filecid,gameid,window.web3.utils.toWei(price, 'ether')).send({from:accounts[0]});
        abc = await contract.methods.games(gameid).call()
        let tokenid = abc.tokenid;
        console.log("filecid : "+ filecid)
        const config2 = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                ...maindata,
                tokenid:tokenid})
        }
        const response2 = await fetch("https://bobaap.herokuapp.com/startgame", config2)
        const json2 = await response2.json()
        console.log(json2)
        setPrice("")
        setSecret("")
        setMonth("")
        setYear("")
        setDay("")
        setHour("")
        setMinute("")
        setProgress(false);
        
    }
    function makeFileObjects (obj) {
        // You can create File objects from a Blob of binary data
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // Here we're just storing a JSON object, but you can store images,
        // audio, or whatever you want!
         const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
      
        const files = [
          new File(['contents-of-file-1'], 'plain-utf8.txt'),
          new File([blob], 'hello.json')
        ]
        return files
      }
      function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    const onDrop = useCallback(acceptedFiles => {
        setimagelist(acceptedFiles);
        setImagetext(acceptedFiles[0].name)
       
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


    const [isProgress, setProgress] = useState(false);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
            <div className="form__group field">
                <input autoComplete="off" type="input" id="price" value={price} onInput={e => setPrice(e.target.value)} className="form__field" placeholder="Entry Fee (In ETH)" name="entry_fee" id='entry_fee' required />
                <label for="entry_fee" className="form__label">Entry Fee (In ETH)</label>
            </div>
            <div className="form__group field">
                <textarea rows="7" type="input" id="secret" value={secret} onInput={e => setSecret(e.target.value)} className="form__field" placeholder="Secret Winner Message" name="win_msg" id='win_msg' required />
                <label for="win_msg" className="form__label">Secret Winner Message</label>
            </div>
            <div style={{ display: 'flex' }}>
                <div className="nftSelect" style={{ display: 'flex' }}>
                   
                   
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p style={{color:"gray"}}>Drop the files here ...</p> :
                                <p style={{color:"gray"}}>{imagetext}</p>
                        }
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex' }}>
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                    <div><span className="otherSpan">Match Date</span></div>
                    <div style={{ 'display': 'flex' }}>
                        <div className="form__group field" style={{ marginTop: 10, width: '100px' }}>
                            <input type="input" id="day" value={day} onInput={e => setDay(e.target.value)} className="form__field" placeholder="Day" name="day" id='day' required />
                            <label for="day" className="form__label">Day</label>
                        </div>
                        <div className="form__group field" style={{ marginTop: 10, width: '100px' }}>
                            <input type="input" className="form__field" value={month} onInput={e => setMonth(e.target.value)} placeholder="Month" name="month" id='month' required />
                            <label for="month" id="month" className="form__label">Month</label>
                        </div>
                        <div className="form__group field" style={{ marginTop: 10, width: '100px' }}>
                            <input type="input" className="form__field" placeholder="Minuite" value={year} onInput={e => setYear(e.target.value)} name="year" id='year' required />
                            <label for="year" id="year" className="form__label">Year</label>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                    <div><span className="otherSpan">Match Time</span></div>
                    <div style={{ 'display': 'flex' }}>
                        <div className="form__group field" style={{ marginTop: 10, width: '100px' }}>
                            <input type="input"  className="form__field" value={hour} onInput={e => setHour(e.target.value)} placeholder="Hour" name="hrs" id='hrs' required />
                            <label for="hrs" className="form__label">Hour</label>
                        </div>
                        <div className="form__group field" style={{ marginTop: 10, width: '100px' }}>
                            <input type="input" className="form__field" value={minute} onInput={e => setMinute(e.target.value)} placeholder="Minuite" name="min" id='min' required />
                            <label for="min" id="minute" className="form__label">Minute</label>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ 'display': 'flex' }}>
                {!isProgress && (<div onClick={() => {onSubmit() }} className="cardButtonx">
                    <span className="cardButtonSpanx">Create Match</span>
                </div>)}
                {isProgress && (<CircularProgress style={{ marginTop: '25px' }} color='secondary' />)}
            </div>


        </Box>
    )
}