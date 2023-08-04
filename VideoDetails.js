
//AIzaSyDopaAwT9Ke8kDIj5Y1AWJvR-0PCkhTHU
const apiKey = "AIzaSyBsh14p8Ao_Go6YZIghxCM1tPy3vkKSHbU";
const baseUrl = "https://www.googleapis.com/youtube/v3";
let idOfClickedVideo = localStorage.getItem("key");
console.log(idOfClickedVideo);

async function fetchChannelDetails(channelId){
    const url= `${baseUrl}/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`;
    const response = await fetch(url,{method:"GET"});
    const result = await response.json();
    console.log(result);
    return result;
}

async function fetchVideoDetails(){
    const url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${idOfClickedVideo}`;
    const response = await fetch(url,{method:"GET"});
    const videoInfo = await response.json();
    console.log("video infor>>>", videoInfo)
    const channelDetails = await fetchChannelDetails(videoInfo.items[0].snippet.channelId);
    
    console.log("channel information",channelDetails);
    addVideoDetailsOntoUI(videoInfo,channelDetails);
}
async function getcomments(){
 
   const url = `${baseUrl}/commentThreads?key=${apiKey}&videoId=${idOfClickedVideo}&part=snippet&order=time&maxResults=80`;
   const response = await fetch(url,{method:"GET"});
   const comments = response.json();
   return comments;
   //console.log(comments);

}
const currentSearchstr = localStorage.getItem("searchStr");
async function GetRecommendedVideos(){
  /*
   <div class="video_card">
      <img src="https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg" alt="" />
      <div>
        <p>advanced javascript video only in 1 hour</p>
        <b>John sinha </b>
        <b>15k.  1 week ago</b>
      </div>
    </div>
   */
    const url = `${baseUrl}/search?key=${apiKey}&q=${currentSearchstr}&part=snippet&type=video&maxResults=10`;
    const response = await fetch(url,{method:"GET"});
    const result = await response.json();
   // console.log(result);
   ShowRecommendedVideosOnUI(result.items);
}
function ShowRecommendedVideosOnUI(RecommendedVideoList){
  const videoContainer = document.querySelector(".main_right_container");
  RecommendedVideoList.forEach((video)=>{
    const {snippet} = video;
    const videocard = document.createElement("div");
    videocard.className = "video_card";
    videocard.innerHTML=`
    <img src="${snippet.thumbnails.high.url}" alt="" />
    <div>
      <p>${snippet.title}</p>
      <b>${snippet.channelTitle}</b>
      <b>15k.  1 week ago</b>
    </div>
    `
   videoContainer.appendChild(videocard);
  })
}
async function showComments(){
  let comments = await getcomments();
  console.log("comment info>>>",comments);
  const items = comments.items;
  console.log(items);
  const MainCommentContainer=document.querySelector(".do_comments_cntainer");
  for(let i = 0; i<items.length; i++){
    let comment = items[i];
  const commentContainner = document.createElement("div");
  commentContainner.className = "all_comments_container";
  commentContainner.innerHTML=`
         <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="" />
          <div>
              <b>${comment.snippet.topLevelComment.snippet.authorDisplayName}</b>
              <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
              <div>
              <img src="like.png" alt="" />${comment.snippet.topLevelComment.snippet.likeCount}
              <img src="DisLiked.png" alt="" />1
              <p>Reply ${comment.snippet.totalReplyCount}</p>
          </div>
  
  `
  MainCommentContainer.appendChild(commentContainner);

}
         
}

function addVideoDetailsOntoUI(videoInfo,channelDetails){
    const mainContainer = document.createElement("div");
    mainContainer.className = "main_container";

    mainContainer.innerHTML = `
    <div class="videoplay_container" id="main_left_container">
    <div class="Play_video_container">
        <iframe width="1090" height="497" src="https://www.youtube.com/embed/${idOfClickedVideo}">
        </iframe>
        <video src="https://www.youtube.com/watch?v=7tlJRhEu8Bc"></video>
      </iframe>
    </div>
    <div class="videoplay_information_container">
      <p>${videoInfo.items[0].snippet.title}</p>
      <div class="statistic">
        <p>${videoInfo.items[0].statistics.viewCount} . Oct 8, 2021</p>
        <div class="like_dislike_container">
          <div>
            <img src="like.png" alt="" />
            <span>${videoInfo.items[0].statistics.likeCount}</span>
          </div>
          <div>
            <img src="DisLiked.png" alt="" />
            <span>NA</span>
          </div>
          <div>
            <img src="Save.png" alt="" />
            <span>save</span>
          </div>
          <div>
            <img src="Share.png" alt="" />
            <span>share</span>
          </div>
        </div>
      </div>
    </div>
    <div class="subscribe_container">
      <div class="left">
        <img src="User-Avatar.png" alt="avtar" />
        <div>
          <p>${videoInfo.items[0].snippet.channelTitle}</p>
          <b>${channelDetails.items[0].statistics.subscriberCount}</b>
        </div>
      </div>
      <div class="right">
        <div class="subscribeBtn">Subscribe</div>
      </div>
    </div>
    <div class="videoplay_Description_and_all_container">
      <p>
       ${videoInfo.items[0].snippet.description}
      </p>
    </div>
    <div class="videoplay_comments_and_all_container">
      <div class="total_comments_and_sort">
            <p>${videoInfo.items[0].statistics.commentCount} Comments</p>
            <div>
                <img src="Dropdown.png" alt="" />
                <b>Sort</b>
            </div>
      </div>
      <div class="do_comments_cntainer">
            <div class="write_comment">
                <img src="User-Avatar.png" alt="" />
                <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Add a public comment"
                />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="main_right_container">
    <div class="tags">
      <div class="allbtn">all</div>
      <div class="recommendBtn">Recommended</div>
    </div>
  </div>

    `
    document.body.appendChild(mainContainer);
    showComments();
    GetRecommendedVideos()
}
fetchVideoDetails()

