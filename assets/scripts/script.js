// Custom helper to convert any place of the image to HEX color.
var rgbToHex = function (data) {
    var colorToHex = function (color) {
        var hex = color.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + colorToHex(data[0]) + colorToHex(data[1]) + colorToHex(data[2]);
};
// Initialization of elements.
var canvas = document.getElementById('canvas');
var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
var toggle = document.getElementById('toggle');
var editor = document.getElementById('editor');
var picker = document.getElementById('picker');
var color = document.getElementById('color');
var activeColor = document.getElementById('active-color');
var zoomCanvas = document.getElementById('zoom-canvas');
// Variables for using.
var imgPath = 'assets/images/BG.jpg';
var active = false;
var mouseX = canvas ? canvas.width / 2 : 0;
var mouseY = canvas ? canvas.height / 2 : 0;
var zoomSize = 50;
// We draw an image, with the optimal size for any size of the image.
var drawImage = function (img) {
    if (!ctx || !canvas)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    var newWidth = img.width * scale;
    var newHeight = img.height * scale;
    var x = (canvas.width - newWidth) / 2;
    var y = (canvas.height - newHeight) / 2;
    ctx.drawImage(img, x, y, newWidth, newHeight);
};
// Initialization of iamge.
var initialize = function () {
    var BG = new Image();
    BG.src = imgPath;
    BG.onload = function () {
        drawImage(BG);
    };
};
initialize();
// Hiding a picker after selecting any place of canvas or toggling on the button.
var hidePicker = function () {
    if (!picker)
        return;
    picker.style.opacity = '0';
    picker.style.visibility = 'hidden';
    active = false;
    document.removeEventListener('mousemove', handleMouseMove);
};
// Showing a picker by clicking on the button.
var showPicker = function () {
    if (!picker)
        return;
    picker.style.opacity = '1';
    picker.style.visibility = 'visible';
    active = true;
    document.addEventListener('mousemove', handleMouseMove);
};
// Calculating a correct centered positioning for the picker on mouse move.
var calculatePickerPosition = function () {
    if (!picker || !canvas)
        return;
    var pickerWidth = picker.offsetWidth, pickerHeight = picker.offsetHeight;
    var canvasWidth = canvas.width, canvasHeight = canvas.height;
    var mouseXCentered = Math.max(Math.min(mouseX - pickerWidth / 2, canvasWidth - pickerWidth), 0);
    var mouseYCentered = Math.max(Math.min(mouseY - pickerHeight / 2, canvasHeight - pickerHeight), 0);
    picker.style.left = mouseXCentered + 'px';
    picker.style.top = mouseYCentered + 'px';
};
// Zooming any place of mouse move to see which place needs to be picked.
var zoomPicker = function () {
    var zoomCtx = zoomCanvas === null || zoomCanvas === void 0 ? void 0 : zoomCanvas.getContext('2d');
    if (!zoomCanvas || !canvas || !zoomCtx)
        return;
    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.drawImage(canvas, mouseX - zoomSize / 2, mouseY - zoomSize / 2, zoomSize, zoomSize, 0, 0, zoomCanvas.width, zoomCanvas.height);
};
// Implementation of mouse move.
var handleMouseMove = function (event) {
    if (!canvas || !activeColor || !picker)
        return;
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    var imageData = ctx.getImageData(mouseX, mouseY, 1, 1);
    var hex = rgbToHex(imageData.data);
    activeColor.innerText = hex;
    picker.style.setProperty("--fill-color", hex);
    calculatePickerPosition();
    zoomPicker();
};
// Setting selected color.
var handleSetColor = function () {
    if ((activeColor === null || activeColor === void 0 ? void 0 : activeColor.innerText) && active && color) {
        color.innerText = activeColor.innerText;
        color.style.setProperty("--preview-color", activeColor.innerText);
        hidePicker();
    }
};
// Toggling of color picker.
toggle === null || toggle === void 0 ? void 0 : toggle.addEventListener('click', function () { return active ? hidePicker() : showPicker(); });
// Handling selecting color.
picker === null || picker === void 0 ? void 0 : picker.addEventListener('click', handleSetColor);
