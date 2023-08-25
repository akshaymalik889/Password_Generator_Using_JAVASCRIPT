// fetching data

// slider
const inputSlider = document.querySelector("[data-lengthSlider]");

// length display
const lengthDisplay = document.querySelector("[data-lengthNumber]");

// password display
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

// copy button
const copyBtn = document.querySelector("[data-copy]");

// copymsg button
const copyMsg = document.querySelector("[data-copyMsg]");

// checkbox uppercase
const uppercaseCheck = document.querySelector("#uppercase");

// checkbox uppercase
const lowercaseCheck = document.querySelector("#lowercase");

// checkbox numbers
const numbersCheck = document.querySelector("#numbers");

// checkbox Symbols
const symbolsCheck = document.querySelector("#symbols");

// indicator
const indicator = document.querySelector("[data-indicator]");

// generate Button
const generateBtn  = document.querySelector(".generateButton");

// all checkbox list in array
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

// symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// default case
let password = "";
let passwordLength = 10;
let checkCount = 0;

// set initial values on UI
handleSlider();

// strength color circle to grey
setIndicator("#ccc");



// set password length on UI
function handleSlider()
{
    //in starting
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
} 

//indicator color
function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// finds random no. in given range
function getRndInteger(min,max)
{
    //math.random() -> 0 to 1 ,
    return Math.floor(Math.random() * (max-min)) + min;
}

// for number
function generateRandomNumber()
{
    return getRndInteger(0,9);
}

// for lowercase letters
function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

// for uppercase letters
function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

// for Special symbols
function generateSymbol()
{
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum); 
}

// strength calculate
function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    
    if(uppercaseCheck.checked)
    hasUpper = true;

    if(lowercaseCheck.checked)
    hasLower = true;

    if(numbersCheck.checked)
    hasNum = true;

    if(symbolsCheck.checked)
    hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8 )
    setIndicator("#0f0");

    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6 )
    setIndicator("#ff0");

    else
    setIndicator("#f00");  
}

// copy clipboard
async function copyContent()
{
    try {
        // method to copy on clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed"
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    // to set timeout for hide text
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange()
{
    checkCount = 0;

    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    } )

    // special condition (if password length < checkbox  count)
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

}

// for shuffle password -> bcoz we can easily see first upper then lower so we
//shuffle our password
function shufflePassword(array)
{
    // fisher yates method
    for(let i = array.length-1; i>0 ; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach( (el) => (str += el));
    return str;
}



// Event Listners



    //on slider
    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;

        // set password length on UI
        handleSlider();
    })

    // on copy clipboard
    copyBtn.addEventListener('click',()=>{
        if(passwordDisplay.value)
        copyContent();
    })

    // ON checkbox 
    //count checkbox checked for use in generate password listner
    allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
    })

    // on generate Password
    generateBtn.addEventListener('click', () => {

        //no checkbox selected
        if(checkCount <= 0)
        return;

        // special case
        if(passwordLength < checkCount)
        {
            passwordLength = checkCount;
            handleSlider();
        }

        // generate new password

        //step -1 remove old password
        password = "";

        //step-2 first put required checkbox content

        // method-1

        // if(uppercaseCheck.checked)
        // password += generateUpperCase();

        // if(lowercaseCheck.checked)
        // password += generateLowerCase();

        // if(numbersCheck.checked)
        // password += generateRandomNumber();

        // if(symbolsCheck.checked)
        // password += generateSymbol();

        // method-2
        let funcArr = [];

        //push all function in array
        if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

        if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

        if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

        if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        //first put required checkbox content
        for(let i=0; i<funcArr.length;i++)
        {
            password += funcArr[i]();
        }

        //remaining password addition
        for(let i=0; i<passwordLength-funcArr.length; i++)
        {
            //rest password can be uppercase,lowercase,number,symbol
            let randIndex = getRndInteger(0,funcArr.length);
            password += funcArr[randIndex]();
        }

        // shuffle the password for more security reason ,send in array form
        password = shufflePassword(Array.from(password));

        // now show password in UI
        passwordDisplay.value = password;

        // now find strength of password
        calcStrength();
         
    })