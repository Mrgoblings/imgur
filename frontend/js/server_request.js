import  {ImageContainer} from './container_template.js';


fetch(`http://localhost:3000/posts${window.location.search}`, {
    // method: "GET",
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    // // body: {
    // //     query: document.getElementsByClassName("search")[0].value, //TODO
    // // },
})

    .then(response => {
        if (response.ok) { 
            return response.json(); //* Parse the response body as JSON
        } else {
            throw new Error("Failed to fetch posts.");
        }
    })
    .then(data => {
        //* Access the parsed JSON data (assuming it has the expected structure)
        data.payload.forEach(element => {
            (new ImageContainer(element.imageUrl, null, element.title, 69, 69, 3)).appendToParent(".images-section");
        });
    })
    .catch(error => {
        // Handle network or other errors
        console.error("Error creating post:", error);
    });