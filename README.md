# translate-script
Script to assist in translating files.

## Example
Translated from chinese to portuguese.

Input:
```
<ul>
  <li>咖啡</li>
  <li>茶</li>
  <li>牛奶</li>
  <li>但我必须向你解释，这一切斥乐颂苦的错误思想是如何产生的，我要给你一个完整的系统说明，阐述真理的伟大探索者、人类世界的缔造者的实际教导。幸福。没有人拒绝、不喜欢或避免快乐本身，因为它就是快乐.</li>
</ul>
```
Output:
```
<ul>
  <li>café</li>
  <li>Chá</li>
  <li>leite</li>
  <li>Mas eu tenho que explicar como os pensamentos errados do sofrimento de Jie Song são surgidos. Quero lhe dar uma explicação completa do sistema para explicar o ensino real do grande explorador da verdade e do fundador do mundo humano. felicidade. Ninguém se recusa, não gosta ou evita a própria felicidade, porque é felicidade.</li>
</ul>
```


### Language Tags
https://github.com/matheuss/google-translate-api/blob/master/languages.js

### Usage
After cloning the project, copy the content of the file you want to translate and paste it in file.txt.

Run project with node, and an output file(translated.txt) will be generated:
```
npm install
node index.js
```

To change search params, edit params from function searchContents:
#### Example:
```
transformText(await searchContents(`<li>`, `</li>`));
```

To change translated languages, edit 'from' and 'to' inside of function transformText:
#### Example:
```
const from = 'zh-tw'; //chinese
const to = 'pt'; //portuguese
```
