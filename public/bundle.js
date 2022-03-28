let web3;
let crudContract;

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        if(typeof window.ethereum !== 'undefined') {
            window.ethereum.enable()
                .then(() => {
                    resolve(new Web3(window.ethereum))
                })
                .catch((err) => {
                    console.log(err);
                })
            return;
        }
        if(typeof window.web3 !== 'undefined') {
            return resolve(new Web3(window.web3.currentProvider))
        }

        return resolve(new Web3('http://localhost:7545'))
    })
}

const initContract = () => {
    const contractABI = [
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "users",
          "outputs": [
            {
              "name": "uid",
              "type": "uint256"
            },
            {
              "name": "name",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x365b98b2"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_name",
              "type": "string"
            }
          ],
          "name": "create",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0xb6a46b3b"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "read",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xed2e5a97"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "id",
              "type": "uint256"
            },
            {
              "name": "_name",
              "type": "string"
            }
          ],
          "name": "update",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0xf745630f"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "destroy",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0x9d118770"
        }
    ]
    const contractAddress = "0xD26BC21e99Fd3E1EeD4dCeCD4733AA100e740A4f"
    return new web3.eth.Contract(contractABI, contractAddress)
}

const initApp = () => {
    let accounts = []
    web3.eth.getAccounts().then((_accounts) => {
        accounts = _accounts;
    })
    // Getting HTML elements
    const createUserForm = document.getElementById('createUserForm')
    const getUserForm = document.getElementById('getUserForm')
    const updateUserForm = document.getElementById('updateUserForm')
    const deleteUserForm = document.getElementById('deleteUserForm')

    const createUserSuccess = document.getElementById('createUserSuccess')
    const createUserError = document.getElementById('createUserError')
    
    const getUserSuccess = document.getElementById('getUserSuccess')
    const getUserError = document.getElementById('getUserError')
    const getUserResult = document.getElementById('getUserResult')
    const updateMessageSuccess = document.getElementById('updateMessageSuccess')
    const updateMessageError = document.getElementById('updateMessageError')
    const deleteMessageSuccess = document.getElementById('deleteMessageSuccess')
    const deleteMessageError = document.getElementById('deleteMessageError')

    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const input = e.target.elements[0].value
        crudContract.methods.create(input).send({from:accounts[0]}).then(() => {
            successHandler(createUserSuccess, `Succefully created user by name ${input}`)
        }).catch((err) => {
            errorHandler(createUserError, err.message)
        })
    })
    getUserForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const input = e.target.elements[0].value
        crudContract.methods.read(input).call().then((result) => {
            successHandler(getUserSuccess, 'User is succefully retreived')
            getUserResult.innerHTML = `ID is: ${result[0]}, Name is: ${result[1]}`
        }).catch((err) => {
            errorHandler(getUserError, 'something went wrong')
        })
    })
    updateUserForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = e.target.elements[0].value
        const name = e.target.elements[1].value

        crudContract.methods.update(id, name).send({from:accounts[0]}).then(() => {
            successHandler(updateMessageSuccess, 'User is succefully updated!')
        }).catch((err) => {
            errorHandler(updateMessageError, err.message)
        })
    })
    deleteUserForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = e.target.elements[0].value
        crudContract.methods.destroy(id).send({from:accounts[0]}).then(() => {
            successHandler(deleteMessageSuccess, 'User is succefully deleted!')
        }).catch((err) => {
            errorHandler(deleteMessageError, err.message)
        })

    })

}

const successHandler = (element, mssg) => {
    element.classList.add('success')
    element.innerHTML = mssg
    setTimeout(() => {
        element.innerHTML = ''
        element.classList.remove('success')
    },5000)
}
const errorHandler = (element, mssg) => {
    element.classList.add('error')
            element.innerHTML = mssg
            setTimeout(() => {
                element.innerHTML = ''
                element.classList.remove('error')
            },5000)
}
document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then((_web3) => {
            web3 = _web3;
            crudContract = initContract()
            initApp()
        })
})