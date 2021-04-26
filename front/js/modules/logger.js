let logger = (function(){

    function postLog(username, gameId) {
        console.log(username + ' se connect à ' + gameId);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username
            },
            success: () => {
                window.location.href = "/";
            },
        });
    }

    return {
        connexion(username, gameId) {
            postLog(username, gameId);
        }
    }
})();