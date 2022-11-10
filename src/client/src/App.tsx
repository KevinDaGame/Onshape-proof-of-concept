
import * as fs from 'fs';
import path from 'path';
import React, { Component } from 'react'
import ThreeDView from './components/ThreeDView';
import documents from './documents';
import { occurrence, part } from './types';

export default class App extends Component {
  state = {
    model: [],
    assembly: null,
    document: documents.smile
  }
  constructor(props: any) {
    super(props)
    this.getGLTF = this.getGLTF.bind(this);
  }
  async getGLTF(elementID: string, partID: string, configurations?: Array<{ key: string, value: number, unit: string }>) {
    let query = 'configuration=';
    if (configurations) {
      configurations.forEach((config) => {
        query += `${config.key}%3d${config.value}${config.unit}&`
      })
    }
    let req = `http://localhost:30000/api/parts/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${elementID}/partid/${partID}/gltf/` + (configurations ? '?' + query : '')
    console.log(req);

    return fetch(req).then(res => res.json()).then(res => {
      return res;
    });
  }

  async getAssembly(elementId: string) {
    let elId = elementId ? elementId : this.state.document.e;
    let req = `http://localhost:30000/api/assemblies/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${elId}/`
    let parts: part[] = [];
    await fetch(req).then(res => res.json()).then(async (res) => {
      this.setState({ assembly: res })
        for (let p of res.rootAssembly.instances) {
          if (p.type === 'Part') {
            let gltf = this.getGLTF(p.elementId, p.partId )
            let occurence = res.rootAssembly.occurrences.find((o: occurrence) => o.path.includes(p.id as string))
            parts.push({
              gltf: gltf,
              occurence: occurence
            })
          }
          else if(p.type = 'Assembly') {
            parts.push(...(await this.getAssembly(p.elementId)));
          }
        }
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
      <ThreeDView gltf={this.state.model} getModel={this.getAssembly} />
    )
  }
}
