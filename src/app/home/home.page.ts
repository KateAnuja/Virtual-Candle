import { Component } from '@angular/core';
declare var MediaRecorder: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  recordedAudio=[];

  
  constructor(
  ) {}
  
  ionViewWillEnter(){
    this.record();
    setTimeout(()=>{
      this.listen();
    },1000);
  }

  ionViewDidEnter(){
    
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){

  }

  async record(){
    const recorder:any = await this.recordAudio();
    recorder.start();
    setTimeout(async ()=>{
      const audio =await recorder.stop();
      this.recordedAudio.push(audio);
      this.record();
    },1000);
  }

  currentAud=0;
  async listen(){
    console.log("listen");
    if(this.recordedAudio[this.currentAud]){
      let audio=this.recordedAudio[this.currentAud];
      await audio.play();
      this.visualize(audio);
      audio.onended=()=>{
        console.log("ended");
        this.currentAud++;
        this.listen();
      }
    }else{
      setTimeout(()=>{
        this.listen();
      },1000);
    }
    
  }

  recordAudio(){
    return new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
  
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
  
      const start = () => mediaRecorder.start();
  
      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            //const play = () => audio.play();
            resolve(audio);
          });
  
          mediaRecorder.stop();
        });
  
      resolve({ start, stop });
    });
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
        console.log(barHeight);
        
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
