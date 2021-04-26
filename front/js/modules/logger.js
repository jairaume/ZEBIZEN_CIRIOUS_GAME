let logger = (function(){

    function postLog(username, gameId) {
        console.log(username + ' se connect à ' + gameId);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                username: username,
                currentGameId: gameId
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