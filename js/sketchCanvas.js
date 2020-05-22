let canvasWidth = 0;
let canvasHeight = 0;

let path;
let overlay;
let sketch = [];

let overlayColor = "#000000";
let annotationColor = "#00aaaa";

let pointData = [];
let strokeData = [];

let identifyController;


//Initialize Paper Canvas On Load
window.onload = function() {
    
    //Collect pressure and tilt data during sketching events
    // document.getElementById('sketchCanvas').addEventListener('pointerdown', function(event) {
    //     pressure = event.pressure;
    //     tiltX = event.tiltX;
    //     tiltY = event.tiltY;
        
    //     //Compute actual tilt
    //     var radianTiltX = tiltX * (Math.PI / 180);
    //     var radianTiltY = tiltY * (Math.PI / 180);
    //     var tanTiltX = Math.tan(radianTiltX);
    //     var tanTiltY = Math.tan(radianTiltY);
    //     var aziX = Math.atan(tanTiltY / tanTiltX);
    //     if (aziX != 0) {
    //          tilt = Math.abs(Math.atan(Math.sin(aziX) / tanTiltY)) * (180 / Math.PI);
    //     }
    //     else {
    //         tilt = 90;
    //     }
    // })

    //Associate Paper JS with Canvas
    var canvas = document.getElementById('sketchCanvas');

    paper.setup(canvas);
    canvasWidth = paper.view.size.width;
    canvasHeight = paper.view.size.height;

    annotation.activate();
    //generateOverlay();
    
    //Rescale function
    // paper.Raster.prototype.rescale = function(width, height) {
    //     this.scale(width / this.width, height / this.height);
    // };
}    

//Brush tools
let annotation = new paper.Tool();
let axis = new paper.Tool();
let eraser = new paper.Tool();

let pointID = 0;
//Annotation brush
annotation.onMouseDown = function(event) {
    path = new paper.Path();
    path.strokeColor = annotationColor;
    path.strokeWidth = 6
    path.strokeCap = 'round';

    //Save data
    let point = new Point(event.point.x, event.point.y, pointID);
    pointData.push(point);
    pointID++;

}

annotation.onMouseDrag = function(event) {
    path.add(event.point);

    //Save data
    let point = new Point(event.point.x, event.point.y, pointID);
    pointData.push(point);
    pointID++;
}

annotation.onMouseUp = function(event) { 
    path.smooth();
    sketch.push(path);

    //Save data
    strokeData.push(pointData);
    pointID = 0;
}

//Axis brush
axis.onMouseDown = function(event) {
    path = new paper.Path();
    path.strokeColor = annotationColor;
    path.strokeWidth = 4;
    path.dashArray = [20, 10];
}

axis.onMouseDrag = function(event) {
    path.add(event.point);
}

axis.onMouseUp = function(event) { 
    path.smooth();
    sketch.push(path);
}

//Eraser
eraser.onMouseDown = erase;
eraser.onMouseDrag = erase;


function generateOverlay() {
    var zeroPoint = new paper.Point(0,0);
    var maxPoint = new paper.Point(canvasWidth, canvasHeight);
    overlay = new paper.Path.Rectangle(zeroPoint, maxPoint);
    overlay.fillColor = overlayColor;
    overlay.opacity = 0.4;
}

function toggleOverlay() {
    if (overlayColor === "#000000") {
        overlayColor = "#ffffff";
        annotationColor = "#000000";
        overlay.fillColor = overlayColor;
    }
    else {
        overlayColor = "#000000";
        annotationColor = "#ffffff";
        overlay.fillColor = overlayColor;
    }
    
    //Update existing strokes
    for (i = 0; i < sketch.length; i++) {
        sketch[i].strokeColor = annotationColor;
    }
}

function erase(event) {

    //dataChanged = true;
    let hits = paper.project.hitTestAll(event.point, {
        segments: true,
        fill: true,
        class: paper.Path,
        tolerance: 5,
        stroke: true
    });

    if (hits.length) {
        for (var i = 0; i < hits.length; i++) {
            let hit = hits[i];
            
            hit.item.remove();
        }
    }
}

let ruler = new PlainDraggable(document.getElementById('ruler'));
let rulerRotated = 0;

function rotateRuler() {
    let rulerDOM = document.getElementById('ruler');
    let rect = rulerDOM.getBoundingClientRect();
    if (rulerRotated === 0) {
        rulerDOM.style.top = rect.top;
        rulerDOM.style.left = rect.left;
        rulerDOM.className = "rotated";
        rulerRotated = 1;
    }
    else {
        console.log('hello..?');
        rulerDOM.style.top = rect.top;
        rulerDOM.style.left = rect.left;
        rulerDOM.className = "";
        rulerRotated = 0;
    }
    ruler = new PlainDraggable(document.getElementById('ruler'));
}


