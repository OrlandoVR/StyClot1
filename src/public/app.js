var recoveryEmailGlobal = null

$(function(){
    $("#logout").on("click", () => {
        window.location = "/logout"
    });

    $("#openModalWriteEmail").click(function(e){
        if($("#textCampoVacioEmail")){
            $("#textCampoVacioEmail").remove()
        }
        
        $("#modal-write-email").modal("show");
    });

    $("#btnSendRecoveryCode").on("click", (e) => {
        const recoveryEmail = $.trim($("#recoveryEmail").val());
    
        recoveryEmailGlobal = null

        if($("#textCampoVacioEmail")){
            $("#textCampoVacioEmail").remove()
        }

        if(recoveryEmail=="" || recoveryEmail == null){
            e.preventDefault()

            $("#divRecoveryEmail").append('<p class="text-warning" id="textCampoVacioEmail">No puede estar el campo vacio</p>');

        }else{
            recoveryEmailGlobal = recoveryEmail

            $.ajax({
                url: "/verificarEmail",
                method: "POST",
                data: {recoveryEmail: recoveryEmailGlobal},
                success: (res) =>{
                    const rst = res.rst
                    if(rst){
                        $("#modal-write-email").modal("hide");
                        $("#modal-write-password").modal("show");
                    }else{
                        $("#divRecoveryEmail").append('<p class="text-warning" id="textCampoVacioEmail">No existe ese correo</p>');
                    } 
                },
                error: () => {
                    alert("error")
                }   
    
            })
        }
    });

    $("#btnRecoveryUpdatePassword").on("click", () => {
        if($("#divErrorsCheckSamePass")){
            $("#divErrorsCheckSamePass").remove()
        }

        const password = $.trim($("#recoveryPassword").val())
        const repeatPassword = $.trim($("#recoveryRepeatPassword").val())

        var errors = []
        
        if(password == "" || password == null || repeatPassword == "" || repeatPassword == null) errors.push("Los campos no deben estar vacios");
        
        if(password != repeatPassword){
            errors.push("Las contraseñas deben ser iguales");  
        }else{
            if(password.length < 6) errors.push("Contraseña minimo 6 caracteres");
        }
        
        if(errors.length > 0){
            $("#divRecoveryRepeatPassword").append('<div id="divErrorsCheckSamePass"></div>')
            errors.forEach(element => {
                $("#divErrorsCheckSamePass").append(`<p class="text-warning">${element}</p>`)
            });
        }else{
            $.ajax({
                url: "/checkSamePassword",
                method: "POST",
                data: {email: recoveryEmailGlobal, password, repeatPassword},
                success: (res) =>{
                    const rst = res.rst
                    if(rst){
                        $("#modal-write-password").modal("hide");
                        window.location = "/"
                    }
                },
                error: () => {
                    alert("error")
                }   
    
            })
        }
    });

    // Route publications

    $("#iconHome").on("click", () =>{
        window.location = "/publications";
    })

    $("#iconAddPost").on("click", () =>{
        window.location = "/newPublications";
    })

    //Subir imagen a un contenedor

    $("#custom-btn").on("click", () => {
        $("#default-btn").click();
    })
});