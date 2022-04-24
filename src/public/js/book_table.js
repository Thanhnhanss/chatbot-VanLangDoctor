(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading 

    MessengerExtensions.getContext('1319937271855579',
        function success(thread_context) {
            // success
            //set psid to input
            $("#psid").val(thread_context.psid);
            handleClickButtonBookTable();
        },
        function error(err) {
            // error
            console.log('Lỗi đặt lịch VănLang chatbot', err);
            $('#error').text(err);
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;
    const PHONE_REG = /[0-9]/g;

    let email = $("#email");
    let phoneNumber = $("#phoneNumber");
    let faculty = $('#faculty');
    let time = $('#time');
    let flag = false;

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        flag = true;
    } else {
        email.removeClass("is-invalid");
    }

    if (phoneNumber.val().match(PHONE_REG)) {
        phoneNumber.addClass("is-invalid");
        flag = true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    if (faculty.children('button').html().includes('Chọn khoa')) {
        faculty.addClass("is-invalid");
        flag = true;
    } else {
        faculty.removeClass("is-invalid");
    }

    if (time.children('button').html().includes('Chọn khung giờ')) {
        time.addClass("is-invalid");
        flag = true;
    } else {
        faculty.removeClass("is-invalid");
    }

    return flag;
}


function handleClickButtonBookTable() {
    $("#btnBookTable").on("click", function (e) {
        let check = validateInputFields(); //return true or false
        let data = {
            psid: $("#psid").val(),
            customerName: $("#customerName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            faculty: $('#faculty > button').html(),
            time: $('#time > button').html()
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
            }, function error(err) {
                // an error occurred
                console.log(err);
            });

            axios.post('https://chatbotbacsivanlang.herokuapp.com/reserve-table-ajax', data)
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });
}

$(document).ready(() => {
    $('#time .dropdown-menu .dropdown-item').click(function (e) {
        e.preventDefault();
        $('#time > button').html($(this).text());
    });

    $('#faculty .dropdown-menu .dropdown-item').click(function (e) {
        e.preventDefault();
        $('#faculty > button').html($(this).text());
    });
});