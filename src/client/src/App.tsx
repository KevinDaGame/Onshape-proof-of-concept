
import * as fs from 'fs';
import path from 'path';
import React, { Component } from 'react'
import ThreeDView from './components/ThreeDView';
import documents from './documents';
import { occurrence, part, transform } from './types';
import { combineTransform } from './util/CombineTransform';

export default class App extends Component {
  state = {
    model: [],
    assembly: [],
    document: documents.reverse_engineer
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

  async getAssembly(elementId: string, parentTransform?: transform) {
    let elId = elementId ? elementId : this.state.document.e;
    let req = `http://localhost:30000/api/assemblies/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${elId}/`
    let parts: part[] = [];
    await fetch(req).then(res => res.json()).then(async (res) => {
      console.log(res);
      const iteration = (instances: any, parentTransform?: transform) => {
        for (let p of instances) {
          let occurence: occurrence = res.rootAssembly.occurrences.find((o: occurrence) => o.path.includes(p.id as string))
          //if it has a parent, the transform of parent and child are combined, since the transform is relative to the parent element
          // occurence.transform = combineTransform(occurence.transform, parentTransform);
          if (p.type === 'Part') {
            let gltf = this.getGLTF(p.documentId, p.documentMicroversion, p.elementId, p.partId )
            parts.push({
              gltf: gltf,
              occurence: occurence
            })
          }
          else if(p.type = 'Assembly') {
            iteration(res.subAssemblies.find((e: any) => e.elementId === p.elementId).instances, occurence.transform);
          }
        }
        }
      iteration(res.rootAssembly.instances, parentTransform);
    });
    return parts;

  }
  async renderAssembly() {
    this.setState({ model: await(this.getAssembly(this.state.document.e)) })
  }

  componentDidMount(): void {
    this.renderAssembly();
  }

  render() {

    return (
      <ThreeDView gltf={this.state.model} getModel={() => {}} />
    )
  }
}
