/* 
* Yanika telus
* Project 1
* ISTE 340  
*/
const choiceData = selectInfo.choices;// is the name of the array in ChoiceData.js"choices":[]
const dataLength = Object.keys(choiceData).length;
var updatedDepth;
var selectedChoices = new Array();
var sourceArray = new Array();
var selectednum;
var video = document.getElementById('myVideo');

const selectDiv = document.createElement("div");
selectDiv.id = "selectDiv";
document.body.append(selectDiv);

const buttonsDiv = document.createElement("div");
buttonsDiv.id = "buttonsDiv";
document.body.append(buttonsDiv);

createRestartButton();
getLocalStorage();
createSelectElement("Main");

function createSelectElement(dataKey) {
    for (var i = 0; i < dataLength; i++) {
        // If choice does not match key, skip this data point
        if (choiceData[i].key != dataKey)
            continue;

        /* ADDS BACKGROUND VIDEO ELEMENTS THAT CHANGE AS CLICKED ON */
        addRemoveVideo(i);
        selectednum = i;
        // Creates a header to label the specific select menu
        var h2 = document.createElement('h2');
        var textNode = document.createTextNode(choiceData[i].description);
        h2.className = choiceData[i].depth;
        h2.appendChild(textNode);
        selectDiv.appendChild(h2);
        updatedDepth = choiceData[i].depth;

        // Creates the select list element
        var selectList = document.createElement('select');
        selectList.id = choiceData[i].key;
        selectList.name = choiceData[i].description;
        selectList.className = choiceData[i].depth;
        selectDiv.appendChild(selectList);

        // Creates null Select option
        var nullOption = document.createElement('option');
        nullOption.text = "Select an Option";
        nullOption.selected = this;
        nullOption.disabled = true;
        selectList.appendChild(nullOption);                

        // Creates option 1
        var newOption1 = document.createElement('option');
        newOption1.value = choiceData[i].option_1;
        newOption1.text = choiceData[i].option_1;
        selectList.appendChild(newOption1);

        // Creates option 2
        var newOption2 = document.createElement('option');
        newOption2.value = choiceData[i].option_2;
        newOption2.text = choiceData[i].option_2;
        selectList.appendChild(newOption2);

        // Creates option 3 if there is one 
        if( choiceData[i].option_3 !==  undefined) {
            var newOption3 = document.createElement('option');
            newOption3.value = choiceData[i].option_3;
            newOption3.text = choiceData[i].option_3;
            selectList.appendChild(newOption3);
        }
        // Hooks up an event to reload the choices whenever the select value is changed
        //figure out if you need to remove any select list or add any select list
        selectList.addEventListener("change", function () {
            var selectedValue = this.options[this.options.selectedIndex].value;

            if (video.hasAttribute("controls")) {
                video.removeAttribute("controls");   
            }
            video.muted = true;

            if (isLastSibling(this) === false) {
                //if this element is not last sibling remove it and update list
                removeSelectList(selectedValue,this);
                selectedChoices.length = updatedDepth-1;
                selectedChoices.push(selectedValue+" ");
            } else {
                //if equal then this is the last element in depth
                if(getHighestDepth() === updatedDepth){
                    selectedChoices.push(" "+selectedValue+" ");
                    console.log(selectedChoices);
                    displayResults(selectednum, selectedValue);
                }else{
                    selectedChoices.push(" "+selectedValue+" ");
                    console.log(selectedChoices);
                    createSelectElement(selectedValue);
                }

            }
        });//end of event listener
    }//end of for loop
}//end of CREATESELECTELEMENT

/*
 * Returns Boolean 
 * @param {String} currentNode 
 * checks if current Node is last sibling
 */
function isLastSibling(currentNode) {
    return currentNode === currentNode.parentNode.querySelector(currentNode.nodeName + ':last-of-type');
}

/* 
 * @param {String} currentNode 
 * Add restart button to Top right side of page
 */
function createRestartButton(){
    //creating title of page
    const h1 = document.createElement('h1');
    var h1TM = document.createTextNode("STREAM SELECTOR");
    h1.className = "tittle";
    h1.appendChild(h1TM);
    selectDiv.appendChild(h1);

    // creating restart button 
    var restart = document.createElement('BUTTON');
    restart.textContent =' RESTART';
    restart.onclick = function(){
        window.location.reload();
    }
    buttonsDiv.appendChild(restart);

    //creating Name inptu to save content
    const label = document.createElement('label');
    const text = document.createTextNode('Enter Name: ');
    label.id = 'label';
    label.appendChild(text);
    var nameInput = document.createElement('input');
    nameInput.type = "text";
    nameInput.id = 'nameInput';
    nameInput.className = 'input_name';
    buttonsDiv.append(label,nameInput);
    //save name on enter
    nameInput.addEventListener("keypress", function (e) {
        if (e.key === 'Enter') {
            localStorage.setItem('fname', document.getElementById('nameInput').value);
        }
    });
}

/*
 * @param {String} changedValue selected option value 
 * @param {String} thisCurrentNode current node that was selected
 * Removes all select list under the current node
 */
function removeSelectList(changedValue, thisCurrentNode) {
    console.log('remove select lists');
    var bool = isLastSibling(thisCurrentNode);

    var element = document.getElementById('choicesLine');
    if (element !== null){
        element.parentNode.removeChild(element);
    }
    //removes node until last node of type
    while(!bool) {
        thisCurrentNode.parentNode.removeChild(thisCurrentNode.nextSibling)
        console.log('this is NOT the last element', bool);
        bool = isLastSibling(thisCurrentNode);
    }
    createSelectElement(changedValue);
}

 /*
  * @param {Int} num the positon in keys
  * adds and removes background video for each option
  * Extra POINTS
  */
function addRemoveVideo(num) {
    //check to see if scr is availible
    if (choiceData[num].src !==  undefined) {
        var prevSource = document.getElementById('sourceid');
        if (prevSource !== null) {
            prevSource.parentNode.removeChild(prevSource);
        }
        var source = document.createElement('source');
        source.id = "sourceid";
        video.appendChild(source);
        var newSource = document.getElementById('sourceid');
        newSource.setAttribute('src', ('images/'+choiceData[num].src));
        video.load();
    }
}
/*
  * @param {Int} n the positon in keys
  * @param {String} selected option calue
  * update the video to final choice and display line of selected choices
 */
function displayResults(n, selectedValue) {
    if (choiceData[n].src !==  undefined) {
        fullString = choiceData[n].src;
        sourceArray = fullString.split(",");
        var sourceArrayLength = sourceArray.length-1;
        for(var int = 0; int <= sourceArrayLength; int++){
            if( sourceArray[int]===(selectedValue+'.mp4')){

                var prevSource = document.getElementById('sourceid');
                if (prevSource !== null) {
                    prevSource.parentNode.removeChild(prevSource);
                }
                var source = document.createElement('source');
                source.id = "sourceid";
                video.appendChild(source);
                var newSource = document.getElementById('sourceid');
                newSource.setAttribute('src', ('images/'+sourceArray[int]));
                video.load();
                video.setAttribute("controls","controls");
                video.muted = !video.muted;
            }
        }
    }
    var exist = document.getElementById('choicesLine');
    if (exist !== null){
        exist.parentNode.removeChild(exist);
        selectedChoices.length = updatedDepth;
        selectedChoices.push(" "+selectedValue+" ");
    }
    const choices = document.createElement('h3');
    var resultTextNode = document.createTextNode("YOU SELECTED: " + selectedChoices);
    choices.id = "choicesLine";
    choices.appendChild(resultTextNode);
    selectDiv.appendChild(choices);
    saveYourChoice(selectedChoices);
}

/*
 * returns choice data's depth
 * getting depths and adding to array
 */
function getHighestDepth(){
    var depthArr = new Array();
    for (var i = 0; i < dataLength; i++) {
        depthArr[i] = choiceData[i].depth;
    }
    //sort array incase data isn't already sorted
    depthArr.sort(function(a, b){return a - b});
    const num = (depthArr.length-1);
    return choiceData[num].depth;
}
/*
 *  Setter
 *  Sets local storage
 */
function saveYourChoice(list) {
        localStorage.setItem('choice', list);
}
/*
 * Getter
 * Gets Local Storage Name and choices
 */
function getLocalStorage(){
    var name = localStorage.getItem('fname');
    var lastChoices = localStorage.getItem('choice');
    if (name !== null){
        alert("Welcome back "+name+"!"+ "\n "+ "Your last Choices:  "+ lastChoices);
    }
}