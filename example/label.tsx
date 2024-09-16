import React, { useState } from 'react';
import styled from 'styled-components';
import SiriusLabel from '../src/components/SiriusLabel';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  text-align: center;
  align-items: center;
  justify-content: space-between;
`

const LabelDoc: React.FC = () => {
    const [state, setState] = useState<boolean>(false);
    return (
        <div>
            <button onClick={()=>{setState(!state)}}>Change Led Colors</button>
            <Wrapper>
                <SiriusLabel pv_name={state?'RAD:Thermo10:Gamma':'SI-01BCFE:VA-CCG-MD:Pressure-Mon'} egu='KWh'/>
                <SiriusLabel pv_name={'SI-01BCFE:VA-CCG-MD:Pressure-Mon'} egu='m'/>
                <SiriusLabel pv_name={'RAD:Thermo1:Gamma'} precision={5} egu='uSv'/>
                <SiriusLabel pv_name={'TS-02:DI-Scrn:ScrnType-Sel'} egu='Sv'/>
            </Wrapper>
        </div>
    )
};

export default LabelDoc;
