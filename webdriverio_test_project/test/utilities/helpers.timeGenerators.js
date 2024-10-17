export const currentDateAndTime = () => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate() + 1).padStart(2, '0');
    let hh = String(today.getHours());
    let MM = String(today.getMinutes());
    let ss = String(today.getSeconds());
    let ms = String(today.getMilliseconds());
    return today = yyyy + mm + dd + hh + MM + ss + ms;
}

export const currentDateAndTimeMinutes = () => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate() + 1).padStart(2, '0');
    let hh = String(today.getHours() < 10 ? '0' : '') + today.getHours();
    let MM = String(today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    return today = yyyy + mm + dd + hh + MM;
}


export const currentDate = () => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

export const currentTime = () => {
    let today = new Date();
    let hh = String(today.getHours()).padStart(2, '0');
    let MM = String(today.getMinutes()).padStart(2, '0');
    let ss = String(today.getSeconds()).padStart(2, '0');
    let ms = String(today.getMilliseconds()).padStart(3, '0');
    return `${hh}${MM}${ss}${ms}`;
}

export const getDayBeforeDate = () => {
    const today = new Date();
    const dayBefore = new Date(today.setDate(today.getDate() - 1));
    
    const month = (dayBefore.getMonth() + 1).toString().padStart(2, '0'); 
    const day = dayBefore.getDate().toString().padStart(2, '0'); 
    const year = dayBefore.getFullYear(); 

    return `${month}${day}${year}`;
};