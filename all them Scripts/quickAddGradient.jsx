#target illustrator

// This script was primarily written to work with the Gradient Generator by Learn UI Design
// https://www.learnui.design/tools/gradient-generator.html

// Design your gradient on the website, copy the CSS to the clipboard then run this script
// The script omits the angle of the gradient specified on the site, you have to set it in Illustrator

// Select and copy a series of hexadecimal codes, then run this script to create a new Gradient from the selected color codes.

// Tested with Illustrator CC and up

var doc = app.activeDocument;

// Creates a new type object in Illustrator from the content of the clipboard
paste();

// Variable gets the content of the type object (clipboard)
var clipboardContent = app.activeDocument.selection[0].contents;

// Remove the type object from Illustrator
cut();

// Here's where all the magic happens
doTheMagic();

function doTheMagic() {

    if (clipboardContent.length !== 0) {

        var hexCodes = charToHex(clipboardContent);

        if (hexCodes !== null) {

            var hexCount = hexCodes.length;
			var gradientName = "Cool Gradient";
            
            var coolGradients = nameCheck(gradientName);
			var newGradient;
			newGradient = doc.gradients.add();
			newGradient.type = GradientType.LINEAR;
			
			if (coolGradients > 0) {
                
				newGradient.name = gradientName + " " + coolGradients;
			
			} else {
			
				newGradient.name = gradientName;
				
			}
			
			var clr = new RGBColor();

			for (i = 0; i < hexCount; i++) {
				
				clr.red = hexToRgb(hexCodes[i]).red;
				clr.green = hexToRgb(hexCodes[i]).green;
				clr.blue =hexToRgb(hexCodes[i]).blue;

				if (i === 0) {

					newGradient.gradientStops[0].color = clr;
					newGradient.gradientStops[0].rampPoint = 0;
					newGradient.gradientStops[0].midPoint = 50;
					
				} else if (i === (hexCount - 1)) {

					newGradient.gradientStops[hexCount - 1].color = clr;
					newGradient.gradientStops[hexCount - 1].rampPoint = 100;
					newGradient.gradientStops[hexCount - 1].midPoint = 50;
					
				} else {

					stop = newGradient.gradientStops.add();
					stop.color = clr;
					newGradient.gradientStops[i].rampPoint = ((i / (hexCount - 1)) * 100);
					newGradient.gradientStops[i].midPoint = 50;
					
				}
			}
        } else {
            alert("Can't find any hexdecimal Color Codes...");
        }  
    }
}

// Making sure the new gradient gets a unique name otherwise Illustrator would freak out
function nameCheck(nm){

    var allGradients = doc.gradients.length;
    var grName, inName;
    var sC = 0; 

    for (j = 0; j < allGradients; j++) {
						
        grName = doc.gradients[j].name;
        inName = grName.indexOf(nm);
						
        if (inName != -1) {
             var aR = grName.split(" ");
             var numero = Number(aR[2]);                      
                         
             if (numero > sC){ 
                sC = numero;
            }                         
        } 
    }
    sC++;
    return sC;
}         

// Extracting hex codes from a text into an array
function charToHex(ch) {

    var arr = ch.match(/([a-f\d]{6})/gi);
	return arr;

}

// Hex code goes in, RGB values come out
function hexToRgb(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } : null;
}

