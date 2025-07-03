console.log("TEst me")
// register plugins
document.addEventListener("DOMContentLoaded", (event) => {
	/********* POPUP OPEN/CLOSE ANIMATION STEPS *********/
	
	const videoPopupOpenSteps = [
    { opacity: "0"},
    { opacity: "1"}
  ]

  const videoPopupCloseSteps = [
    { opacity: "1"},
    { opacity: "0"}
  ]
  
  /******************/

	// Grab all the instance of the video popup component
	const videoPopupComponents = document.querySelectorAll('[fc-video-popup ^= "component"]')
  
  const vimeoComponents = Array.from(videoPopupComponents).filter(component => {
  	const iframe = component.querySelector('iframe')
    const src = iframe.getAttribute('src')
    return src.includes('vimeo')
  })
  
  const youtubeComponents = Array.from(videoPopupComponents).filter(component => {
  	const iframe = component.querySelector('iframe')
    const src = iframe.getAttribute('src')
    return src.includes('youtube')
  })
  
  if(vimeoComponents.length > 0)
  {
  	var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://player.vimeo.com/api/player.js'
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
    
    script.onload = () => {
    	for(const component of vimeoComponents)
      {  
        // Take the button that will be used to play the video
        const playButton = component.querySelector('[fc-video-popup = play]')

        // Extrapolate the group the component belongs to in case there are more than one instance on the page
        let group = component.getAttribute('fc-video-popup').split('component')[1] 
        if(group === undefined)
          group = ''

        // Get all the open and close buttons associated with the component
        const openButtons = document.querySelectorAll(`[fc-video-popup = open${group}]`)
        const closeButtons = component.querySelectorAll('[fc-video-popup = close]')

        // ...Get the animation parameters...
        const videoPopupParameters = {
          duration: parseFloat(component.getAttribute('duration')),
          easing: component.getAttribute('easing')
        }

        if(isNaN(videoPopupParameters.duration))
          videoPopupParameters.duration = 300

        if(videoPopupParameters.easing === null)
          videoPopupParameters.easing = 'ease'

        // ...And create the corresponding parameters object to animate the popup
        const videoPopupTiming = {
          duration: videoPopupParameters.duration,
          fill: 'forwards',
          easing: videoPopupParameters.easing
        }

        // Take the corresponding iframe and creates the player
        const iframe = component.querySelector('iframe')
        const player = new Vimeo.Player(iframe)

        // When the player is on pause, the play button fades in
        player.on('pause', function(){
          playButtonFadeIn(playButton)
        })

        // When the player is on play, the play button fades out
        player.on('play', function(){
          playButtonFadeOut(playButton)
        })

        // When the play button is clicked, the corresponding player gets started
        playButton.addEventListener('click', function() {
          player.play()
        })

        // For every open button associated with the current component...
        for(const openButton of openButtons)
        {
          // The popup fades in, the video starts playing, and page scrolling is disabled
          openButton.addEventListener('click', function() {
            player.play()
            component.style.display = 'flex'
            component.animate(videoPopupOpenSteps, videoPopupTiming)
            document.querySelector('body').style.overflow = 'hidden'
          })
        }

        // For every close button associated with the current component...
        for(const closeButton of closeButtons)
        {
          // The popup fades out, the video gets paused, and page scrolling is enabled
          closeButton.addEventListener('click', function() {
            player.pause()
            component.animate(videoPopupCloseSteps, videoPopupTiming)
            setTimeout(function() { component.style.display = 'none' }, videoPopupParameters.duration)
            document.querySelector('body').style.overflow = 'visible'
          })
        }
      }
    }
  }
    
  if(youtubeComponents.length > 0)
  {
  	var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://www.youtube.com/iframe_api'
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
  }
  
  function onYouTubeIframeAPIReady() {
    for(const component of youtubeComponents)
    {  
      // Take the button that will be used to play the video
      const playButton = component.querySelector('[fc-video-popup = play]')

      // Extrapolate the group the component belongs to in case there are more than one instance on the page
      let group = component.getAttribute('fc-video-popup').split('component')[1] 
      if(group === undefined)
        group = ''

      // Get all the open and close buttons associated with the component
      const openButtons = document.querySelectorAll(`[fc-video-popup = open${group}]`)
      const closeButtons = component.querySelectorAll('[fc-video-popup = close]')

      // ...Get the animation parameters...
      const videoPopupParameters = {
        duration: parseFloat(component.getAttribute('duration')),
        easing: component.getAttribute('easing')
      }

      if(isNaN(videoPopupParameters.duration))
        videoPopupParameters.duration = 300

      if(videoPopupParameters.easing === null)
        videoPopupParameters.easing = 'ease'

      // ...And create the corresponding parameters object to animate the popup
      const videoPopupTiming = {
        duration: videoPopupParameters.duration,
        fill: 'forwards',
        easing: videoPopupParameters.easing
      }

			// Take the corresponding iframe and creates the player
      const iframe = component.querySelector('iframe')
      const player = new YT.Player(iframe)
      
      player.addEventListener('onStateChange', (e) => {
      	const state = e.data
        
        switch(state)
        {
        	// When the player is on play, the play button fades out
        	case 1:
            playButtonFadeOut(playButton)
            break
          // When the player is on pause, the play button fades in
          case 2:
            playButtonFadeIn(playButton)
            break
        }
      })

      // When the play button is clicked, the corresponding player gets started
      playButton.addEventListener('click', function() {
      	player.playVideo()
      })

      // For every open button associated with the current component...
      for(const openButton of openButtons)
      {
        // The popup fades in, the video starts playing, and page scrolling is disabled
        openButton.addEventListener('click', function() {
          player.playVideo()
          component.style.display = 'flex'
          component.animate(videoPopupOpenSteps, videoPopupTiming)
          document.querySelector('body').style.overflow = 'hidden'
        })
      }

      // For every close button associated with the current component...
      for(const closeButton of closeButtons)
      {
        // The popup fades out, the video gets paused, and page scrolling is enabled
        closeButton.addEventListener('click', function() {
          player.pauseVideo()
          component.animate(videoPopupCloseSteps, videoPopupTiming)
          setTimeout(function() { component.style.display = 'none' }, videoPopupParameters.duration)
          document.querySelector('body').style.overflow = 'visible'
        })
      }
    }
  }

	// Fade-out animation for the play button
	function playButtonFadeOut(playButton) {
		const fadeOutSteps = [
      { opacity: "1" },
      { opacity: "0" }
    ]

    const timing = {
      duration: 300,
      fill: 'forwards'
    }

    playButton.parentNode.animate(fadeOutSteps, timing)

    setTimeout(function(){
      playButton.parentNode.style.display = 'none'
    }, 300)
	}
  
  // Fade-in animation for the play button
  function playButtonFadeIn(playButton) {
    const fadeInSteps = [
      { opacity: "0" },
      { opacity: "1" }
    ]

    const timing = {
      duration: 300,
      fill: 'forwards'
    }

    playButton.parentNode.style.display = 'flex'

    playButton.parentNode.animate(fadeInSteps, timing)
  }
});