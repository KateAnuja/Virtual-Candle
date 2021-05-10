import { Component } from '@angular/core';
declare var MediaRecorder: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(
  ) {}
  
  ionViewWillEnter(){
    var audioCtx = new (window.AudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(async stream => {
      let audioChunks = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(1000);
      mediaRecorder.addEventListener("dataavailable", async e => {
        if(audioChunks.length>5){
          const audioBlob = new Blob([...audioChunks]);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          await audio.play();
          audio.onended=()=>{
            console.log("ended");
          }
          this.visualize(audio);
          audioChunks = [];
        }
        audioChunks.push(e.data);
        
      });

      
    });

  }

  ionViewDidEnter(){
    
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){

  }

  visualize(audio){
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas :any = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();


  }

}
