userlogBtn[0].onclick = () => {
    var userLoginForm = document.createElement("div"),
        fileInputDOM = `<div id="change_picture_btn"><label for="profile">Change</label></div>`,
        profileImgDOM = `<img id="edit_user_account_picture" alt="User Profile" src="data:image/png;base64,${lsProfile}">${fileInputDOM}`;
    pageBody[0].appendChild(userLoginForm);
    userLoginForm.setAttribute("id", "edit_user_section");
    userLoginForm.setAttribute("class", "modal_bg");
    userLoginForm.innerHTML = `
        <form class="modal_container" autocomplete="off">
            <header class="modal_header">
                <b>User login</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="form_body">
                <div id="user_account_profile"></div>
                <input type="file" class="hidden" id="profile" accept=".png, .jpg, .jpeg"/>
                <input type="text" class="input_text" id="username_inp" placeholder="Enter username" maxlength="30">
                <input type="password" class="input_text" id="password_inp" placeholder="Enter password" maxlength="20">
            </main>
            <div class="line_dividerX"></div>
            <footer class="form_footer">
                <p class="form_error hidden"></p>
                <button id="save_btn">Save</button>
            </footer>
        </form>`;

    var userProfile = document.querySelector("#user_account_profile"),
        input = document.querySelector("#username_inp"),
        password = document.querySelector("#password_inp"),
        saveBtn = document.querySelector("#save_btn"),
        errorMsg = document.querySelector(".form_error"),
        profile = document.querySelector("#profile"),
        fileReader = new FileReader();

    closeMenu("edit_user_section");

    if (lsProfile != null) {
        userProfile.innerHTML = profileImgDOM;
    } else {
        defaultProfilePicture(userProfile, 98, fileInputDOM);
    }

    if (lsUsername != null) {
        input.value = lsUsername;
    }

    profile.onchange = () => {
        userProfile.innerHTML = profileImgDOM;
        fileReader.onload = function() {
            document.querySelector("#edit_user_account_picture").src = fileReader.result;
        };
        if (profile.files[0]) {
            fileReader.readAsDataURL(profile.files[0]);
        };
    };

    saveBtn.onclick = (e) => {
        function errorInput(msg) {
            e.preventDefault();
            errorMsg.classList.remove("hidden");
            errorMsg.innerText = msg;
        }
        if (input.value) {
            e.preventDefault();
            const loginData = {
                username: input.value,
                password: password.value
            };
            fetch('https://delhitodolist.pythonanywhere.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log(data)
                if(data && data["status"] === 200){
                    localStorage.setItem("username", input.value);
                    localStorage.setItem("user", data.data)
                    localStorage.setItem("logstatus", true);
                    location.reload();
                    console.log(data["data"]);
                    document.querySelector(".close_btn").click();
                }
                else{
                    errorInput(data["message"]);
                    console.log(data["message"]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else if (input.value == "") {
            errorInput("Your input name is empty");
        } else {
            errorInput("Number is not allowed");
        }
    };
};