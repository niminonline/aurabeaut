
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


const handlePassword= (val)=>{
    
    if(val.name=="password"){
    const password= val.value;
    
    }
    else if(val.name=="confirmPassword")
    {
        const confirmPassword= val.value;
       
    }
    if((password.length <8)||(confirmPassword.length<7)){
        document.getElementById("confirmPassword-error").innerText= "Password must be atleast 8 characters";
    }
    
    else if(password!=confirmPassword){
        
        
        document.getElementById("confirmPassword-error").innerText= "Passwords mismatch";

    }
    else{
        document.getElementById("confirmPassword-error").innerText= "";
    }
}

