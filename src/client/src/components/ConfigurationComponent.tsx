import React from 'react'
import { Configuration } from '../types'

type props = {
  configurations: Array<{
    value: string|boolean
    configuration: Configuration}>
}

const ConfigurationComponent = (props: props) => {
  return (
    <div>ConfigurationComponent</div>
  )
}

export default ConfigurationComponent