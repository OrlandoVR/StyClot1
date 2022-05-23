var recoveryEmailGlobal = null

$(function () {

    // Log out

    $("#logout").on("click", () => {
        window.location = "/logout"
    });

    $("#openModalWriteEmail").click(function (e) {
        if ($("#textCampoVacioEmail")) {
            $("#textCampoVacioEmail").remove()
        }

        $("#modal-write-email").modal("show");
    });

    $("#btnSendRecoveryCode").on("click", (e) => {
        const recoveryEmail = $.trim($("#recoveryEmail").val());

        recoveryEmailGlobal = null

        if ($("#textCampoVacioEmail")) {
            $("#textCampoVacioEmail").remove()
        }

        if (recoveryEmail == "" || recoveryEmail == null) {
            e.preventDefault()

            $("#divRecoveryEmail").append('<p class="text-warning" id="textCampoVacioEmail">No puede estar el campo vacio</p>');

        } else {
            recoveryEmailGlobal = recoveryEmail

            $.ajax({
                url: "/verificarEmail",
                method: "POST",
                data: { recoveryEmail: recoveryEmailGlobal },
                success: (res) => {
                    const rst = res.rst
                    if (rst) {
                        $("#modal-write-email").modal("hide");
                        $("#modal-write-password").modal("show");
                    } else {
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
        if ($("#divErrorsCheckSamePass")) {
            $("#divErrorsCheckSamePass").remove()
        }

        const password = $.trim($("#recoveryPassword").val())
        const repeatPassword = $.trim($("#recoveryRepeatPassword").val())

        var errors = []

        if (password == "" || password == null || repeatPassword == "" || repeatPassword == null) errors.push("Los campos no deben estar vacios");

        if (password != repeatPassword) {
            errors.push("Las contraseñas deben ser iguales");
        } else {
            if (password.length < 6) errors.push("Contraseña minimo 6 caracteres");
        }

        if (errors.length > 0) {
            $("#divRecoveryRepeatPassword").append('<div id="divErrorsCheckSamePass"></div>')
            errors.forEach(element => {
                $("#divErrorsCheckSamePass").append(`<p class="text-warning">${element}</p>`)
            });
        } else {
            $.ajax({
                url: "/checkSamePassword",
                method: "POST",
                data: { email: recoveryEmailGlobal, password, repeatPassword },
                success: (res) => {
                    const rst = res.rst
                    if (rst) {
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

    $("#iconHome").on("click", () => {
        window.location = "/publications";
    })

    $("#iconAddPost").on("click", () => {
        window.location = "/newPublications";
    })

    $("#iconChat").on("click", () => {

        $.ajax({
            url: "/getIdUser",
            method: "POST",
            success: (res) => {
                const rst = res.rst
                if (rst) {
                    window.location = `/chat/${rst}`;
                }
            },
            error: () => {
                alert("error")
            }
        })
    })

    $("#myProfile").on("click", () => {
        window.location = "/profile";
    })

    //Subir imagen a un contenedor

    $("#custom-btn").on("click", () => {
        $("#default-btn").click();
    })

    $("#default-btn").on("change", (e) => {

        const file = e.target.files[0]

        if (file) {
            let reader = new FileReader();

            reader.onload = () => {
                const result = reader.result;
                $("#imageAddPost").attr("src", result)
            }
            reader.readAsDataURL(file)
            $(".content").hide()
        }
    })

    // Boton añadir tag

    $("#icon-tag").on("click", () => {
        $("#modal-tag").modal("show")
    })

    $("#close-modal-tag").on("click", () => {
        $("#modal-tag").modal("hide")
    })

    $("#close-btnSuperior-modal-tag").on("click", () => {
        $("#modal-tag").modal("hide")
    })

    $("#add-modal-tag").on("click", () => {
        const store = $("#store-modal-tag").val()
        const price = $("#price-modal-tag").val()
    })


    // Boton Seguir

    $("#btn-seguir").change(e => {
        const hiddenUserName = $("#hiddenUserName").val()

        if ($("#btn-seguir").is(":checked")) {
            $.ajax({
                url: "/seguir",
                method: "POST",
                data: { otherUserName: hiddenUserName },
                success: (res) => {
                    console.log(res)
                    const rst = res.rst
                    if (rst) {
                        $("#label-btn-seguir").text("Siguiendo")
                        $("#btn-seguir").prop("checked", true)
                    }
                },
                error: () => {
                    alert("error")
                }
            })

        } else {
            $.ajax({
                url: "/dejarSeguir",
                method: "POST",
                data: { otherUserName: hiddenUserName },
                success: (res, e) => {
                    const rst = res.rst
                    if (rst) {
                        $("#label-btn-seguir").text("Seguir")
                        $("#btn-seguir").prop("checked", false)
                    }
                },
                error: () => {
                    alert("error")
                }
            })
        }
    })

    //Like

    const likes = document.querySelectorAll(".icon-like")
    likes.forEach(like => {
        like.addEventListener("click", (event) => {
            if (event.target.classList.contains("likePress")) {

                const numLikes = document.querySelectorAll(".numLikes")
                numLikes.forEach(element => {
                    if (element.dataset.id == like.dataset.id) {
                        let numLike = parseInt(element.innerHTML)
                        element.innerHTML = --numLike
                    }
                });

                $.ajax({
                    url: "/dislike",
                    method: "POST",
                    data: { publicationId: like.dataset.id },
                    success: (res, e) => {
                        const rst = res.rst
                        if (rst) {
                            event.target.classList.remove("likePress")
                            console.log("dislike")
                        }
                    },
                    error: () => {
                        alert("error")
                    }
                })
            } else {

                const numLikes = document.querySelectorAll(".numLikes")
                numLikes.forEach(element => {
                    if (element.dataset.id == like.dataset.id) {
                        let numLike = parseInt(element.innerHTML)
                        element.innerHTML = ++numLike
                    }
                });


                $.ajax({
                    url: "/like",
                    method: "POST",
                    data: { publicationId: like.dataset.id },
                    success: (res, e) => {
                        const rst = res.rst
                        if (rst) {
                            event.target.classList.toggle("likePress")
                            console.log("like")
                        }
                    },
                    error: () => {
                        alert("error")
                    }
                })
            }
        })
    });

    // Buscador

    $(document).on("click", function (e) {
        const contenedorItemsBuscador = $("#contenedor-buscadorId");
        if (!contenedorItemsBuscador.is(e.target) && contenedorItemsBuscador.has(e.target).length === 0) {
            $("#search").val("")
            contenedorItemsBuscador.hide()
        }
    });


    $("#search").keyup(e => {
        $("#contenedor-buscadorId").show()

        let inputText = $("#search").val()

        if (inputText != "" && inputText != undefined && inputText != null) {
            $.ajax({
                url: "/allUsersByLetter",
                method: "POST",
                data: { inputText },
                success: (res) => {
                    let container = $("#contenedor-buscadorId");
                    container.html("")
                    res.allUsers.forEach(element => {
                        container.append(`<a href="/otherProfile/${element._id}"><div class="item-buscador d-flex gap-2 rounded-3">
              <img src="/img/user/${element.profile_image}" alt="" class="img-fluid rounded-circle">
              <p>${element.userName}</p>
            </div></a>`)
                    });

                },
                error: () => {
                    alert("error")
                }

            })
        } else {
            $("#contenedor-buscadorId").hide()
        }
    })

});