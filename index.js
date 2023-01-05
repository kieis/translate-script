const fs = require('fs');
const TranslateTools = require('@translate-tools/core/translators/GoogleTranslator');

const translator = new TranslateTools.GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

//read file into array
let arrayFile = fs.readFileSync('./file.txt').toString().split("\n");

const searchContents = async (charStart, charEnd, file = arrayFile) => {
    const paramsFound = [];
    let currentObject = {
        start: null,
        end: null
    };

    function pushAndReset() {
        if(currentObject.start && currentObject.end) {
            paramsFound.push(currentObject);
            currentObject = {
                start: null,
                end: null,
            };
        }
    }

    for(i in file) {
        const currentLine = file[i];
        pushAndReset();

        if(!currentObject.start && !currentObject.end) {
            let start = currentLine.indexOf(charStart);
            if(start > 0) {
                currentObject.start = {
                    line: i,
                    index: start + charStart.length,
                };
                let end = currentLine.indexOf(charEnd); //, start + charStart.length
                if(end > 0) {
                    currentObject.end = {
                        line: i,
                        index: end,
                    };
                    pushAndReset();
                } else {
                    //search in next line
                    let endNext = file[i+1]?.indexOf(charEnd);
                    if(endNext > 0) {
                        currentObject.end = {
                            line: i,
                            index: end,
                        };
                        pushAndReset();
                    }
                }
            }
        }

        if(currentObject.start && !currentObject.end) {
            let end = currentLine.indexOf(charEnd); //, currentObject.start.index + charStart.length
            if(end > 0) {
                currentObject.end = {
                    line: i,
                    index: end,
                };
                pushAndReset();
            }
        }
    }

    return paramsFound;
}

const transformText = async (arrayContents) => {
    const from = 'zh-tw';
    const to = 'pt';

    for(i in arrayContents) {
        const current = arrayContents[i];
        //limits
        if(current.start.line === current.end.line) {
            const text = arrayFile[current.start.line].slice(current.start.index, current.end.index);
            let translated = text;
            try {
                translated = await translator.translate(text, from, to);
            }catch(e) {
                console.log(e)
            }

            //replace on file
            arrayFile[current.start.line] = 
            arrayFile[current.start.line].substring(0, current.start.index) + 
            translated + 
            arrayFile[current.start.line].substring(current.end.index, arrayFile[current.start.line].length);

            //log
            console.log(arrayFile[current.start.line]);
        }else {
            //if the sentence are in another line, needs a better solution, for while just translating and printing
            const text = arrayFile[current.start.line].slice(current.start.index, arrayFile[current.start.line].length) + arrayFile[current.end.line].slice(0, current.end.index);
            const translated = await translator.translate(text, from, to);
            console.log(translated);
        }   
    }

    console.log('Writing...')

    //write
    const file = fs.createWriteStream('translated.txt');
    file.on('error', function(err) { /* error handling */ });
    arrayFile.forEach(function(v) { file.write(v + '\n'); });
    file.end();
}

async function run() {
    //enter start and end parameter
    transformText(await searchContents(
        `/>`, 
        `</td>`
    ));
}

run();