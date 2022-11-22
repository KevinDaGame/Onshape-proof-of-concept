import React, { useState } from 'react'
import { Configuration, EnumConfiguration } from '../types'

type props = {
  configurations: Array<{
    value: string | boolean | number
    configuration: Configuration
  }>
  onChange: Function
  onSubmit: Function
}

const ConfigurationComponent = (props: props) => {
  const [toggled, toggle] = useState(false);
  const getInput = (config: {
    value: string | boolean | number;
    configuration: Configuration;
  }) => {
    switch (config.configuration.btType) {
      case "BTMConfigurationParameterBoolean-2550":
        return <input type="checkbox" checked={config.value as boolean} onChange={(e) => { props.onChange(config.configuration.parameterId, e.target.checked) }} />
      case "BTMConfigurationParameterEnum-105":
        let conf = config.configuration as EnumConfiguration;
        return <select onChange={(e) => { props.onChange(config.configuration.parameterId, e.target.value) }}>
          {conf.options.map((e, i) => {
            return <option key={i} value={e.option}>{e.optionName}</option>
          })}
        </select>
      case "BTMConfigurationParameterQuantity-1826":
        return <input type="number" value={(config as any).defaultValue as number} onChange={(e) => { props.onChange(config.configuration.parameterId, Math.round(parseInt(e.target.value))) }} />

    }
  }

  return (
    <div className='Configuration'>
      <div className="confForm">
        {props.configurations.map((config, i) => {
          return (
            <div className="confRow" key={i}>
              <label>{config.configuration.parameterName}</label>
              {getInput(config)}

            </div>
          )
        })}
      </div>
      <button className={toggled ? 'toggled' : ""} onClick={() => props.onSubmit()} onMouseEnter={(e) => {
        toggle(!toggled)
      }}>Submit</button>
    </div>
  )
}

export default ConfigurationComponent
