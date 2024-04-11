const header = document.querySelector("header");

window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", window.scrollY > 120);
})

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('active');
}

let moreProjectsButton = document.getElementById('more-btn');
let moreProjects = document.getElementById('more-projs');

let isExpanded = false;

moreProjectsButton.addEventListener('click', function() {
    if (isExpanded) {
        moreProjects.style.height = '0';
        moreProjects.style.overflow = 'hidden';
        moreProjectsButton.innerHTML = 'Show More';
        window.scrollTo({
            top: document.getElementById('projects').offsetTop,
            behavior: 'smooth'
        });
    } else {
        moreProjects.style.height = 'max-content';
        moreProjects.style.overflow = 'visible';
        moreProjectsButton.innerHTML = 'Show Less';
    }
    isExpanded = !isExpanded;
});