
$(function(){
    const socket = io();

    $.ajax({
        url: "/getMyUserName",
        method: "GET",
        success: (res) =>{
            const userName= res.userName
            socket.emit("new user", userName)
        },
        error: () => {
            alert("error")
        }   
    })


    $("#btn-chat-send-message").on("click", () =>{

        const receptor = $("#chatReceptor").val()
        const message = $("#input-chat-text-message").val()

        socket.emit("send message", {receptor, message} )
        $("#input-chat-text-message").val("")
    })

    socket.on("priv", data =>{
        console.log(data);
    })

})
