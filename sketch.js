// Copyright (c) 2018 ml5
// https://opensource.org/licenses/MIT

let video;
let poseNet;
let poses = [];

function setup() {
  // 建立畫布
  createCanvas(640, 480);
  
  // 初始化攝影機
  video = createCapture(VIDEO, function(stream) {
    console.log("攝影機啟動成功！");
  });
  video.size(width, height);

  // 初始化 PoseNet 模型
  // 傳入 video 並在模型載入完成後執行 modelReady
  poseNet = ml5.poseNet(video, modelReady);

  // 當偵測到人體姿勢時，將結果存入 poses 變數
  poseNet.on('pose', function(results) {
    poses = results;
  });

  // 隱藏原始的 HTML 影片元件，只顯示畫布
  video.hide();
}

function modelReady() {
  console.log("模型已準備就緒！");
  // 更改 index.html 中 id 為 status 的文字
  let statusElement = select('#status');
  if (statusElement) {
    statusElement.html('Model Loaded');
  }
}

function draw() {
  // 將攝影機畫面繪製在畫布上
  image(video, 0, 0, width, height);

  // 繪製偵測到的關鍵點與骨架
  drawKeypoints();
  drawSkeleton();
}

// 繪製關鍵點（紅點）
function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // 信心值大於 0.2 才繪製，避免雜訊
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// 繪製骨架（紅線）
function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      strokeWeight(2);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}