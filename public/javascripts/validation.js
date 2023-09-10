
//=======================Sign up Validation===========================


var namevalid=false, emailvalid=false,phonevalid=false,passwordvalid=false,confirmPasswordvalid=false;


const handleNameChange=()=>{
  var name= document.getElementById("name").value;
  

 
  if (!name.match(/\b^[A-Za-z \.]+$\b/) )
  {
    document.getElementById("name-error").innerText = ("Enter a valid name");
    namevalid=false;
  }
  else
  document.getElementById("name-error").innerText= "";
  namevalid=true;

}


const handleEmailChange=()=>
{
var mailregex = /\b^[^ ][a-z.\-_0-9]+@[a-z0-9]+\.[a-z]{2,3}\b/;
if(!(document.getElementById("email").value).match(mailregex))
{
  document.getElementById("email-error").innerText= ("Enter a valid email id");
 emailvalid =false;
}
else
{
  document.getElementById("email-error").innerText= "";

emailvalid=true;
}
}



const handlePhoneChange=()=>
{
  if (!(document.getElementById("mobile").value).match(/\b\d{10}\b/))
  {
    document.getElementById("mobile-error").innerText= "Enter a valid phone number";
    phonevalid=false;

  } 
  else{
    document.getElementById("mobile-error").innerText= "";
    phonevalid=true;

  }
}


function handlePassword() {
  let password = document.getElementById("password").value;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!password) {
    passwordvalid = false
      document.getElementById("password-error").innerText = "Password is required"
  }
  else if (!password.match(passwordRegex)) {
    passwordvalid = false
      document.getElementById("password-error").innerText = "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit. No special characters allowed."
  } else {
    passwordvalid = true
      document.getElementById("password-error").innerText = ""
      updateSubmitButton();
  }
}

function handleConfirmPassword() {
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;


  if (!confirmPassword) {
    confirmPasswordvalid = false;
      document.getElementById("confirmPassword-error").innerText = "Re enter password";
  }
  else if (password !== confirmPassword) {
    confirmPasswordvalid = false;
      document.getElementById("confirmPassword-error").innerText = "Passwords do not match";
  }

  else {
    confirmPasswordvalid = true;
      document.getElementById("confirmPassword-error").innerText = "";
      updateSubmitButton();
  }
}


function updateSubmitButton() {

  const submitButton = document.getElementById('signUpButton');

  if (namevalid && emailvalid && phonevalid && passwordvalid && confirmPasswordvalid) {
    // console.log("Success");
      submitButton.disabled=false;
  } else {
    submitButton.disabled=true;
  }
}
