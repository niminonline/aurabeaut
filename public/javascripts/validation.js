
//=======================Sign up Validation===========================


var namevalid=false, emailvalid=false,phonevalid=false,subjectvalid=false,messagevalid=false;


const handleNameChange=()=>{
  var name= document.getElementById("name").value;
  console.log(name);

 
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
  if (!(document.getElementById("phone").value).match(/\b\d{10}\b/))
  {
    document.getElementById("phone-error").innerText= "Enter a valid phone number";
    phonevalid=false;

  } 
  else{
    document.getElementById("phone-error").innerText= "";
    phonevalid=true;

  }
}


function validatePassword() {
  let password = document.getElementById("password").value;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!password) {
      userpassword = false
      document.getElementById("passwordError").innerText = "Password is required"
  }
  else if (!password.match(passwordRegex)) {
      userpassword = false
      document.getElementById("passwordError").innerText = "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit"
  } else {
      userpassword = true
      document.getElementById("passwordError").innerText = ""
      updateSubmitButton();
  }
}

function validateConfirmPassword() {
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm_password").value;


  if (!confirmPassword) {
      userconfirmpassword = false;
      document.getElementById("confirm_passwordError").innerText = "Re enter password";
  }
  else if (password !== confirmPassword) {
      userconfirmpassword = false;
      document.getElementById("confirm_passwordError").innerText = "Passwords do not match";
  }

  else {
      userconfirmpassword = true;
      document.getElementById("confirm_passwordError").innerText = "";
      updateSubmitButton();
  }
}
