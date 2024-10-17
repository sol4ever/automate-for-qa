const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const loginInputs = {
    validUsername: generateRandomString(10),
    validPassword: generateRandomString(10), 

    username11Char: generateRandomString(11), 
    username20Char: generateRandomString(20), 
    
    password11Char: generateRandomString(11), 
    password20Char: generateRandomString(20), 

    usernameEmpty: '',   
    username1Char: generateRandomString(1),   
    username9Char: generateRandomString(9),  
    username21Char: generateRandomString(21), 

    passwordEmpty: '', 
    password1Char: generateRandomString(1),   
    password9Char: generateRandomString(9),   
    password21Char: generateRandomString(21),
};
