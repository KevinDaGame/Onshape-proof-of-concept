
import * as fs from 'fs';
import path from 'path';
import React, { Component } from 'react'
import ThreeDView from './components/ThreeDView';
import GltfTree from './data/GltfTree';
import documents from './documents';
import { occurrence, part, transform } from './types';
import { combineTransform } from './util/CombineTransform';
type props = {}
type state = {
  model: null | GltfTree
  assembly: []
  document: any
}
export default class App extends Component<props | state> {
  state: state = {
    model: null,
    assembly: [],
    document: documents.espresso
  }
  constructor(props: any) {
    super(props)
    this.getGLTF = this.getGLTF.bind(this);
  }
  async getGLTF(docId: string, docMicroversion: string, elementID: string, partID: string, configurations?: Array<{ key: string, value: number, unit: string }>) {
    let query = 'configuration=';
    if (configurations) {
      configurations.forEach((config) => {
        query += `${config.key}%3d${config.value}${config.unit}&`
      })
    }
    let req = `http://localhost:30000/api/parts/d/${docId}/m/${docMicroversion}/e/${elementID}/partid/${partID}/gltf/` + '?' + (configurations ? + query + '&' : '') + 'outputFaceAppearances=true'
    console.log(req);

    return fetch(req).then(res => res.json()).then(res => {
      return res;
    });
  }

  async getAssembly(elementId: string) {
    let elId = elementId ? elementId : this.state.document.e;
    let req = `http://localhost:30000/api/assemblies/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${elId}/`
    let parts = new GltfTree(elId, null, "Assembly");
    await fetch(req).then(res => res.json()).then(async (res) => {
      console.log(res);
      const iteration = (assembly: any, parentId?: string) => {
        if (assembly.hasOwnProperty('instances')) {
          for (let p of assembly.instances) {
            let occurence: occurrence = res.rootAssembly.occurrences.find((o: occurrence) => o.path.includes(p.id as string))
            if (p.type === 'Part') {
              if (!occurence.hidden) {
                let gltf = this.getGLTF(p.documentId, p.documentMicroversion, p.elementId, p.partId)
                parts.insert(elId, p.id, "Part", {
                  gltf: gltf,
                  occurence: occurence
                })
              }
            }
            else if (p.type = 'Assembly') {
              parts.insert(elId, p.id, "Assembly", null)
              iteration(res.subAssemblies.find((e: any) => e.elementId === p.elementId), p.id);
            }
          }
        }
      }
      iteration(res.rootAssembly);
    });
    return parts;

  }

  componentDidMount(): void {
    this.getAssembly(this.state.document.e).then((e) => {
      this.setState({ model: e })
    })
  }

  render() {

    return (
      this.state.model ? <ThreeDView gltf={this.state.model} getModel={() => { }} /> : <div>Loading...</div>
    )
  }
}
