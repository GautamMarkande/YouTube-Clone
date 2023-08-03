const apiKey = "AIzaSyB6qKHCCXMl1j_npfhzTbWOiww26OXJ0OE";
const baseUrl = "https://www.googleapis.com/youtube/v3";

/*
*@param{string} searchString
*
*/
let searchString = " ";

const input = document.getElementById("search_input");
const searchBtn = document.getElementById("search_btn");

async function fetchVideoDetails(VideoId){
    const url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${VideoId}`;
    const response = await fetch(url,{method:"GET"});
    const videoInfo = await response.json();
   // const channelDetails = await fetchChannelDetails(videoInfo.items[0].snippet.channelId);
     //console.log("video infor>>>", videoInfo)
    // console.log("channer information",channelDetails);
    // addVideoDetailsOntoUI(videoInfo,channelDetails);
    return videoInfo;

}


async function getVideoDetails(searchString){

    const url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&type=video&maxResults=10`;
    const response = await fetch(url,{method:"GET"});
    const result = await response.json();
   // console.log(result);
   ShowVideosOnUI(result.items);
}
searchBtn.addEventListener("click", ()=>{
    searchString = input.value;
    getVideoDetails(searchString);

})

async function ShowVideosOnUI(VideoList){
    const container = document.getElementById("container");
    container.innerHTML = "";
   for(let i = 0; i<VideoList.length; i++){
    var videoDetails = await fetchVideoDetails(VideoList[i].id.videoId);
   // let stringifyvideoDetails = JSON.stringify(videoDetails);
   // console.log(videoDetails);
    var VideoId = VideoList[i].id.videoId;
   // console.log(typeof VideoId);
    const {snippet} = VideoList[i];
    const videoElement = document.createElement("div");
    videoElement.className = "video";
    videoElement.innerHTML = `
    
        <img src="${snippet.thumbnails.high.url}" alt="" onclick ="openVideoDetails('${VideoId}')">
            <div class="video_info">
                <div class="channel_profile_container">
                    <img class="prfile_icon" src="https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg" alt="" width="30px" height="30px">
                    <p>${snippet.title}</p>
                </div>
                <div class="ch_name_and_view_uploaded_date">
                    <b>${snippet.channelTitle}</b>
                    <b>${videoDetails.items[0].statistics.viewCount}. 5 year ago</b>
                </div>
                
            </div>
    
        `
        
        container.appendChild(videoElement);

    }
}
function openVideoDetails(vid){
    localStorage.setItem("key",vid)
    localStorage.setItem("searchStr",searchString);
    window.open("./VideoDetails.html");

}
getVideoDetails(searchString);
