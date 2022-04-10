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
            handleClickButtonFeedBackTable();
        },
        function error(err) {
            // error
            console.log('Lỗi đánh giá phản hồi vanlang chatbot', err);
            $('#error').text(err);
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");
    let phoneNumber = $("#phoneNumber");
    let faculty = $('#faculty');
    let time = $('#time');
    let flag = false;
    let satisfied = $('#satisfied');

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        flag = true;
    } else {
        email.removeClass("is-invalid");
    }

    if (phoneNumber.val() === "") {
        phoneNumber.addClass("is-invalid");
        flag = true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    if (satisfied.children('button').html().includes('Chọn đánh giá')) {
        satisfied.addClass("is-invalid");
        flag = true;
    } else {
        faculty.removeClass("is-invalid");
    }

    return flag;
}


function handleClickButtonFeedBackTable() {
    $("#btnFeedbackTable").on("click", function (e) {
        let check = validateInputFields(); //return true or false
        let data = {
            psid: $("#psid").val(),
            customerName: $("#customerName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            content: $("content").val(),
            satisfied: $('#satisfied').val()
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
            }, function error(err) {
                // an error occurred
                console.log(err);
            });

            axios.post('https://chatbotbacsivanlang.herokuapp.com/feedback-ajax', data1)
                .then(function (data1) {
                    console.log(data1);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });
}

$(document).ready(() => {
    $('#satisfied .dropdown-menu .dropdown-item').click(function (e) {
        e.preventDefault();
        $('#satisfied > button').html($(this).text());
    });
});