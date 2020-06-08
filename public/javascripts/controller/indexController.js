app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [];
    $scope.players = {};
    $scope.playerList2 = [];
    $scope.username = "";


    $scope.init = () => {
        const btn = document.getElementById("login-button");
        const input = document.getElementById("username-input");
        const desc = document.getElementById("desc-message");
        let username = "";

        btn.addEventListener("click", function(){
            username = input.value.toString();
            $scope.username = username;

            if(username != "") {
                initSocket(username);
                btn.style.display = "none";
                input.style.display = "none";
                desc.innerText = "Sohbete " + username +" adı ile bağlandınız. Konuşmaya başlayabilirsiniz!";
                setTimeout(function(){ desc.style.display = "none" }, 1500);
            }
            else {
                desc.innerText = "Kullanıcı adı alanı boş bırakılamaz!";
                input.style.background = "rgba(255, 51, 51, 0.59)";
                setTimeout(function(){ desc.style.display = "none";input.style.background = "#fff"; }, 1500);
                return false;
            }

        });


    };

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById("chat-area");
            const scrollHeights = document.getElementById("chat-area").scrollHeight;
            element.scrollTop = scrollHeights;

        });
    }

    function initSocket(username) {
        indexFactory.connectSocket('http://localhost:3000', {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        }).then((socket) => {

            socket.emit('newUser', { username })

            socket.on('initPlayers', (players) => {
               $scope.players = players;
               $scope.$apply();
            });

            socket.on('initPlayerList', (playerList) => {
                $scope.playerList2 = playerList;
                $scope.$apply();
            });

            socket.on('playerList', (playerList) => {
                $scope.playerList2 = playerList;
                $scope.$apply();
            });

            socket.on('newUser', (data) => {
                console.log(data.username);
                const messageData = {
                    type: {
                        code: 0, // SERVER or USER MESSAGE
                        message: 1 // LOGIN or DIS Message
                    }, // info by SERVER
                    username: data.username
                };

                $scope.messages.push(messageData)
                $scope.$apply()
            });

            socket.on("newMessage", data => {
                $scope.messages.push(data);
                $scope.$apply()
                scrollTop();
            });

            $scope.newMessage = () => {
                let message = $scope.message;

                const messageData = {
                    type: {
                        code: 1, // SERVER or USER MESSAGE
                    },
                    username: username,
                    text: message,
                    id: socket.id
                };

                $scope.messages.push(messageData);
                $scope.message = "";
                socket.emit("newMessage", messageData);
                scrollTop();
            };

            socket.on("disUser", (data) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },
                    username: data.username
                };
                $scope.messages.push(messageData)
                $scope.$apply()
            });

        }).catch((err) => {
            console.log(err)
        })
    }

}]);