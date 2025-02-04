const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		message: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		token: null,
		registrationSuccess: false,
		registrationExists: false,
		registrationEmpty: false,
		registrationInProgress: false,
		registrationDoesntExist: false,
		registrationWrong: false,
	  },
	  actions: {
		setRegistrationEmpty: (value) => {
		  setStore({ registrationEmpty: value });
		},
		setRegistrationSuccess: (value) => {
		  setStore({ registrationSuccess: value });
		},
		setRegistrationExists: (value) => {
		  setStore({ registrationExists: value });
		},
		setRegistrationInProgress: (value) => {
		  setStore({ registrationInProgress: value });
		},
		setRegistrationDoesntExist: (value) => {
		  setStore({ registrationInProgress: value });
		},
		setRegistrationWrong: (value) => {
		  setStore({ registrationWrong: value });
		},
  

  
		register: async (email, password) => {
		  const store = getStore();
  
		  if (!email || !password) {
			setStore({ registrationEmpty: true });
			throw new Error("Email and password are required");
		  }
		  const requestOptions = {
			method: "Post",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  email: email,
			  password: password,
			  is_active: true,
			}),
		  };
  
		  try {
			const resp = await fetch(
			  process.env.BACKEND_URL + "/api/user",
			  requestOptions
			);
  
			if (resp.status !== 200) {
			  alert("Email or password are wrong");
			  return false;
			} else {
			  setStore({ registrationSuccess: true });
			}
  
			const data = await resp.json();
			console.log("this came from the backend", data);
  
		
			return true;
		  } catch (error) {
			console.log("there has been an error signing up");
			setStore({ registrationExists: true });
		  }
		},
  
	
  
		login: async (email, password) => {
		  const store = getStore();
  
		  if (!email || !password) {
			setStore({ registrationEmpty: true });
			throw new Error("Email and password are required");
		  }
  
		  const requestOptions = {
			method: "Post",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  email: email,
			  password: password,
			}),
		  };
  
		  try {
			const resp = await fetch(
			  process.env.BACKEND_URL + "/api/token",
			  requestOptions
			);
  
			if (resp.status !== 200) {
			  setStore({ registrationWrong: true });
			  return false;
			}
  
			const data = await resp.json();
  
			console.log(
			  "this is what I get from the token endpoint, with the fetch in flux of function login",
			  data
			);
			if (data.access_token != undefined) {
			  sessionStorage.setItem("token", data.access_token); 
			  setStore({ token: data.access_token });
			  setStore({ registrationSuccess: true });
			  return true;
			}
  
			console.log("token undefined");
		  } catch (error) {
			console.log("there has been an error logging in", error);
			setStore({ registrationDoesntExist: true });
		  }
		},
  

  
		syncTokenFromSessionStore: () => {

		  const token = sessionStorage.getItem("token");
		  console.log(
			"Application just loaded, synching the session storage token"
		  );
		  if (token && token != "" && token != undefined)
			setStore({ token: token });
		},
  
	
		logout: () => {
		  sessionStorage.removeItem("token");
		  console.log("login out");
		  setStore({ token: null });
		  setStore({ message: null });
		  // location.reload();
		},
  
		
		getMessage: () => {
		  const store = getStore();
  
		  const requestOptions = {
			headers: {
			  Authorization: "Bearer" + store.token,
			},
		  };
  
		  fetch(process.env.BACKEND_URL + "/api/hello", requestOptions)
			.then((resp) => resp.json())
			.then((data) => setStore({ message: data.message }))
			.catch((error) =>
			  console.log("Error loading message from backend", error)
			);
		},
	  },
	};
  };
  
  export default getState;
  