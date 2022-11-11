export type part = {
    gltf: Promise<string>,
    occurence: occurrence
}

export type occurrence = {
    hidden: boolean,
    fixed: boolean,
    transform: transform,
    path: Array<string>
}

export type transform = [
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
]