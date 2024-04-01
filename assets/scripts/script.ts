// Custom helper to convert any place of the image to HEX color.
const rgbToHex = (data: Uint8ClampedArray): string => {
    const colorToHex = (color: number): string => {
        const hex = color.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    return "#" + colorToHex(data[0]) + colorToHex(data[1]) + colorToHex(data[2]);
}

// Initialization of elements.
const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D | null;
const toggle = document.getElementById('toggle') as HTMLButtonElement | null;
const editor = document.getElementById('editor') as HTMLDivElement | null;
const picker = document.getElementById('picker') as HTMLDivElement | null;
const color = document.getElementById('color') as HTMLParagraphElement | null;
const activeColor = document.getElementById('active-color') as HTMLParagraphElement | null;
const zoomCanvas = document.getElementById('zoom-canvas') as HTMLCanvasElement | null;

// Variables for using.
const imgPath: string = 'assets/images/BG.jpg';
let active: boolean = false;
let mouseX: number = canvas ? canvas.width / 2 : 0;
let mouseY: number = canvas ? canvas.height / 2 : 0;
let zoomSize: number = 50;

// We draw an image, with the optimal size for any size of the image.
const drawImage = (img: HTMLImageElement) => {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    const x = (canvas.width - newWidth) / 2;
    const y = (canvas.height - newHeight) / 2;
    ctx.drawImage(img, x, y, newWidth, newHeight);
}

// Initialization of iamge.
const initialize = () => {
    const BG = new Image();
    BG.src = imgPath;
    BG.onload = () => {
        drawImage(BG)
    }
}

initialize();

// Hiding a picker after selecting any place of canvas or toggling on the button.
const hidePicker = () => {
    if (!picker) return;

    picker.style.opacity = '0';
    picker.style.visibility = 'hidden';
    active = false;
    document.removeEventListener('mousemove', handleMouseMove);
}

// Showing a picker by clicking on the button.
const showPicker = () => {
    if (!picker) return;

    picker.style.opacity = '1';
    picker.style.visibility = 'visible';
    active = true;
    document.addEventListener('mousemove', handleMouseMove);
}

// Calculating a correct centered positioning for the picker on mouse move.
const calculatePickerPosition = () => {
    if (!picker || !canvas) return;

    const pickerWidth = picker.offsetWidth, pickerHeight = picker.offsetHeight;
    const canvasWidth = canvas.width, canvasHeight = canvas.height;
    const mouseXCentered = Math.max(Math.min(mouseX - pickerWidth / 2, canvasWidth - pickerWidth), 0);
    const mouseYCentered = Math.max(Math.min(mouseY - pickerHeight / 2, canvasHeight - pickerHeight), 0);

    picker.style.left = mouseXCentered + 'px';
    picker.style.top = mouseYCentered + 'px';
}

// Zooming any place of mouse move to see which place needs to be picked.
const zoomPicker = () => {
    const zoomCtx = zoomCanvas?.getContext('2d');

    if (!zoomCanvas || !canvas || !zoomCtx) return;

    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.drawImage(
        canvas,
        mouseX - zoomSize / 2,
        mouseY - zoomSize / 2,
        zoomSize,
        zoomSize,
        0, 0,
        zoomCanvas.width,
        zoomCanvas.height
    );
}

// Implementation of mouse move.
const handleMouseMove = (event: MouseEvent) => {
    if (!canvas || !activeColor || !picker) return;
    
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    const imageData = ctx.getImageData(mouseX, mouseY, 1, 1);
    const hex = rgbToHex(imageData.data);

    activeColor.innerText = hex;
    picker.style.setProperty("--fill-color", hex);

    calculatePickerPosition()
    zoomPicker()
}

// Setting selected color.
const handleSetColor = () => {
    if (activeColor?.innerText && active && color) {
        color.innerText = activeColor.innerText;
        color.style.setProperty("--preview-color", activeColor.innerText);
        hidePicker();
    }
}

// Toggling of color picker.
toggle?.addEventListener('click', () => active ? hidePicker() : showPicker())

// Handling selecting color.
picker?.addEventListener('click', handleSetColor);
