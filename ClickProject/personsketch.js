// import * as www from './p5.min.js';

let video;
let poseNet;
let poses = [];
let skeletons = [];
let detectionPersonNumber = 1;
let leftElbowPos = [0,0]; // number 7 leftElbow
let leftWristPos = [0,0]; // number 9 leftWrist
let timeStampTemp = Date.now();
let actionState = false;
let waveHandTime = Date.now();
let waveTimes = 0;
let waveCountState = false;
var playAnimation = false;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, 
      {
        imageScaleFactor: 0.3,
        outputStride: 16,
        flipHorizontal: false,
        minConfidence: 0.5,
        maxPoseDetections: 5,
        scoreThreshold: 0.5,
        nmsRadius: 20,
        detectionType: 'single',
       }
      , modelReady);
    poseNet.on('pose', gotPoses);
    video.hide();
}

function modelReady() {
    //select('#status').html('Model Loaded');
}

function draw() {
    image(video, 0, 0, width, height);
    drawKeypoints();

    
    //console.log('draw : wave hand state : ', playAnimation);
    drawSkeleton();
}


function drawKeypoints()  {
    for (let i = 0; i < poses.length; i++) {
        //poses.length is number of detect people
        

        // if( i< detectionPersonNumber){
        if(false){
            for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
                let keypoint = poses[i].pose.keypoints[j];
                // drow keypoint when score > 0.2
                if (keypoint.score > 0.2) {
                    fill(255, 0, 0);
                    noStroke();
                    ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
                }
            }
        }

        // number 7 leftElbow
        let leftElbowKeypoint = poses[i].pose.keypoints[7];
        if (leftElbowKeypoint.score > 0.5) {
            leftElbowPos[0]=Math.floor(leftElbowKeypoint.position.x);
            leftElbowPos[1]=Math.floor(leftElbowKeypoint.position.y);
        }
        // number 9 leftElbow
        let leftWristKeypoint = poses[i].pose.keypoints[9];
        if (leftWristKeypoint.score > 0.5) {
            leftWristPos[0]=Math.floor(leftWristKeypoint.position.x);
            leftWristPos[1]=Math.floor(leftWristKeypoint.position.y);
        }
        // console.log('left elbow position : ',leftElbowPos);
        //console.log('left wrist position : ',leftWristPos);
        if(Math.abs(leftWristPos[0]-leftElbowPos[0])<30){
            if (!actionState && waveCountState){
                waveTimes += 1;
                waveCountState = false;
            }
            actionState = true;
            
        }else{
            if (actionState && waveCountState){
                waveTimes += 1;
                waveCountState = false;
            }
            actionState = false;
            timeStampTemp = Date.now();
        }
        // console.log(waveTimes);
        if ((Date.now() - timeStampTemp)>0.3){
            waveCountState = true;
        }

        if ((Date.now() - timeStampTemp)>1){
            // console.log('the elbow and wrist is vertical state ! , distance : ',Math.abs(leftWristPos[0]-leftElbowPos[0]));
            timeStampTemp = Date.now();
        }

        if (waveTimes>5){
            playAnimation = true;
            console.log('Stacy say hello to you!!');
            document.getElementById("htmlid").name = true;
            waveTimes = 0;
        }else{
            playAnimation = false;
            // document.getElementById("htmlid").name = false;
        }
    }
}

function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
    // for (let i = 0; i < 2; i++) {
        if( i< detectionPersonNumber){
            for (let j = 0; j < poses[i].skeleton.length; j++) {
                let partA = poses[i].skeleton[j][0];
                let partB = poses[i].skeleton[j][1];
                stroke(255, 0, 0);
                line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
            }
        }
    }
}

function gotPoses(results) {
    poses = results;
}


// export let playAnimationFunc = function () {
//     return playAnimation
//   }
// export{
//     playAnimation
// };

// module.exports = MyClass(){
//     // playAnimationFunc(){
//     //         return playAnimation;
//     // }
//     // return playAnimation;
//     constructor() {
//         console.log("es6");
//       }
// };