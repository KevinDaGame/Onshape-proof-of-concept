
import { stringify } from 'querystring';
import { Component } from 'react'
import ConfigurationComponent from './components/ConfigurationComponent';
import ThreeDView from './components/ThreeDView';
import GltfTree, { GltfNode } from './data/GltfTree';
import documents from './documents';
import { Assembly, Configuration, occurrence, parsedPart, part, rootAssembly } from './types';

type props = {}
type state = {
  model?: GltfTree
  assembly: []
  document: any
  configurations: Array<{
    value: string | boolean
    configuration: Configuration
  }>
  cache: Array<{name: string, gltf: Promise<any>}>
}
export default class App extends Component<props | state> {
  state: state = {
    assembly: [],
    document: documents.smile,
    configurations: [],
    cache: []
  }
  
  constructor(props: any) {
    super(props)
    this.getGLTF = this.getGLTF.bind(this);
    this.getAssembly = this.getAssembly.bind(this);
    this.updateConfigurationInput = this.updateConfigurationInput.bind(this);
  }
  async getGLTF(docId: string, docMicroversion: string, elementID: string, partID: string, configuration: string): Promise<any> {
    
    let req = `http://localhost:30000/api/parts/d/${docId}/m/${docMicroversion}/e/${elementID}/partid/${partID}/gltf/?configuration=${configuration}&outputFaceAppearances=true`
    return fetch(req).then(res => res.json()).then(res => {
      return res;
    });
  }

  async fetchConfigurations() {
    let req = `http://localhost:30000/api/elements/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${this.state.document.e}/configuration/`
    let configurationsArr: Array<{
      value: string | boolean
      configuration: Configuration
    }> = [];
    await fetch(req).then(res => res.json()).then((configurations: any) => {
      configurations.configurationParameters.forEach((e: Configuration) => {
        configurationsArr.push({ configuration: e, value: e.defaultValue });
      })
      this.setState({ configurations: configurationsArr }, () => {this.getAssembly()})
    })
  }

  getConfigurations() {
    let query = "";
    if (this.state.configurations.length > 0) {
      query += 'configuration=';
      if (this.state.configurations) {
        this.state.configurations.forEach((config) => {
          query += `${config.configuration.parameterId}%3d${config.value};`
        })
      }
    }
    return query;
  }

  updateConfigurationInput(key: string, value: string|boolean) {
    let configurations = this.state.configurations;
    let configuration = configurations.find((e) => e.configuration.parameterId === key)
    if (configuration) {
      configuration.value = value;
    }
    this.setState({ configurations: configurations });
  }

  async getAssembly() {
    let cache: {name: string, gltf: Promise<any>}[] = [];
    let tree = new GltfTree("root", null, "Assembly");
    let rootAssembly: Assembly;
    let query = this.getConfigurations();
    let req = `http://localhost:30000/api/assemblies/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${this.state.document.e}/?${query}excludeSuppressed=true`
    await fetch(req).then(res => res.json()).then(async (assembly: Assembly) => {
      rootAssembly = assembly;
      const iteration = (assembly: rootAssembly, parentId?: string) => {
        if (assembly.hasOwnProperty('instances')) {
          for (let p of assembly.instances) {
            let occurence: occurrence = rootAssembly.rootAssembly.occurrences.find((o: occurrence) => o.path.includes(p.id as string))
            if (p.type === 'Part') {
              if (!p.suppressed && !occurence.hidden) {
                console.log("Getting part" +  p.id);
                
                tree.insert(parentId ?? assembly.elementId, p.id, "Part", {
                  documentId: p.documentId,
                  documentMicroversion: p.documentMicroversion,
                  elementId: p.elementId,
                  partId: p.partId,
                  occurrence: occurence
                }, p.name)
                if (!cache.find((e: any) => e.name === p.elementId + p.partId)) {
                  cache.push({name: p.elementId + p.partId, gltf: this.getGLTF(p.documentId, p.documentMicroversion, p.elementId, p.partId, p.configuration)})
                }
              }
            }
            else if (p.type = 'Assembly') {
              tree.insert(parentId ?? assembly.elementId, p.id, "Assembly", null, p.name)
              iteration(rootAssembly.subAssemblies.find((e: any) => e.elementId === p.elementId) as unknown as rootAssembly, p.id);
            }
            else {
              console.log(`unknown type ${p.type} for ${p.id} ${p.name}`);
            }
          }
        }
      }
      iteration(assembly.rootAssembly, "root");
      this.setState({ model: tree })
      this.setState({ cache: cache })
    });

  }

  componentDidMount(): void {
    this.fetchConfigurations()
  }

  render() {
    return (
      <div>
        {this.state.model ? <ThreeDView gltfTree={this.state.model} cache={this.state.cache} /> : <div>Loading...</div>}
        {this.state.configurations ? <ConfigurationComponent configurations={this.state.configurations} onChange={this.updateConfigurationInput} onSubmit={this.getAssembly}/> : <div>Loading...</div>}
      </div>
    )
  }
}
