import React, { useState } from 'react';
import styled from 'styled-components';
import SiriusInvisible from '../src/components/SiriusInvisible';

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`

const InvisibleDoc: React.FC = () => {
    const [values, setValues] = useState({});

    function valueList<EpicsData>(value: EpicsData, pvname: string): EpicsData {
        if(pvname !== undefined){
            setValues(prev => ({...prev, [pvname]: value.value}));
        }
        return value
    }

    return (
        <div>
            <Wrapper>
                An Invisible Widget to monitor 1 or several PVs:
                <SiriusInvisible pv_name={["SI-01BCFE:VA-CCG-MD:Pressure-Mon", "RAD:Thermo2:Gamma"]} modifyValue={valueList}/>
                <SiriusInvisible pv_name={["SI-02C3:VA-CCG-BG:Pressure-Mon", "SI-04C3:VA-CCG-BG:Pressure-Mon"]} modifyValue={valueList}/>
                {Object.entries(values).map(([key, value]: [string, any])=>{
                    return (
                        <div>
                            --{key} {value}--
                        </div>
                    )
                })}
            </Wrapper>
        </div>
    )
};

export default InvisibleDoc;
