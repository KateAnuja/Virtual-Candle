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
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(300);
      console.log("recording")
      mediaRecorder.addEventListener("dataavailable", e => {
        const blobDataInWebaFormat = e.data; // .weba = webaudio; subset of webm
        const blobDataInWavFormat: Blob = new Blob([blobDataInWebaFormat], { type : 'audio/wav; codecs=0' });
        var reader = new FileReader();
          reader.readAsDataURL(blobDataInWavFormat);
          reader.onloadend = function () {
          var base64String = reader.result;
          console.log('Base64 String - ', base64String);
        }
      });
    });

    // this.mediaCapture.captureAudio()
    // .then((x)=>{
    //   console.log(x);
    // })
  }

  ionViewDidEnter(){
    
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){

  }

}
