<h1 align="center">JS Editor</h1></br>

## HOW TO RUN?

### For VS Code
You can run by extension live-server.

### For PhpStorm or WebStorm

Right-click on **index.html** file.
Select "Run" or "Debug" to run the file.

### Using Node.js
If you don't have already installed http-server
```gradle
npm install -g http-server
```
Next open the terminal inside the root of the project and run
```gradle
http-server
```

## Usage

You can change the default image inside the already compiled script.js file.
The default image is
```gradle
 var imgPath = 'assets/images/BG.jpg'
```
You can change it to BG1, BG2, BG3, BG4 for testing;

## If you want to work in script.ts file! 
If you don't have already installed typescript in your local machine do

```gradle
npm i -g typescript
```

- Some changes in script.ts file
- ```gradle
  tsc assets/scripts/script.ts
  ```
