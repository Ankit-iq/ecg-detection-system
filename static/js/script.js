let chart;

function visualizeECG(){

let input = document.getElementById("ecgInput").value;

if(!input){
alert("Enter ECG signal values");
return;
}

let values = input.split(",").map(Number);

updateStats(values);

let labels = values.map((_,i)=>i);

const data = {
labels: labels,
datasets: [{
label: "ECG Signal",
data: values,
borderColor: "red",
borderWidth: 2,
pointRadius: 0,
tension: 0.2
}]
};

const config = {

type: "line",

data: data,

options: {

plugins:{legend:{labels:{color:"white"}}},

scales:{
x:{ticks:{color:"white"}},
y:{ticks:{color:"white"}}
}

}

};

if(chart){
chart.destroy();
}

let ctx = document.getElementById("ecgChart").getContext("2d");

chart = new Chart(ctx, config);

}


function updateStats(values){

document.getElementById("signalLength").innerText = values.length;

document.getElementById("maxVal").innerText =
Math.max(...values).toFixed(3);

document.getElementById("minVal").innerText =
Math.min(...values).toFixed(3);

}


function loadNormal(){

let example = Array.from({length:187},(_,i)=>Math.sin(i/10)*0.3);

document.getElementById("ecgInput").value = example.join(",");

visualizeECG();

}


function loadAbnormal(){

let example = [];

for(let i=0;i<187;i++){

let val = Math.sin(i/8)*0.4;

if(i%30===0){
val+=1.2;
}

example.push(val);

}

document.getElementById("ecgInput").value = example.join(",");

visualizeECG();

}


document.getElementById("fileInput").addEventListener("change",function(e){

let file = e.target.files[0];

let reader = new FileReader();

reader.onload = function(){

let text = reader.result.replace(/\n/g,",");

document.getElementById("ecgInput").value = text;

visualizeECG();

};

reader.readAsText(file);

});