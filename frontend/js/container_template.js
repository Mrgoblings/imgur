/* 
! The recreatad template from js to be set as template
<!-- TEMPLATE image container -->
<div class="imageContainer"> 
	<img class="image color-loading" alt="Image" src="https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg" width="300"/>
	<div class="postData">
		<a class="postText">This is an example image</a>
	</div>
	<div class="postInfo">
		<div class="upvoteContainer">
			<img src="images/upvote.svg" class="upvote"/>
			<p class="upvoteCount">69</p>
		</div>
		<div class="downvoteContainer">
			<img src="images/downvote.svg" class="downvote"/>
			<p class="downvoteCount">69</p>
		</div>
		<div class="commentContainer">
			<img src="images/comment.svg" class="comment"/>
			<p class="commentCount">42</p>
		</div>
	</div>
</div>
<!-- End of TEMPLATE container -->


*/


export class ImageContainer {
    constructor(imageSrc, imageAlt, postTextContent, upvoteCount, downvoteCount, commentCount) {
        this.imageSrc = imageSrc;
        this.imageAlt = imageAlt;
        this.postTextContent = postTextContent;
        this.upvoteCount = upvoteCount;
        this.downvoteCount = downvoteCount;
        this.commentCount = commentCount;
        this.container = null;
    }
  
    createImageContainer() {
        this.container = document.createElement('div');
        this.container.className = 'imageContainer';
    
        const image = document.createElement('img');
        image.className = 'image color-loading';
        image.alt = this.imageAlt;
        image.src = this.imageSrc;
        image.width = '300';
        this.container.appendChild(image);
    
        const postData = document.createElement('div');
        postData.className = 'postData';
        this.container.appendChild(postData);
    
        const postText = document.createElement('a');
        postText.className = 'postText';
        postText.textContent = this.postTextContent;
        postData.appendChild(postText);
    
        const postInfo = document.createElement('div');
        postInfo.className = 'postInfo';
        this.container.appendChild(postInfo);
    
        const upvoteContainer = document.createElement('div');
        upvoteContainer.className = 'upvoteContainer';
        postInfo.appendChild(upvoteContainer);
    
        const upvoteImage = document.createElement('img');
        upvoteImage.src = 'images/upvote.svg';
        upvoteImage.className = 'upvote';
        upvoteContainer.appendChild(upvoteImage);
    
        const upvoteCountElement = document.createElement('p');
        upvoteCountElement.className = 'upvoteCount';
        upvoteCountElement.textContent = this.upvoteCount;
        upvoteContainer.appendChild(upvoteCountElement);
    
        const downvoteContainer = document.createElement('div');
        downvoteContainer.className = 'downvoteContainer';
        postInfo.appendChild(downvoteContainer);
    
        const downvoteImage = document.createElement('img');
        downvoteImage.src = 'images/downvote.svg';
        downvoteImage.className = 'downvote';
        downvoteContainer.appendChild(downvoteImage);
    
        const downvoteCountElement = document.createElement('p');
        downvoteCountElement.className = 'downvoteCount';
        downvoteCountElement.textContent = this.downvoteCount;
        downvoteContainer.appendChild(downvoteCountElement);
    
        const commentContainer = document.createElement('div');
        commentContainer.className = 'commentContainer';
        postInfo.appendChild(commentContainer);
    
        const commentImage = document.createElement('img');
        commentImage.src = 'images/comment.svg';
        commentImage.className = 'comment';
        commentContainer.appendChild(commentImage);
    
        const commentCountElement = document.createElement('p');
        commentCountElement.className = 'commentCount';
        commentCountElement.textContent = this.commentCount;
        commentContainer.appendChild(commentCountElement);
    
        return this.container;
    }
  
    // Append the image container to a parent element on your webpage
    appendToParent(parentElementClass) {
        const parentElement = document.querySelector(parentElementClass);
        if (parentElement) {
            parentElement.appendChild(this.createImageContainer());
        } else {
            console.error(`Parent element with class "${parentElementClass}" not found.`);
        }
    }
}

// module.exports = ImageContainer;
  