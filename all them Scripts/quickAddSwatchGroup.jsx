#target illustrator

// A simple script to turn a series of Hexadecimal Color Codes into Illustrator Swatches 

// Tested with Illustrator CC and up


// Chanage this to false if you don't like global colors.
var globalColors = true;

var doc = app.activeDocument;

var newSGroup;

// Creates a new type object in Illustrator from the content of the clipboard
paste();

// Variable gets the content of the type object (clipboard)
var clipboardContent = app.activeDocument.selection[0].contents;

// Remove the type object from Illustrator
cut();

// Here's where all the magic happens
doTheMagic ();

function doTheMagic() {
	
	if (clipboardContent.length !== 0) {

        var myHex = clipboardContent;


        var hex = charToHex(myHex);
		
		if (hex !== null) {
        
			addSGroup();

			var lgt = hex.length;
			
			if (globalColors) {
			
				for (i = 0; i < lgt; i++) {

					var allSwatches = doc.swatches.length;
					var swName, inName, hName;
					var dup = 0;
					var dupArray = [];
					var subC = 0;

					var stg = "R=" + hexToRgb(hex[i]).red + " G=" + hexToRgb(hex[i]).green + " B=" + hexToRgb(hex[i]).blue;
							
					dup = Number(nameCheck(stg))+1;

					

					newGlobalSwatch(hexToRgb(hex[i]).red, hexToRgb(hex[i]).green, hexToRgb(hex[i]).blue, dup);

				}
			}else {

                for (i = 0; i < lgt; i++) {

                    newSwatch(hexToRgb(hex[i]).red, hexToRgb(hex[i]).green, hexToRgb(hex[i]).blue);

                }

            }
		} else {
				alert("Can't find any hexdecimal Color Codes...");
			}  
	}	
} 
        

// Making sure the new global swatch gets a unique name otherwise Illustrator would freak out
  function nameCheck(nm){
    var allSwatches = doc.swatches.length;
    var swName, inName;

    var sC = 0;
   

    for (j = 0; j < allSwatches; j++) {
						
        swName = doc.swatches[j].name;
        inName = swName.indexOf(nm);
						
        if (inName != -1) {
             var aR =swName.split(" ");
                                   
                            
             if (aR[3] > sC){
            
                sC = aR[3];
            } else {
                sC++;
                }
                        
        } 
    }
    return sC;
}     

// Extracting hex codes from a text into an array
function charToHex(ch) {

    var arr = ch.match(/([a-f\d]{6})/gi);
    return(arr);
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



// The making of a Global Swatch
function newGlobalSwatch(a, b, c, d) {

    var myRGB = new RGBColor();
    var newSpot = doc.spots.add();

    myRGB.red = a;
    myRGB.green = b;
    myRGB.blue = c;

	
	if (d === 1){
		newSpot.name = "R=" + a + " G=" + b + " B=" + c;
	}else{
        newSpot.name = "R=" + a + " G=" + b + " B=" + c + " " + d;
	}
    
    newSpot.color = myRGB;
    newSpot.colorType = ColorModel.PROCESS;

    newSGroup.addSpot(newSpot);


}

// The making of a Regular Swatch - you should use Global Swatches btw.
function newSwatch(a, b, c) {

    var myRGB = new RGBColor();
    var newS = doc.swatches.add();

    myRGB.red = a;
    myRGB.green = b;
    myRGB.blue = c;

    newSGroup.addSwatch(newS);
    newS.name = "R=" + a + " G=" + b + " B=" + c;
    newS.color = myRGB;

}

// Creating the new Swatch Group
function addSGroup(){
    
     var totalSGroups = doc.swatchGroups.length;
     newSGroup = doc.swatchGroups.add();

     newSGroup.name = "Swatch Group " + (totalSGroups);

    
}