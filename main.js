const ipAddress = document.querySelector("#ip-address");
const ipTest = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
const subnetMask = document.querySelector("#subnet-mask");
const maskBits = document.querySelector("#mask-bits");
const wildcardMask = document.querySelector("#wildcard-mask");
const vlsmRange = document.querySelector("#vlsm-range");
const maximumAddresses = document.querySelector("#maximum-addresses");
const activeForm = document.querySelectorAll(".active");

const getSubnetAddress = function() {
    let ip = ipAddress.value.split(".");
    let mask = subnetMask.value.split(".");
    let subnetAddress = ["", "", "", ""];
    for (let i = 0; i < ip.length; i++) {
        ip[i] = parseInt(ip[i]).toString(2);
        mask[i] = parseInt(mask[i]).toString(2);
    }

    for (let i = 0; i < ip.length; i++) {
        for (let j = 0; j < 8; j++) {
            if (ip[i][j] == 1 && mask[i][j] == 1) subnetAddress[i] += "1";
            else subnetAddress[i] += "0";
        }
    }

    let splitString;

    for (let i = 0; i < subnetAddress.length; i++) {
        splitString = subnetAddress[i].split("");
        splitString = splitString.reverse();
        splitString = splitString.join("");
        subnetAddress[i] = parseInt(subnetAddress[i], 2);
    }

    return subnetAddress[0] + "." + subnetAddress[1] + "." + subnetAddress[2] + "." + subnetAddress[3];
}

const getBroadcastAddress = function() {
    let mask = subnetMask.value.split(".");
    let notMask = ["", "", "", ""];
    let subnetAddress = getSubnetAddress().split(".");
    let broadcastAddress = [0, 0, 0, 0];

    for (let i = 0; i < mask.length; i++) {
        mask[i] = parseInt(mask[i]).toString(2);
    }

    for (let i = 0; i < mask.length; i++) {
        for (let j = 0; j < 8; j++) {
            if (mask[i][j] == 1) notMask[i] += 0;
            else notMask[i] += 1;
        }
    }

    for (let i = 0; i < notMask.length; i++) {
        notMask[i] = parseInt(notMask[i], 2);
        broadcastAddress[i] = parseInt(subnetAddress[i]) + notMask[i];
    }

    return broadcastAddress[0] + "." + broadcastAddress[1] + "." + broadcastAddress[2] + "." + broadcastAddress[3];
}

const changeVlsmRange = function() {
    vlsmRange.value = getSubnetAddress() + " - " + getBroadcastAddress();
}

const setSubnetMasks = function() {
    let digits = [0, 0, 0, 0];

    for (let i = 0; i < digits.length; i++) {
        let bin = "00000000";
        while (parseInt(bin, 2) !== 255) {
            bin = bin.replace("0", "1");
            let number;
            switch(i) {
                case 0: 
                    number = parseInt(bin, 2) + "." + digits[1] + "." + digits[2] + "." + digits[3];
                    break;
                case 1:
                    number = digits[0] + "." + parseInt(bin, 2) + "." +  digits[2] + "." + digits[3];
                    break;
                case 2:
                    number = digits[0] + "." + digits[1] + "." + parseInt(bin, 2) + "." + digits[3];
                    break;
                case 3: 
                    number = digits[0] + "." + digits[1] + "." + digits[2] + "." + parseInt(bin, 2);
                    break;
            }
            let newMask = document.createElement("option");
            newMask.textContent = number;
            subnetMask.appendChild(newMask);
        }
        digits[i] = 255;
    }
}

const changeSubnetMask = function(el) {
    if (el === maskBits) subnetMask.selectedIndex = el.value - 1;
    else subnetMask.selectedIndex = 32 - el.selectedIndex - 1;
    changeWildcardMask();
}

const setMaskBits = function() {
    for (let i = 1; i <= 32; i++) {
        let newMaskBit = document.createElement("option");
        newMaskBit.textContent = i;
        maskBits.appendChild(newMaskBit);
    }
}

const changeMaskBits = function() {
    maskBits.selectedIndex = subnetMask.selectedIndex;
}

const changeWildcardMask = function() {
    const subnetMaskDigits = subnetMask.value.split(".");
    let wMask = "";
    for (let i = 0; i < subnetMaskDigits.length; i++) {
        if (i !== subnetMaskDigits.length - 1) {
            wMask += (255 - subnetMaskDigits[i]) + ".";
        } else wMask += 255 - subnetMaskDigits[i];
    }
    wildcardMask.value = wMask;
}

const getMaximumAddresses = function() {
    for (let i = 0; i < 32; i++) {
        let number = document.createElement("option");
        number.textContent = Math.pow(2, i);
        maximumAddresses.appendChild(number);
    }
}

const changeMaximumAddresses = function() {
    maximumAddresses.selectedIndex = 32 - subnetMask.selectedIndex - 1;
}

ipAddress.addEventListener("change", function() {
    changeVlsmRange();
});

maskBits.addEventListener("change", function() {
    changeSubnetMask(maskBits);
    changeVlsmRange();
    changeMaximumAddresses();
});

subnetMask.addEventListener("change", function() {
    changeMaskBits();
    changeWildcardMask();
    changeVlsmRange();
    changeMaximumAddresses();
});

maximumAddresses.addEventListener("change", function() {
    changeSubnetMask(maximumAddresses);
    changeMaskBits();
    changeVlsmRange();
});

getMaximumAddresses();
setSubnetMasks();
setMaskBits();
changeWildcardMask();
getBroadcastAddress();