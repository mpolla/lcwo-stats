let heatMapData = {};  
var cal = new CalHeatMap();

function getLogin() {
    let formData = new FormData();
    formData.append('username', document.getElementById("lcwo-username").value);
    formData.append('password', document.getElementById("lcwo-password").value);
    return formData;
}
    

async function doLcwoLogin() {
    await fetch('https://lcwo.net/dologin', {
        method: "POST",
        credentials: 'include',
        body: getLogin()
    })
}


async function initLcwoStats() {
    
    const apiResponse = await fetch('https://lcwo.net/api/index.php?action=export_results&type=koch&fmt=json', {
        method: "GET",
        credentials: 'include'
    })
    let data = await apiResponse.json();


    if (data.msg == "you must log in to use this function") {
        document.getElementById("loginform").style.display = "block";
        return;

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

    document.getElementById("loginform").style.display = "none";    
}

