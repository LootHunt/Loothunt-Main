import './App.css';
import * as React from 'react';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import HoverImage from './HoverImage'
import CreateMatch from './CreateMatch';
import MyMatches from './MyMatches';
import Matches from './Matches';
import Web3 from 'web3'
import { abi } from "./abi"

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
    background: {
      default: 'black'
    }
  },
});

const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



function App() {

  const [currentMenu, setCurrentMenu] = useState(0);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState("")
  const [matchList, setMatchList] = useState([])
  const [isLoginProgress, setLoginProgress] = useState(false)
  const [metaMaskError, setMetaMaskErr] = useState(false)
  const [metaMaskLoginError, setMetaMaskLoginErr] = useState(false)
  const [myCollection, setMyCollection] = useState([])
  const [isProgress, setProgress] = useState(false);

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  }

  useEffect(() => {

  }, [])

  const getData = async () => {
    let config = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('jwt')
      },
    }
     
    const response = await fetch("https://bobaap.herokuapp.com/wondata", config)
    const data = await response.json();
    for (let i = 0; i < data['data'].length; i++) {
      let dd = data['data'][i]
      let contract = await new window.web3.eth.Contract(abi, "0x4af41400A49f752190E735B1C3EC6Ccc97beA316");
      try{
        console.log(dd.tokenid)
      let tokenuri = await contract.methods.tokenURI(dd.tokenid).call()
      
      const res = await fetch(`https://${tokenuri}.ipfs.infura-ipfs.io/hello.json`)
      let da = await res.json();
      const config2 = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encrypt: da.secret
        })
      }
       let ress = await fetch("https://bobaap.herokuapp.com/getdecrypt", config2)
       let dp = await ress.json();




      dd.url = da.image
      dd.secret = dp.dec
      console.log(dp.dec)
      data['data'][i] = dd;
    }catch(e){
      console.log(e)
    }


    }
    setMatchList(data['data'])
  }

  const handleMetaMaskConncet = async () => {
    setLoginProgress(true)
    if (!isMetaMaskInstalled()) {
      setMetaMaskErr(true);
      setLoginProgress(false)
      return;
    }
    try {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      if (accounts.length > 0) {
        const account_ = accounts[0];
        setAccount(account_);
        getData()
        let nonce = await fetch("https://bobaap.herokuapp.com/" + accounts[0] + "/nonce")
        const json = await nonce.json()
        nonce = json.nonce
        const signature = await ethereum.request({
          method: "personal_sign",
          params: [nonce, accounts[0]],
        });
        const config2 = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature: signature
          })
        }
        const response2 = await fetch("https://bobaap.herokuapp.com/" + accounts[0] + "/signature", config2)
        let res = await response2.json()
        localStorage.setItem("jwt", res.token);

        const myCollection_ = [{ 'img': '', 'secret_text': '' }];
        setMyCollection(myCollection_)

        setLoggedIn(true);
        setLoginProgress(false)
      }
    } catch (e) {
      setMetaMaskLoginErr(true);
      setLoginProgress(false)
    }

  }

  useEffect(() => {
    if (isMetaMaskInstalled()) {
      console.log('MetaMask is installed!');
    } else {
      setMetaMaskErr(true)
    }
  }, [])

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth='xl'>
          <header style={{ display: 'flex', alignItems: 'center' }}>
            <img height={64} width={64} src='logo.png' /><span className='title'>Loot Hunt</span>
          </header>
          {!isLoggedIn && (
            <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', left: 0, right: 0, top: 0, bottom: 0 }}>
              {!isLoginProgress && (<div onClick={() => {
                handleMetaMaskConncet()
              }} className="cardButton">
                <img height={32} width={32} src='metamask.png' /><span className="cardButtonSpan" style={{ marginLeft: '10px' }}>Connect With MetaMask</span>
              </div>)}
              {isLoginProgress && (<CircularProgress style={{ marginTop: '10px' }} color='secondary' />)}

            </Box>
          )}
          {isLoggedIn && (<Box sx={{ display: 'flex', flex: 1, marginTop: '15px' }}>
            <div onClick={() => {
              setCurrentMenu(0)
            }} className={`swapMenuItem ${currentMenu == 0 ? 'swapMenuItemSelected' : ''}`}>
              <span className="swapMenuItemSpan">Matches</span>
            </div>
            <div onClick={() => {
              setCurrentMenu(3)
            }} className={`swapMenuItem ${currentMenu == 3 ? 'swapMenuItemSelected' : ''}`}>
              <span className="swapMenuItemSpan">Create Event</span>
            </div>
            <div onClick={() => {
              setCurrentMenu(1)
            }} className={`swapMenuItem ${currentMenu == 1 ? 'swapMenuItemSelected' : ''}`}>
              <span className="swapMenuItemSpan">My Matches</span>
            </div>
            <div onClick={() => {
              setCurrentMenu(2)
            }} className={`swapMenuItem ${currentMenu == 2 ? 'swapMenuItemSelected' : ''}`}>
              <span className="swapMenuItemSpan">My Collections</span>
            </div>
          </Box>)}
          {isLoggedIn && currentMenu == 0 && (<Matches />)}
          {isLoggedIn && currentMenu == 1 && (<MyMatches />)}
          {isLoggedIn && currentMenu == 3 && (<CreateMatch />)}
          {isLoggedIn && currentMenu == 1 && (<Box>

          </Box>)}
          {isLoggedIn && currentMenu == 2 && (<Box sx={{ flexGrow: 1, marginTop: '30px' }}>
            {isProgress && (<div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress style={{ marginTop: '10px' }} color='secondary' />
            </div>)}
            <Grid container spacing={2}>
              {
                matchList.map((el, index) => {
                  return (
                    <Grid key={index} item xs={2}>
                      <HoverImage url={el.url} secret={el.secret} />
                    </Grid>
                  )
                })
              }
            </Grid>
          </Box>)}
          <Snackbar open={metaMaskError} autoHideDuration={4500} onClose={() => { setMetaMaskErr(false) }}>
            <Alert onClose={() => { setMetaMaskErr(false) }} severity="error" sx={{ width: '100%' }}>
              MetaMask is not installed!
            </Alert>
          </Snackbar>
          <Snackbar open={metaMaskLoginError} autoHideDuration={4500} onClose={() => { setMetaMaskLoginErr(false) }}>
            <Alert onClose={() => { setMetaMaskLoginErr(false) }} severity="error" sx={{ width: '100%' }}>
              MetaMask Login Rejected!
            </Alert>
          </Snackbar>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
