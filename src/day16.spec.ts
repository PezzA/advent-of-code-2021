import {convertHexCharToBinary, convertToBinary, evaluateVersions, Packet, readPacket, sumVersions} from "./day16";

const testString1 = `D2FE28`

test('it converts to binary', () => {
    expect(convertHexCharToBinary("0")).toBe('0000')
    expect(convertHexCharToBinary("7")).toBe('0111')
    expect(convertHexCharToBinary("7")).toBe('0111')
    expect(convertHexCharToBinary("F")).toBe('1111')
    expect(convertToBinary(testString1)).toBe('110100101111111000101000')
})

test('It reads literals', () => {
    const binary = convertToBinary(testString1);
    const p = readPacket(binary)
    console.log(p)
})

test('It reads len type 1 operations', () => {
    const binary = convertToBinary("EE00D40C823060");
    const p = readPacket(binary)
    console.log(p)
})

test('It reads len type 0 operations', () => {
    const binary = convertToBinary("38006F45291200");
    const p = readPacket(binary)
    console.log(p)
})

test('it adds versions', () => {
    const binary = convertToBinary("8A004A801A8002F478");
    const [p, _] = readPacket(binary)
    console.log(sumVersions(p))
})

test('it adds versions', () => {
    const binary = convertToBinary("8A004A801A8002F478");
    const [p, _] = readPacket(binary)
    const summedVersions = sumVersions(p)
    expect(summedVersions).toBe(6)
})

test('it adds versions 2', () => {
    const binary = convertToBinary("620080001611562C8802118E34");
    const [p, _] = readPacket(binary)
    const summedVersions = sumVersions(p)
    expect(summedVersions).toBe(12)
})

test('it adds versions 3', () => {
    const binary = convertToBinary("C0015000016115A2E0802F182340");
    const [p, _] = readPacket(binary)
    const summedVersions = sumVersions(p)
    expect(summedVersions).toBe(23)
})

test('it adds versions 4', () => {
    const binary = convertToBinary("A0016C880162017C3686B18A3D4780");
    const [p, _] = readPacket(binary)
    const summedVersions = sumVersions(p)
    expect(summedVersions).toBe(31)
})

const evaluateTestCases: [string, number][] = [
    ["C200B40A82", 3],
    ["04005AC33890", 54],
    ["880086C3E88112", 7],
    ["CE00C43D881120", 9],
    ["D8005AC2A8F0", 1],
    ["F600BC2D8F", 0],
    ["9C005AC2F8F0", 0],
    ["9C0141080250320F1802104A08", 1]
]

test.each(evaluateTestCases)('it evaluates %s to %s', (program, expected) => {
    const binary = convertToBinary(program);
    const [p, _] = readPacket(binary)
    const evaluated = evaluateVersions(p)
    expect(evaluated).toBe(expected)
})