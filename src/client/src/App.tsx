
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
}
export default class App extends Component<props | state> {
  state: state = {
    assembly: [],
    document: documents.smile,
    configurations: []
  }
  constructor(props: any) {
    super(props)
    this.getGLTF = this.getGLTF.bind(this);
  }
  async getGLTF(docId: string, docMicroversion: string, elementID: string, partID: string): Promise<any> {
    let query = this.getConfigurations();
    let req = `http://localhost:30000/api/parts/d/${docId}/m/${docMicroversion}/e/${elementID}/partid/${partID}/gltf/` + '?' + (query + '&') + 'outputFaceAppearances=true'

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
      this.setState({ configurations: configurationsArr })
    })
  }

  getConfigurations() {
    let query = "";
    if (this.state.configurations.length > 0) {
      query += 'configuration=';
      if (this.state.configurations) {
        this.state.configurations.forEach((config) => {
          query += `${config.configuration.parameterId}%3d${config.value}&`
        })
      }
    }
    return query;
  }

  updateConfigurationInput(key: string, value: string) {
    let configurations = this.state.configurations;
    let configuration = configurations.find((e) => e.configuration.parameterId === key)
    if (configuration) {
      configuration.value = value;
    }
    this.setState({ configurations: configurations });
  }

  async getAssembly(elementId: string) {
    let tree = new GltfTree("root", null, "Assembly");
    let rootAssembly: Assembly;
    let elId = elementId ? elementId : this.state.document.e;
    let req = `http://localhost:30000/api/assemblies/d/${this.state.document.d}/${this.state.document.type}/${this.state.document.typeId}/e/${this.state.document.e}/?`
    await fetch(req).then(res => res.json()).then(async (assembly: Assembly) => {
      rootAssembly = assembly;
      this.fetchConfigurations();
      const iteration = (assembly: rootAssembly, parentId?: string) => {
        if (assembly.hasOwnProperty('instances')) {
          for (let p of assembly.instances) {
            let occurence: occurrence = rootAssembly.rootAssembly.occurrences.find((o: occurrence) => o.path.includes(p.id as string))
            if (p.type === 'Part') {
              if (!occurence.hidden) {
                tree.insert(parentId ?? assembly.elementId, p.id, "Part", {
                  documentId: p.documentId,
                  documentMicroversion: p.documentMicroversion,
                  elementId: p.elementId,
                  partId: p.partId,
                  occurrence: occurence,
                  gltf: this.getGLTF(p.documentId, p.documentMicroversion, p.elementId, p.partId)
                }, p.name)
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
    });

  }

  componentDidMount(): void {
    this.getAssembly(this.state.document.e);
  }

  render() {
    return (
      <div>
        {this.state.model ? <ThreeDView gltfTree={this.state.model} /> : <div>Loading...</div>}
        {this.state.configurations ? <ConfigurationComponent configurations={this.state.configurations} /> : <div>Loading...</div>}
      </div>
    )
  }
}
