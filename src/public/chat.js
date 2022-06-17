
$(function () {
    const socket = io();

    $.ajax({
        url: "/online",
        method: "GET",
        success: (res) => {
            const userName = res.userName
            const listaChatUsuarios = res.listaChatUsuarios

            let estados = document.querySelectorAll(".estado-user")

            estados.forEach(estado => {
                listaChatUsuarios.forEach(element => {
                    if (element.receptor._id == estado.dataset.id) {
                        if (element.receptor.estado) {
                            estado.classList.remove("offline")
                            estado.classList.add("online") // ONLINE
    
                        } else {
                            estado.classList.remove("online")
                            estado.classList.add("offline"); // OFFLINE
                        }
                    }
                });
                
            })

            socket.emit("new user", { userName, listaChatUsuarios })
        },
        error: () => {
            alert("error")
        }
    })

    socket.on("estado", data => {

        const estadoUsuario = data.estado
        const id = data.id

        let estados = document.querySelectorAll(".estado-user")

        estados.forEach(estado => {
            if (id == estado.dataset.id) {
                if (estadoUsuario) {
                    estado.classList.remove("offline")
                    estado.classList.add("online") // ONLINE

                } else {
                    estado.classList.remove("online")
                    estado.classList.add("offline"); // OFFLINE
                }
            }
        })

        console.log(data.message)
    })


    $("#btn-chat-send-message").on("click", () => {

        const receptor = $("#chatReceptor").val()
        const message = $("#input-chat-text-message").val()
        const time = new Date().toLocaleString()

        $.ajax({
            url: "/getMyUserName",
            method: "GET",
            success: (res) => {
                const userName = res.userName

                $(".content-chat").append(`<div class="message-emisor-chat"><p>${message}</p></div><i class="chat-time-emisor">${time}</i>`)

                socket.emit("send message", { emisor: userName, receptor, message, time })
                $("#input-chat-text-message").val("")
            },
            error: () => {
                alert("error")
            }
        })
    })

    socket.on("priv", data => {
        const receptor = $("#chatReceptor").val()

        console.log("receptor: "+ receptor )
        console.log("data.receptor: "+ data.emisor )

        if (receptor == data.emisor) {
            console.log("entroooooo")
            $(".content-chat").append(`<div class="message-receptor-chat"><p>${data.message}</p></div><i class="chat-time-receptor">${data.time}</i>`)
        }
        console.log(`${data.emisor}: ${data.message}`);
    })

})
