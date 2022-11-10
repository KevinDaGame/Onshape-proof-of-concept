import React from 'react'
type props = {
    data: any
}
const DataComponent = (props: props) => {
    return (
        props.data.map((item: any) => {
            return (
                <div key={item.key}>
                    <p>{item.key}: {item.value}</p>

                </div>
            )
        })
    )
}

export default DataComponent