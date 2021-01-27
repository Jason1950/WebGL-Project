
    let poseNetState = false;
    let poseNet = [];
    var video = document.getElementById("video2");
    // cameraPermission();
    setupCamera111();
    // function setupCamera() {
    //     // Get access to the camera!
    //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //         // Not adding { audio: true } since we only want video now
    //         // navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
    //         navigator.mediaDevices
    //         .getUserMedia({ video: true })
    //         .then(function (stream) {
    //             //video.src = window.URL.createObjectURL(stream);
    //             video.srcObject = stream;
    //             video.play();
    //             poseNetState = true;
    //         });
    //     }
    // }

    // function cameraPermission(){
    //     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    //         throw new Error(
    //             'Browser API navigator.mediaDevices.getUserMedia not available');
    //       }
    //     // navigator.mediaDevices.getUserMedia({ video: true })
    //     if (navigator.mediaDevices.getUserMedia) {
    //         navigator.mediaDevices.getUserMedia({ video: true })
    //           .then(function (stream) {
    //             video.srcObject = stream;
    //           })
    //           .catch(function (err0r) {
    //             console.log("Something went wrong!");
    //           });
    //       }
    // }

    async function setupCamera111() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
              'Browser API navigator.mediaDevices.getUserMedia not available');
        }
      
        const video = document.getElementById('video2');
        video.width = 640; //videoWidth;
        video.height = 480; //videoHeight;
      
        //const mobile = isMobile();
        const stream = await navigator.mediaDevices.getUserMedia({
          'audio': false,
          'video': {
            facingMode: 'user',
            width:  video.width,
            height:  video.height,
          },
        });
        video.srcObject = stream;
      
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video);
          };
        });
      }

    async function loadAndPredict() {
        // const net = await bodyPix.load(/** optional arguments, see below **/);
        /**
         * One of (see documentation below):
         *   - net.segmentPerson
         *   - net.segmentPersonParts
         *   - net.segmentMultiPerson
         *   - net.segmentMultiPersonParts
         * See documentation below for details on each method.
         */
        // const segmentation = await net.segmentPerson(img);
        // console.log(segmentation);

        const scaleFactor = 0.50;
        const flipHorizontal = false;
        const outputStride = 16;


        const net = await posenet.load();
        const pose = await net.estimateSinglePose(
                                video, 
                                scaleFactor, 
                                flipHorizontal, 
                                outputStride);
        // console.log(pose);
        console.log(Math.floor(pose.keypoints[7].position.x));
        document.getElementById("textH1").innerHTML = Math.floor(pose.keypoints[7].position.x);
        requestAnimationFrame(loadAndPredict);
        return pose;
        poseNet = poseNet.concat(pose);
        // poseNet = pose;
        // console.log(Math.floor(pose.keypoints[7].position.x));
        
        // requestAnimationFrame(loadAndPredict);
        Predict();
        
    }

    function Predict(pose){
        // const pose = net.estimateSinglePose(video, 0.5, false, 16);
        console.log(pose);
        // console.log(Math.floor(pose.keypoints[7].position.x));

        // requestAnimationFrame(Predict);
    }

    video.addEventListener('loadeddata', function(){
        // Do something once loaded.
        let pose = loadAndPredict();

        Predict(pose);
      });
    

    /* Legacy code below: getUserMedia 
    else if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia({ video: true }, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia({ video: true }, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia({ video: true }, function(stream){
            video.srcObject = stream;
            video.play();
        }, errBack);
    }
    */

    //  camera take a picture
    // var canvas = document.getElementById("canvas");
    // var context = canvas.getContext("2d");
    // var video = document.getElementById("video");

    // // Trigger photo take
    // document.getElementById("snap").addEventListener("click", function () {
    // context.drawImage(video, 0, 0, 640, 480);
    // });

    if (poseNetState){
        //  -----------------------------------------------------
        //              posenet start !!!!!!!!!!!!!
        //  -----------------------------------------------------
        console.log('posenet start !!')
        let poses;
        posenet.load().then(function(net) {
            // posenet model loaded
            //const imageElement = document.getElementById('cat');
            const pose = net.estimateSinglePose(video, {
            flipHorizontal: true
        });
        return pose;
        }).then(function(pose){
        poses = pose;
        console.log(pose);
        console.log(poses.keypoints);

        
        });

        for (let j = 0; j < poses.keypoints.length; j++) {
            let keypoint = poses.keypoints[j];
            // drow keypoint when score > 0.2
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
        let leftElbowPos = [0,0];
        let leftWristPos = [0,0]; // number 9 leftWrist
        // number 7 leftElbow
        let leftElbowKeypoint = poses.keypoints[7];
        if (leftElbowKeypoint.score > 0.2) {
            leftElbowPos[0]=Math.floor(leftElbowKeypoint.position.x);
            leftElbowPos[1]=Math.floor(leftElbowKeypoint.position.y);
        }
        // number 9 leftElbow
        let leftWristKeypoint = poses.keypoints[9];
        if (leftWristKeypoint.score > 0.5) {
            leftWristPos[0]=Math.floor(leftWristKeypoint.position.x);
            leftWristPos[1]=Math.floor(leftWristKeypoint.position.y);
        }
        console.log(leftElbowPos);
        console.log(leftWristPos);

    }













    // const video = document.getElementById('webcam');


    // // Check if webcam access is supported.
    // function hasGetUserMedia() {
    //   return !!(navigator.mediaDevices &&
    //     navigator.mediaDevices.getUserMedia);
    // }
    
    
    // // Enable the live webcam view and start classification.
    // function enableCam(event) {
    //   // getUsermedia parameters.
    //   const constraints = {
    //     video: true
    //   };

    // const imageScaleFactor = 0.50;
    // const flipHorizontal = false;
    // const outputStride = 16;
    // const scaleFactor = 0.50;

    
    
    
      // Activate the webcam stream.
    //   navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    //     video.addEventListener('loadedmetadata', function() {
    //       // do something once loaded metadata
    //     });
    
    //     video.srcObject = stream;
    //     video.addEventListener('loadeddata', function(){
    //       // Do something once loaded.
    //         const net = posenet.load();
    //         const pose = net.estimateSinglePose(
    //             video, 
    //             scaleFactor, 
    //             flipHorizontal, 
    //             outputStride);
    //         console.log('pose', pose);
    //     });
    //   });
    // }
    
    
    
    // // If webcam supported, add event listener to button for when user
    // // wants to activate it.
    // if (hasGetUserMedia()) {
    // //   const enableWebcamButton = document.getElementById('webcamButton');
    // //   enableWebcamButton.addEventListener('click', enableCam);
    //     enableCam();
    // } else {
    //   console.warn('getUserMedia() is not supported by your browser');
    // }