var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({video: document.getElementById('preview'), scanPeriod: 1, mirror: false});
    self.scanner.addListener('scan', function (content, image) {
     // var x = self.scans.unshift({ date: +(Date.now()), content: content });
	  document.getElementById("show").innerHTML = content;
	});
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
		if(cameras.length>1){
			console.log("ok");
			self.activeCameraId = cameras[1].id;
			self.scanner.start(cameras[1]);
		} else {
			self.activeCameraId = cameras[0].id;
			self.scanner.start(cameras[0]);
		  }
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});
