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

        $("#recoveryEmail").val("")

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
                        $("#recoveryPassword").val("")
                        $("#recoveryRepeatPassword").val("")
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
            errors.push("Las contrase??as deben ser iguales");
        } else {
            if (password.length < 6) errors.push("Contrase??a minimo 6 caracteres");
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

    // Boton a??adir tag

    $("#icon-tag").on("click", () => {
        $("#modal-tag").modal("show")
    })

    $("#close-modal-tag").on("click", () => {
        $("#modal-tag").modal("hide")
    })

    $("#close-btnSuperior-modal-tag").on("click", () => {
        $("#modal-tag").modal("hide")
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

    //Rack
    const racks = document.querySelectorAll(".icon-rack")
    racks.forEach(rack => {
        rack.addEventListener("click", event => {
            const div_publication_like = document.querySelectorAll(".div-publication-tags")
            div_publication_like.forEach(element => {
                if (event.target.dataset.id == element.dataset.id) {
                    if (window.getComputedStyle(element).getPropertyValue("display") == "none") {
                        rack.setAttribute("src", "/pngIcons/unrack.png")
                        element.style.display = "block"
                    } else {
                        rack.setAttribute("src", "/pngIcons/rack.png")
                        element.style.display = "none"
                    }
                }
            })
        })
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

    // Comentarios

    $(".divIcons__comment").on("click", (e) => {
        $("#comment-id-publication").val(e.target.dataset.id)

        const idPublication = $("#comment-id-publication").val()

        $.ajax({
            url: "/commentByidPublication",
            method: "POST",
            data: { idPublication },
            success: (res) => {

                const publication = res.publications

                $("#content-chat").html("")
                if (publication.comments.length > 0) {
                    publication.comments.forEach(element => {
                        $("#content-chat").append(`<div class="target-coment p-3 mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="target-commet-image-name d-flex align-items-center gap-2 mb-2">
                                    <img class="rounded-circle" src="/img/user/${element.idUser.profile_image}" alt="">
                                    <p class="fs-3">${element.idUser.userName}</p>
                                </div>
                                <p class="comment-date">${element.time}</p>
                            </div>
        
                            <p>${element.text}</p>
                        </div>`)
                    });
                } else {
                    $("#content-chat").append(`<p id="comment-void">No hay comentarios</p>`)
                }

            },
            error: () => {
                alert("error")
            }

        })

        $(".modal-comment").modal("show")
    })

    $("#btn-comment").on("click", e => {

        const idPublication = $("#comment-id-publication").val()
        const commentText = $("#comment-text").val()

        if (commentText != "") {
            $.ajax({
                url: "/comment",
                method: "POST",
                data: { idPublication, commentText },
                success: (res) => {

                    if ($("#comment-void").length) $("#content-chat").html("")


                    $("#content-chat").append(`<div class="target-coment p-3 mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="target-commet-image-name d-flex align-items-center gap-2 mb-2">
                                    <img class="rounded-circle" src="/img/user/${res.myUser.profile_image}" alt="">
                                    <p class="fs-3">${res.myUser.userName}</p>
                                </div>
                                <p class="comment-date">${res.time}</p>
                            </div>
        
                            <p>${commentText}</p>
                        </div>`)

                    $("#comment-text").val("")
                },
                error: () => {
                    alert("error")
                }

            })

        }
    })

    $(".btn-close-modal-comment").on("click", e => {
        $("#modal-comment").modal("hide")
    })

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

    //TAG

    $("#add-modal-tag").on("click", e => {

        const storeName = $("#store-modal-tag").val()
        const price = $("#price-modal-tag").val()

        let tagName = ""
        var tags = $(":input[name='check-tag']")

        for (var i = 0; i < tags.length; i++) {
            if (tags[i].checked) {
                tagName = tags[i].value
            }
        }

        const errors = []

        if (tagName == "") errors.push("Elige una prenda")
        if (storeName == "") errors.push("Escribe donde lo compraste")
        if (price == "") errors.push("Escribe cuanto te costo")

        if (errors.length > 0) {
            $("#errors-form-publicar-tag").html("")
            errors.forEach(element => {
                $("#errors-form-publicar-tag").append(`<p class="text-danger"> ${element} </p>`)
            });
        } else {
            $(".content-tag").append(`<div class="content-item-tag mb-3" data-image="${tagName}" data-storename="${storeName}" data-price="${price}">
            <div>
            <img src="pngIcons/${tagName}.png" alt="">
            <p>${storeName}</p>
            </div>
            <div>
            <p>${price}???</p>
            <i class="fa-solid fa-xmark btn-delete-tag"></i>
            </div>
            </div>`)

            $(".btn-delete-tag").on("click", e => {
                e.currentTarget.parentNode.parentNode.remove()
            })

            $("#modal-tag").modal("hide")
        }
    })

    // Publicar


    $("#form-publicar").on("submit", e => {
        e.preventDefault()

        let formData = new FormData(e.currentTarget)

        const hijos = $(".content-tag").children()

        const tags = {}

        for (var i = 0; i < hijos.length; i++) {

            const image = hijos[i].dataset.image
            const storeName = hijos[i].dataset.storename
            const price = hijos[i].dataset.price

            tags[i] = {
                image,
                storeName,
                price
            }
        }

        formData.append("tags", JSON.stringify(tags))


        $.ajax({
            url: "/newPublications",
            contentType: false,
            processData: false,
            method: "POST",
            data: formData,
            success: (res) => {
                console.log(res)
                if (res.errors.length > 0) {
                    console.log("hay error")
                    res.errors.forEach(element => {
                        $("#errors").html("")
                        $("#errors").append(`
                            <div class="alert alert-danger mt-3 alert-dismissible fade show" role="alert">
                            <h4>${element}</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                            </div>
                        `)
                    });
                } else {
                    console.log("no hay error")
                    window.location.href = "/publications"
                }
            },
            error: () => {
                alert("error")
            }
        })
    })

    // Slider Tags for allClothe

    $(":input[name='check-tag']").on("click", e => {
        const regExpCloset = new RegExp(/^\/closet\/\S*$/)
        const regExpOutfit = new RegExp(/^\/addOutfit\/\S*$/)

        var tagName = e.currentTarget.defaultValue
        $(".tagNameHidden").val(tagName)

        const currentUrl = window.location

        if (regExpCloset.test(currentUrl.pathname) || currentUrl.pathname == "/closet") {
            console.log("paso test")
            // window.location.href = `/closet/${tagName}`
            $.ajax({
                url: `/closet/${tagName}`,
                method: "GET",
                success: (res) => {
                    console.log("siu")
                    console.log(res)
                    $(".content-grid-closet").html("")
                    if (res.sendClothes) {
                        res.sendClothes.forEach(element => {
                            $(".content-grid-closet").append(`<div class="grid-profile-item bg-black">
                            <img src="/img/clothes/${element.image}" alt="" height="300px">
                            <i class="fa-solid fa-xmark remove-clothe" onclick="openModalSureRemove(this)" data-id="${element._id}" data-tagname="${element.tagName}"></i>
                            </div>
                            `)
                        });
                    } else {
                        $(".content-grid-closet").append(`<h4>${res.msg}</h4>`)
                    }
                },
                error: () => {
                    alert("error")
                }
            })
        } else if (regExpOutfit.test(currentUrl.pathname) || currentUrl.pathname == "/addOutfit") {
            $.ajax({
                url: `/outfit/${tagName}`,
                method: "POST",
                success: (res) => {
                    console.log($(".lista-ropas"))
                    $(".lista-ropas").empty()

                    res.clothesByTagName.forEach(element => {
                        console.log("1")
                        $(".lista-ropas").append(`<img src="/img/clothes/${element.image}" alt="" style="width: 300px; height: 150px;" draggable="true" ondragstart="drag(event)" id="${element._id}">`)
                    });

                    // Codigo recuperado
                    // $("#list-clothes-slider").empty()
                    // res.clothesByTagName.forEach(element => {

                    //     $("#list-clothes-slider").append(`<div class="swiper-slide d-flex justify-content-center bg-dark divClotheMove" onmousedown="seleccionar(this)"> 
                    //     <img src="/img/clothes/${element.image}" alt=""> 
                    // </div>`)
                    // });

                    // var swiper2 = new Swiper(".mySwiper2", {
                    //     slidesPerView: 3,
                    //     spaceBetween: 20,
                    //     slidesPerGroup: 3,
                    //     allowTouchMove: false,
                    //     navigation: {
                    //         nextEl: ".swiper-button-next",
                    //         prevEl: ".swiper-button-prev",
                    //     },
                    // });
                    // console.log("bien despues de addOutfit")
                    //Codigo recuperado
                },
                error: () => {
                    alert("error")
                }
            })
        }
    })

});

// Remove Clothe

const openModalSureRemove = e => {
    console.log(e)

    const id = e.dataset.id
    const tagName = e.dataset.tagname

    $("#formDelete").attr("action", `/closet/${tagName}/${id}?_method=DELETE`)
    $("#sure-remove").modal("show")
}

//Remove Outfit

const openModalSureRemoveOutfit = e => {
    console.log(e)

    const id = e.dataset.id

    $("#formDeleteOutfit").attr("action", `/outfit/${id}?_method=DELETE`)
    $("#sure-remove-outfit").modal("show")
}


//MOVER ROPA

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

//CAPTURA DEL DIV

function captura() {

    html2canvas($('#vestidor')[0]).then(function (canvas) {
        const base64URL = canvas.toDataURL("image/jpeg")
        $.ajax({
            url: "/outfit",
            method: "POST",
            data: { base64URL },
            success: (res) => {
                console.log(res.rst)

                window.location.href = "/outfit"
            },
            error: () => {
                alert("error")
            }
        })
    });
}
