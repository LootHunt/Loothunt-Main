


let casca = async () => {


    const ethereum = window.ethereum;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);

    let config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('jwt')
        },
        body:
        {
            "gameid": gameid,
            "address": accounts[0]
        }
    }

    const response = await fetch("https://bobaap.herokuapp.com/claimprize", config)
    const data = await response.json();
    let contract = await new window.web3.eth.Contract(abi, "0x4af41400A49f752190E735B1C3EC6Ccc97beA316");
    let tokenuri = await contract.methods.claimPrize(response.hashedmessage, response.v, response.r, response.s, gameid, acccounts[0]).send({ from: accounts[0] });
}