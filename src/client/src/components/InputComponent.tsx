import React from 'react'
import { useEffect } from 'react'

type props = {
    text: string
    onSet: Function
    defaultVal: number
    minVal: number
    maxVal: number
}
const InputComponent = (props: props) => {
    const [val, setVal] = React.useState(props.defaultVal)
    useEffect(() => {
        setVal(props.defaultVal)

    }, [props.defaultVal])


    const handleChange = (e: any) => {
        setVal(e.target.value)
        props.onSet(e.target.value)
    }
    return (
        <div style={{display: 'flex'}}>
        <label htmlFor={props.text}>{props.text}</label>
        <input id={props.text} type="range" min={props.minVal} max={props.maxVal} value={val} step={0.1} onInput={(e) => {handleChange(e)}}></input>
        <input type="number" value={val} step={0.1} onInput={(e) => {handleChange(e)}} style={{width: '50px'}}/>
    </div>
    )

}

InputComponent.defaultProps = {
    defaultVal: 1,
    minVal: 0,
    maxVal: 10,
}
export default InputComponent