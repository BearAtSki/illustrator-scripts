#target illustrator

// A simple script to turn a series of Hexadecimal Color Codes into Illustrator Swatch Groups

// Tested with Illustrator CC and up

var globalColors = true;

var doc = app.activeDocument;

var newSGroup;

var numOfColors = 1;

var numOfDuplicates = 0;


// Creating the Dialog Panel
var dlg = new Window("dialog{text:'Swatch Group from HEX Codes'}");

myDlg();

function myDlg() {

    dlg.panel1 = dlg.add('panel', undefined, 'Description');
    dlg.panel1.alignChildren = ['Left', 'Top'];
    dlg.panel1.orientation = 'column';

    var line1 = "\nMake RGB Swatch Groups from Hex Colors!";
    var line2 = 'Separate Them with Any Punctuation Mark or Symbol. \n(Like these: - * . , : ; # \'space\' etc.)';

    dlg.panel1.msgS1 = dlg.panel1.add('statictext', undefined, line1, {
        multiline: true
    });
    dlg.panel1.msgS2 = dlg.panel1.add('statictext', undefined, line2, {
        multiline: true
    });
    dlg.panel1.msgS1.size = [300, 30];
    dlg.panel1.msgS2.size = [300, 30];

    dlg.panel2 = dlg.add('panel', undefined, 'Your Hex Code');
    dlg.panel2.orientation = 'row:fill';

    dlg.panel2.msgH = dlg.panel2.add('edittext {properties: {multiline: true}}', undefined, '');
    dlg.panel2.msgH.size = [300, 20];

    dlg.alignChildren = ['Center', 'Top'];
    dlg.group1 = dlg.add('group');
    dlg.group1.orientation = 'row';
    dlg.group1.c1 = dlg.group1.add('checkbox', undefined, "Make 'em Global");
    dlg.group1.c1.value = globalColors;

    dlg.group2 = dlg.add('group');
    dlg.group2.orientation = 'row';

    dlg.group2.btnOK = dlg.group2.add('button', undefined, 'Ok');
    dlg.group2.btnOK.onClick = function() {
        dlg.close();
        funcOk(dlg.group1.c1.value)
    };

    dlg.group2.btnCANCEL = dlg.group2.add('button', undefined, 'Cancel', {
        name: 'cancel'
    });


    dlg.show();

}


// After clicking OK, the magic begins
function funcOk(bool) {


    if (dlg.panel2.msgH.text.length !== 0) {

        var myHex = dlg.panel2.msgH.text;

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
