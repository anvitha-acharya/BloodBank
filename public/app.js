let web3;
let bloodBankContract;
let isInitialized = false;

// Global variable to store location
let donorLocation = null;

// Initialize Web3 and contract
async function initWeb3() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed');
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected accounts:', accounts);
            
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }
            
            web3 = new Web3(window.ethereum);
            
            // Get the current network and chain ID
            const networkId = await web3.eth.net.getId();
            const chainId = await web3.eth.getChainId();
            console.log('Connected to network ID:', networkId);
            console.log('Chain ID:', chainId);
            
            // Initialize contract
            const contractAddress = '0xF87745a994B941bBc49a9f61c7c5B13517a2Cd37';
            console.log('Attempting to connect to contract at:', contractAddress);
            
            // Check if the contract exists at the specified address
            const code = await web3.eth.getCode(contractAddress);
            console.log('Contract code length:', code.length);
            console.log('Contract code (first 100 chars):', code.substring(0, 100));
            
            if (code === '0x' || code === '') {
                throw new Error('No contract found at the specified address. Please make sure the contract is deployed correctly.');
            }
            
            // Log the ABI being used
            console.log('Contract ABI:', JSON.stringify(contractABI));
            
            bloodBankContract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Verify contract is initialized
            try {
                // Try to get the admin address first (this should always exist)
                console.log('Attempting to call admin()...');
                const admin = await bloodBankContract.methods.admin().call();
                console.log('Admin address:', admin);
                
                // Then try to get blood inventory
                console.log('Attempting to call bloodInventory(0)...');
                const bloodInventory = await bloodBankContract.methods.bloodInventory(0).call();
                console.log('Blood inventory for type A:', bloodInventory);
                
                console.log('Contract initialized successfully');
                isInitialized = true;
                return true;
            } catch (error) {
                console.error('Contract initialization failed:', error);
                console.error('Error details:', {
                    message: error.message,
                    code: error.code,
                    data: error.data,
                    stack: error.stack
                });
                
                // Check if it's a network mismatch
                if (error.message.includes('network')) {
                    alert('Network mismatch. Please make sure you are connected to the correct network in MetaMask.');
                } else if (error.message.includes('gas')) {
                    alert('Gas estimation failed. Please check if the contract is deployed correctly.');
                } else {
                    alert('Contract initialization failed: ' + error.message);
                }
                return false;
            }
        } else {
            alert("Please install MetaMask to use this application.");
            return false;
        }
    } catch (error) {
        console.error('Error initializing Web3:', error);
        console.error('Full error:', error);
        alert('Error connecting to MetaMask: ' + error.message);
        return false;
    }
}

// Add network change handler
if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
        console.log('Network changed to:', chainId);
        window.location.reload();
    });
    
    window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed to:', accounts[0]);
        window.location.reload();
    });
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    addStatusButton();
});

window.addEventListener('load', async () => {
    console.log('Window loaded');
    try {
        await initWeb3();
        console.log('Web3 initialized');
        
        // Only call displayBloodStock if we're on the blood stock page
        if (document.getElementById('bloodTypeA')) {
            await displayBloodStock();
            // Update every 30 seconds
            setInterval(displayBloodStock, 30000);
        }
    } catch (error) {
        console.error('Error initializing:', error);
    }
});

// Helper function to ensure contract is initialized
async function ensureInitialized() {
    if (!isInitialized) {
        const success = await initWeb3();
        if (!success) {
            throw new Error('Failed to initialize Web3 and contract');
        }
    }
}
// Add this function to check chain ID
async function checkChainId() {
    try {
        const chainId = await web3.eth.getChainId();
        console.log('Current Chain ID:', chainId);
        alert('Current Chain ID: ' + chainId);
        return chainId;
    } catch (error) {
        console.error('Error getting chain ID:', error);
        return null;
    }
}

// Contract Address and ABI (replace with your actual deployed contract address and ABI)
const contractAddress = '0xF87745a994B941bBc49a9f61c7c5B13517a2Cd37';
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminLoggedIn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BloodDonated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "BloodRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"indexed": false,
				"internalType": "struct BloodBank.Request",
				"name": "request",
				"type": "tuple"
			}
		],
		"name": "BloodRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			}
		],
		"name": "DonorPermissionGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			}
		],
		"name": "DonorPermissionRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "hospital",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"name": "HospitalRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			}
		],
		"name": "PatientPermissionGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			}
		],
		"name": "PatientPermissionRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "PatientRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RequestResponded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospitalAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"name": "addHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "addPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminLogin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowedDonors",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowedPatients",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "bloodInventory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bloodRequests",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "donateBlood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "donorAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "donorBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "getBloodInventory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "getPatientRequests",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"internalType": "struct BloodBank.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "getPatientResponses",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"internalType": "struct BloodBank.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRegisteredUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "registeredDonors",
				"type": "address[]"
			},
			{
				"internalType": "address[]",
				"name": "registeredPatients",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalBloodDonated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "grantDonorPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "grantPatientPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hospitals",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "isDonorAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "isPatientAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospitalAddress",
				"type": "address"
			}
		],
		"name": "locateHospitalToDonate",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientRequests",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isResponded",
				"type": "bool"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientResponses",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isResponded",
				"type": "bool"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "patients",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "registerAsDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "registerAsPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "requestBlood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"name": "respondToRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "revokeDonorPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "revokePatientPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBloodDonated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDonors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalHospitals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPatients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ;

function redirectTo(page) {
    window.location.href = page;
}

// Function to handle admin login
async function adminLogin() {
    try {
        // Get the entered admin address
        const adminAddress = document.getElementById('adminAddress').value;

        // Validate admin address (replace this with your actual validation logic)
        const isValidAdmin = await isValidAdminAddress(adminAddress);

        if (isValidAdmin) {
            alert('Admin Login Successful');
            // Redirect to the admin dashboard after login
            redirectTo('admin_dashboard.html');
        } else {
            alert('Invalid Admin Address');
        }
    } catch (error) {
        console.error('Error logging in as admin:', error.message);
    }
}

// Function to validate admin address (replace this with your actual validation logic)
async function isValidAdminAddress(adminAddress) {
    // For simplicity, let's assume any non-empty admin address is valid
    return adminAddress.trim() !== '';
}

// Function to register a donor
async function registerDonor(event) {
    event.preventDefault();
    
    try {
        await ensureInitialized();
        
        const name = document.getElementById('donorName').value;
        const age = document.getElementById('donorAge').value;
        const bloodType = document.getElementById('donorBloodType').value;

        if (!name || !age || !bloodType) {
            alert('Please fill in all fields');
            return false;
        }

        if (age < 18 || age > 65) {
            alert('Age must be between 18 and 65 years');
            return false;
        }

        // Check if location was captured
        if (!donorLocation) {
            alert('Please capture your location first');
            return false;
        }

        const accounts = await web3.eth.getAccounts();
        const donorAddress = accounts[0];

        // Map blood type string to numeric value
        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType];

        // Store donor location in localStorage
        const donorData = {
            address: donorAddress,
            latitude: donorLocation.latitude,
            longitude: donorLocation.longitude,
            name: name,
            bloodType: bloodType
        };
        localStorage.setItem(`donor_${donorAddress}`, JSON.stringify(donorData));

        // Register the donor on the blockchain
        await bloodBankContract.methods.registerAsDonor(name, bloodTypeNumeric)
            .send({ from: donorAddress });

        alert('Donor registration successful! Please wait for admin approval.');
        window.location.href = 'donor_login.html';
        return false;
    } catch (error) {
        console.error('Error registering donor:', error);
        alert('Error registering donor: ' + error.message);
        return false;
    }
}

// Function to search for nearby donors
async function searchNearbyDonors() {
    try {
        // Get patient's current location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const patientLat = position.coords.latitude;
        const patientLng = position.coords.longitude;

        // Get all donors from localStorage
        const donors = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('donor_')) {
                const donor = JSON.parse(localStorage.getItem(key));
                donors.push(donor);
            }
        }

        // Calculate distances and sort donors
        const donorsWithDistance = donors.map(donor => {
            const distance = calculateDistance(
                patientLat,
                patientLng,
                donor.latitude,
                donor.longitude
            );
            return { ...donor, distance };
        });

        // Sort by distance
        donorsWithDistance.sort((a, b) => a.distance - b.distance);

        // Display results
        displayDonorResults(donorsWithDistance);
    } catch (error) {
        console.error('Error searching for donors:', error);
        alert('Error searching for donors: ' + error.message);
    }
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Function to display donor results
function displayDonorResults(donors) {
    const resultsDiv = document.getElementById('donorResults');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.style.height = '400px';
    mapContainer.style.marginBottom = '20px';
    resultsDiv.appendChild(mapContainer);

    // Initialize map
    const map = new google.maps.Map(mapContainer, {
        zoom: 12,
        center: { lat: donors[0]?.latitude || 0, lng: donors[0]?.longitude || 0 }
    });

    // Add markers for each donor
    donors.forEach(donor => {
        const marker = new google.maps.Marker({
            position: { lat: donor.latitude, lng: donor.longitude },
            map: map,
            title: `${donor.name} (${donor.bloodType})`
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${donor.name}</h3>
                    <p>Blood Type: ${donor.bloodType}</p>
                    <p>Distance: ${donor.distance.toFixed(2)} km</p>
                    <button onclick="requestBloodFromDonor('${donor.address}')">Request Blood</button>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });

    // Create list of donors
    const donorList = document.createElement('div');
    donorList.className = 'donor-list';
    donors.forEach(donor => {
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <h3>${donor.name}</h3>
            <p>Blood Type: ${donor.bloodType}</p>
            <p>Distance: ${donor.distance.toFixed(2)} km</p>
            <button onclick="requestBloodFromDonor('${donor.address}')">Request Blood</button>
        `;
        donorList.appendChild(donorCard);
    });
    resultsDiv.appendChild(donorList);
}

// Function to request blood from a specific donor
async function requestBloodFromDonor(donorAddress) {
    try {
        const bloodType = prompt('Enter blood type (A, B, AB, O):');
        const amount = parseInt(prompt('Enter the amount of blood requested:'));

        if (!bloodType || isNaN(amount)) {
            alert('Please enter valid blood type and amount');
            return;
        }

        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType.toUpperCase()];

        // Get patient address
        const accounts = await web3.eth.getAccounts();
        const patientAddress = accounts[0];

        // Call the smart contract function for blood request
        await bloodBankContract.methods.requestBlood(bloodTypeNumeric, amount)
            .send({ from: patientAddress });

        alert('Blood request sent successfully!');
    } catch (error) {
        console.error('Error requesting blood:', error);
        alert('Error requesting blood: ' + error.message);
    }
}

// Add this to your HTML file where you want to show the donor search interface
function addDonorSearchInterface() {
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div class="search-container">
            <h2>Find Nearby Donors</h2>
            <button onclick="searchNearbyDonors()" class="search-button">Search Nearby Donors</button>
            <div id="donorResults"></div>
        </div>
    `;
    document.body.appendChild(searchContainer);
}

// Add this to your HTML file's head section
function addGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBteTYgV4PeMFPBvB9NGs-1tyjw6L17dI8`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize the search interface when the page loads
window.addEventListener('load', () => {
    if (document.getElementById('donorSearch')) {
        addDonorSearchInterface();
        addGoogleMapsScript();
    }
});

// Function to register a patient
async function registerPatient() {
    try {
        await ensureInitialized();
        
        const name = document.getElementById('patientName').value;
        const age = document.getElementById('patientAge').value;
        const bloodType = document.getElementById('patientBloodType').value;

        if (!name || !age || !bloodType) {
            alert('Please fill in all fields');
            return;
        }

        // Get the currently selected account from MetaMask
        const accounts = await web3.eth.getAccounts();
        const patientAddress = accounts[0];

        // Map blood type string to numeric value
        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType];

        // Register the patient
        await bloodBankContract.methods.registerAsPatient(name, bloodTypeNumeric)
            .send({ from: patientAddress });

        alert('Patient registration successful! Please wait for admin approval.');
        window.location.href = 'patient_login.html';
    } catch (error) {
        console.error('Error registering patient:', error);
        alert('Error registering patient: ' + error.message);
    }
}

// Function to handle granting user permission by admin
async function grantUserPermission() {
    try {
        // Get admin address
        const adminAddress = await getCurrentUserAddress();
        if (!adminAddress) {
            alert('Please connect your MetaMask wallet first');
            return;
        }

        // Get registered users
        const { registeredDonors, registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();

        // Create a list of pending users
        const pendingUsers = [];
        
        // Check donors
        for (const donorAddress of registeredDonors) {
            const isAllowed = await bloodBankContract.methods.isDonorAllowed(donorAddress).call();
            if (!isAllowed) {
            const donorDetails = await bloodBankContract.methods.donors(donorAddress).call();
                pendingUsers.push({
                    address: donorAddress,
                    name: donorDetails.name,
                    type: 'Donor',
                    bloodType: ['A', 'B', 'AB', 'O'][donorDetails.bloodType]
                });
            }
        }

        // Check patients
        for (const patientAddress of registeredPatients) {
            const isAllowed = await bloodBankContract.methods.isPatientAllowed(patientAddress).call();
            if (!isAllowed) {
            const patientDetails = await bloodBankContract.methods.patients(patientAddress).call();
                pendingUsers.push({
                    address: patientAddress,
                    name: patientDetails.name,
                    type: 'Patient',
                    bloodType: ['A', 'B', 'AB', 'O'][patientDetails.bloodType]
                });
            }
        }

        if (pendingUsers.length === 0) {
            alert('No pending users to approve');
            return;
        }

        // Create a formatted list of pending users
        const userList = pendingUsers.map((user, index) => 
            `${index + 1}. ${user.type}: ${user.name}\n   Address: ${user.address}\n   Blood Type: ${user.bloodType}`
        ).join('\n\n');

        // Show the list and get user input
        const userInput = prompt(
            'Select a user to approve (enter number):\n\n' + userList
        );

        if (!userInput) {
            return; // User cancelled
        }

        const selectedIndex = parseInt(userInput) - 1;
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= pendingUsers.length) {
            alert('Invalid selection. Please enter a number between 1 and ' + pendingUsers.length);
            return;
        }

        const selectedUser = pendingUsers[selectedIndex];

        // Grant permission based on user type
        if (selectedUser.type === 'Donor') {
            await bloodBankContract.methods.grantDonorPermission(selectedUser.address)
                .send({ from: adminAddress });
            alert(`Donor ${selectedUser.name} has been approved`);
        } else {
            await bloodBankContract.methods.grantPatientPermission(selectedUser.address)
                .send({ from: adminAddress });
            alert(`Patient ${selectedUser.name} has been approved`);
        }

        // Refresh the display
        if (typeof displayRegisteredUsers === 'function') {
            await displayRegisteredUsers();
        }

    } catch (error) {
        console.error('Error during granting user permission:', error);
        alert('Error granting permission: ' + error.message);
    }
}

// Function to handle donor login
async function donorLogin() {
    try {
        await ensureInitialized();
        const donorAddress = document.getElementById('donorAddress').value;
        const donor = await bloodBankContract.methods.donors(donorAddress).call();
        
        if (donor.isRegistered) {
            localStorage.setItem('userAddress', donorAddress);
            localStorage.setItem('userType', 'donor');
            redirectTo('donor_dashboard.html');
        } else {
            alert('Donor not registered. Please register first.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
}

// Function to handle patient login
async function patientLogin() {
    try {
        await ensureInitialized();
        const patientAddress = '0x21f49D3476000345c34E214741cADee8317ead94'; // Use the correct Ganache address
        const patient = await bloodBankContract.methods.patients(patientAddress).call();
        
        if (patient.isRegistered) {
            localStorage.setItem('userAddress', patientAddress);
            localStorage.setItem('userType', 'patient');
            localStorage.setItem('patientAddress', patientAddress); // Store patient address
            redirectTo('patient_dashboard.html');
        } else {
            alert('Patient not registered. Please register first.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
}

// Function to handle blood donation by donors

//add hospital
async function addHospital() {
    try {
        const hospitalName = prompt('Enter hospital name:');
        const hospitalLocation = prompt('Enter hospital location (address):');

        // Call the smart contract function for adding a hospital
        await bloodBankContract.methods.addHospital(hospitalLocation, hospitalName).send({ from: getCurrentUserAddress() });

        alert('Hospital Added Successfully');
    } catch (error) {
        console.error('Error during adding hospital:', error.message);
    }
}
// Function to get the current user's Ethereum address using web3.js
function getCurrentUserAddress() {
    // Assuming you have web3 available
    if (window.ethereum) {
        return window.ethereum.selectedAddress;
    } else {
        console.error('Web3 provider not found');
        return null;
    }
}

// Add a function to get optimal gas parameters
async function getGasParameters() {
    try {
        // Get current gas price from network
        const gasPrice = await web3.eth.getGasPrice();
        // Convert to Gwei and set to 2 Gwei
        const gasPriceInGwei = 2;
        const gasPriceInWei = web3.utils.toWei(gasPriceInGwei.toString(), 'gwei');
        
        return {
            gasPrice: gasPriceInWei,
            gas: 200000 // Set a reasonable gas limit
        };
    } catch (error) {
        console.error('Error getting gas parameters:', error);
        throw error;
    }
}

// Modify the donateBlood function to use custom gas parameters
async function donateBlood() {
    try {
        // Ensure QR code library is loaded
        if (typeof QRCode === 'undefined') {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        const donorAddress = getCurrentUserAddress();
        if (!donorAddress) {
            alert('Please connect your MetaMask wallet first');
            return;
        }

        const bloodTypeStr = prompt('Enter the blood type (A, B, AB, O):');
        if (!bloodTypeStr) {
            alert('Blood type is required');
            return;
        }

        const bloodType = mapBloodType(bloodTypeStr.toUpperCase());
        if (bloodType === undefined) {
            alert('Invalid blood type. Please enter A, B, AB, or O');
            return;
        }

        const donationAmount = prompt('Enter the amount of blood to donate:');
        if (!donationAmount) {
            alert('Amount is required');
            return;
        }

        const amount = parseInt(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        // Get gas parameters
        const gasParams = await getGasParameters();

        // Call the smart contract function for blood donation with custom gas parameters
        const tx = await bloodBankContract.methods.donateBlood(bloodType, amount)
            .send({ 
                from: donorAddress,
                gasPrice: gasParams.gasPrice,
                gas: gasParams.gas
            });

        // Generate unique donation ID
        const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Store the donation details with QR data
        const donationData = {
            donationId,
            donorAddress,
            bloodType: bloodTypeStr,
            amount,
            timestamp: Date.now(),
            txHash: tx.transactionHash
        };

        // Generate QR code
        await generateBloodBagQR(donationData);

        // Store in localStorage
        const donationKey = `donation_${donationId}`;
        localStorage.setItem(donationKey, JSON.stringify(donationData));
        
        // Clear and refresh the display
        const donationDetailsList = document.getElementById('donationDetailsList');
        if (donationDetailsList) {
            donationDetailsList.innerHTML = '';
        }
        displayStoredDonationDetails();
        
        alert('Blood Donation Successful! QR Code has been generated.');
    } catch (error) {
        console.error('Error during blood donation:', error.message);
        alert('Error during blood donation: ' + error.message);
    }
}

// Modify other transaction functions to use the same gas parameters
async function registerAsDonor(name, bloodType) {
    try {
        const gasParams = await getGasParameters();
        return await bloodBankContract.methods.registerAsDonor(name, bloodType)
            .send({ 
                from: getCurrentUserAddress(),
                gasPrice: gasParams.gasPrice,
                gas: gasParams.gas
            });
    } catch (error) {
        console.error('Error registering donor:', error);
        throw error;
    }
}

async function registerAsPatient(name, bloodType) {
    try {
        const gasParams = await getGasParameters();
        return await bloodBankContract.methods.registerAsPatient(name, bloodType)
            .send({ 
                from: getCurrentUserAddress(),
                gasPrice: gasParams.gasPrice,
                gas: gasParams.gas
            });
    } catch (error) {
        console.error('Error registering patient:', error);
        throw error;
    }
}

async function requestBlood(bloodType, amount) {
    try {
        const gasParams = await getGasParameters();
        return await bloodBankContract.methods.requestBlood(bloodType, amount)
            .send({ 
                from: getCurrentUserAddress(),
                gasPrice: gasParams.gasPrice,
                gas: gasParams.gas
            });
    } catch (error) {
        console.error('Error requesting blood:', error);
        throw error;
    }
}

async function respondToRequest(patientAddress, bloodType, response) {
    try {
        const gasParams = await getGasParameters();
        return await bloodBankContract.methods.respondToRequest(patientAddress, bloodType, response)
            .send({ 
                from: getCurrentUserAddress(),
                gasPrice: gasParams.gasPrice,
                gas: gasParams.gas
            });
    } catch (error) {
        console.error('Error responding to request:', error);
        throw error;
    }
}

// Function to display stored donation details
async function displayStoredDonationDetails() {
    try {
        const donationDetailsList = document.getElementById('donationDetailsList');
        const totalDonatedElement = document.getElementById('totalDonated');
        const lastDonationElement = document.getElementById('lastDonation');
        const bloodTypeElement = document.getElementById('bloodType');
        const qrCodeContainer = document.getElementById('qrCodeContainer');
    
        if (donationDetailsList) {
            let totalAmount = 0;
            let lastDonation = null;
            let bloodType = null;
            donationDetailsList.innerHTML = ''; // Clear existing entries
    
            // Get all donation entries and sort them by timestamp
            const donations = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('donation_')) {
                    const donationData = JSON.parse(localStorage.getItem(key));
                    donations.push({
                        ...donationData,
                        timestamp: parseInt(donationData.timestamp)
                    });
                }
            }

            // Sort donations by timestamp (newest first)
            donations.sort((a, b) => b.timestamp - a.timestamp);

            // Clear QR code container
            if (qrCodeContainer) {
                qrCodeContainer.innerHTML = '';
            }

            // Display donations and update statistics
            for (const donation of donations) {
                // Create list item and append it to the list
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Donation from donor at ${donation.donorAddress}. Blood Type: ${donation.bloodType}, Amount: ${donation.amount}</span>
                        <button onclick="removeDonation('${donation.donorAddress}', '${donation.bloodType}', ${donation.amount})" 
                                class="btn btn-danger" style="margin-left: 10px; padding: 2px 8px;">Remove</button>
                    </div>
                `;
                donationDetailsList.appendChild(listItem);
    
                // Update total amount
                totalAmount += parseInt(donation.amount);

                // Update last donation if not set
                if (!lastDonation) {
                    lastDonation = donation;
                }

                // Update blood type if not set
                if (!bloodType) {
                    bloodType = donation.bloodType;
                }

                // Generate QR code for each donation
                if (qrCodeContainer) {
                    const qrWrapper = document.createElement('div');
                    qrWrapper.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        margin: 20px 0;
                    `;
                    
                    // Add title with donation date
                    const title = document.createElement('h4');
                    title.textContent = `Blood Donation QR Code - ${new Date(donation.timestamp).toLocaleDateString()}`;
                    title.style.cssText = `
                        margin-bottom: 15px;
                        color: #2c3e50;
                        font-weight: 600;
                    `;
                    qrWrapper.appendChild(title);
                    
                    // Create canvas element for QR code
                    const canvas = document.createElement('canvas');
                    canvas.style.cssText = `
                        background: white;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 15px;
                    `;
                    qrWrapper.appendChild(canvas);
                    
                    // Generate QR code
                    await QRCode.toCanvas(canvas, JSON.stringify(donation), {
                        width: 200,
                        margin: 1,
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        }
                    });

                    // Add download button
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = 'Download QR Code';
                    downloadBtn.className = 'btn btn-primary';
                    downloadBtn.style.cssText = `
                        padding: 8px 20px;
                        font-size: 14px;
                        border-radius: 5px;
                        background-color: #007bff;
                        border: none;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        margin-top: 10px;
                    `;
                    
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.download = `blood-donation-${donation.donationId}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    };
                    
                    // Add hover effect
                    downloadBtn.onmouseover = () => {
                        downloadBtn.style.backgroundColor = '#0056b3';
                    };
                    downloadBtn.onmouseout = () => {
                        downloadBtn.style.backgroundColor = '#007bff';
                    };
                    
                    qrWrapper.appendChild(downloadBtn);
                    
                    // Add donation details
                    const detailsDiv = document.createElement('div');
                    detailsDiv.style.cssText = `
                        margin-top: 15px;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    `;
                    detailsDiv.innerHTML = `
                        <p><strong>Donation ID:</strong> ${donation.donationId}</p>
                        <p><strong>Blood Type:</strong> ${donation.bloodType}</p>
                        <p><strong>Amount:</strong> ${donation.amount} units</p>
                        <p><strong>Date:</strong> ${new Date(donation.timestamp).toLocaleDateString()}</p>
                    `;
                    qrWrapper.appendChild(detailsDiv);
                    
                    qrCodeContainer.appendChild(qrWrapper);
                }
            }
    
            // Display the total amount
            if (totalDonatedElement) {
                totalDonatedElement.textContent = totalAmount;
            }

            // Display last donation
            if (lastDonationElement) {
                if (lastDonation) {
                    const date = new Date(lastDonation.timestamp);
                    lastDonationElement.textContent = `${lastDonation.bloodType} - ${lastDonation.amount} units (${date.toLocaleDateString()})`;
                } else {
                    lastDonationElement.textContent = 'No donations yet';
                }
            }

            // Display blood type
            if (bloodTypeElement) {
                bloodTypeElement.textContent = bloodType || 'Not specified';
            }
        } else {
            console.error('Element with ID "donationDetailsList" not found.');
        }
    } catch (error) {
        console.error('Error displaying donation details:', error);
        alert('Error loading donation details. Please check console for details.');
    }
}

	// Function to request blood
	async function requestBlood() {
		try {
			const patientAddress = getCurrentUserAddress();
			
			// Check if the patient address is available
			if (!patientAddress) {
				console.error('Patient address not available');
				return;
			}

			// Prompt the user for the blood type and amount
			const bloodType = prompt('Enter blood type (A, B, AB, O):');
			const amount = parseInt(prompt('Enter the amount of blood requested:'));

			// Call the smart contract function for blood request with specified blood type and amount
			await bloodBankContract.methods.requestBlood(bloodType, amount).send({ from: patientAddress });

			alert('Blood Request Sent');
		} catch (error) {
			console.error('Error during blood request:', error.message);
		}
	}

// Function to display blood requests
async function displayBloodRequests(targetElementId) {
    try {
        // Ensure contract is initialized
        await ensureInitialized();

        const result = await bloodBankContract.methods.getRegisteredUsers().call();
        const registeredPatients = result[1];
        const requestsList = document.getElementById(targetElementId);
        requestsList.innerHTML = '';

        const bloodTypes = ['A', 'B', 'AB', 'O'];
        let hasRequests = false;
        let pendingRequests = [];

        // First, collect all pending requests
        for (const patientAddress of registeredPatients) {
            for (let bloodType = 0; bloodType < 4; bloodType++) {
            const requests = await bloodBankContract.methods.getPatientRequests(patientAddress, bloodType).call();

                if (requests.length > 0) {
            for (const request of requests) {
                if (!request.isResponded) {
                            const patient = await bloodBankContract.methods.patients(patientAddress).call();
                            pendingRequests.push({
                                patientAddress,
                                patientName: patient.name,
                                bloodType,
                                amount: request.amount
                            });
                            hasRequests = true;
                        }
                    }
                }
            }
        }

        if (!hasRequests) {
            requestsList.innerHTML = '<p>No pending blood requests found.</p>';
            return;
        }

        // Create a formatted list of pending requests
        const requestList = pendingRequests.map((req, index) => 
            `${index + 1}. Patient: ${req.patientName}\n   Address: ${req.patientAddress}\n   Blood Type: ${bloodTypes[req.bloodType]}\n   Amount: ${req.amount} units`
        ).join('\n\n');

        // Show the list and get user input
        const userInput = prompt(
            'Select a request to respond to (enter number):\n\n' + requestList
        );

        if (!userInput) {
            return; // User cancelled
        }

        const selectedIndex = parseInt(userInput) - 1;
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= pendingRequests.length) {
            alert('Invalid selection. Please enter a number between 1 and ' + pendingRequests.length);
            return;
        }

        const selectedRequest = pendingRequests[selectedIndex];
        const response = confirm(`Do you want to approve this request?\n\nPatient: ${selectedRequest.patientName}\nBlood Type: ${bloodTypes[selectedRequest.bloodType]}\nAmount: ${selectedRequest.amount} units`);

        if (response !== null) {
            await respondToRequest(selectedRequest.patientAddress, selectedRequest.bloodType, response);
            // Refresh the display
            await displayBloodRequests(targetElementId);
        }
    } catch (error) {
        console.error('Error displaying blood requests:', error);
        alert('Error loading blood requests. Please check console for details.');
    }
}

// Function to respond to a blood request
async function respondToRequest(patientAddress, bloodType, response) {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAddress = accounts[0];

        await bloodBankContract.methods.respondToRequest(patientAddress, bloodType, response)
            .send({ from: adminAddress });

        alert(`Request ${response ? 'approved' : 'declined'} successfully!`);
    } catch (error) {
        console.error('Error responding to request:', error);
        alert('Error responding to request: ' + error.message);
    }
}

	function mapBloodType(bloodTypeString) {
		const bloodTypeMap = {
			'A': 0,
			'B': 1,
			'AB': 2,
			'O': 3,
		};
		return bloodTypeMap[bloodTypeString];
	}

	// Function to display the response on the patient dashboard
	function displayResponse(patientAddress, response) {
		const patientDashboard = document.getElementById('patientDashboard');
		const responseMessage = response ? 'approved' : 'rejected';
		const listItem = document.createElement('li');
		listItem.textContent = `Your blood donation request has been ${responseMessage}.`;
		patientDashboard.appendChild(listItem);
	}

	

	async function respondToRequest() {
		try {
			const userAddress = getCurrentUserAddress();
	
			// Check if the user address is valid
			if (!userAddress) {
				alert('Invalid user address. Please make sure MetaMask is connected.');
				return;
			}
	
			const patientAddress = prompt('Enter patient address:');
	
			// Check if the patient address is valid
			if (!web3.utils.isAddress(patientAddress)) {
				alert('Invalid patient address. Please try again.');
				return;
			}
	
			const bloodType = prompt('Enter blood type (A, B, AB, O):');
			const response = confirm('Do you want to approve the blood donation request?');
	
			// Call the smart contract function for responding to blood donation requests
			await bloodBankContract.methods.respondToRequest(patientAddress, bloodType, response).send({ from: userAddress });
	
			alert('Your response has been sent.');

		} catch (error) {
			console.error('Error during responding to blood donation requests:', error.message);
		}
	}
	
	async function displayPatientResponses() {
		try {
			const { registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();
	
			// Filter patients with responses
			const patientsWithResponses = await Promise.all(
				registeredPatients.map(async (patientAddress) => {
					const responses = await bloodBankContract.methods.getPatientResponses(patientAddress).call();
					return { patientAddress, hasResponses: responses.length > 0 };
				})
			);
	
			// Filter only patients with responses
			const patientsWithResponsesFiltered = patientsWithResponses.filter((patient) => patient.hasResponses);
	
			// Check if there are patients with responses
			if (patientsWithResponsesFiltered.length === 0) {
				console.log('No patients with responses found.');
				return;
			}
	
			// Prompt the user to select a patient with responses
			const selectedPatient = prompt('Select a patient with responses:\n' +
				patientsWithResponsesFiltered.map((patient, index) => `${index + 1}. ${patient.patientAddress}`).join('\n'));
	
        // Check if the selected patient is valid
        if (!selectedPatient || !web3.utils.isAddress(selectedPatient)) {
            alert('Invalid patient address. Please try again.');
				return;
			}
	
        // Call the smart contract function to get patient responses
        const responses = await bloodBankContract.methods.getPatientResponses(selectedPatient).call();

        // Display responses
        const responseList = document.getElementById('responseList');
        if (responseList) {
            responseList.innerHTML = '';
            responses.forEach((response, index) => {
				const listItem = document.createElement('li');
                listItem.textContent = `Response ${index + 1}: ${response.isResponded ? 'Approved' : 'Declined'}`;
                responseList.appendChild(listItem);
			});
        }
		} catch (error) {
        console.error('Error displaying patient responses:', error);
        alert('Error loading patient responses. Please check console for details.');
    }
}

// Function to display registered users
async function displayRegisteredUsers() {
    try {
        const { registeredDonors, registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();
        
        // Display donors
        const donorsList = document.getElementById('donorsList');
        if (donorsList) {
            donorsList.innerHTML = '';
            for (const donorAddress of registeredDonors) {
                const donor = await bloodBankContract.methods.donors(donorAddress).call();
                const isAllowed = await bloodBankContract.methods.isDonorAllowed(donorAddress).call();
                
                const donorItem = document.createElement('div');
                donorItem.className = 'user-card';
                donorItem.innerHTML = `
                    <div class="user-info">
                        <strong>${donor.name}</strong>
                        <br>
                        <small>Address: ${donorAddress}</small>
                        <br>
                        <small>Blood Type: ${['A', 'B', 'AB', 'O'][donor.bloodType]}</small>
                    </div>
                    <div class="status-badge ${isAllowed ? 'status-approved' : 'status-pending'}">
                        ${isAllowed ? 'Approved' : 'Pending'}
                    </div>
                `;
                donorsList.appendChild(donorItem);
            }
        }

        // Display patients
        const patientsList = document.getElementById('patientsList');
        if (patientsList) {
            patientsList.innerHTML = '';
            for (const patientAddress of registeredPatients) {
                const patient = await bloodBankContract.methods.patients(patientAddress).call();
                const isAllowed = await bloodBankContract.methods.isPatientAllowed(patientAddress).call();
                
                const patientItem = document.createElement('div');
                patientItem.className = 'user-card';
                patientItem.innerHTML = `
                    <div class="user-info">
                        <strong>${patient.name}</strong>
                        <br>
                        <small>Address: ${patientAddress}</small>
                        <br>
                        <small>Blood Type: ${['A', 'B', 'AB', 'O'][patient.bloodType]}</small>
                    </div>
                    <div class="status-badge ${isAllowed ? 'status-approved' : 'status-pending'}">
                        ${isAllowed ? 'Approved' : 'Pending'}
                    </div>
                `;
                patientsList.appendChild(patientItem);
            }
        }
    } catch (error) {
        console.error('Error displaying registered users:', error);
        alert('Error loading registered users. Please check console for details.');
    }
}

// Function to decline a user
async function declineUser() {
    try {
        const { registeredDonors, registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();
        
        // Create a list of all users
        const allUsers = [];
        
        // Add donors
        for (const donorAddress of registeredDonors) {
            const donor = await bloodBankContract.methods.donors(donorAddress).call();
            const isAllowed = await bloodBankContract.methods.isDonorAllowed(donorAddress).call();
            if (isAllowed) {
                allUsers.push({
                    address: donorAddress,
                    name: donor.name,
                    type: 'Donor',
                    bloodType: ['A', 'B', 'AB', 'O'][donor.bloodType]
                });
            }
        }
        
        // Add patients
        for (const patientAddress of registeredPatients) {
            const patient = await bloodBankContract.methods.patients(patientAddress).call();
            const isAllowed = await bloodBankContract.methods.isPatientAllowed(patientAddress).call();
            if (isAllowed) {
                allUsers.push({
                    address: patientAddress,
                    name: patient.name,
                    type: 'Patient',
                    bloodType: ['A', 'B', 'AB', 'O'][patient.bloodType]
                });
            }
        }
        
        if (allUsers.length === 0) {
            alert('No approved users to decline');
            return;
        }
        
        // Create a formatted list of users
        const userList = allUsers.map((user, index) => 
            `${index + 1}. ${user.type}: ${user.name}\n   Address: ${user.address}\n   Blood Type: ${user.bloodType}`
        ).join('\n\n');
        
        // Show the list and get user input
        const userInput = prompt(
            'Select a user to decline (enter number):\n\n' + userList
        );
        
        if (!userInput) {
            return; // User cancelled
        }
        
        const selectedIndex = parseInt(userInput) - 1;
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= allUsers.length) {
            alert('Invalid selection. Please enter a number between 1 and ' + allUsers.length);
            return;
        }
        
        const selectedUser = allUsers[selectedIndex];
        
        // Revoke permission based on user type
        if (selectedUser.type === 'Donor') {
            await bloodBankContract.methods.revokeDonorPermission(selectedUser.address)
                .send({ from: await getCurrentUserAddress() });
            alert(`Donor ${selectedUser.name} has been declined`);
        } else {
            await bloodBankContract.methods.revokePatientPermission(selectedUser.address)
                .send({ from: await getCurrentUserAddress() });
            alert(`Patient ${selectedUser.name} has been declined`);
        }
        
        // Refresh the display
        await displayRegisteredUsers();
        
		} catch (error) {
        console.error('Error during declining user:', error);
        alert('Error declining user: ' + error.message);
    }
}

// Function to remove a specific donation
function removeDonation(donorAddress, bloodType, amount) {
    // Find and remove the donation from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('donation_')) {
            const donationData = JSON.parse(localStorage.getItem(key));
            if (donationData.donorAddress === donorAddress && 
                donationData.bloodType === bloodType && 
                donationData.amount === amount) {
                localStorage.removeItem(key);
                break;
            }
        }
    }
    // Refresh the display
    displayStoredDonationDetails();
}

// Function to display blood stock information
async function displayBloodStock() {
    try {
        // Only proceed if we're on the blood stock page
        if (!document.getElementById('bloodTypeA')) {
            return;
        }

        // Ensure contract is initialized
        if (!isInitialized) {
            const success = await initWeb3();
            if (!success) {
                throw new Error('Failed to initialize Web3');
            }
        }

        // Get blood stock counts using bloodInventory mapping
        const [bloodTypeA, bloodTypeB, bloodTypeAB, bloodTypeO] = await Promise.all([
            bloodBankContract.methods.bloodInventory(0).call(),
            bloodBankContract.methods.bloodInventory(1).call(),
            bloodBankContract.methods.bloodInventory(2).call(),
            bloodBankContract.methods.bloodInventory(3).call()
        ]);

        // Update the display
        document.getElementById('bloodTypeA').textContent = bloodTypeA;
        document.getElementById('bloodTypeB').textContent = bloodTypeB;
        document.getElementById('bloodTypeAB').textContent = bloodTypeAB;
        document.getElementById('bloodTypeO').textContent = bloodTypeO;

        // Set up event listeners for real-time updates
        if (window.ethereum) {
            // Remove existing listeners to prevent duplicates
            window.ethereum.removeAllListeners('accountsChanged');
            window.ethereum.removeAllListeners('chainChanged');

            // Listen for account changes
            window.ethereum.on('accountsChanged', async function (accounts) {
                if (accounts.length === 0) {
                    // MetaMask is locked or user has not connected any accounts
                    return;
                }
                await displayBloodStock();
            });

            // Listen for network changes
            window.ethereum.on('chainChanged', async function (chainId) {
                await displayBloodStock();
            });
        }

    } catch (error) {
        console.error('Error loading blood stock:', error);
        // Only show error if we're on the blood stock page
        if (document.getElementById('bloodTypeA')) {
            const errorMessage = error.message.includes('MetaMask is not installed') 
                ? 'Please install MetaMask to view blood stock information.'
                : 'Error loading blood stock information. Please make sure MetaMask is connected and you are on the correct network.';
            alert(errorMessage);
        }
    }
}

// Initialize and update blood stock
async function initializeBloodStock() {
    try {
        // Initial display
        await displayBloodStock();
        
        // Update every 10 seconds
        setInterval(displayBloodStock, 10000);
    } catch (error) {
        console.error('Error initializing blood stock:', error);
    }
}

// Update blood stock on page load
window.addEventListener('load', initializeBloodStock);

// Function to search for nearby donors
async function searchNearbyDonors() {
    try {
        // Get patient's current location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const patientLat = position.coords.latitude;
        const patientLng = position.coords.longitude;

        // Get all donors from localStorage
        const donors = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('donor_')) {
                const donor = JSON.parse(localStorage.getItem(key));
                donors.push(donor);
            }
        }

        // Calculate distances and sort donors
        const donorsWithDistance = donors.map(donor => {
            const distance = calculateDistance(
                patientLat,
                patientLng,
                donor.latitude,
                donor.longitude
            );
            return { ...donor, distance };
        });

        // Sort by distance
        donorsWithDistance.sort((a, b) => a.distance - b.distance);

        // Display results
        displayDonorResults(donorsWithDistance);
    } catch (error) {
        console.error('Error searching for donors:', error);
        alert('Error searching for donors: ' + error.message);
    }
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Function to display donor results
function displayDonorResults(donors) {
    const resultsDiv = document.getElementById('donorResults');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.style.height = '400px';
    mapContainer.style.marginBottom = '20px';
    resultsDiv.appendChild(mapContainer);

    // Initialize map
    const map = new google.maps.Map(mapContainer, {
        zoom: 12,
        center: { lat: donors[0]?.latitude || 0, lng: donors[0]?.longitude || 0 }
    });

    // Add markers for each donor
    donors.forEach(donor => {
        const marker = new google.maps.Marker({
            position: { lat: donor.latitude, lng: donor.longitude },
            map: map,
            title: `${donor.name} (${donor.bloodType})`
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${donor.name}</h3>
                    <p>Blood Type: ${donor.bloodType}</p>
                    <p>Distance: ${donor.distance.toFixed(2)} km</p>
                    <button onclick="requestBloodFromDonor('${donor.address}')">Request Blood</button>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });

    // Create list of donors
    const donorList = document.createElement('div');
    donorList.className = 'donor-list';
    donors.forEach(donor => {
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <h3>${donor.name}</h3>
            <p>Blood Type: ${donor.bloodType}</p>
            <p>Distance: ${donor.distance.toFixed(2)} km</p>
            <button onclick="requestBloodFromDonor('${donor.address}')">Request Blood</button>
        `;
        donorList.appendChild(donorCard);
    });
    resultsDiv.appendChild(donorList);
}

// Function to request blood from a specific donor
async function requestBloodFromDonor(donorAddress) {
    try {
        const bloodType = prompt('Enter blood type (A, B, AB, O):');
        const amount = parseInt(prompt('Enter the amount of blood requested:'));

        if (!bloodType || isNaN(amount)) {
            alert('Please enter valid blood type and amount');
            return;
        }

        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType.toUpperCase()];

        // Get patient address
        const accounts = await web3.eth.getAccounts();
        const patientAddress = accounts[0];

        // Call the smart contract function for blood request
        await bloodBankContract.methods.requestBlood(bloodTypeNumeric, amount)
            .send({ from: patientAddress });

        alert('Blood request sent successfully!');
    } catch (error) {
        console.error('Error requesting blood:', error);
        alert('Error requesting blood: ' + error.message);
    }
}

// Add this to your HTML file where you want to show the donor search interface
function addDonorSearchInterface() {
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div class="search-container">
            <h2>Find Nearby Donors</h2>
            <button onclick="searchNearbyDonors()" class="search-button">Search Nearby Donors</button>
            <div id="donorResults"></div>
        </div>
    `;
    document.body.appendChild(searchContainer);
}

// Add this to your HTML file's head section
function addGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBteTYgV4PeMFPBvB9NGs-1tyjw6L17dI8`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize the search interface when the page loads
window.addEventListener('load', () => {
    if (document.getElementById('donorSearch')) {
        addDonorSearchInterface();
        addGoogleMapsScript();
    }
});

// Function to get user's location
async function getLocation() {
    const locationStatus = document.getElementById('locationStatus');
    const mapDiv = document.getElementById('donorMap');
    
    if (!locationStatus || !mapDiv) {
        console.error('Location status or map elements not found');
        return false;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });

        const { latitude, longitude } = position.coords;
        donorLocation = { latitude, longitude };

        // Show success message
        locationStatus.className = 'location-status success';
        locationStatus.textContent = 'Location captured successfully!';

        // Show map
        mapDiv.style.display = 'block';
        const map = new google.maps.Map(mapDiv, {
            center: { lat: latitude, lng: longitude },
            zoom: 15
        });

        // Add marker
        new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: 'Your Location'
        });

        return true;
    } catch (error) {
        console.error('Error getting location:', error);
        locationStatus.className = 'location-status error';
        locationStatus.textContent = 'Error getting location. Please enable location services and try again.';
        return false;
    }
}

// Function to register a donor
async function registerDonor() {
    try {
        await ensureInitialized();
        
        const name = document.getElementById('donorName').value;
        const age = document.getElementById('donorAge').value;
        const bloodType = document.getElementById('donorBloodType').value;

        if (!name || !age || !bloodType) {
            alert('Please fill in all fields');
            return;
        }

        if (age < 18 || age > 65) {
            alert('Age must be between 18 and 65 years');
            return;
        }

        // Check if location was captured
        if (!donorLocation) {
            alert('Please capture your location first');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const donorAddress = accounts[0];

        // Map blood type string to numeric value
        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType];

        // Store donor location in localStorage
        const donorData = {
            address: donorAddress,
            latitude: donorLocation.latitude,
            longitude: donorLocation.longitude,
            name: name,
            bloodType: bloodType
        };
        localStorage.setItem(`donor_${donorAddress}`, JSON.stringify(donorData));

        // Register the donor on the blockchain
        await bloodBankContract.methods.registerAsDonor(name, bloodTypeNumeric)
            .send({ from: donorAddress });

        alert('Donor registration successful! Please wait for admin approval.');
        window.location.href = 'donor_login.html';
    } catch (error) {
        console.error('Error registering donor:', error);
        alert('Error registering donor: ' + error.message);
    }
}

// Add QR code library
function addQRCodeScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
    document.head.appendChild(script);
}

// Function to generate QR code for blood donation
async function generateBloodBagQR(donationData) {
    try {
        const qrData = {
            donationId: donationData.donationId,
            donorAddress: donationData.donorAddress,
            bloodType: donationData.bloodType,
            amount: donationData.amount,
            timestamp: donationData.timestamp,
            txHash: donationData.txHash
        };

        const qrString = JSON.stringify(qrData);
        const qrContainer = document.getElementById('qrCodeContainer');
        
        if (qrContainer) {
            // Clear previous QR code
            qrContainer.innerHTML = '';
            
            // Create canvas element
            const canvas = document.createElement('canvas');
            qrContainer.appendChild(canvas);
            
            // Generate QR code
            await QRCode.toCanvas(canvas, qrString, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
        }

        return qrString;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

// Function to display donation history from QR code
async function displayDonationHistory(qrData) {
    try {
        const historyContainer = document.getElementById('donationHistory');
        if (!historyContainer) return;

        const donationData = JSON.parse(qrData);
        
        // Get donor details from blockchain
        const donor = await bloodBankContract.methods.donors(donationData.donorAddress).call();
        
        // Create history display
        const historyHTML = `
            <div class="donation-history-card">
                <h3>Blood Bag Details</h3>
                <div class="history-details">
                    <p><strong>Donation ID:</strong> ${donationData.donationId}</p>
                    <p><strong>Donor Name:</strong> ${donor.name}</p>
                    <p><strong>Blood Type:</strong> ${donationData.bloodType}</p>
                    <p><strong>Amount:</strong> ${donationData.amount} units</p>
                    <p><strong>Date:</strong> ${new Date(donationData.timestamp).toLocaleString()}</p>
                    <p><strong>Transaction Hash:</strong> <a href="https://sepolia.etherscan.io/tx/${donationData.txHash}" target="_blank">${donationData.txHash}</a></p>
                </div>
            </div>
        `;

        historyContainer.innerHTML = historyHTML;
    } catch (error) {
        console.error('Error displaying donation history:', error);
        alert('Error loading donation history: ' + error.message);
    }
}

// Add QR code scanner functionality
function addQRScanner() {
    const scannerContainer = document.createElement('div');
    scannerContainer.innerHTML = `
        <div class="scanner-container">
            <h3>Scan Blood Bag QR Code</h3>
            <video id="qrScanner" style="width: 100%; max-width: 400px;"></video>
            <div id="donationHistory"></div>
        </div>
    `;
    document.body.appendChild(scannerContainer);

    // Initialize QR scanner
    const video = document.getElementById('qrScanner');
    const scanner = new QrScanner(video, result => {
        displayDonationHistory(result);
    });

    // Start scanner
    scanner.start();
}

// Initialize QR code functionality on page load
window.addEventListener('load', () => {
    addQRCodeScript();
    if (document.getElementById('qrScanner')) {
        addQRScanner();
    }
});
