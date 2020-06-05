app.factory('indexFactory', [() => {
    const connectSocket = (url, options) => {
        return new Promise((resolve, reject) => {
            const socket = io.connect(url);
            socket.on('connect', () => {
                resolve(socket)
            });

            socket.on('connect_error', () => {
                reject(new Error('connect_error'));
            });
        });
    };

    return {
        connectSocket
    }
}]);