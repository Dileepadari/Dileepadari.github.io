
aboutProject.onclick = () => {
    var aboutProjectSection = document.createElement("div");
    pageBody[0].appendChild(aboutProjectSection);
    aboutProjectSection.setAttribute("id", "about_project_section");
    aboutProjectSection.setAttribute("class", "modal_bg");
    aboutProjectSection.innerHTML = `
        <div class="modal_container">
            <header class="modal_header">
                <b>About project</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="modal_body">
                <img
                    src="assets/brand-logo.jpg"
                    width="100%"
                    alt="logo"
                    class="logo"
                <p>
                    This project is a simple to-do list that allows you to create, edit, and delete tasks. It is built using HTML, CSS, and JavaScript. The backend is integrated by python using api endpoints. The frontend is inspired (mostly taken) from minecraftjohn.
                <br><br>
                   However, This To do can have different types of lists and further will be developed, contribution is highly appreciated.
                </p>
            </main>
            <div class="line_dividerX"></div>
            <footer class="form_footer" id="about_project_footer">
                <p id="last_update"></p>
                <a href="https://github.com/dileepadari" target="_blank" rel="noopener noreferrer">Visit Github for more info.</a>
            </footer>
        </div>
    `;
    
    fetch("https://api.github.com/repos/Dileepadari/Dileepadari.github.io/branches/main")
        .then((response) => response.json())
        .then((data) => {
            const date = new Date(data.commit.commit.author.date);
            const formattedDate = date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            });
            document.querySelector("#last_update").innerHTML = formattedDate;
        });


    closeMenu("about_project_section");

    if (JSON.parse(pageHtml[0].getAttribute("darkmode")) === true) {
        dynamicLogo("var(--text)");
    } else {
        dynamicLogo("url(#paint0_linear_179_2)");
    }
};