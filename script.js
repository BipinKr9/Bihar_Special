document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const videoContainer = document.getElementById('videoContainer');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = document.getElementById('closeBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    let videos = [];

    // Fetch videos from JSON file
    async function fetchVideos() {
        try {
            const response = await fetch('videos.json');
            videos = await response.json();
            displayVideos(videos);
        } catch (error) {
            console.error('Error fetching videos:', error);
            videoContainer.innerHTML = '<p class="error-message">Failed to load videos. Please try again later.</p>';
        }
    }

    // Display videos in the container
    function displayVideos(videosToDisplay) {
        videoContainer.innerHTML = '';
        
        if (videosToDisplay.length === 0) {
            videoContainer.innerHTML = '<p class="error-message">No videos found.</p>';
            return;
        }

        videosToDisplay.forEach(video => {
            // Extract YouTube video ID from URL
            const videoId = getYouTubeVideoId(video.videoUrl);
            
            // Create thumbnail URL
            const thumbnailUrl = videoId ? 
                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 
                video.thumbnailUrl || 'placeholder.jpg';

            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="thumbnail-container">
                    <img class="thumbnail" src="${thumbnailUrl}" alt="${video.title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                </div>
            `;

            // Add click event to play the video
            videoCard.addEventListener('click', () => {
                openVideoPlayer(video.videoUrl);
            });

            videoContainer.appendChild(videoCard);
        });
    }

    // Extract YouTube video ID from URL
    function getYouTubeVideoId(url) {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Open video player modal
    function openVideoPlayer(videoUrl) {
        const videoId = getYouTubeVideoId(videoUrl);
        
        if (videoId) {
            videoPlayer.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            `;
            videoPlayerModal.style.display = 'flex';
        } else {
            alert('Invalid video URL');
        }
    }

    // Close video player modal
    function closeVideoPlayer() {
        videoPlayer.innerHTML = '';
        videoPlayerModal.style.display = 'none';
    }

    // Search functionality
    function searchVideos() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayVideos(videos);
            return;
        }
        
        const filteredVideos = videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm)
        );
        
        displayVideos(filteredVideos);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeVideoPlayer);
    
    videoPlayerModal.addEventListener('click', function(event) {
        if (event.target === videoPlayerModal) {
            closeVideoPlayer();
        }
    });

    searchBtn.addEventListener('click', searchVideos);
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchVideos();
        }
    });

    // Initialize
    fetchVideos();
});