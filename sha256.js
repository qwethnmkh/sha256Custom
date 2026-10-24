const originalMessage = "If the earth is flat, the algorithm will fail to digest this.";
const encoder = new TextEncoder();

function hexDigit(value) {
    if (value === 0) return "0";
    if (value === 1) return "1";
    if (value === 2) return "2";
    if (value === 3) return "3";
    if (value === 4) return "4";
    if (value === 5) return "5";
    if (value === 6) return "6";
    if (value === 7) return "7";
    if (value === 8) return "8";
    if (value === 9) return "9";
    if (value === 10) return "A";
    if (value === 11) return "B";
    if (value === 12) return "C";
    if (value === 13) return "D";
    if (value === 14) return "E";
    if (value === 15) return "F";
}

function decimalToHex(decimal) {
    let firstRemainder = decimal % 16;
    let quotient = Math.floor(decimal / 16);
    let secondRemainder = quotient % 16;
    const hex = `${hexDigit(secondRemainder)}${hexDigit(firstRemainder)}`;
    return hex;
}

function hexToBinary(hex) {
    const binaryMap = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111'
    };

    return binaryMap[hex] || '0000';
}

function chunk(data, length = 512) {
    let accumulatedBits = '';
    let array = [];
    for (let i = 0; i < data.length; i++) {
        accumulatedBits += data[i];
        if (accumulatedBits.length === length) {
            array.push(accumulatedBits);
            accumulatedBits = '';
        }
    }
    if (accumulatedBits.length > 0) {
        array.push(accumulatedBits);
    }
    return array;
}

function padBits(bit, limit = 512, encodedArr) {
    if (bit.length >= limit) return bit;

    const originalLength = encodedArr.length * 8;
    let padded = bit + '1';

    while ((padded.length + 64) % limit !== 0) {
        padded += '0';
    }

    const lengthBits = originalLength.toString(2).padStart(64, '0');
    return padded + lengthBits;
}

function fractionToBinary(fraction, count) {
    let binary = '';

    for (let i = 0; i < count; i++) {
        fraction *= 2;

        if (fraction >= 1) {
            binary += '1';
            fraction -= 1;
        } else {
            binary += '0';
        }
    }

    return binary;
}

//Not the character binary, the actual binary of the representation of the calculatable number
function numberToBinary(number) {
    let binary = '';
    while (number > 0) {
        binary = (number % 2) + binary;
        number = Math.floor(number / 2);
    }
    return binary;
}

function vote(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return;
    }

    for (let c of candidates) {
        if (typeof c !== 'string') return;
        if (candidates[0].length !== c.length) return;
    }

    let result = '';

    for (let i = 0; i < candidates[0].length; i++) {
        let ones = 0;

        for (let j = 0; j < candidates.length; j++) {
            if (candidates[j][i] === '1') {
                ones++;
            }
        }

        result += ones > candidates.length / 2 ? '1' : '0';
    }

    return result;
}
    
    
function choose(e, f, g) {
    let result = '';
    e = String(e);
    f = String(f);
    g = String(g);

    for (let i = 0; i < 32; i++) {
        if (e[i] === '1') {
            result += f[i];
        } else {
            result += g[i];
        }
    }

    return result;
}

function slide(bit, positions) {
    bit = String(bit);
    let arr = bit.split('');
    for (let i = 0; i < positions; i++) {
        let first = arr.pop();
        arr.splice(0, 0, first);
    }
    return arr.join('');
}

function shiftRight(bit, positions) {
    bit = String(bit);

    return '0'.repeat(positions) + bit.slice(0, bit.length - positions);
}

function collide(bit1, bit2) {
    if (bit1.length !== bit2.length) return;
    let result = '';
    for (let i = 0; i < bit1.length; i++) {
        if (bit1[i] === bit2[i]) {
            result += '0';
        } else {
            result += '1';
        }
    }
    return result;
}

function sumBits(bit1, bit2) {
    if (bit1.length !== 32 || bit2.length !== 32) {
        throw new Error(
            `sumBits requires two 32-bit values. Got first value with ${bit1.length} and second value with ${bit2.length}`
        );
    }

    let result = '';
    let carrier = 0;

    for (let i = 31; i >= 0; i--) {
        const total =
            Number(bit1[i]) +
            Number(bit2[i]) +
            carrier;

        result = (total % 2) + result;
        carrier = Math.floor(total / 2);
    }

    // IMPORTANT:
    // The carry beyond bit 31 is discarded.
    return result;
}

function zero32() {
    return '0'.repeat(32);
}

    
function digest(message) {
    //Encoding the message
    const array = encoder.encode(message);
    let binary = '';

    //Decimal to binary
    array.forEach(item => {
        const hex = decimalToHex(item);
        let h1 = hex[0];
        let h2 = hex[1];

        binary += `${hexToBinary(h1)}${hexToBinary(h2)}`;
    })

    //Chunking
    //This is an array
    let dataChunks = chunk(binary, 512); //This variable will hold the 512 512 512 array
    
    //Padding
    if (dataChunks[dataChunks.length - 1].length < 512) {
        let lastChunk = dataChunks.pop();
        let paddedResult = padBits(lastChunk, 512, array);
        dataChunks.push(paddedResult);
    }
    
    //The cube root of the first 64 prime numbers
    const K = [Math.cbrt(2), Math.cbrt(3), Math.cbrt(5), Math.cbrt(7), Math.cbrt(11), Math.cbrt(13), Math.cbrt(17), Math.cbrt(19), Math.cbrt(23), Math.cbrt(29), Math.cbrt(31), Math.cbrt(37), Math.cbrt(41), Math.cbrt(43), Math.cbrt(47), Math.cbrt(53), Math.cbrt(59), Math.cbrt(61), Math.cbrt(67), Math.cbrt(71), Math.cbrt(73), Math.cbrt(79), Math.cbrt(83), Math.cbrt(89), Math.cbrt(97), Math.cbrt(101), Math.cbrt(103), Math.cbrt(107), Math.cbrt(109), Math.cbrt(113), Math.cbrt(127), Math.cbrt(131), Math.cbrt(137), Math.cbrt(139), Math.cbrt(149), Math.cbrt(151), Math.cbrt(157), Math.cbrt(163), Math.cbrt(167), Math.cbrt(173), Math.cbrt(179), Math.cbrt(181), Math.cbrt(191), Math.cbrt(193), Math.cbrt(197), Math.cbrt(199), Math.cbrt(211), Math.cbrt(223), Math.cbrt(227), Math.cbrt(229), Math.cbrt(233), Math.cbrt(239), Math.cbrt(241), Math.cbrt(251), Math.cbrt(257), Math.cbrt(263), Math.cbrt(269), Math.cbrt(271), Math.cbrt(277), Math.cbrt(281), Math.cbrt(283), Math.cbrt(293), Math.cbrt(307), Math.cbrt(311)];
    K.forEach((k, ind) => {
        K[ind] = fractionToBinary(k - Math.floor(k), 32);
    });
    const H = {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        G: '',
        H: '',
    }
    let bowl = zero32();
    let topBlend = zero32();
    const binG1 = []; //The group 1 recycle bin A B C D
    const binG2 = []; //The group 2 recycle bin E F G H

    // root of first eight prime numbers
    H.A = Math.sqrt(2);
    H.B = Math.sqrt(3);
    H.C = Math.sqrt(5);
    H.D = Math.sqrt(7);
    H.E = Math.sqrt(11);
    H.F = Math.sqrt(13);
    H.G = Math.sqrt(17);
    H.H = Math.sqrt(19);

    H.A = fractionToBinary(H.A - Math.floor(H.A), 32);
    H.B = fractionToBinary(H.B - Math.floor(H.B), 32);
    H.C = fractionToBinary(H.C - Math.floor(H.C), 32);
    H.D = fractionToBinary(H.D - Math.floor(H.D), 32);
    H.E = fractionToBinary(H.E - Math.floor(H.E), 32);
    H.F = fractionToBinary(H.F - Math.floor(H.F), 32);
    H.G = fractionToBinary(H.G - Math.floor(H.G), 32);
    H.H = fractionToBinary(H.H - Math.floor(H.H), 32);

    
    
    dataChunks.forEach((ch, ind) => {
        let round = 0; // The digestion round
        let W = chunk(ch, 32); // The array of the 16 pieces of the words.

        function check32(name, value) {
            if (typeof value !== 'string' || value.length !== 32) {
                throw new Error(
                    `${name} is NOT 32 bits. Value: ${value} | length: ${
                        typeof value === 'string' ? value.length : 'not a string'
                    }`
                );
            }
        }

        for (let i = 0; i < 16; i++) {
            let p = W[i];
            check32(`W[${i}]`, p);

            bowl = sumBits(String(bowl), String(p));
            check32(`bowl after W[${i}]`, bowl);
            bowl = sumBits(String(bowl), String(H.H));
            check32(`bowl after H.H at ${i}`, bowl);
            bowl = sumBits(String(bowl), String(choose(H.E, H.F, H.G)));
            check32(`bowl after choose(E,F,G) at ${i}`, bowl);
            bowl = sumBits(String(bowl), String(K[i]));
            check32(`bowl after K[${i}]`, bowl);

            let r1 = slide(H.E, 6);
            let r2 = slide(H.E, 11);
            let r3 = slide(H.E, 25);
            let sigma1 = collide(collide(r1, r2), r3);
            check32(`sigma1 at ${i}`, sigma1);
            bowl = sumBits(String(bowl), sigma1);
            check32(`bowl after sigma1 at ${i}`, bowl);

            let sl1 = slide(H.A, 2);
            let sl2 = slide(H.A, 13);
            let sl3 = slide(H.A, 22);
            let spunA = collide(collide(sl1, sl2), sl3);
            check32(`spunA at ${i}`, spunA);
            let majority = vote([H.A, H.B, H.C]);
            check32(`majority at ${i}`, majority);
            topBlend = sumBits(String(spunA), String(majority));
            check32(`topBlend at ${i}`, topBlend);

            binG1.push(H.D);
            check32(`binG1 latest at ${i}`, binG1[binG1.length - 1]);

            H.D = H.C;
            H.C = H.B;
            H.B = H.A;
            H.A = sumBits(String(topBlend), String(bowl));
            check32(`H.A at ${i}`, H.A);

            H.H = H.G;
            H.G = H.F;
            H.F = H.E;
            H.E = sumBits(String(binG1.pop()), String(bowl));
            check32(`H.E at ${i}`, H.E);

            bowl = zero32();
            topBlend = zero32();
            binG1.length = 0;
            binG2.length = 0;
            round++;
        }

        for (let i = 16; i < 64; i++) {
            let firstCopy = '';
            let secondCopy = '';
            let thirdCopy = '';

            let twoStepsBack = W[i - 2];
            check32(`W[${i - 2}]`, twoStepsBack);
            firstCopy = slide(twoStepsBack, 17);
            check32(`sigma1 ROTR17 at ${i}`, firstCopy);
            secondCopy = slide(twoStepsBack, 19);
            check32(`sigma1 ROTR19 at ${i}`, secondCopy);
            thirdCopy = shiftRight(twoStepsBack, 10);
            check32(`sigma1 SHR10 at ${i}`, thirdCopy);
            let sigma1 = collide(collide(firstCopy, secondCopy), thirdCopy);
            check32(`sigma1 at ${i}`, sigma1);

            let fifteenStepsBack = W[i - 15];
            check32(`W[${i - 15}]`, fifteenStepsBack);
            firstCopy = slide(fifteenStepsBack, 7);
            check32(`sigma0 ROTR7 at ${i}`, firstCopy);
            secondCopy = slide(fifteenStepsBack, 18);
            check32(`sigma0 ROTR18 at ${i}`, secondCopy);
            thirdCopy = shiftRight(fifteenStepsBack, 3);
            check32(`sigma0 SHR3 at ${i}`, thirdCopy);
            let sigma0 = collide(collide(firstCopy, secondCopy), thirdCopy);
            check32(`sigma0 at ${i}`, sigma0);

            let sevenStepsBack = W[i - 7];
            check32(`W[${i - 7}]`, sevenStepsBack);
            let sixteenStepsBack = W[i - 16];
            check32(`W[${i - 16}]`, sixteenStepsBack);

            let newWord = sumBits(sumBits(sigma1, sevenStepsBack), sumBits(sigma0, sixteenStepsBack));
            check32(`W[${i}]`, newWord);
            W.push(newWord);

            bowl = sumBits(String(bowl), String(W[i]));
            check32(`bowl after W[${i}] at expansion`, bowl);
            bowl = sumBits(String(bowl), String(H.H));
            check32(`bowl after H.H at expansion ${i}`, bowl);
            bowl = sumBits(String(bowl), String(choose(H.E, H.F, H.G)));
            check32(`bowl after choose(E,F,G) at expansion ${i}`, bowl);
            bowl = sumBits(String(bowl), String(K[i]));
            check32(`bowl after K[${i}] at expansion`, bowl);

            let r1 = slide(H.E, 6);
            let r2 = slide(H.E, 11);
            let r3 = slide(H.E, 25);
            let sigmaFirst = collide(collide(r1, r2), r3);
            check32(`sigmaFirst at ${i}`, sigmaFirst);
            bowl = sumBits(String(bowl), sigmaFirst);
            check32(`bowl after sigmaFirst at ${i}`, bowl);

            let sl1 = slide(H.A, 2);
            let sl2 = slide(H.A, 13);
            let sl3 = slide(H.A, 22);
            let spunA = collide(collide(sl1, sl2), sl3);
            check32(`spunA at expansion ${i}`, spunA);
            let majority = vote([H.A, H.B, H.C]);
            check32(`majority at expansion ${i}`, majority);
            topBlend = sumBits(String(spunA), String(majority));
            check32(`topBlend at expansion ${i}`, topBlend);

            binG1.push(H.D);
            check32(`binG1 latest at expansion ${i}`, binG1[binG1.length - 1]);

            H.D = H.C;
            H.C = H.B;
            H.B = H.A;
            H.A = sumBits(String(topBlend), String(bowl));
            check32(`H.A at expansion ${i}`, H.A);

            H.H = H.G;
            H.G = H.F;
            H.F = H.E;
            H.E = sumBits(String(binG1.pop()), String(bowl));
            check32(`H.E at expansion ${i}`, H.E);

            bowl = zero32();
            topBlend = zero32();
            binG1.length = 0;
            binG2.length = 0;
            round++;
        }
    });
    return `${H.A}${H.B}${H.C}${H.D}${H.E}${H.F}${H.G}${H.H}`; // The final hash value 256 bits
}

console.log(digest(originalMessage));


module.exports = { digest }
