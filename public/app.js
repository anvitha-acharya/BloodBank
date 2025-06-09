let web3;
let bloodBankContract;
let isInitialized = false;

// Initialize Web3 and contract
async function initWeb3() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Initialize contract
            const contractAddress = '0x3a9227BeFBe723f78Ea463AF0D993B34B603494F';
            bloodBankContract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Verify contract is initialized
            try {
                await bloodBankContract.methods.getBloodInventory(0).call();
                console.log('Contract initialized successfully');
                isInitialized = true;
                return true;
            } catch (error) {
                console.error('Contract initialization failed:', error);
                alert('Contract not found at the specified address. Please make sure the contract is deployed correctly.');
                return false;
            }
        } else {
            alert("Please install MetaMask to use this application.");
            return false;
        }
    } catch (error) {
        console.error('Error initializing Web3:', error);
        alert('Error connecting to MetaMask. Please make sure MetaMask is installed and connected to the correct network.');
        return false;
    }
}

// Initialize on page load
window.addEventListener('load', async () => {
    await initWeb3();
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

// Contract Address and ABI (replace with your actual deployed contract address and ABI)
const contractAddress = '0x3a9227BeFBe723f78Ea463AF0D993B34B603494F';
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

        const accounts = await web3.eth.getAccounts();
        const donorAddress = accounts[0];

        // Map blood type string to numeric value
        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType];

        // Register the donor
        await bloodBankContract.methods.registerAsDonor(name, bloodTypeNumeric)
            .send({ from: donorAddress });

        alert('Donor registration successful! Please wait for admin approval.');
        window.location.href = 'donor_login.html';
    } catch (error) {
        console.error('Error registering donor:', error);
        alert('Error registering donor: ' + error.message);
    }
}

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

        // Use the correct Ganache address
        const patientAddress = '0x21f49D3476000345c34E214741cADee8317ead94';

        // Map blood type string to numeric value
        const bloodTypeMap = { 'A': 0, 'B': 1, 'AB': 2, 'O': 3 };
        const bloodTypeNumeric = bloodTypeMap[bloodType];

        // Register the patient
        await bloodBankContract.methods.registerAsPatient(name, bloodTypeNumeric)
            .send({ from: patientAddress });

        // Store the patient address
        localStorage.setItem('patientAddress', patientAddress);
        localStorage.setItem('userAddress', patientAddress);
        localStorage.setItem('userType', 'patient');

        alert('Patient registration successful! Please wait for admin approval.');
        window.location.href = 'patient_dashboard.html';
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


async function donateBlood() {
    try {
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

        // Call the smart contract function for blood donation
        await bloodBankContract.methods.donateBlood(bloodType, amount).send({ from: donorAddress });

        // Store the donation details
        const donationKey = `donation_${new Date().getTime()}`;
        const donationData = { donorAddress, bloodType: bloodTypeStr, amount };
        localStorage.setItem(donationKey, JSON.stringify(donationData));
        
        // Clear and refresh the display
        const donationDetailsList = document.getElementById('donationDetailsList');
        if (donationDetailsList) {
            donationDetailsList.innerHTML = '';
        }
        displayStoredDonationDetails();
        
        alert('Blood Donation Successful');
    } catch (error) {
        console.error('Error during blood donation:', error.message);
        alert('Error during blood donation: ' + error.message);
    }
}

// Function to display stored donation details
async function displayStoredDonationDetails() {
    try {
        const donationDetailsList = document.getElementById('donationDetailsList');
        const totalDonatedElement = document.getElementById('totalDonated');
        const lastDonationElement = document.getElementById('lastDonation');
        const bloodTypeElement = document.getElementById('bloodType');
        
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
                        timestamp: parseInt(key.split('_')[1])
                    });
                }
            }

            // Sort donations by timestamp (newest first)
            donations.sort((a, b) => b.timestamp - a.timestamp);

            // Display donations and update statistics
            donations.forEach(donation => {
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
            });
            
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