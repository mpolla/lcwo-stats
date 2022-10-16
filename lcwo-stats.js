let heatMapData = {};  
var cal = new CalHeatMap();

function saveCredentials() {
    if (document.getElementById("save-password").checked === true) {
        console.log("Saving login/password to localstorage");
        let foruse = document.getElementById("lcwo-username").value;
        let forpas = document.getElementById("lcwo-password").value;
        if (foruse !== null) {
            localStorage.setItem("lcwou", foruse);
        }
        if (forpas !== null) {
            localStorage.setItem("lcwop", forpas);
        }
    }
}


function getLogin() {

    let formData = new FormData();
    let foruse = document.getElementById("lcwo-username").value;
    let formPassword = document.getElementById("lcwo-password").value;
    let storageUsername = localStorage.getItem("lcwou");
    let storagePassword = localStorage.getItem("lcwop");

    if (storageUsername === null || storagePassword === null) {
        console.log("No credentials found in local storage, using login form data.");
        renderLogin();
        formData.append('username', foruse);
        formData.append('password', formPassword);
    } else {
        console.log("Using localstore credentials to login.");
        formData.append('username', storageUsername);
        formData.append('password', storagePassword);
    }
    return formData;
}
    


async function doLcwoLogin() {
    await fetch('https://lcwo.net/dologin', {
        method: "POST",
        credentials: 'include',
        body: getLogin()
    })
}

async function renderLogin() {
    document.getElementById("loginform").style.display = "block";
}

async function hideLogin() {
    document.getElementById("loginform").style.display = "none";
}

async function renderLcwoStats() {

    // Try to fetch data with existing cookie
    const apiResponse = await fetch('https://lcwo.net/api/index.php?action=export_results&type=koch&fmt=json', {
        method: "GET",
        credentials: 'include'
    })
    let data = await apiResponse.json();

    // If the cookie has expired, re-login and try again
    if (data.msg == "you must log in to use this function") {

        console.log("Cookie has expired. Trying to re-login..");
        doLcwoLogin()

        const apiResponse = await fetch('https://lcwo.net/api/index.php?action=export_results&type=koch&fmt=json', {
            method: "GET",
            credentials: 'include'
        })
        let data2 = await apiResponse.json();
        // If no successa after re-login, show login form
        if (data2.msg == "you must log in to use this function") {
            console.log("Re-login failed. Let's show the login form.");
            renderLogin();
            return;
        } else {
            console.log("Re-login worked!");
            data = data2;
        }
    }
    
    for (var i = 0; i < data.length; i++) {
        let epoch = new Date(data[i].time).getTime()/1000;
        heatMapData[epoch] = 1;
    }
    
    cal.init({
        start: new Date((new Date()).getFullYear()-1, (new Date()).getMonth()+1, 1) ,
        range: 12,
        domain: "month",
        subDomain: "day",      
        data: heatMapData
    });

    hideLogin();
}

