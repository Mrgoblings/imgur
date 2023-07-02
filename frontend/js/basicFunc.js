window.onscroll = function() {
    var element = document.getElementById("navbar");

    if (scrollY < 150) {
        element.style = "background: transparent;";
    } else {
        element.style = "background: #171544;";
    }
};


window.addEventListener("load", function() {
    var preloader = document.getElementById("preloader");
    preloader.classList.add("hide");
});