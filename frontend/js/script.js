const popupScreen = document.querySelector("#popup-screen");
const closeBtn = document.querySelector(".close-btn");
const submitBtn = document.querySelector(".search-button");
const searchBar = document.getElementsByClassName("search")[0];
const searchForm = document.getElementsByClassName("form")[0];


window.onscroll = () => {
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
    searchBar.value = window.location.search.substring(1);
});


closeBtn.addEventListener("click", () => {
    popupScreen.classList.remove("active");
});


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (searchBar.value)
        window.location.replace(`search.html?${searchBar.value}`);
    else window.location.replace(`index.html`);
});

var drop = document.getElementById("fileUpload");
var form = document.getElementById("postForm");

drop.addEventListener("dragenter", () => {
    form.style.backgroundColor = '#65e66091';
}, false);
drop.addEventListener("dragleave", () => {
    form.style.backgroundColor = 'transparent';
}, false);


function newPost() {
    popupScreen.classList.add("active");
}


function btn_toggle_fun() {
    let fun = document.getElementById("fun");
    console.log(fun.innerHTML);
    if (fun.innerHTML == "FUN") {
        fun.innerHTML = "fun";
        fun.classList.remove("clicked");
    } else {
        fun.innerHTML = "FUN";
        fun.classList.add("clicked");
    }
}

function btn_toggle_whole() {
    let whole = document.getElementById("whole");
    if (whole.innerHTML == "WHOLESOME") {
        whole.innerHTML = "wholesome";
        whole.classList.remove("clicked");
    } else {
        whole.innerHTML = "WHOLESOME";
        whole.classList.add("clicked");
    }
}

function btn_toggle_game() {
    let game = document.getElementById("game");
    if (game.innerHTML == "GAMING") {
        game.innerHTML = "gaming";
        game.classList.remove("clicked");
    } else {
        game.innerHTML = "GAMING";
        game.classList.add("clicked");
    }
}

const stateButton = document.getElementById("stateButton");

let currentState = "PUBLIC";

stateButton.addEventListener("click", function() {
    if (currentState === "PRIVATE") {
        currentState = "UNLISTED";
        stateButton.textContent = "UNLISTED";
    } else if (currentState === "UNLISTED") {
        currentState = "PUBLIC";
        stateButton.textContent = "PUBLIC";
    } else {
        currentState = "PRIVATE";
        stateButton.textContent = "PRIVATE";
    }
});

document.getElementById("postForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission
    let tags = [];
    const formData = new FormData();
    formData.append("file", document.getElementById("fileUpload").files[0]);
    formData.append("title", document.getElementById("titleInput").value);
    if (document.getElementById("fun").innerHTML == "FUN") {
        tags.push("fun");
    }
    if (document.getElementById("whole").innerHTML == "WHOLESOME") {
        tags.push("wholesome");
    }
    if (document.getElementById("game").innerHTML == "GAMING") {
        tags.push("gaming");
    }
    console.log(tags);
    formData.append("tags", tags);
    formData.append("state", currentState);

    await fetch("http://localhost:3000/posts", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Handle successful response
                console.log("Post created successfully.");
            } else {
                // Handle error response
                console.error("Failed to create post.");
            }
        })
        .catch(error => {
            // Handle network or other errors
            console.error("Error creating post:", error);
        });
});


document.getElementById("fileUpload").onchange = function() {
    document.getElementById("box_input").style = "display: none;";
    document.getElementById("data_input").style = "display: flex;";
    document.getElementById("titleInput").style = "display: block;";
    document.getElementById("stateButton").style = "display: block;";
    document.getElementById("submitButton").style = "display: block;";
    // document.getElementById("postForm").submit();
};