import {Puzzle, PuzzleReturn} from "./common";

export interface Packet {
    version: number
    typeId: number
    value: number
    subPackets: Packet[]
}

type BinaryOp = string

// https://stackoverflow.com/questions/45053624/convert-hex-to-binary-in-javascript
export function convertHexCharToBinary(hex: string): string {
    return (parseInt(hex, 16).toString(2)).padStart(4, '0');
}

export function convertToBinary(input: string): BinaryOp {
    let retVal: BinaryOp = ""

    for (const char of input) {
        retVal += convertHexCharToBinary(char)
    }
    return retVal
}

export function sumVersions(p: Packet): number {
    let subTotal = 0
    for (const sp of p.subPackets) {
        subTotal += sumVersions(sp)
    }

    return subTotal + p.version
}

export function evaluateVersions(p: Packet): number {
    let subTotal = 0

    switch (p.typeId) {
        case 0:
            for (const sp of p.subPackets) {
                subTotal += evaluateVersions(sp)
            }
            break;
        case 1:
            subTotal = 1
            for (const sp of p.subPackets) {
                subTotal *= evaluateVersions(sp)
            }
            break;
        case 2:
            subTotal = Math.min(...p.subPackets.map(sp => evaluateVersions(sp)))
            break;
        case 3:
            subTotal = Math.max(...p.subPackets.map(sp => evaluateVersions(sp)))
            break;
        case 4:
            subTotal = p.value;
            break;
        case 5:
            subTotal = evaluateVersions(p.subPackets[0]) > evaluateVersions(p.subPackets[1])
                ? 1 : 0;
            break;
        case 6:
            subTotal = evaluateVersions(p.subPackets[0]) < evaluateVersions(p.subPackets[1])
                ? 1 : 0;
            break;
        case 7:
            subTotal = evaluateVersions(p.subPackets[0]) === evaluateVersions(p.subPackets[1])
                ? 1 : 0;
            break;
    }

    return subTotal
}

export function readPacket(inputBinary: BinaryOp): [Packet, string] {
    const versionString = inputBinary.substring(0, 3)
    const typeIdString = inputBinary.substring(3, 6)
    const version = parseInt(versionString, 2)
    const typeId = parseInt(typeIdString, 2)

    let remainPacket = inputBinary.substring(6)

    if (typeId === 4) {
        let endSignal = false
        let digit = ""
        while (!endSignal) {
            const group = remainPacket.substring(0, 5)

            if (group[0] === "0") {
                endSignal = true
            }
            digit += group.substring(1, 5)

            remainPacket = remainPacket.substring(5)
        }
        return [{version, typeId, value: parseInt(digit, 2), subPackets: []}, remainPacket]
    } else {
        let packets: Packet[] = [];

        const lengthType = remainPacket[0]

        if (lengthType === "0") {
            const length = remainPacket.substring(1, 16)
            const len = parseInt(length, 2)
            remainPacket = remainPacket.substring(16)

            let subPacket = remainPacket.substring(0, len)
            while (subPacket.length > 0) {
                const [subP, remain] = readPacket(subPacket)
                packets.push(subP)
                subPacket = remain
            }
            remainPacket = remainPacket.substring(len)
        } else {
            const length = remainPacket.substring(1, 12)
            const len = parseInt(length, 2)
            remainPacket = remainPacket.substring(12)
            for (let loop = 0; loop < len; loop++) {
                const [subP, remain] = readPacket(remainPacket)
                packets.push(subP)
                remainPacket = remain
            }

        }
        return [{version, typeId, value: 0, subPackets: packets}, remainPacket]
    }
}

function partOne(input: string[]): PuzzleReturn {
    const binary = convertToBinary(input[0]);
    const [p, _] = readPacket(binary)
    const summedVersions = sumVersions(p)
    return summedVersions
}

function partTwo(input: string[]): PuzzleReturn {
    const binary = convertToBinary(input[0]);
    const [p, _] = readPacket(binary)
    const summedVersions = evaluateVersions(p)
    return summedVersions
}

export default {
    title: "Packet Decoder",
    year: 2021,
    day: 16,
    partOne: partOne,
    partTwo: partTwo
} as Puzzle