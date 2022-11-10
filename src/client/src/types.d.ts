export type part = {
    gltf: Promise<string>,
    occurence: occurrence
}

export type occurrence = {
    hidden: boolean,
    fixed: boolean,
    transform: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ],
    path: Array<string>
}