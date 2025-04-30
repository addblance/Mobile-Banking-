function register() {
  alert("Register function called");

  const name = document.getElementById("regName").value;
  const mobile = document.getElementById("regMobile").value;
  const email = document.getElementById("regEmail").value;
  const nid = document.getElementById("regNID").value;
  const dob = document.getElementById("regDOB").value;
  const password = document.getElementById("regPassword").value;
  const pin = document.getElementById("regPIN").value;
  const division = document.getElementById("regDivision").value;

  if (!name || !mobile || !email || !password || !pin) {
    alert("Please fill in all required fields");
    return;
  }

  alert("Trying to create Firebase user...");
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Firebase user created, now writing to Realtime Database...");
      const uid = userCredential.user.uid;
      return db.ref("users/" + uid).set({
        name, mobile, email, nid, dob, pin, division
      });
    })
    .then(() => {
      alert("Registration successful, redirecting to login...");
      window.location.href = "login.html";
    })
    .catch(error => {
      alert("Registration failed: " + error.message);
    });
}

function login() {
  alert("Login function called");

  const mobile = document.getElementById("loginMobile").value;
  const password = document.getElementById("loginPassword").value;

  alert("Checking mobile in database...");
  db.ref("users").orderByChild("mobile").equalTo(mobile).once("value", snapshot => {
    if (snapshot.exists()) {
      let email = null;
      snapshot.forEach(child => {
        email = child.val().email;
      });

      if (email) {
        alert("Email found: " + email + ". Logging in...");
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(() => {
            alert("Login successful! Redirecting...");
            window.location.href = "index.html";
          })
          .catch(err => alert("Login failed: " + err.message));
      } else {
        alert("Email not found for mobile number.");
      }
    } else {
      alert("Mobile number not found!");
    }
  });
}