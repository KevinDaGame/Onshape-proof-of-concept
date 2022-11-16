export type parsedPart = {
    gltf: Promise<any>,
    documentId: string,
    documentMicroversion: string,
    elementId: string,
    partId: string,
    occurrence: occurrence,
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

export type partStudioFeatures = [
    {
        configuration: string,
        documentId: string,
        documentMicroversion: string,
        documentVersion: string,
        elementId: string,
        featureId: string,
        featureType: string,
        fullConfiguration: string,
        partNumber: string,
        revision: string
    }
]

export type part = {
    bodyType: "solid",
    configuration: string,
    documentId: string,
    documentMicroversion: string,
    documentVersion: string,
    elementId: string,
    fullConfiguration: string,
    isStandardContent: true,
    mateConnectors: [
        {
            featureId: string,
            mateConnectorCS: {
                getxAxis: Array<number>,
                getyAxis: Array<number>
                getzAxis: Array<number>
                origin: Array<number>
            }
        }
    ],
    partId: string,
    partNumber: string,
    revision: string
}

export type instances = [
    {
        configuration: string,
        documentId: string,
        documentMicroversion: string,
        documentVersion: string,
        elementId: string,
        featureId: string,
        fullConfiguration: string,
        id: string,
        isStandardContent: true,
        name: string,
        partId: string,
        partNumber: string,
        revision: string,
        status: "DeletedElement",
        suppressed: true,
        type: "Assembly" | "Part"
    }
]

export type occurrences = [
    {
        fixed: true,
        hidden: true,
        path: Array<string>,
        transform: Array<number>,
    }
]
export type features = [
    {
        featureData: {
            name: string
        },
        featureType: string,
        id: string,
        suppressed: true
    }
]

export type rootAssembly = {
    configuration: string,
    documentId: string,
    documentMicroversion: string,
    documentVersion: string,
    elementId: string,
    features: features,
    fullConfiguration: string,
    instances: instances
    occurrences: occurences
    partNumber: string,
    revision: string
}
export type Assembly = {
    partStudioFeatures: partStudioFeatures
    parts: Array<part>
    rootAssembly: rootAssembly

    subAssemblies: Array<Assembly>
}
export type Configuration = {
    "btType": "BTMConfigurationParameterEnum-105"|"BTMConfigurationParameterBoolean-2550",
    "defaultValue": string|boolean,
    "namespace": string,
    "parameterId": string,
    "parameterName": string,
    "nodeId": string
}

export type EnumConfiguration = Configuration & {
    "enumName": string,
    "options": [
      {
        "btType": "BTMEnumOption-592",
        "optionName": string,
        "option": string,
        "nodeId": string
      }
    ],
}