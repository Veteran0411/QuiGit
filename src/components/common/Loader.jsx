import React from 'react'
import { Space, Spin } from "antd";

const Loader = () => {
    return (
        <div>
            <Space size="middle" style={{width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Spin size='large' />
            </Space>
        </div>
    )
}

export default Loader